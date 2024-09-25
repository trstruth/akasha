// app/api/flags/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { FlagServiceClient } from '@/gen/akasha_grpc_pb';
import {
    ListBoolFlagsRequest,
    ListStringFlagsRequest,
    CreateBoolFlagRequest,
    CreateStringFlagRequest,
    BoolFlag as ProtoBoolFlag,
    StringFlag as ProtoStringFlag,
    BoolTargetingRule as ProtoBoolTargetingRule,
    StringTargetingRule as ProtoStringTargetingRule,
    Condition as ProtoCondition,
    ListBoolFlagsResponse,
    CreateBoolFlagResponse,
    CreateStringFlagResponse,
    ListStringFlagsResponse,
} from '@/gen/akasha_pb';
import * as grpc from '@grpc/grpc-js';
import { mapGrpcError } from '../errors';
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

export async function GET(): Promise<NextResponse> {
    return new Promise((resolve) => {
        const listBoolRequest = new ListBoolFlagsRequest();
        listBoolRequest.setPage(1);
        listBoolRequest.setPageSize(100);

        const listStringRequest = new ListStringFlagsRequest();
        listStringRequest.setPage(1);
        listStringRequest.setPageSize(100);

        const flags: Flag<string | boolean>[] = [];

        client.listBoolFlags(listBoolRequest, (error: grpc.ServiceError, boolResponse: ListBoolFlagsResponse) => {
            if (error) {
                console.error('Error calling listBoolFlags:', error);
                resolve(mapGrpcError(error));
            } else {
                const boolFlags = boolResponse.getFlagsList().map((protoFlag) => {
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
                    return flag;
                });
                flags.push(...boolFlags);

                client.listStringFlags(listStringRequest, (error: grpc.ServiceError, stringResponse: ListStringFlagsResponse) => {
                    if (error) {
                        console.error('Error calling listStringFlags:', error);
                        resolve(mapGrpcError(error));
                    } else {
                        const stringFlags = stringResponse.getFlagsList().map((protoFlag) => {
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
                            return flag;
                        });
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
        const flag = data as Flag<string | boolean>;

        return new Promise((resolve) => {
            if (flag.type === 'bool') {
                const boolFlag = flag as BoolFlag;

                const protoFlag = new ProtoBoolFlag();
                protoFlag.setId(boolFlag.id);
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

                const createRequest = new CreateBoolFlagRequest();
                createRequest.setFlag(protoFlag);

                client.createBoolFlag(createRequest, (error: grpc.ServiceError, response: CreateBoolFlagResponse) => {
                    if (error) {
                        console.error('Error creating BoolFlag:', error);
                        resolve(mapGrpcError(error));
                    } else {
                        const createdProtoFlag = response.getFlag()!;
                        const createdFlag: BoolFlag = {
                            id: createdProtoFlag.getId(),
                            name: createdProtoFlag.getName(),
                            enabled: createdProtoFlag.getEnabled(),
                            defaultValue: createdProtoFlag.getDefaultValue(),
                            type: 'bool',
                            targetingRulesList: createdProtoFlag.getTargetingRulesList().map((protoRule) => ({
                                variant: protoRule.getVariant(),
                                conditionsList: protoRule.getConditionsList().map((protoCondition) => ({
                                    attribute: protoCondition.getAttribute(),
                                    operator: protoCondition.getOperator(),
                                    value: protoCondition.getValue(),
                                })),
                            })),
                        };
                        resolve(NextResponse.json({ flag: createdFlag }));
                    }
                });
            } else if (flag.type === 'string') {
                const stringFlag = flag as StringFlag;

                const protoFlag = new ProtoStringFlag();
                protoFlag.setId(stringFlag.id);
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

                const createRequest = new CreateStringFlagRequest();
                createRequest.setFlag(protoFlag);

                client.createStringFlag(createRequest, (error: grpc.ServiceError, response: CreateStringFlagResponse) => {
                    if (error) {
                        console.error('Error creating StringFlag:', error);
                        resolve(mapGrpcError(error));
                    } else {
                        const createdProtoFlag = response.getFlag()!;
                        const createdFlag: StringFlag = {
                            id: createdProtoFlag.getId(),
                            name: createdProtoFlag.getName(),
                            enabled: createdProtoFlag.getEnabled(),
                            defaultValue: createdProtoFlag.getDefaultValue(),
                            variants: createdProtoFlag.getVariantsList(),
                            type: 'string',
                            targetingRulesList: createdProtoFlag.getTargetingRulesList().map((protoRule) => ({
                                variant: protoRule.getVariant(),
                                conditionsList: protoRule.getConditionsList().map((protoCondition) => ({
                                    attribute: protoCondition.getAttribute(),
                                    operator: protoCondition.getOperator(),
                                    value: protoCondition.getValue(),
                                })),
                            })),
                        };
                        resolve(NextResponse.json({ flag: createdFlag }));
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
