const grpc = require('grpc');

const serviceArgs = ['localhost:50051', grpc.credentials.createInsecure()]

const getName = (call, type) => {
  const names = call.request.getGreeting();

  switch (type) {
    case 'first':
      return names.getFirstName();
    case 'last':
      return names.getLastName();
    case 'full':
      return `${names.getFirstName()} ${names.getLastName()}`;
    default:
      throw new Error('invalid name format');
  }
}

const generateUnsafeClient = (Client) => new Client(...serviceArgs);

module.exports = { 
  getName,
  generateUnsafeClient,
  serviceArgs,
 };