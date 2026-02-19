export type WecomKfConfig = {
  enabled: boolean;
  serverBaseUrl: string;
  deviceId: string;
  localAgentId: string;
  localAgentTimeoutSeconds: number;
  skipHistory: boolean;
  sessionMapPath: string;
};

const DEFAULTS: WecomKfConfig = {
  enabled: true,
  serverBaseUrl: "http://8.148.182.238:8080",
  deviceId: "",
  localAgentId: "main",
  localAgentTimeoutSeconds: 180,
  skipHistory: false,
  sessionMapPath: "",
};

function toString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function toNumber(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function resolveWecomKfConfig(value: unknown): WecomKfConfig {
  const raw =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  return {
    enabled: toBoolean(raw.enabled, DEFAULTS.enabled),
    serverBaseUrl: toString(raw.serverBaseUrl) || DEFAULTS.serverBaseUrl,
    deviceId: toString(raw.deviceId),
    localAgentId: toString(raw.localAgentId) || DEFAULTS.localAgentId,
    localAgentTimeoutSeconds: toNumber(
      raw.localAgentTimeoutSeconds,
      DEFAULTS.localAgentTimeoutSeconds,
    ),
    skipHistory: toBoolean(raw.skipHistory, DEFAULTS.skipHistory),
    sessionMapPath: toString(raw.sessionMapPath),
  };
}
