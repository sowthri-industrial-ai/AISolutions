// lib/observability.ts
// Langfuse wrapper. Powers the in-UI observability panel (TECH-STACK.md §3, §8).

type TraceId = string;

export const logTrace = {
  async start(_payload: { project: string; input: unknown }): Promise<TraceId> {
    // TODO: open a Langfuse trace and return its id.
    return "";
  },
  async step(_traceId: TraceId, _step: unknown): Promise<void> {
    // TODO: append a span/event for the streamed demo step.
  },
  async complete(_traceId: TraceId): Promise<void> {
    // TODO: close the trace with success.
  },
  async fail(_traceId: TraceId, _err: unknown): Promise<void> {
    // TODO: close the trace with an error status.
  },
};
