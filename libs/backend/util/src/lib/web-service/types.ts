export interface RequestPayload {
  params: Record<string, string>;
  search: Record<string, string>;
  body: Record<string, unknown>;
}