# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# NO CHECKED-IN PROTOBUF GENCODE
# source: akasha.proto
# Protobuf Python Version: 5.27.2
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import runtime_version as _runtime_version
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
_runtime_version.ValidateProtobufRuntimeVersion(
    _runtime_version.Domain.PUBLIC,
    5,
    27,
    2,
    '',
    'akasha.proto'
)
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x0c\x61kasha.proto\x12\x06\x61kasha\"Q\n\tCondition\x12\x11\n\tattribute\x18\x01 \x01(\t\x12\"\n\x08operator\x18\x02 \x01(\x0e\x32\x10.akasha.Operator\x12\r\n\x05value\x18\x03 \x01(\t\"K\n\x11\x42oolTargetingRule\x12%\n\nconditions\x18\x01 \x03(\x0b\x32\x11.akasha.Condition\x12\x0f\n\x07variant\x18\x02 \x01(\x08\"M\n\x13StringTargetingRule\x12%\n\nconditions\x18\x01 \x03(\x0b\x32\x11.akasha.Condition\x12\x0f\n\x07variant\x18\x02 \x01(\t\"q\n\x07\x43ontext\x12\x33\n\nattributes\x18\x01 \x03(\x0b\x32\x1f.akasha.Context.AttributesEntry\x1a\x31\n\x0f\x41ttributesEntry\x12\x0b\n\x03key\x18\x01 \x01(\t\x12\r\n\x05value\x18\x02 \x01(\t:\x02\x38\x01\"\x80\x01\n\x08\x42oolFlag\x12\n\n\x02id\x18\x01 \x01(\t\x12\x0c\n\x04name\x18\x02 \x01(\t\x12\x0f\n\x07\x65nabled\x18\x03 \x01(\x08\x12\x15\n\rdefault_value\x18\x04 \x01(\x08\x12\x32\n\x0ftargeting_rules\x18\x05 \x03(\x0b\x32\x19.akasha.BoolTargetingRule\"\x96\x01\n\nStringFlag\x12\n\n\x02id\x18\x01 \x01(\t\x12\x0c\n\x04name\x18\x02 \x01(\t\x12\x0f\n\x07\x65nabled\x18\x03 \x01(\x08\x12\x15\n\rdefault_value\x18\x04 \x01(\t\x12\x10\n\x08variants\x18\x05 \x03(\t\x12\x34\n\x0ftargeting_rules\x18\x06 \x03(\x0b\x32\x1b.akasha.StringTargetingRule\"7\n\x15\x43reateBoolFlagRequest\x12\x1e\n\x04\x66lag\x18\x01 \x01(\x0b\x32\x10.akasha.BoolFlag\"8\n\x16\x43reateBoolFlagResponse\x12\x1e\n\x04\x66lag\x18\x01 \x01(\x0b\x32\x10.akasha.BoolFlag\" \n\x12GetBoolFlagRequest\x12\n\n\x02id\x18\x01 \x01(\t\"5\n\x13GetBoolFlagResponse\x12\x1e\n\x04\x66lag\x18\x01 \x01(\x0b\x32\x10.akasha.BoolFlag\"7\n\x15UpdateBoolFlagRequest\x12\x1e\n\x04\x66lag\x18\x01 \x01(\x0b\x32\x10.akasha.BoolFlag\"8\n\x16UpdateBoolFlagResponse\x12\x1e\n\x04\x66lag\x18\x01 \x01(\x0b\x32\x10.akasha.BoolFlag\";\n\x17\x43reateStringFlagRequest\x12 \n\x04\x66lag\x18\x01 \x01(\x0b\x32\x12.akasha.StringFlag\"<\n\x18\x43reateStringFlagResponse\x12 \n\x04\x66lag\x18\x01 \x01(\x0b\x32\x12.akasha.StringFlag\"\"\n\x14GetStringFlagRequest\x12\n\n\x02id\x18\x01 \x01(\t\"9\n\x15GetStringFlagResponse\x12 \n\x04\x66lag\x18\x01 \x01(\x0b\x32\x12.akasha.StringFlag\";\n\x17UpdateStringFlagRequest\x12 \n\x04\x66lag\x18\x01 \x01(\x0b\x32\x12.akasha.StringFlag\"<\n\x18UpdateStringFlagResponse\x12 \n\x04\x66lag\x18\x01 \x01(\x0b\x32\x12.akasha.StringFlag\"\x1f\n\x11\x44\x65leteFlagRequest\x12\n\n\x02id\x18\x01 \x01(\t\"%\n\x12\x44\x65leteFlagResponse\x12\x0f\n\x07success\x18\x01 \x01(\x08\"7\n\x14ListBoolFlagsRequest\x12\x0c\n\x04page\x18\x01 \x01(\x05\x12\x11\n\tpage_size\x18\x02 \x01(\x05\"M\n\x15ListBoolFlagsResponse\x12\x1f\n\x05\x66lags\x18\x01 \x03(\x0b\x32\x10.akasha.BoolFlag\x12\x13\n\x0btotal_count\x18\x02 \x01(\x05\"9\n\x16ListStringFlagsRequest\x12\x0c\n\x04page\x18\x01 \x01(\x05\x12\x11\n\tpage_size\x18\x02 \x01(\x05\"Q\n\x17ListStringFlagsResponse\x12!\n\x05\x66lags\x18\x01 \x03(\x0b\x32\x12.akasha.StringFlag\x12\x13\n\x0btotal_count\x18\x02 \x01(\x05\"$\n\x11GetMetricsRequest\x12\x0f\n\x07\x66lag_id\x18\x01 \x01(\t\"\xd1\x01\n\x12GetMetricsResponse\x12\x15\n\rtotal_queries\x18\x01 \x01(\x03\x12\x12\n\ntrue_count\x18\x02 \x01(\x03\x12\x13\n\x0b\x66\x61lse_count\x18\x03 \x01(\x03\x12\x45\n\x0evariant_counts\x18\x04 \x03(\x0b\x32-.akasha.GetMetricsResponse.VariantCountsEntry\x1a\x34\n\x12VariantCountsEntry\x12\x0b\n\x03key\x18\x01 \x01(\t\x12\r\n\x05value\x18\x02 \x01(\x03:\x02\x38\x01\"U\n\x17\x45valuateBoolFlagRequest\x12\n\n\x02id\x18\x01 \x01(\t\x12\x0c\n\x04name\x18\x02 \x01(\t\x12 \n\x07\x63ontext\x18\x03 \x01(\x0b\x32\x0f.akasha.Context\")\n\x18\x45valuateBoolFlagResponse\x12\r\n\x05value\x18\x01 \x01(\x08\"W\n\x19\x45valuateStringFlagRequest\x12\n\n\x02id\x18\x01 \x01(\t\x12\x0c\n\x04name\x18\x02 \x01(\t\x12 \n\x07\x63ontext\x18\x03 \x01(\x0b\x32\x0f.akasha.Context\"+\n\x1a\x45valuateStringFlagResponse\x12\r\n\x05value\x18\x01 \x01(\t*g\n\x08Operator\x12\n\n\x06\x45QUALS\x10\x00\x12\x0e\n\nNOT_EQUALS\x10\x01\x12\x0c\n\x08\x43ONTAINS\x10\x02\x12\x10\n\x0cNOT_CONTAINS\x10\x03\x12\x10\n\x0cGREATER_THAN\x10\x04\x12\r\n\tLESS_THAN\x10\x05\x32\xda\x05\n\x0b\x46lagService\x12O\n\x0e\x43reateBoolFlag\x12\x1d.akasha.CreateBoolFlagRequest\x1a\x1e.akasha.CreateBoolFlagResponse\x12\x46\n\x0bGetBoolFlag\x12\x1a.akasha.GetBoolFlagRequest\x1a\x1b.akasha.GetBoolFlagResponse\x12O\n\x0eUpdateBoolFlag\x12\x1d.akasha.UpdateBoolFlagRequest\x1a\x1e.akasha.UpdateBoolFlagResponse\x12U\n\x10\x43reateStringFlag\x12\x1f.akasha.CreateStringFlagRequest\x1a .akasha.CreateStringFlagResponse\x12L\n\rGetStringFlag\x12\x1c.akasha.GetStringFlagRequest\x1a\x1d.akasha.GetStringFlagResponse\x12U\n\x10UpdateStringFlag\x12\x1f.akasha.UpdateStringFlagRequest\x1a .akasha.UpdateStringFlagResponse\x12\x43\n\nDeleteFlag\x12\x19.akasha.DeleteFlagRequest\x1a\x1a.akasha.DeleteFlagResponse\x12L\n\rListBoolFlags\x12\x1c.akasha.ListBoolFlagsRequest\x1a\x1d.akasha.ListBoolFlagsResponse\x12R\n\x0fListStringFlags\x12\x1e.akasha.ListStringFlagsRequest\x1a\x1f.akasha.ListStringFlagsResponse2U\n\x0eMetricsService\x12\x43\n\nGetMetrics\x12\x19.akasha.GetMetricsRequest\x1a\x1a.akasha.GetMetricsResponse2\xc7\x01\n\x11\x45valuationService\x12U\n\x10\x45valuateBoolFlag\x12\x1f.akasha.EvaluateBoolFlagRequest\x1a .akasha.EvaluateBoolFlagResponse\x12[\n\x12\x45valuateStringFlag\x12!.akasha.EvaluateStringFlagRequest\x1a\".akasha.EvaluateStringFlagResponseb\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'akasha_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
  DESCRIPTOR._loaded_options = None
  _globals['_CONTEXT_ATTRIBUTESENTRY']._loaded_options = None
  _globals['_CONTEXT_ATTRIBUTESENTRY']._serialized_options = b'8\001'
  _globals['_GETMETRICSRESPONSE_VARIANTCOUNTSENTRY']._loaded_options = None
  _globals['_GETMETRICSRESPONSE_VARIANTCOUNTSENTRY']._serialized_options = b'8\001'
  _globals['_OPERATOR']._serialized_start=2186
  _globals['_OPERATOR']._serialized_end=2289
  _globals['_CONDITION']._serialized_start=24
  _globals['_CONDITION']._serialized_end=105
  _globals['_BOOLTARGETINGRULE']._serialized_start=107
  _globals['_BOOLTARGETINGRULE']._serialized_end=182
  _globals['_STRINGTARGETINGRULE']._serialized_start=184
  _globals['_STRINGTARGETINGRULE']._serialized_end=261
  _globals['_CONTEXT']._serialized_start=263
  _globals['_CONTEXT']._serialized_end=376
  _globals['_CONTEXT_ATTRIBUTESENTRY']._serialized_start=327
  _globals['_CONTEXT_ATTRIBUTESENTRY']._serialized_end=376
  _globals['_BOOLFLAG']._serialized_start=379
  _globals['_BOOLFLAG']._serialized_end=507
  _globals['_STRINGFLAG']._serialized_start=510
  _globals['_STRINGFLAG']._serialized_end=660
  _globals['_CREATEBOOLFLAGREQUEST']._serialized_start=662
  _globals['_CREATEBOOLFLAGREQUEST']._serialized_end=717
  _globals['_CREATEBOOLFLAGRESPONSE']._serialized_start=719
  _globals['_CREATEBOOLFLAGRESPONSE']._serialized_end=775
  _globals['_GETBOOLFLAGREQUEST']._serialized_start=777
  _globals['_GETBOOLFLAGREQUEST']._serialized_end=809
  _globals['_GETBOOLFLAGRESPONSE']._serialized_start=811
  _globals['_GETBOOLFLAGRESPONSE']._serialized_end=864
  _globals['_UPDATEBOOLFLAGREQUEST']._serialized_start=866
  _globals['_UPDATEBOOLFLAGREQUEST']._serialized_end=921
  _globals['_UPDATEBOOLFLAGRESPONSE']._serialized_start=923
  _globals['_UPDATEBOOLFLAGRESPONSE']._serialized_end=979
  _globals['_CREATESTRINGFLAGREQUEST']._serialized_start=981
  _globals['_CREATESTRINGFLAGREQUEST']._serialized_end=1040
  _globals['_CREATESTRINGFLAGRESPONSE']._serialized_start=1042
  _globals['_CREATESTRINGFLAGRESPONSE']._serialized_end=1102
  _globals['_GETSTRINGFLAGREQUEST']._serialized_start=1104
  _globals['_GETSTRINGFLAGREQUEST']._serialized_end=1138
  _globals['_GETSTRINGFLAGRESPONSE']._serialized_start=1140
  _globals['_GETSTRINGFLAGRESPONSE']._serialized_end=1197
  _globals['_UPDATESTRINGFLAGREQUEST']._serialized_start=1199
  _globals['_UPDATESTRINGFLAGREQUEST']._serialized_end=1258
  _globals['_UPDATESTRINGFLAGRESPONSE']._serialized_start=1260
  _globals['_UPDATESTRINGFLAGRESPONSE']._serialized_end=1320
  _globals['_DELETEFLAGREQUEST']._serialized_start=1322
  _globals['_DELETEFLAGREQUEST']._serialized_end=1353
  _globals['_DELETEFLAGRESPONSE']._serialized_start=1355
  _globals['_DELETEFLAGRESPONSE']._serialized_end=1392
  _globals['_LISTBOOLFLAGSREQUEST']._serialized_start=1394
  _globals['_LISTBOOLFLAGSREQUEST']._serialized_end=1449
  _globals['_LISTBOOLFLAGSRESPONSE']._serialized_start=1451
  _globals['_LISTBOOLFLAGSRESPONSE']._serialized_end=1528
  _globals['_LISTSTRINGFLAGSREQUEST']._serialized_start=1530
  _globals['_LISTSTRINGFLAGSREQUEST']._serialized_end=1587
  _globals['_LISTSTRINGFLAGSRESPONSE']._serialized_start=1589
  _globals['_LISTSTRINGFLAGSRESPONSE']._serialized_end=1670
  _globals['_GETMETRICSREQUEST']._serialized_start=1672
  _globals['_GETMETRICSREQUEST']._serialized_end=1708
  _globals['_GETMETRICSRESPONSE']._serialized_start=1711
  _globals['_GETMETRICSRESPONSE']._serialized_end=1920
  _globals['_GETMETRICSRESPONSE_VARIANTCOUNTSENTRY']._serialized_start=1868
  _globals['_GETMETRICSRESPONSE_VARIANTCOUNTSENTRY']._serialized_end=1920
  _globals['_EVALUATEBOOLFLAGREQUEST']._serialized_start=1922
  _globals['_EVALUATEBOOLFLAGREQUEST']._serialized_end=2007
  _globals['_EVALUATEBOOLFLAGRESPONSE']._serialized_start=2009
  _globals['_EVALUATEBOOLFLAGRESPONSE']._serialized_end=2050
  _globals['_EVALUATESTRINGFLAGREQUEST']._serialized_start=2052
  _globals['_EVALUATESTRINGFLAGREQUEST']._serialized_end=2139
  _globals['_EVALUATESTRINGFLAGRESPONSE']._serialized_start=2141
  _globals['_EVALUATESTRINGFLAGRESPONSE']._serialized_end=2184
  _globals['_FLAGSERVICE']._serialized_start=2292
  _globals['_FLAGSERVICE']._serialized_end=3022
  _globals['_METRICSSERVICE']._serialized_start=3024
  _globals['_METRICSSERVICE']._serialized_end=3109
  _globals['_EVALUATIONSERVICE']._serialized_start=3112
  _globals['_EVALUATIONSERVICE']._serialized_end=3311
# @@protoc_insertion_point(module_scope)
