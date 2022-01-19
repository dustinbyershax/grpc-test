const grpc = require('grpc');

const greets = require('./protos/greet_pb');
const greetService = require('./protos/greet_grpc_pb');

const calculator = require('./protos/calculator_pb');
const calculatorService = require('./protos/calculator_grpc_pb');
const { getName } = require('../utils');

/**
 * Implements the greet RPC method.
 */
function greet(call, callback) {
  const greeting = new greets.GreetResponse();
  const names = call.request.getGreeting();
  const [firstName, lastName ] = [names.getFirstName(), names.getLastName()]; 
  greeting.setResult(`Hi ${firstName} ${lastName}!!`);

  callback(null, greeting);
}

function calculate(call, callback) {
  // const greeting = new greets.GreetResponse();
  const calculateSum = new calculator.SumResponse();
  // const names = call.request.getGreeting();
  const sums = call.request.getSum();
  // const [firstName, lastName ] = [names.getFirstName(), names.getLastName()]; 
  const [first, second] = [sums.getFirstnumber(), sums.getSecondnumber()]
  calculateSum.setResult(first + second);
 
  callback(null, calculateSum);
}

function greetManyTimes(call, callback) {
  const firstName = call.request.getGreeting().getFirstName();
  let count = 0;

  let intervalId = setInterval(() => {

    const greetManyTimesResponse =  new greets.GreetManyTimesResponse();
    greetManyTimesResponse.setResult(firstName);
    // set up streaming
    call.write(greetManyTimesResponse);
    if (++count > 9) {
      clearInterval(intervalId);
      call.end(); // we have sent all messages
    }
  }, 1000);
}

function primeNumberDecomposition(call, callback) {
  let number = call.request.getNumber();
  let divisor = 2;

  console.log('Received number: ', number);

  while (number > 1) {
    if (number % divisor === 0) {
      const primeNumberDecompositionResponse = new calculator.PrimeNumberDecompositionResponse();

      primeNumberDecompositionResponse.setResult(divisor);

      number /= divisor;

      //write the message using call.write()
      call.write(primeNumberDecompositionResponse);
    } else {
      divisor++;
      console.log('Divisor has increased to ', divisor);
    }
  }
}

function longGreet(call, callback) {
  call.on('data', req => {
    const names = req.getGreeting();
    const fullName = `${names.getFirstName()} ${names.getLastName()}`;

    console.log(`Hello ${fullName}`);
  });

  call.on('error', err => {
    console.error(err);
  });

  call.on('end', () => {
    const response = new greets.LongGreetResponse();
    response.setResult('Long Greet Client Streaming...');

    callback(null, response);
  })
}

function computeAverage(call, callback) {
  let total = 0;
  let count = 0;

  call.on('data', req => {
    const val = req.getNumber();
    console.log('received ', val);
    total += val;
    count++;
  });

  call.on('error', err => {
    console.error(`Error in computeAverage: ${err}`);
  });

  call.on('end', () => {
    const response = new calculator.ComputeAverageResponse();
    const average = total / count;
    console.log(`The average is ${average}`);

    response.setResult(average);
    callback(null, response);
  });
}

function main() {
  const server = new grpc.Server();
  server.addService(calculatorService.CalculatorServiceService, { calculate, computeAverage });
  server.addService(calculatorService.PrimeNumberDecompositionServiceService, { primeNumberDecomposition });
  server.addService(greetService.GreetServiceService, {
    greet,
    greetManyTimes,
    longGreet
  });
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();

  console.log('server running on 0.0.0.0:50051')
}
main()