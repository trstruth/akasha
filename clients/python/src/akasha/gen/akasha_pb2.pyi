from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class Operator(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    EQUALS: _ClassVar[Operator]
    NOT_EQUALS: _ClassVar[Operator]
    CONTAINS: _ClassVar[Operator]
    NOT_CONTAINS: _ClassVar[Operator]
    GREATER_THAN: _ClassVar[Operator]
    LESS_THAN: _ClassVar[Operator]
EQUALS: Operator
NOT_EQUALS: Operator
CONTAINS: Operator
NOT_CONTAINS: Operator
GREATER_THAN: Operator
LESS_THAN: Operator

class Condition(_message.Message):
    __slots__ = ("attribute", "operator", "value")
    ATTRIBUTE_FIELD_NUMBER: _ClassVar[int]
    OPERATOR_FIELD_NUMBER: _ClassVar[int]
    VALUE_FIELD_NUMBER: _ClassVar[int]
    attribute: str
    operator: Operator
    value: str
    def __init__(self, attribute: _Optional[str] = ..., operator: _Optional[_Union[Operator, str]] = ..., value: _Optional[str] = ...) -> None: ...

class BoolTargetingRule(_message.Message):
    __slots__ = ("conditions", "variant")
    CONDITIONS_FIELD_NUMBER: _ClassVar[int]
    VARIANT_FIELD_NUMBER: _ClassVar[int]
    conditions: _containers.RepeatedCompositeFieldContainer[Condition]
    variant: bool
    def __init__(self, conditions: _Optional[_Iterable[_Union[Condition, _Mapping]]] = ..., variant: bool = ...) -> None: ...

class StringTargetingRule(_message.Message):
    __slots__ = ("conditions", "variant")
    CONDITIONS_FIELD_NUMBER: _ClassVar[int]
    VARIANT_FIELD_NUMBER: _ClassVar[int]
    conditions: _containers.RepeatedCompositeFieldContainer[Condition]
    variant: str
    def __init__(self, conditions: _Optional[_Iterable[_Union[Condition, _Mapping]]] = ..., variant: _Optional[str] = ...) -> None: ...

class Context(_message.Message):
    __slots__ = ("attributes",)
    class AttributesEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: str
        def __init__(self, key: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...
    ATTRIBUTES_FIELD_NUMBER: _ClassVar[int]
    attributes: _containers.ScalarMap[str, str]
    def __init__(self, attributes: _Optional[_Mapping[str, str]] = ...) -> None: ...

class BoolFlag(_message.Message):
    __slots__ = ("id", "name", "enabled", "default_value", "targeting_rules")
    ID_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    ENABLED_FIELD_NUMBER: _ClassVar[int]
    DEFAULT_VALUE_FIELD_NUMBER: _ClassVar[int]
    TARGETING_RULES_FIELD_NUMBER: _ClassVar[int]
    id: str
    name: str
    enabled: bool
    default_value: bool
    targeting_rules: _containers.RepeatedCompositeFieldContainer[BoolTargetingRule]
    def __init__(self, id: _Optional[str] = ..., name: _Optional[str] = ..., enabled: bool = ..., default_value: bool = ..., targeting_rules: _Optional[_Iterable[_Union[BoolTargetingRule, _Mapping]]] = ...) -> None: ...

class StringFlag(_message.Message):
    __slots__ = ("id", "name", "enabled", "default_value", "variants", "targeting_rules")
    ID_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    ENABLED_FIELD_NUMBER: _ClassVar[int]
    DEFAULT_VALUE_FIELD_NUMBER: _ClassVar[int]
    VARIANTS_FIELD_NUMBER: _ClassVar[int]
    TARGETING_RULES_FIELD_NUMBER: _ClassVar[int]
    id: str
    name: str
    enabled: bool
    default_value: str
    variants: _containers.RepeatedScalarFieldContainer[str]
    targeting_rules: _containers.RepeatedCompositeFieldContainer[StringTargetingRule]
    def __init__(self, id: _Optional[str] = ..., name: _Optional[str] = ..., enabled: bool = ..., default_value: _Optional[str] = ..., variants: _Optional[_Iterable[str]] = ..., targeting_rules: _Optional[_Iterable[_Union[StringTargetingRule, _Mapping]]] = ...) -> None: ...

class CreateBoolFlagRequest(_message.Message):
    __slots__ = ("flag",)
    FLAG_FIELD_NUMBER: _ClassVar[int]
    flag: BoolFlag
    def __init__(self, flag: _Optional[_Union[BoolFlag, _Mapping]] = ...) -> None: ...

class CreateBoolFlagResponse(_message.Message):
    __slots__ = ("flag",)
    FLAG_FIELD_NUMBER: _ClassVar[int]
    flag: BoolFlag
    def __init__(self, flag: _Optional[_Union[BoolFlag, _Mapping]] = ...) -> None: ...

class GetBoolFlagRequest(_message.Message):
    __slots__ = ("id",)
    ID_FIELD_NUMBER: _ClassVar[int]
    id: str
    def __init__(self, id: _Optional[str] = ...) -> None: ...

class GetBoolFlagResponse(_message.Message):
    __slots__ = ("flag",)
    FLAG_FIELD_NUMBER: _ClassVar[int]
    flag: BoolFlag
    def __init__(self, flag: _Optional[_Union[BoolFlag, _Mapping]] = ...) -> None: ...

class UpdateBoolFlagRequest(_message.Message):
    __slots__ = ("flag",)
    FLAG_FIELD_NUMBER: _ClassVar[int]
    flag: BoolFlag
    def __init__(self, flag: _Optional[_Union[BoolFlag, _Mapping]] = ...) -> None: ...

class UpdateBoolFlagResponse(_message.Message):
    __slots__ = ("flag",)
    FLAG_FIELD_NUMBER: _ClassVar[int]
    flag: BoolFlag
    def __init__(self, flag: _Optional[_Union[BoolFlag, _Mapping]] = ...) -> None: ...

class CreateStringFlagRequest(_message.Message):
    __slots__ = ("flag",)
    FLAG_FIELD_NUMBER: _ClassVar[int]
    flag: StringFlag
    def __init__(self, flag: _Optional[_Union[StringFlag, _Mapping]] = ...) -> None: ...

class CreateStringFlagResponse(_message.Message):
    __slots__ = ("flag",)
    FLAG_FIELD_NUMBER: _ClassVar[int]
    flag: StringFlag
    def __init__(self, flag: _Optional[_Union[StringFlag, _Mapping]] = ...) -> None: ...

class GetStringFlagRequest(_message.Message):
    __slots__ = ("id",)
    ID_FIELD_NUMBER: _ClassVar[int]
    id: str
    def __init__(self, id: _Optional[str] = ...) -> None: ...

class GetStringFlagResponse(_message.Message):
    __slots__ = ("flag",)
    FLAG_FIELD_NUMBER: _ClassVar[int]
    flag: StringFlag
    def __init__(self, flag: _Optional[_Union[StringFlag, _Mapping]] = ...) -> None: ...

class UpdateStringFlagRequest(_message.Message):
    __slots__ = ("flag",)
    FLAG_FIELD_NUMBER: _ClassVar[int]
    flag: StringFlag
    def __init__(self, flag: _Optional[_Union[StringFlag, _Mapping]] = ...) -> None: ...

class UpdateStringFlagResponse(_message.Message):
    __slots__ = ("flag",)
    FLAG_FIELD_NUMBER: _ClassVar[int]
    flag: StringFlag
    def __init__(self, flag: _Optional[_Union[StringFlag, _Mapping]] = ...) -> None: ...

class DeleteFlagRequest(_message.Message):
    __slots__ = ("id",)
    ID_FIELD_NUMBER: _ClassVar[int]
    id: str
    def __init__(self, id: _Optional[str] = ...) -> None: ...

class DeleteFlagResponse(_message.Message):
    __slots__ = ("success",)
    SUCCESS_FIELD_NUMBER: _ClassVar[int]
    success: bool
    def __init__(self, success: bool = ...) -> None: ...

class ListBoolFlagsRequest(_message.Message):
    __slots__ = ("page", "page_size")
    PAGE_FIELD_NUMBER: _ClassVar[int]
    PAGE_SIZE_FIELD_NUMBER: _ClassVar[int]
    page: int
    page_size: int
    def __init__(self, page: _Optional[int] = ..., page_size: _Optional[int] = ...) -> None: ...

class ListBoolFlagsResponse(_message.Message):
    __slots__ = ("flags", "total_count")
    FLAGS_FIELD_NUMBER: _ClassVar[int]
    TOTAL_COUNT_FIELD_NUMBER: _ClassVar[int]
    flags: _containers.RepeatedCompositeFieldContainer[BoolFlag]
    total_count: int
    def __init__(self, flags: _Optional[_Iterable[_Union[BoolFlag, _Mapping]]] = ..., total_count: _Optional[int] = ...) -> None: ...

class ListStringFlagsRequest(_message.Message):
    __slots__ = ("page", "page_size")
    PAGE_FIELD_NUMBER: _ClassVar[int]
    PAGE_SIZE_FIELD_NUMBER: _ClassVar[int]
    page: int
    page_size: int
    def __init__(self, page: _Optional[int] = ..., page_size: _Optional[int] = ...) -> None: ...

class ListStringFlagsResponse(_message.Message):
    __slots__ = ("flags", "total_count")
    FLAGS_FIELD_NUMBER: _ClassVar[int]
    TOTAL_COUNT_FIELD_NUMBER: _ClassVar[int]
    flags: _containers.RepeatedCompositeFieldContainer[StringFlag]
    total_count: int
    def __init__(self, flags: _Optional[_Iterable[_Union[StringFlag, _Mapping]]] = ..., total_count: _Optional[int] = ...) -> None: ...

class GetMetricsRequest(_message.Message):
    __slots__ = ("flag_id",)
    FLAG_ID_FIELD_NUMBER: _ClassVar[int]
    flag_id: str
    def __init__(self, flag_id: _Optional[str] = ...) -> None: ...

class GetMetricsResponse(_message.Message):
    __slots__ = ("total_queries", "true_count", "false_count", "variant_counts")
    class VariantCountsEntry(_message.Message):
        __slots__ = ("key", "value")
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: int
        def __init__(self, key: _Optional[str] = ..., value: _Optional[int] = ...) -> None: ...
    TOTAL_QUERIES_FIELD_NUMBER: _ClassVar[int]
    TRUE_COUNT_FIELD_NUMBER: _ClassVar[int]
    FALSE_COUNT_FIELD_NUMBER: _ClassVar[int]
    VARIANT_COUNTS_FIELD_NUMBER: _ClassVar[int]
    total_queries: int
    true_count: int
    false_count: int
    variant_counts: _containers.ScalarMap[str, int]
    def __init__(self, total_queries: _Optional[int] = ..., true_count: _Optional[int] = ..., false_count: _Optional[int] = ..., variant_counts: _Optional[_Mapping[str, int]] = ...) -> None: ...

class EvaluateBoolFlagRequest(_message.Message):
    __slots__ = ("id", "name", "context")
    ID_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    CONTEXT_FIELD_NUMBER: _ClassVar[int]
    id: str
    name: str
    context: Context
    def __init__(self, id: _Optional[str] = ..., name: _Optional[str] = ..., context: _Optional[_Union[Context, _Mapping]] = ...) -> None: ...

class EvaluateBoolFlagResponse(_message.Message):
    __slots__ = ("value",)
    VALUE_FIELD_NUMBER: _ClassVar[int]
    value: bool
    def __init__(self, value: bool = ...) -> None: ...

class EvaluateStringFlagRequest(_message.Message):
    __slots__ = ("id", "name", "context")
    ID_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    CONTEXT_FIELD_NUMBER: _ClassVar[int]
    id: str
    name: str
    context: Context
    def __init__(self, id: _Optional[str] = ..., name: _Optional[str] = ..., context: _Optional[_Union[Context, _Mapping]] = ...) -> None: ...

class EvaluateStringFlagResponse(_message.Message):
    __slots__ = ("value",)
    VALUE_FIELD_NUMBER: _ClassVar[int]
    value: str
    def __init__(self, value: _Optional[str] = ...) -> None: ...
