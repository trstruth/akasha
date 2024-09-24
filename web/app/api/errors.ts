import * as grpc from '@grpc/grpc-js';
import { NextResponse } from 'next/server';

export function mapGrpcError(error: grpc.ServiceError) {
    return NextResponse.json(
        { error: error.message },
        { status: grpcStatusToHttp(error.code) }
    );
}
/**
 * Maps gRPC status codes to HTTP status codes.
 */
function grpcStatusToHttp(code: grpc.status): number {
    switch (code) {
        case grpc.status.OK:
            return 200;
        case grpc.status.INVALID_ARGUMENT:
            return 400;
        case grpc.status.NOT_FOUND:
            return 404;
        case grpc.status.ALREADY_EXISTS:
            return 409;
        case grpc.status.PERMISSION_DENIED:
            return 403;
        case grpc.status.UNAUTHENTICATED:
            return 401;
        case grpc.status.INTERNAL:
            return 500;
        default:
            return 500;
    }
}

