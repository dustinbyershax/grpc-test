// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var protos_primeNumberDecomposition_pb = require('../protos/primeNumberDecomposition_pb.js');

function serialize_primeNumberDecomposition_PrimeNumberDecompositionRequest(arg) {
  if (!(arg instanceof protos_primeNumberDecomposition_pb.PrimeNumberDecompositionRequest)) {
    throw new Error('Expected argument of type primeNumberDecomposition.PrimeNumberDecompositionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_primeNumberDecomposition_PrimeNumberDecompositionRequest(buffer_arg) {
  return protos_primeNumberDecomposition_pb.PrimeNumberDecompositionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_primeNumberDecomposition_PrimeNumberDecompositionResponse(arg) {
  if (!(arg instanceof protos_primeNumberDecomposition_pb.PrimeNumberDecompositionResponse)) {
    throw new Error('Expected argument of type primeNumberDecomposition.PrimeNumberDecompositionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_primeNumberDecomposition_PrimeNumberDecompositionResponse(buffer_arg) {
  return protos_primeNumberDecomposition_pb.PrimeNumberDecompositionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var PrimeNumberDecompositionServiceService = exports.PrimeNumberDecompositionServiceService = {
  // streaming API
primeNumberDecomposition: {
    path: '/primeNumberDecomposition.PrimeNumberDecompositionService/PrimeNumberDecomposition',
    requestStream: false,
    responseStream: true,
    requestType: protos_primeNumberDecomposition_pb.PrimeNumberDecompositionRequest,
    responseType: protos_primeNumberDecomposition_pb.PrimeNumberDecompositionResponse,
    requestSerialize: serialize_primeNumberDecomposition_PrimeNumberDecompositionRequest,
    requestDeserialize: deserialize_primeNumberDecomposition_PrimeNumberDecompositionRequest,
    responseSerialize: serialize_primeNumberDecomposition_PrimeNumberDecompositionResponse,
    responseDeserialize: deserialize_primeNumberDecomposition_PrimeNumberDecompositionResponse,
  },
};

exports.PrimeNumberDecompositionServiceClient = grpc.makeGenericClientConstructor(PrimeNumberDecompositionServiceService);
