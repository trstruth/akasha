// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var akasha_pb = require('./akasha_pb.js');

function serialize_akasha_CreateBoolFlagRequest(arg) {
  if (!(arg instanceof akasha_pb.CreateBoolFlagRequest)) {
    throw new Error('Expected argument of type akasha.CreateBoolFlagRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_CreateBoolFlagRequest(buffer_arg) {
  return akasha_pb.CreateBoolFlagRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_CreateBoolFlagResponse(arg) {
  if (!(arg instanceof akasha_pb.CreateBoolFlagResponse)) {
    throw new Error('Expected argument of type akasha.CreateBoolFlagResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_CreateBoolFlagResponse(buffer_arg) {
  return akasha_pb.CreateBoolFlagResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_CreateStringFlagRequest(arg) {
  if (!(arg instanceof akasha_pb.CreateStringFlagRequest)) {
    throw new Error('Expected argument of type akasha.CreateStringFlagRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_CreateStringFlagRequest(buffer_arg) {
  return akasha_pb.CreateStringFlagRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_CreateStringFlagResponse(arg) {
  if (!(arg instanceof akasha_pb.CreateStringFlagResponse)) {
    throw new Error('Expected argument of type akasha.CreateStringFlagResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_CreateStringFlagResponse(buffer_arg) {
  return akasha_pb.CreateStringFlagResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_DeleteFlagRequest(arg) {
  if (!(arg instanceof akasha_pb.DeleteFlagRequest)) {
    throw new Error('Expected argument of type akasha.DeleteFlagRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_DeleteFlagRequest(buffer_arg) {
  return akasha_pb.DeleteFlagRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_DeleteFlagResponse(arg) {
  if (!(arg instanceof akasha_pb.DeleteFlagResponse)) {
    throw new Error('Expected argument of type akasha.DeleteFlagResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_DeleteFlagResponse(buffer_arg) {
  return akasha_pb.DeleteFlagResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_EvaluateBoolFlagRequest(arg) {
  if (!(arg instanceof akasha_pb.EvaluateBoolFlagRequest)) {
    throw new Error('Expected argument of type akasha.EvaluateBoolFlagRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_EvaluateBoolFlagRequest(buffer_arg) {
  return akasha_pb.EvaluateBoolFlagRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_EvaluateBoolFlagResponse(arg) {
  if (!(arg instanceof akasha_pb.EvaluateBoolFlagResponse)) {
    throw new Error('Expected argument of type akasha.EvaluateBoolFlagResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_EvaluateBoolFlagResponse(buffer_arg) {
  return akasha_pb.EvaluateBoolFlagResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_EvaluateStringFlagRequest(arg) {
  if (!(arg instanceof akasha_pb.EvaluateStringFlagRequest)) {
    throw new Error('Expected argument of type akasha.EvaluateStringFlagRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_EvaluateStringFlagRequest(buffer_arg) {
  return akasha_pb.EvaluateStringFlagRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_EvaluateStringFlagResponse(arg) {
  if (!(arg instanceof akasha_pb.EvaluateStringFlagResponse)) {
    throw new Error('Expected argument of type akasha.EvaluateStringFlagResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_EvaluateStringFlagResponse(buffer_arg) {
  return akasha_pb.EvaluateStringFlagResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_GetBoolFlagRequest(arg) {
  if (!(arg instanceof akasha_pb.GetBoolFlagRequest)) {
    throw new Error('Expected argument of type akasha.GetBoolFlagRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_GetBoolFlagRequest(buffer_arg) {
  return akasha_pb.GetBoolFlagRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_GetBoolFlagResponse(arg) {
  if (!(arg instanceof akasha_pb.GetBoolFlagResponse)) {
    throw new Error('Expected argument of type akasha.GetBoolFlagResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_GetBoolFlagResponse(buffer_arg) {
  return akasha_pb.GetBoolFlagResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_GetMetricsRequest(arg) {
  if (!(arg instanceof akasha_pb.GetMetricsRequest)) {
    throw new Error('Expected argument of type akasha.GetMetricsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_GetMetricsRequest(buffer_arg) {
  return akasha_pb.GetMetricsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_GetMetricsResponse(arg) {
  if (!(arg instanceof akasha_pb.GetMetricsResponse)) {
    throw new Error('Expected argument of type akasha.GetMetricsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_GetMetricsResponse(buffer_arg) {
  return akasha_pb.GetMetricsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_GetStringFlagRequest(arg) {
  if (!(arg instanceof akasha_pb.GetStringFlagRequest)) {
    throw new Error('Expected argument of type akasha.GetStringFlagRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_GetStringFlagRequest(buffer_arg) {
  return akasha_pb.GetStringFlagRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_GetStringFlagResponse(arg) {
  if (!(arg instanceof akasha_pb.GetStringFlagResponse)) {
    throw new Error('Expected argument of type akasha.GetStringFlagResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_GetStringFlagResponse(buffer_arg) {
  return akasha_pb.GetStringFlagResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_ListBoolFlagsRequest(arg) {
  if (!(arg instanceof akasha_pb.ListBoolFlagsRequest)) {
    throw new Error('Expected argument of type akasha.ListBoolFlagsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_ListBoolFlagsRequest(buffer_arg) {
  return akasha_pb.ListBoolFlagsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_ListBoolFlagsResponse(arg) {
  if (!(arg instanceof akasha_pb.ListBoolFlagsResponse)) {
    throw new Error('Expected argument of type akasha.ListBoolFlagsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_ListBoolFlagsResponse(buffer_arg) {
  return akasha_pb.ListBoolFlagsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_ListStringFlagsRequest(arg) {
  if (!(arg instanceof akasha_pb.ListStringFlagsRequest)) {
    throw new Error('Expected argument of type akasha.ListStringFlagsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_ListStringFlagsRequest(buffer_arg) {
  return akasha_pb.ListStringFlagsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_ListStringFlagsResponse(arg) {
  if (!(arg instanceof akasha_pb.ListStringFlagsResponse)) {
    throw new Error('Expected argument of type akasha.ListStringFlagsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_ListStringFlagsResponse(buffer_arg) {
  return akasha_pb.ListStringFlagsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_UpdateBoolFlagRequest(arg) {
  if (!(arg instanceof akasha_pb.UpdateBoolFlagRequest)) {
    throw new Error('Expected argument of type akasha.UpdateBoolFlagRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_UpdateBoolFlagRequest(buffer_arg) {
  return akasha_pb.UpdateBoolFlagRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_UpdateBoolFlagResponse(arg) {
  if (!(arg instanceof akasha_pb.UpdateBoolFlagResponse)) {
    throw new Error('Expected argument of type akasha.UpdateBoolFlagResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_UpdateBoolFlagResponse(buffer_arg) {
  return akasha_pb.UpdateBoolFlagResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_UpdateStringFlagRequest(arg) {
  if (!(arg instanceof akasha_pb.UpdateStringFlagRequest)) {
    throw new Error('Expected argument of type akasha.UpdateStringFlagRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_UpdateStringFlagRequest(buffer_arg) {
  return akasha_pb.UpdateStringFlagRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_akasha_UpdateStringFlagResponse(arg) {
  if (!(arg instanceof akasha_pb.UpdateStringFlagResponse)) {
    throw new Error('Expected argument of type akasha.UpdateStringFlagResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_akasha_UpdateStringFlagResponse(buffer_arg) {
  return akasha_pb.UpdateStringFlagResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// The FlagService defines CRUD operations for flags.
var FlagServiceService = exports.FlagServiceService = {
  // BoolFlag operations
createBoolFlag: {
    path: '/akasha.FlagService/CreateBoolFlag',
    requestStream: false,
    responseStream: false,
    requestType: akasha_pb.CreateBoolFlagRequest,
    responseType: akasha_pb.CreateBoolFlagResponse,
    requestSerialize: serialize_akasha_CreateBoolFlagRequest,
    requestDeserialize: deserialize_akasha_CreateBoolFlagRequest,
    responseSerialize: serialize_akasha_CreateBoolFlagResponse,
    responseDeserialize: deserialize_akasha_CreateBoolFlagResponse,
  },
  getBoolFlag: {
    path: '/akasha.FlagService/GetBoolFlag',
    requestStream: false,
    responseStream: false,
    requestType: akasha_pb.GetBoolFlagRequest,
    responseType: akasha_pb.GetBoolFlagResponse,
    requestSerialize: serialize_akasha_GetBoolFlagRequest,
    requestDeserialize: deserialize_akasha_GetBoolFlagRequest,
    responseSerialize: serialize_akasha_GetBoolFlagResponse,
    responseDeserialize: deserialize_akasha_GetBoolFlagResponse,
  },
  updateBoolFlag: {
    path: '/akasha.FlagService/UpdateBoolFlag',
    requestStream: false,
    responseStream: false,
    requestType: akasha_pb.UpdateBoolFlagRequest,
    responseType: akasha_pb.UpdateBoolFlagResponse,
    requestSerialize: serialize_akasha_UpdateBoolFlagRequest,
    requestDeserialize: deserialize_akasha_UpdateBoolFlagRequest,
    responseSerialize: serialize_akasha_UpdateBoolFlagResponse,
    responseDeserialize: deserialize_akasha_UpdateBoolFlagResponse,
  },
  // StringFlag operations
createStringFlag: {
    path: '/akasha.FlagService/CreateStringFlag',
    requestStream: false,
    responseStream: false,
    requestType: akasha_pb.CreateStringFlagRequest,
    responseType: akasha_pb.CreateStringFlagResponse,
    requestSerialize: serialize_akasha_CreateStringFlagRequest,
    requestDeserialize: deserialize_akasha_CreateStringFlagRequest,
    responseSerialize: serialize_akasha_CreateStringFlagResponse,
    responseDeserialize: deserialize_akasha_CreateStringFlagResponse,
  },
  getStringFlag: {
    path: '/akasha.FlagService/GetStringFlag',
    requestStream: false,
    responseStream: false,
    requestType: akasha_pb.GetStringFlagRequest,
    responseType: akasha_pb.GetStringFlagResponse,
    requestSerialize: serialize_akasha_GetStringFlagRequest,
    requestDeserialize: deserialize_akasha_GetStringFlagRequest,
    responseSerialize: serialize_akasha_GetStringFlagResponse,
    responseDeserialize: deserialize_akasha_GetStringFlagResponse,
  },
  updateStringFlag: {
    path: '/akasha.FlagService/UpdateStringFlag',
    requestStream: false,
    responseStream: false,
    requestType: akasha_pb.UpdateStringFlagRequest,
    responseType: akasha_pb.UpdateStringFlagResponse,
    requestSerialize: serialize_akasha_UpdateStringFlagRequest,
    requestDeserialize: deserialize_akasha_UpdateStringFlagRequest,
    responseSerialize: serialize_akasha_UpdateStringFlagResponse,
    responseDeserialize: deserialize_akasha_UpdateStringFlagResponse,
  },
  // Common operations
deleteFlag: {
    path: '/akasha.FlagService/DeleteFlag',
    requestStream: false,
    responseStream: false,
    requestType: akasha_pb.DeleteFlagRequest,
    responseType: akasha_pb.DeleteFlagResponse,
    requestSerialize: serialize_akasha_DeleteFlagRequest,
    requestDeserialize: deserialize_akasha_DeleteFlagRequest,
    responseSerialize: serialize_akasha_DeleteFlagResponse,
    responseDeserialize: deserialize_akasha_DeleteFlagResponse,
  },
  listBoolFlags: {
    path: '/akasha.FlagService/ListBoolFlags',
    requestStream: false,
    responseStream: false,
    requestType: akasha_pb.ListBoolFlagsRequest,
    responseType: akasha_pb.ListBoolFlagsResponse,
    requestSerialize: serialize_akasha_ListBoolFlagsRequest,
    requestDeserialize: deserialize_akasha_ListBoolFlagsRequest,
    responseSerialize: serialize_akasha_ListBoolFlagsResponse,
    responseDeserialize: deserialize_akasha_ListBoolFlagsResponse,
  },
  listStringFlags: {
    path: '/akasha.FlagService/ListStringFlags',
    requestStream: false,
    responseStream: false,
    requestType: akasha_pb.ListStringFlagsRequest,
    responseType: akasha_pb.ListStringFlagsResponse,
    requestSerialize: serialize_akasha_ListStringFlagsRequest,
    requestDeserialize: deserialize_akasha_ListStringFlagsRequest,
    responseSerialize: serialize_akasha_ListStringFlagsResponse,
    responseDeserialize: deserialize_akasha_ListStringFlagsResponse,
  },
};

exports.FlagServiceClient = grpc.makeGenericClientConstructor(FlagServiceService);
// The MetricsService provides metrics about flag queries.
var MetricsServiceService = exports.MetricsServiceService = {
  getMetrics: {
    path: '/akasha.MetricsService/GetMetrics',
    requestStream: false,
    responseStream: false,
    requestType: akasha_pb.GetMetricsRequest,
    responseType: akasha_pb.GetMetricsResponse,
    requestSerialize: serialize_akasha_GetMetricsRequest,
    requestDeserialize: deserialize_akasha_GetMetricsRequest,
    responseSerialize: serialize_akasha_GetMetricsResponse,
    responseDeserialize: deserialize_akasha_GetMetricsResponse,
  },
};

exports.MetricsServiceClient = grpc.makeGenericClientConstructor(MetricsServiceService);
// The EvaluationService allows clients to fetch flag values based on context.
var EvaluationServiceService = exports.EvaluationServiceService = {
  evaluateBoolFlag: {
    path: '/akasha.EvaluationService/EvaluateBoolFlag',
    requestStream: false,
    responseStream: false,
    requestType: akasha_pb.EvaluateBoolFlagRequest,
    responseType: akasha_pb.EvaluateBoolFlagResponse,
    requestSerialize: serialize_akasha_EvaluateBoolFlagRequest,
    requestDeserialize: deserialize_akasha_EvaluateBoolFlagRequest,
    responseSerialize: serialize_akasha_EvaluateBoolFlagResponse,
    responseDeserialize: deserialize_akasha_EvaluateBoolFlagResponse,
  },
  evaluateStringFlag: {
    path: '/akasha.EvaluationService/EvaluateStringFlag',
    requestStream: false,
    responseStream: false,
    requestType: akasha_pb.EvaluateStringFlagRequest,
    responseType: akasha_pb.EvaluateStringFlagResponse,
    requestSerialize: serialize_akasha_EvaluateStringFlagRequest,
    requestDeserialize: deserialize_akasha_EvaluateStringFlagRequest,
    responseSerialize: serialize_akasha_EvaluateStringFlagResponse,
    responseDeserialize: deserialize_akasha_EvaluateStringFlagResponse,
  },
};

exports.EvaluationServiceClient = grpc.makeGenericClientConstructor(EvaluationServiceService);
