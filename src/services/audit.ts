import { isSupabaseConfigured, supabase } from './supabase';

type AuditSource = 'frontend' | 'backend';
type AuditLayer = 'ui' | 'auth' | 'service' | 'database' | 'edge_function';
type AuditStatus = 'success' | 'failure' | 'attempted' | 'info';

type AuditMetadataValue =
  | string
  | number
  | boolean
  | null
  | AuditMetadata
  | AuditMetadataValue[];

export interface AuditMetadata {
  [key: string]: AuditMetadataValue;
}

interface StoredAuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuditEventInput {
  source?: AuditSource;
  layer?: AuditLayer;
  action: string;
  entityType?: string;
  entityId?: string;
  status?: AuditStatus;
  summary?: string;
  metadata?: AuditMetadata;
}

export interface AuditLogRecord {
  id: string;
  source: AuditSource;
  layer: AuditLayer;
  action: string;
  entityType: string | null;
  entityId: string | null;
  actorUserId: string | null;
  actorEmail: string | null;
  actorName: string | null;
  requestPath: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  status: AuditStatus;
  summary: string | null;
  metadata: AuditMetadata | null;
  beforeData: AuditMetadata | null;
  afterData: AuditMetadata | null;
  createdAt: string;
}

interface AuditedMutationOptions<T> extends AuditEventInput {
  getEntityId?: (result: T) => string | undefined;
  getSummary?: (result: T) => string | undefined;
  getMetadata?: (result: T) => AuditMetadata | undefined;
}

const AUTH_STORAGE_KEY = 'ideals_auth_user';
const MOCK_SESSION_KEY = 'ideals_mock_session';

function isBrowser() {
  return typeof window !== 'undefined';
}

function isUuid(value?: string | null) {
  return !!value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function readStoredAuthUser(): StoredAuthUser | null {
  if (!isBrowser()) return null;

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) as StoredAuthUser : null;
  } catch {
    return null;
  }
}

function hasMockSession() {
  if (!isBrowser()) return false;
  return window.localStorage.getItem(MOCK_SESSION_KEY) === '1';
}

function getBrowserMetadata(): AuditMetadata {
  if (!isBrowser()) return {};

  return {
    href: window.location.href,
    path: `${window.location.pathname}${window.location.search}`,
    userAgent: navigator.userAgent,
  };
}

export async function logAuditEvent(input: AuditEventInput): Promise<void> {
  if (!isSupabaseConfigured || hasMockSession()) return;

  const authUser = readStoredAuthUser();
  const browserMetadata = getBrowserMetadata();
  const payload = {
    source: input.source ?? 'frontend',
    layer: input.layer ?? 'ui',
    action: input.action,
    entity_type: input.entityType ?? null,
    entity_id: input.entityId ?? null,
    actor_user_id: isUuid(authUser?.id) ? authUser?.id : null,
    actor_email: authUser?.email ?? null,
    actor_name: authUser?.name ?? null,
    request_path: typeof browserMetadata.path === 'string' ? browserMetadata.path : null,
    user_agent: typeof browserMetadata.userAgent === 'string' ? browserMetadata.userAgent : null,
    status: input.status ?? 'success',
    summary: input.summary ?? null,
    metadata: {
      ...browserMetadata,
      ...(input.metadata ?? {}),
    },
  };

  const { error } = await supabase.from('audit_logs').insert(payload);

  if (error && import.meta.env.DEV) {
    console.warn('Failed to write audit log', error.message);
  }
}

export async function getAuditLogs(limit = 200): Promise<AuditLogRecord[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('audit_logs')
    .select('id, source, layer, action, entity_type, entity_id, actor_user_id, actor_email, actor_name, request_path, ip_address, user_agent, status, summary, metadata, before_data, after_data, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    source: row.source,
    layer: row.layer,
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    actorUserId: row.actor_user_id,
    actorEmail: row.actor_email,
    actorName: row.actor_name,
    requestPath: row.request_path,
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
    status: row.status,
    summary: row.summary,
    metadata: row.metadata,
    beforeData: row.before_data,
    afterData: row.after_data,
    createdAt: row.created_at,
  }));
}

export async function runAuditedMutation<T>(
  options: AuditedMutationOptions<T>,
  mutation: () => Promise<T>,
): Promise<T> {
  try {
    const result = await mutation();
    void logAuditEvent({
      ...options,
      status: options.status ?? 'success',
      entityId: options.entityId ?? options.getEntityId?.(result),
      summary: options.getSummary?.(result) ?? options.summary,
      metadata: {
        ...(options.metadata ?? {}),
        ...(options.getMetadata?.(result) ?? {}),
      },
    });
    return result;
  } catch (error) {
    void logAuditEvent({
      ...options,
      status: 'failure',
      summary: options.summary ?? `Failed to ${options.action}`,
      metadata: {
        ...(options.metadata ?? {}),
        error: error instanceof Error ? error.message : String(error),
      },
    });
    throw error;
  }
}
