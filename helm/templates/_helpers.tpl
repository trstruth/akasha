{{/* Generate the name of the application */}}
{{- define "akasha-chart.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/* Generate a fullname using the chart name and the component name */}}
{{- define "akasha-chart.fullname" -}}
{{- printf "%s-%s" (include "akasha-chart.name" .) .Values.component | trunc 63 | trimSuffix "-" -}}
{{- end -}}
