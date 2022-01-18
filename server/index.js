const greets = require('./protos/greet_pb');
const greetService = require('./protos/greet_grpc_pb');

const calculator = require('./protos/calculator_pb');
const calculatorService = require('./protos/calculator_grpc_pb');

const grpc = require("grpc");

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

// function main() {
//   const server = new grpc.Server();
//   server.addService(service.GreetServiceService, { greet, calculate });
//   server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
//   server.start();

//   console.log('server running on 0.0.0.0:50051')
// }

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

  console.log("Received number: ", number);

  while (number > 1) {
    if (number % divisor === 0) {
      var primeNumberDecompositionResponse = new calculator.PrimeNumberDecompositionResponse();

      primeNumberDecompositionResponse.setResult(divisor);

      number /= divisor;

      //write the message using call.write()
      call.write(primeNumberDecompositionResponse);
    } else {
      divisor++;
      console.log("Divisor has increased to ", divisor);
    }
  }
}

function main() {
  const server = new grpc.Server();
  server.addService(calculatorService.CalculatorServiceService, { calculate });
  server.addService(calculatorService.PrimeNumberDecompositionServiceService, { primeNumberDecomposition });
  server.addService(greetService.GreetServiceService, { greetManyTimes });
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();

  console.log('server running on 0.0.0.0:50051')
}
main()