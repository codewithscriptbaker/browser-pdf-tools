export type AnalyticsEventName =
  | "page_view"
  | "heartbeat"
  | "file_selected"
  | "tool_completed"
  | "tool_failed"
  | "signup"
  | "login";

export interface TrackPayload {
  event: AnalyticsEventName;
  tool?: string;
  anonymousId: string;
  userId?: string;
  meta?: Record<string, unknown>;
}
