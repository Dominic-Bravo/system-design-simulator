import type { GraphNode, NodeType } from './types'

export type ConfigField = {
  key: string
  label: string
  type: 'number' | 'text' | 'boolean'
  suffix?: string
}

export type NodeDefinition = {
  type: NodeType
  label: string
  shortLabel: string
  category: string
  hint: string
  defaultName: string
  defaults: GraphNode['config']
  fields: ConfigField[]
}

const commonFields: ConfigField[] = [
  { key: 'latencyMs', label: 'Latency', type: 'number', suffix: 'ms' },
  { key: 'capacityRps', label: 'Capacity', type: 'number', suffix: 'RPS' },
  { key: 'replicas', label: 'Replicas', type: 'number' },
]

export const nodeCatalog: NodeDefinition[] = [
  {
    type: 'client',
    label: 'Client App',
    shortLabel: 'USER',
    category: 'Entry & Delivery',
    hint: 'mobile or browser users',
    defaultName: 'Client App',
    defaults: { latencyMs: 20, capacityRps: 1000, region: 'global' },
    fields: [
      { key: 'latencyMs', label: 'Network latency', type: 'number', suffix: 'ms' },
      { key: 'capacityRps', label: 'User traffic', type: 'number', suffix: 'RPS' },
      { key: 'region', label: 'Region', type: 'text' },
    ],
  },
  {
    type: 'dns',
    label: 'DNS',
    shortLabel: 'DNS',
    category: 'Entry & Delivery',
    hint: 'domain routing',
    defaultName: 'DNS',
    defaults: { latencyMs: 8, ttlSeconds: 300, capacityRps: 10000 },
    fields: [
      { key: 'latencyMs', label: 'Lookup latency', type: 'number', suffix: 'ms' },
      { key: 'ttlSeconds', label: 'TTL', type: 'number', suffix: 'sec' },
      { key: 'capacityRps', label: 'Capacity', type: 'number', suffix: 'RPS' },
    ],
  },
  {
    type: 'cdn',
    label: 'CDN',
    shortLabel: 'CDN',
    category: 'Entry & Delivery',
    hint: 'edge cache',
    defaultName: 'CDN',
    defaults: { latencyMs: 12, hitRate: 85, capacityRps: 20000 },
    fields: [
      { key: 'latencyMs', label: 'Edge latency', type: 'number', suffix: 'ms' },
      { key: 'hitRate', label: 'Cache hit rate', type: 'number', suffix: '%' },
      { key: 'capacityRps', label: 'Capacity', type: 'number', suffix: 'RPS' },
    ],
  },
  {
    type: 'load_balancer',
    label: 'Load Balancer',
    shortLabel: 'LB',
    category: 'Networking',
    hint: 'routes traffic',
    defaultName: 'Load Balancer',
    defaults: { latencyMs: 1, capacityRps: 12000, replicas: 2, algorithm: 'round-robin' },
    fields: [...commonFields, { key: 'algorithm', label: 'Algorithm', type: 'text' }],
  },
  {
    type: 'api_gateway',
    label: 'API Gateway',
    shortLabel: 'GW',
    category: 'Networking',
    hint: 'rate limits APIs',
    defaultName: 'API Gateway',
    defaults: { latencyMs: 4, capacityRps: 6000, rateLimitRps: 1200, authEnabled: true },
    fields: [
      { key: 'latencyMs', label: 'Latency', type: 'number', suffix: 'ms' },
      { key: 'capacityRps', label: 'Capacity', type: 'number', suffix: 'RPS' },
      { key: 'rateLimitRps', label: 'Rate limit', type: 'number', suffix: 'RPS' },
      { key: 'authEnabled', label: 'Auth enabled', type: 'boolean' },
    ],
  },
  {
    type: 'api',
    label: 'API Service',
    shortLabel: 'API',
    category: 'Compute',
    hint: 'handles requests',
    defaultName: 'API Service',
    defaults: { latencyMs: 5, capacityRps: 900, replicas: 3, cpuCores: 2 },
    fields: [...commonFields, { key: 'cpuCores', label: 'CPU cores', type: 'number' }],
  },
  {
    type: 'web_app',
    label: 'Web App',
    shortLabel: 'WEB',
    category: 'Compute',
    hint: 'frontend server',
    defaultName: 'Web App',
    defaults: { latencyMs: 10, capacityRps: 1500, replicas: 2, ssrEnabled: true },
    fields: [...commonFields, { key: 'ssrEnabled', label: 'SSR enabled', type: 'boolean' }],
  },
  {
    type: 'auth_service',
    label: 'Auth Service',
    shortLabel: 'AUTH',
    category: 'Compute',
    hint: 'sessions and tokens',
    defaultName: 'Auth Service',
    defaults: { latencyMs: 15, capacityRps: 700, replicas: 2, tokenTtlMinutes: 60 },
    fields: [...commonFields, { key: 'tokenTtlMinutes', label: 'Token TTL', type: 'number', suffix: 'min' }],
  },
  {
    type: 'worker',
    label: 'Background Worker',
    shortLabel: 'WORK',
    category: 'Compute',
    hint: 'async processing',
    defaultName: 'Background Worker',
    defaults: { latencyMs: 40, capacityRps: 250, replicas: 4, concurrency: 10 },
    fields: [...commonFields, { key: 'concurrency', label: 'Concurrency', type: 'number' }],
  },
  {
    type: 'database',
    label: 'Primary Database',
    shortLabel: 'DB',
    category: 'Data',
    hint: 'source of truth',
    defaultName: 'Primary Database',
    defaults: { latencyMs: 25, capacityRps: 600, replicas: 1, storageGb: 250 },
    fields: [...commonFields, { key: 'storageGb', label: 'Storage', type: 'number', suffix: 'GB' }],
  },
  {
    type: 'read_replica',
    label: 'Read Replica',
    shortLabel: 'READ',
    category: 'Data',
    hint: 'read scaling',
    defaultName: 'Read Replica',
    defaults: { latencyMs: 18, capacityRps: 1200, replicas: 2, lagMs: 120 },
    fields: [...commonFields, { key: 'lagMs', label: 'Replication lag', type: 'number', suffix: 'ms' }],
  },
  {
    type: 'cache',
    label: 'Redis Cache',
    shortLabel: 'REDIS',
    category: 'Data',
    hint: 'fast reads',
    defaultName: 'Redis Cache',
    defaults: { latencyMs: 2, capacityRps: 9000, hitRate: 80, memoryGb: 16 },
    fields: [
      { key: 'latencyMs', label: 'Latency', type: 'number', suffix: 'ms' },
      { key: 'capacityRps', label: 'Capacity', type: 'number', suffix: 'RPS' },
      { key: 'hitRate', label: 'Hit rate', type: 'number', suffix: '%' },
      { key: 'memoryGb', label: 'Memory', type: 'number', suffix: 'GB' },
    ],
  },
  {
    type: 'search',
    label: 'Search Index',
    shortLabel: 'SRCH',
    category: 'Data',
    hint: 'full-text search',
    defaultName: 'Search Index',
    defaults: { latencyMs: 30, capacityRps: 800, shards: 3, replicas: 2 },
    fields: [...commonFields, { key: 'shards', label: 'Shards', type: 'number' }],
  },
  {
    type: 'object_storage',
    label: 'Object Storage',
    shortLabel: 'S3',
    category: 'Data',
    hint: 'files and media',
    defaultName: 'Object Storage',
    defaults: { latencyMs: 45, capacityRps: 2500, storageGb: 1000, versioning: true },
    fields: [
      { key: 'latencyMs', label: 'Latency', type: 'number', suffix: 'ms' },
      { key: 'capacityRps', label: 'Capacity', type: 'number', suffix: 'RPS' },
      { key: 'storageGb', label: 'Storage', type: 'number', suffix: 'GB' },
      { key: 'versioning', label: 'Versioning', type: 'boolean' },
    ],
  },
  {
    type: 'queue',
    label: 'Message Queue',
    shortLabel: 'MQ',
    category: 'Async & Events',
    hint: 'buffers work',
    defaultName: 'Message Queue',
    defaults: { latencyMs: 10, capacityRps: 5000, retentionHours: 24, maxDepth: 100000 },
    fields: [
      { key: 'latencyMs', label: 'Latency', type: 'number', suffix: 'ms' },
      { key: 'capacityRps', label: 'Throughput', type: 'number', suffix: 'msg/s' },
      { key: 'retentionHours', label: 'Retention', type: 'number', suffix: 'hr' },
      { key: 'maxDepth', label: 'Max depth', type: 'number' },
    ],
  },
  {
    type: 'stream',
    label: 'Event Stream',
    shortLabel: 'KAFKA',
    category: 'Async & Events',
    hint: 'event log',
    defaultName: 'Event Stream',
    defaults: { latencyMs: 12, capacityRps: 15000, partitions: 12, retentionHours: 168 },
    fields: [
      { key: 'latencyMs', label: 'Latency', type: 'number', suffix: 'ms' },
      { key: 'capacityRps', label: 'Throughput', type: 'number', suffix: 'events/s' },
      { key: 'partitions', label: 'Partitions', type: 'number' },
      { key: 'retentionHours', label: 'Retention', type: 'number', suffix: 'hr' },
    ],
  },
  {
    type: 'notification',
    label: 'Notification Service',
    shortLabel: 'NOTIF',
    category: 'External & Ops',
    hint: 'email and push',
    defaultName: 'Notification Service',
    defaults: { latencyMs: 80, capacityRps: 300, provider: 'SendGrid', retries: 3 },
    fields: [
      { key: 'latencyMs', label: 'Latency', type: 'number', suffix: 'ms' },
      { key: 'capacityRps', label: 'Capacity', type: 'number', suffix: 'RPS' },
      { key: 'provider', label: 'Provider', type: 'text' },
      { key: 'retries', label: 'Retries', type: 'number' },
    ],
  },
  {
    type: 'payment',
    label: 'Payment Provider',
    shortLabel: 'PAY',
    category: 'External & Ops',
    hint: 'checkout calls',
    defaultName: 'Payment Provider',
    defaults: { latencyMs: 220, capacityRps: 120, provider: 'Stripe', timeoutMs: 3000 },
    fields: [
      { key: 'latencyMs', label: 'Latency', type: 'number', suffix: 'ms' },
      { key: 'capacityRps', label: 'Capacity', type: 'number', suffix: 'RPS' },
      { key: 'provider', label: 'Provider', type: 'text' },
      { key: 'timeoutMs', label: 'Timeout', type: 'number', suffix: 'ms' },
    ],
  },
  {
    type: 'third_party_api',
    label: 'External API',
    shortLabel: 'EXT',
    category: 'External & Ops',
    hint: 'vendor dependency',
    defaultName: 'External API',
    defaults: { latencyMs: 160, capacityRps: 200, provider: 'Vendor API', timeoutMs: 2000 },
    fields: [
      { key: 'latencyMs', label: 'Latency', type: 'number', suffix: 'ms' },
      { key: 'capacityRps', label: 'Rate limit', type: 'number', suffix: 'RPS' },
      { key: 'provider', label: 'Provider', type: 'text' },
      { key: 'timeoutMs', label: 'Timeout', type: 'number', suffix: 'ms' },
    ],
  },
  {
    type: 'monitoring',
    label: 'Monitoring',
    shortLabel: 'OBS',
    category: 'External & Ops',
    hint: 'logs and metrics',
    defaultName: 'Monitoring',
    defaults: { latencyMs: 5, capacityRps: 10000, sampleRate: 10, alerting: true },
    fields: [
      { key: 'latencyMs', label: 'Ingest latency', type: 'number', suffix: 'ms' },
      { key: 'capacityRps', label: 'Ingest rate', type: 'number', suffix: 'events/s' },
      { key: 'sampleRate', label: 'Sample rate', type: 'number', suffix: '%' },
      { key: 'alerting', label: 'Alerting', type: 'boolean' },
    ],
  },
]

export const nodeDefinitionByType = Object.fromEntries(nodeCatalog.map((node) => [node.type, node])) as Record<NodeType, NodeDefinition>

export const nodeCategories = [...new Set(nodeCatalog.map((node) => node.category))]
