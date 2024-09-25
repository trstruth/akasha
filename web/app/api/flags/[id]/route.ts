// app/api/flags/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { FlagServiceClient } from '@/gen/akasha_grpc_pb';
import {
    GetBoolFlagRequest,
    GetStringFlagRequest,
    UpdateBoolFlagRequest,
    UpdateStringFlagRequest,
    DeleteFlagRequest,
    BoolFlag as ProtoBoolFlag,
    StringFlag as ProtoStringFlag,
    BoolTargetingRule as ProtoBoolTargetingRule,
    StringTargetingRule as ProtoStringTargetingRule,
    Condition as ProtoCondition,
    GetBoolFlagResponse,
    GetStringFlagResponse,
    UpdateBoolFlagResponse,
    UpdateStringFlagResponse,
    DeleteFlagResponse,
} from '@/gen/akasha_pb';
import * as grpc from '@grpc/grpc-js';
import { mapGrpcError } from '../../errors';
import {
    Flag,
    BoolFlag,
    StringFlag,
} from '@/types/models';

const akasha_host = process.env['AKASHA_HOST'] || 'localhost';
const client = new FlagServiceClient(
    `${akasha_host}:50051`,
    grpc.credentials.createInsecure()
);

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse> {
    const flagId = params.id;

    return new Promise((resolve) => {
        const getBoolRequest = new GetBoolFlagRequest();
        getBoolRequest.setId(flagId);

        client.getBoolFlag(getBoolRequest, (error: grpc.ServiceError, response: GetBoolFlagResponse) => {
            if (error && error.code !== grpc.status.NOT_FOUND) {
                console.error('Error getting BoolFlag:', error);
                resolve(mapGrpcError(error));
            } else if (response && response.getFlag()) {
                const protoFlag = response.getFlag()!;
                const flag: BoolFlag = {
                    id: protoFlag.getId(),
                    name: protoFlag.getName(),
                    enabled: protoFlag.getEnabled(),
                    defaultValue: protoFlag.getDefaultValue(),
                    type: 'bool',
                    targetingRulesList: protoFlag.getTargetingRulesList().map((protoRule) => ({
                        variant: protoRule.getVariant(),
                        conditionsList: protoRule.getConditionsList().map((protoCondition) => ({
                            attribute: protoCondition.getAttribute(),
                            operator: protoCondition.getOperator(),
                            value: protoCondition.getValue(),
                        })),
                    })),
                };
                resolve(NextResponse.json({ flag }));
            } else {
                const getStringRequest = new GetStringFlagRequest();
                getStringRequest.setId(flagId);

                client.getStringFlag(getStringRequest, (error: grpc.ServiceError, response: GetStringFlagResponse) => {
                    if (error && error.code !== grpc.status.NOT_FOUND) {
                        console.error('Error getting StringFlag:', error);
                        resolve(mapGrpcError(error));
                    } else if (response && response.getFlag()) {
                        const protoFlag = response.getFlag()!;
                        const flag: StringFlag = {
                            id: protoFlag.getId(),
                            name: protoFlag.getName(),
                            enabled: protoFlag.getEnabled(),
                            defaultValue: protoFlag.getDefaultValue(),
                            variants: protoFlag.getVariantsList(),
                            type: 'string',
                            targetingRulesList: protoFlag.getTargetingRulesList().map((protoRule) => ({
                                variant: protoRule.getVariant(),
                                conditionsList: protoRule.getConditionsList().map((protoCondition) => ({
                                    attribute: protoCondition.getAttribute(),
                                    operator: protoCondition.getOperator(),
                                    value: protoCondition.getValue(),
                                })),
                            })),
                        };
                        resolve(NextResponse.json({ flag }));
                    } else {
                        resolve(NextResponse.json({ error: 'Flag not found' }, { status: 404 }));
                    }
                });
            }
        });
    });
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse> {
    try {
        const data = await request.json();
        const flagId = params.id;
        const flag = data as Flag<boolean | string>;

        return new Promise((resolve) => {
            if (flag.type === 'bool') {
                const boolFlag = flag as BoolFlag;
                const protoFlag = new ProtoBoolFlag();
                protoFlag.setId(flagId);
                protoFlag.setName(boolFlag.name);
                protoFlag.setEnabled(boolFlag.enabled);
                protoFlag.setDefaultValue(boolFlag.defaultValue);

                const protoTargetingRules = boolFlag.targetingRulesList.map((rule) => {
                    const protoRule = new ProtoBoolTargetingRule();
                    protoRule.setVariant(rule.variant);

                    const protoConditions = rule.conditionsList.map((condition) => {
                        const protoCondition = new ProtoCondition();
                        protoCondition.setAttribute(condition.attribute);
                        protoCondition.setOperator(condition.operator);
                        protoCondition.setValue(condition.value);
                        return protoCondition;
                    });
                    protoRule.setConditionsList(protoConditions);

                    return protoRule;
                });
                protoFlag.setTargetingRulesList(protoTargetingRules);

                const updateRequest = new UpdateBoolFlagRequest();
                updateRequest.setFlag(protoFlag);

                client.updateBoolFlag(updateRequest, (error: grpc.ServiceError, response: UpdateBoolFlagResponse) => {
                    if (error) {
                        console.error('Error updating BoolFlag:', error);
                        resolve(mapGrpcError(error));
                    } else {
                        const updatedProtoFlag = response.getFlag()!;
                        const updatedFlag: BoolFlag = {
                            id: updatedProtoFlag.getId(),
                            name: updatedProtoFlag.getName(),
                            enabled: updatedProtoFlag.getEnabled(),
                            defaultValue: updatedProtoFlag.getDefaultValue(),
                            type: 'bool',
                            targetingRulesList: updatedProtoFlag.getTargetingRulesList().map((protoRule) => ({
                                variant: protoRule.getVariant(),
                                conditionsList: protoRule.getConditionsList().map((protoCondition) => ({
                                    attribute: protoCondition.getAttribute(),
                                    operator: protoCondition.getOperator(),
                                    value: protoCondition.getValue(),
                                })),
                            })),
                        };
                        resolve(NextResponse.json({ flag: updatedFlag }));
                    }
                });
            } else if (flag.type === 'string') {
                const stringFlag = flag as StringFlag;
                const protoFlag = new ProtoStringFlag();
                protoFlag.setId(flagId);
                protoFlag.setName(stringFlag.name);
                protoFlag.setEnabled(stringFlag.enabled);
                protoFlag.setDefaultValue(stringFlag.defaultValue);
                protoFlag.setVariantsList(stringFlag.variants || []);

                const protoTargetingRules = stringFlag.targetingRulesList.map((rule) => {
                    const protoRule = new ProtoStringTargetingRule();
                    protoRule.setVariant(rule.variant);

                    const protoConditions = rule.conditionsList.map((condition) => {
                        const protoCondition = new ProtoCondition();
                        protoCondition.setAttribute(condition.attribute);
                        protoCondition.setOperator(condition.operator);
                        protoCondition.setValue(condition.value);
                        return protoCondition;
                    });
                    protoRule.setConditionsList(protoConditions);

                    return protoRule;
                });
                protoFlag.setTargetingRulesList(protoTargetingRules);

                const updateRequest = new UpdateStringFlagRequest();
                updateRequest.setFlag(protoFlag);

                client.updateStringFlag(updateRequest, (error: grpc.ServiceError, response: UpdateStringFlagResponse) => {
                    if (error) {
                        console.error('Error updating StringFlag:', error);
                        resolve(mapGrpcError(error));
                    } else {
                        const updatedProtoFlag = response.getFlag()!;
                        const updatedFlag: StringFlag = {
                            id: updatedProtoFlag.getId(),
                            name: updatedProtoFlag.getName(),
                            enabled: updatedProtoFlag.getEnabled(),
                            defaultValue: updatedProtoFlag.getDefaultValue(),
                            variants: updatedProtoFlag.getVariantsList(),
                            type: 'string',
                            targetingRulesList: updatedProtoFlag.getTargetingRulesList().map((protoRule) => ({
                                variant: protoRule.getVariant(),
                                conditionsList: protoRule.getConditionsList().map((protoCondition) => ({
                                    attribute: protoCondition.getAttribute(),
                                    operator: protoCondition.getOperator(),
                                    value: protoCondition.getValue(),
                                })),
                            })),
                        };
                        resolve(NextResponse.json({ flag: updatedFlag }));
                    }
                });
            } else {
                resolve(NextResponse.json({ error: 'Invalid flag type' }, { status: 400 }));
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
): Promise<NextResponse> {
    const flagId = params.id;

    return new Promise((resolve) => {
        const deleteRequest = new DeleteFlagRequest();
        deleteRequest.setId(flagId);

        client.deleteFlag(deleteRequest, (error: grpc.ServiceError, response: DeleteFlagResponse) => {
            if (error) {
                console.error('Error deleting flag:', error);
                resolve(mapGrpcError(error));
            } else {
                resolve(NextResponse.json({ success: response.getSuccess() }));
            }
        });
    });
}
