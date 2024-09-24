// app/api/flags/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { FlagServiceClient } from '@/gen/akasha_grpc_pb';
import {
    ListBoolFlagsRequest,
    ListStringFlagsRequest,
    CreateBoolFlagRequest,
    CreateStringFlagRequest,
    BoolFlag,
    StringFlag,
    ListBoolFlagsResponse,
    ListStringFlagsResponse,
    CreateBoolFlagResponse,
    CreateStringFlagResponse,
} from '@/gen/akasha_pb';
import * as grpc from '@grpc/grpc-js';
import { mapGrpcError } from '../errors'; // Adjust the import path if necessary

const akasha_host = process.env['AKASHA_HOST'] || 'localhost';
const client = new FlagServiceClient(
    `${akasha_host}:50051`,
    grpc.credentials.createInsecure()
);

type GenericFlag = {
    id: string;
    name: string;
    enabled: boolean;
    defaultValue: string | boolean;
    variants?: string[];
    type: string;
};

export async function GET(): Promise<NextResponse> {
    return new Promise((resolve) => {
        const listBoolRequest = new ListBoolFlagsRequest();
        listBoolRequest.setPage(1);
        listBoolRequest.setPageSize(100); // Adjust page size as needed

        const listStringRequest = new ListStringFlagsRequest();
        listStringRequest.setPage(1);
        listStringRequest.setPageSize(100); // Adjust page size as needed

        const flags: GenericFlag[] = [];

        client.listBoolFlags(listBoolRequest, (error: grpc.ServiceError | null, boolResponse: ListBoolFlagsResponse) => {
            if (error) {
                console.error('Error calling listBoolFlags:', error);
                resolve(mapGrpcError(error));
            } else {
                const boolFlags = boolResponse.getFlagsList().map((flag) => ({
                    id: flag.getId(),
                    name: flag.getName(),
                    enabled: flag.getEnabled(),
                    defaultValue: flag.getDefaultValue(),
                    type: 'bool',
                }));
                flags.push(...boolFlags);

                client.listStringFlags(listStringRequest, (error: grpc.ServiceError | null, stringResponse: ListStringFlagsResponse) => {
                    if (error) {
                        console.error('Error calling listStringFlags:', error);
                        resolve(mapGrpcError(error));
                    } else {
                        const stringFlags = stringResponse.getFlagsList().map((flag) => ({
                            id: flag.getId(),
                            name: flag.getName(),
                            enabled: flag.getEnabled(),
                            defaultValue: flag.getDefaultValue(),
                            variants: flag.getVariantsList(),
                            type: 'string',
                        }));
                        flags.push(...stringFlags);

                        resolve(NextResponse.json({ flags }));
                    }
                });
            }
        });
    });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const data = await request.json();
        const { type, id, name, enabled, defaultValue, variants } = data;

        return new Promise((resolve) => {
            if (type === 'bool') {
                const flag = new BoolFlag();
                flag.setId(id);
                flag.setName(name);
                flag.setEnabled(enabled);
                flag.setDefaultValue(defaultValue);

                // Set targeting rules if provided (you'll need to implement this)

                const createRequest = new CreateBoolFlagRequest();
                createRequest.setFlag(flag);

                client.createBoolFlag(createRequest, (error: grpc.ServiceError | null, response: CreateBoolFlagResponse) => {
                    if (error) {
                        console.error('Error creating BoolFlag:', error);
                        resolve(mapGrpcError(error));
                    } else {
                        resolve(
                            NextResponse.json({
                                flag: { ...response.getFlag()?.toObject(), type: 'bool' },
                            })
                        );
                    }
                });
            } else if (type === 'string') {
                const flag = new StringFlag();
                flag.setId(id);
                flag.setName(name);
                flag.setEnabled(enabled);
                flag.setDefaultValue(defaultValue);
                flag.setVariantsList(variants || []);

                // Set targeting rules if provided (you'll need to implement this)

                const createRequest = new CreateStringFlagRequest();
                createRequest.setFlag(flag);

                client.createStringFlag(createRequest, (error: grpc.ServiceError | null, response: CreateStringFlagResponse) => {
                    if (error) {
                        console.error('Error creating StringFlag:', error);
                        resolve(mapGrpcError(error));
                    } else {
                        resolve(
                            NextResponse.json({
                                flag: { ...response.getFlag()?.toObject(), type: 'string' },
                            })
                        );
                    }
                });
            } else {
                resolve(
                    NextResponse.json({ error: 'Invalid flag type' }, { status: 400 })
                );
            }
        });
    } catch (error) {
        console.error('Error parsing request body:', error);
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}
