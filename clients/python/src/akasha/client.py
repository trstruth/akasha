import grpc
from akasha.gen.akasha_pb2_grpc import EvaluationServiceStub
from akasha.gen.akasha_pb2 import EvaluateStringFlagRequest, EvaluateBoolFlagRequest

class Client:
    def __init__(self, host: str, port: int):
        self.host = host
        self.port = port

    def get_bool(self, name: str, targets: dict[str, str], default: bool) -> bool:
        with grpc.insecure_channel(f"{self.host}:{self.port}") as channel:
            stub = EvaluationServiceStub(channel)
            response = stub.EvaluateBoolFlag(EvaluateBoolFlagRequest(name=name, context=targets))
            return response.value

        return default

    def get_string(self, name: str, targets: dict[str, str], default: str) -> str:
        with grpc.insecure_channel(f"{self.host}:{self.port}") as channel:
            stub = EvaluationServiceStub(channel)
            response = stub.EvaluateStringFlag(EvaluateStringFlagRequest(name=name, context=targets))
            return response.value

        return default