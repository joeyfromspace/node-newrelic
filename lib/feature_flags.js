'use strict'

// unreleased flags gating an active feature
exports.prerelease = {
  custom_instrumentation: true,
  custom_metrics: true,
  express5: false,
  await_support: true,
  synthetics: true,
  native_metrics: true,
  serverless_mode: false,
  promise_segments: false,
  reverse_naming_rules: false
}

// flags that are no longer used for released features
exports.released = [
  'released',
  'cat',
  'express4',
  'express_segments',
  'insights',
  'postgres',
  'mysql_pool',
  'protocol_17',
  'proxy',
  'custom_events',
  'send_request_uri_attribute'
]

// flags that are no longer used for unreleased features
exports.unreleased = [
  'unreleased'
]
