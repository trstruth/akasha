// app/api/flags/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { FlagServiceClient } from '@/gen/akasha_grpc_pb';
import {
    GetBoolFlagRequest,
    GetStringFlagRequest,
    UpdateBoolFlagRequest,
    UpdateStringFlagRequest,
    DeleteFlagRequest,
    BoolFlag,
    StringFlag,
} from '@/gen/akasha_pb';
import * as grpc from '@grpc/grpc-js';
import { mapGrpcError } from '../../errors'; // Adjust the import path if necessary

const client = new FlagServiceClient(
    'localhost:50051',
    grpc.credentials.createInsecure()
);

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const flagId = params.id;

    // Try to get BoolFlag first
    return new Promise((resolve) => {
        const getBoolRequest = new GetBoolFlagRequest();
        getBoolRequest.setId(flagId);

        client.getBoolFlag(getBoolRequest, (error, response) => {
            if (error && error.code !== grpc.status.NOT_FOUND) {
                console.error('Error getting BoolFlag:', error);
                resolve(mapGrpcError(error));
            } else if (response && response.getFlag()) {
                resolve(
                    NextResponse.json({
                        flag: {
                            ...response.getFlag()?.toObject(),
                            type: 'bool',
                        },
                    })
                );
            } else {
                // Try getting StringFlag
                const getStringRequest = new GetStringFlagRequest();
                getStringRequest.setId(flagId);

                client.getStringFlag(getStringRequest, (error, response) => {
                    if (error && error.code !== grpc.status.NOT_FOUND) {
                        console.error('Error getting StringFlag:', error);
                        resolve(mapGrpcError(error));
                    } else if (response && response.getFlag()) {
                        resolve(
                            NextResponse.json({
                                flag: {
                                    ...response.getFlag()?.toObject(),
                                    type: 'string',
                                },
                            })
                        );
                    } else {
                        // Flag not found
                        resolve(
                            NextResponse.json(
                                { error: 'Flag not found' },
                                { status: 404 }
                            )
                        );
                    }
                });
            }
        });
    });
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const data = await request.json();
        const flagId = params.id;
        const { type, name, enabled, defaultValue, variants, targetingRules } = data;

        return new Promise((resolve) => {
            if (type === 'bool') {
                const flag = new BoolFlag();
                flag.setId(flagId);
                flag.setName(name);
                flag.setEnabled(enabled);
                flag.setDefaultValue(defaultValue);

                // Set targeting rules if provided (you'll need to implement this)

                const updateRequest = new UpdateBoolFlagRequest();
                updateRequest.setFlag(flag);

                client.updateBoolFlag(updateRequest, (error, response) => {
                    if (error) {
                        console.error('Error updating BoolFlag:', error);
                        resolve(mapGrpcError(error));
                    } else {
                        resolve(
                            NextResponse.json({
                                flag: {
                                    ...response.getFlag()?.toObject(),
                                    type: 'bool',
                                },
                            })
                        );
                    }
                });
            } else if (type === 'string') {
                const flag = new StringFlag();
                flag.setId(flagId);
                flag.setName(name);
                flag.setEnabled(enabled);
                flag.setDefaultValue(defaultValue);
                flag.setVariantsList(variants || []);

                // Set targeting rules if provided (you'll need to implement this)

                const updateRequest = new UpdateStringFlagRequest();
                updateRequest.setFlag(flag);

                client.updateStringFlag(updateRequest, (error, response) => {
                    if (error) {
                        console.error('Error updating StringFlag:', error);
                        resolve(mapGrpcError(error));
                    } else {
                        resolve(
                            NextResponse.json({
                                flag: {
                                    ...response.getFlag()?.toObject(),
                                    type: 'string',
                                },
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

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const flagId = params.id;

    return new Promise((resolve) => {
        const deleteRequest = new DeleteFlagRequest();
        deleteRequest.setId(flagId);

        client.deleteFlag(deleteRequest, (error, response) => {
            if (error) {
                console.error('Error deleting flag:', error);
                resolve(mapGrpcError(error));
            } else {
                resolve(NextResponse.json({ success: response.getSuccess() }));
            }
        });
    });
}
