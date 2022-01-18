const greets = require('../server/protos/greet_pb');
const greetService = require('../server/protos/greet_grpc_pb');

const calcs = require('../server/protos/calculator_pb');
const calcService = require('../server/protos/calculator_grpc_pb');

const grpc = require('grpc');

const serviceArgs = ['localhost:50051', grpc.credentials.createInsecure()]

const callGreet = () => {
  // instantiate service client
  const client = new greetService.GreetServiceClient(...serviceArgs);
  // request  
  const request = new greets.GreetRequest();
  // payload
  const greeting = new greets.Greeting();
  // set payload args
  greeting.setFirstName('Luke');
  greeting.setLastName('Skywalker');
  // add payload to request
  request.setGreeting(greeting);

  // invoke client function with request, handle responses
  client.greet(request, (error, response) => {
    if (!error) {
      console.log('Greeting Response: ', response.getResult());
    } else {
      console.error('Greeting Error: ', error);
    }
  });
}

const callCalculate = () => {
  const client = new calcService.CalculatorServiceClient(...serviceArgs);
  const req = new calcs.SumRequest();
  const calculation = new calcs.CalculateSum();
  calculation.setFirstnumber(54);
  calculation.setSecondnumber(23);
  req.setSum(calculation);

  client.calculate(req, (err, response) => {
    if (!err) {
      console.log('Calculator Response: ', response.getResult());
    } else {
      console.error('Calculator Error: ', err);
    }
  });
}

const callGreetManyTimes = () => {
  const client = new greetService.GreetServiceClient(...serviceArgs);
  const req = new greets.GreetManyTimesRequest();
  const greeting = new greets.Greeting();
  greeting.setFirstName('Dustin');
  greeting.setLastName('Byers');
  req.setGreeting(greeting);

  const call = client.greetManyTimes(req, () => {});

  call.on('data', (res) => {
    console.log('Client Streaming Response: ', res.getResult());
  });
  call.on('status', (status) => {
    console.log('Status: ', status);
  });
  call.on('error', (err) => {
    console.log('err', err);
  });
  call.on('end', () => {
    console.log('stream ended!');
  })
}

const callPrimeNumberDecomposition = () => {
  const client = new calcService.PrimeNumberDecompositionServiceClient(...serviceArgs);
  const req = new calcs.PrimeNumberDecompositionRequest();
  req.setNumber(120);
  console.log('calccs', client)
  // const call = client.primeNumberDecomposition(req, () => {});
  const call = client.primeNumberDecomposition(req, () => {});

  call.on('data', (res) => {
    console.log('Client Streaming Response: ', res.getResult());
  });
  call.on('status', (status) => {
    console.log('Status: ', status);
  });
  call.on('error', (err) => {
    console.log('err', err);
  });
  call.on('end', () => {
    console.log('stream ended!');
  })
}

function callLongGreeting() {
  const client = new greetService.GreetServiceClient(...serviceArgs);
  const request = new greets.LongGreetRequest();

  const call = client.longGreet(request, (error, response) => {
    if (!error) {
      console.log('Server Response: ', response.getResult());
    } else {
      console.error(error);
    }
  });

  let count = 0;
  let intervalId = setInterval(() => {
    console.log(`Sending message ${count}`);
    const greeting = new greets.Greeting();
    greeting.setFirstName('r2');
    greeting.setLastName('d2');

    request.setGreeting(greeting);
    call.write(request);

    if (++count > 3) {
      clearInterval(intervalId);
      call.end(); // all messages have been sent
    }
  }, 1000);
}

const main = () => {
  // callCalculate();
  // callGreetManyTimes();
  // callPrimeNumberDecomposition();
  callLongGreeting();
};
main()