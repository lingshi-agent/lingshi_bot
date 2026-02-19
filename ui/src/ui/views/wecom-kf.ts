import { html } from "lit";
import type { WecomKfStatus } from "../controllers/wecom-kf.ts";
import { tr } from "../i18n.ts";

const DEFAULT_SERVER_BASE_URL = "http://8.148.182.238:8080";

export type WecomKfProps = {
  connected: boolean;
  loading: boolean;
  busy: boolean;
  error: string | null;
  status: WecomKfStatus | null;
  configForm: Record<string, unknown> | null;
  configDirty: boolean;
  onConfigPatch: (path: Array<string | number>, value: unknown) => void;
  onConfigSave: () => Promise<void>;
  onRefresh: () => Promise<void>;
  onUnbind: () => Promise<void>;
  deviceIdLocked: boolean;
};

function getConfigSection(form: Record<string, unknown> | null): Record<string, unknown> {
  if (!form) return {};
  const plugins = form.plugins as Record<string, unknown> | undefined;
  const entries = plugins?.entries as Record<string, unknown> | undefined;
  const wecomEntry = entries?.["wecom-kf"] as Record<string, unknown> | undefined;
  const config = wecomEntry?.config as Record<string, unknown> | undefined;
  return config ?? {};
}

function getString(cfg: Record<string, unknown>, key: string): string {
  const val = cfg[key];
  return typeof val === "string" ? val : "";
}

function formatDuration(seconds: number | null | undefined): string {
  if (typeof seconds !== "number" || !Number.isFinite(seconds) || seconds < 0) {
    return "-";
  }
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function formatTs(msOrSec: number | null | undefined): string {
  if (typeof msOrSec !== "number" || !Number.isFinite(msOrSec) || msOrSec <= 0) {
    return "-";
  }
  const ms = msOrSec > 10_000_000_000 ? msOrSec : msOrSec * 1000;
  return new Date(ms).toLocaleString();
}

export function renderWecomKf(props: WecomKfProps) {
  const cfg = getConfigSection(props.configForm);
  const serverBaseUrl = getString(cfg, "serverBaseUrl") || DEFAULT_SERVER_BASE_URL;
  const deviceId = getString(cfg, "deviceId");

  const status = props.status;
  const device = status?.device ?? null;
  const deviceIdLocked = props.deviceIdLocked;

  const wsConnected = device?.wsConnected === true;
  const wsConnecting = device?.wsConnecting === true;
  const routeOnline = device?.online === true;
  const isConnected = device?.isBound === true && wsConnected;
  const connectionLabel = wsConnected
    ? tr("wecom.connection.connected")
    : wsConnecting
      ? tr("wecom.connection.connecting")
      : tr("wecom.connection.disconnected");
  const connectionDetail = routeOnline
    ? tr("wecom.connection.serverOnline")
    : tr("wecom.connection.serverOffline");
  const qrImageUrl = device?.qrImageUrl ?? null;

  return html`
    <section class="page">
      <div class="page-title">
        <div>
          <h1>${tr("wecom.title")}</h1>
          <p class="muted">
            ${tr("wecom.subtitle")}
          </p>
        </div>
        <div class="row" style="gap: 8px; flex-wrap: wrap;">
          <button class="btn" ?disabled=${props.loading} @click=${() => props.onRefresh()}>
            ${tr("common.refresh")}
          </button>
          <button class="btn" ?disabled=${props.loading} @click=${() => props.onConfigSave()}>
            ${props.configDirty ? tr("common.saveConfig") : tr("common.configSaved")}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 wecom-status-grid" style="margin-top: 16px;">
        <section class="card wecom-status-card">
          <h2>${tr("wecom.status.wechatKf")}</h2>
          <div style="margin-top: 10px;">
            <div>${tr("wecom.deviceId")}: <span class="mono">${device?.deviceId || "-"}</span></div>
            <div style="margin-top: 6px;">
              ${tr("wecom.bindState")}: ${device?.isBound ? tr("wecom.bound") : tr("wecom.unbound")}
            </div>
            <div style="margin-top: 6px;">
              ${tr("wecom.connection")}: ${connectionLabel}
              <span class="muted">(${connectionDetail})</span>
            </div>
          </div>

          ${
            isConnected
              ? html`
                  <div class="callout" style="margin-top: 12px;">${tr("wecom.status.connected")}</div>
                  <div style="margin-top: 10px;">
                    <div>${tr("wecom.boundUser")}: ${device?.binding?.externalUserid || "-"}</div>
                    <div style="margin-top: 6px;">
                      ${tr("wecom.lastSeen")}: ${formatTs(device?.lastSeenAt)}
                    </div>
                    <div style="margin-top: 6px;">
                      ${tr("wecom.wsLastConnected")}: ${formatTs(device?.wsLastConnectedAt)}
                    </div>
                  </div>
                `
              : html`
                  <div class="callout warn" style="margin-top: 12px;">
                    ${tr("wecom.status.disconnected")}
                  </div>
                  <div style="margin-top: 10px;">
                    <div>
                      ${tr("wecom.shortCode")}: <span class="mono">${device?.shortCode || "-"}</span>
                    </div>
                    <div style="margin-top: 6px;">
                      ${tr("wecom.codeCountdown")}: ${formatDuration(device?.expiresInSeconds)}
                    </div>
                  </div>
                  <div style="margin-top: 12px;">
                    <div class="muted" style="margin-bottom: 8px;">${tr("wecom.qr.title")}</div>
                    ${
                      qrImageUrl
                        ? html`<div class="wecom-qr-wrap">
                            <img
                              class="wecom-qr-image"
                              src=${qrImageUrl}
                              alt=${tr("wecom.qr.title")}
                              @error=${(ev: Event) => {
                                const img = ev.currentTarget as HTMLImageElement;
                                img.style.display = "none";
                                const fallback = img.nextElementSibling as HTMLElement | null;
                                if (fallback) fallback.style.display = "block";
                              }}
                            />
                            <div class="muted" style="display: none;">${tr("wecom.qr.loadFailed")}</div>
                          </div>`
                        : html`<div class="wecom-placeholder">${tr("wecom.qr.unconfigured")}</div>`
                    }
                  </div>
                `
          }

          <div class="row" style="gap: 8px; flex-wrap: wrap; margin-top: 12px;">
            <button class="btn" ?disabled=${props.busy || !device?.isBound} @click=${() => props.onUnbind()}>
              ${tr("wecom.unbind")}
            </button>
            <button class="btn" ?disabled=${props.loading} @click=${() => props.onRefresh()}>
              ${tr("wecom.refreshState")}
            </button>
          </div>
          ${
            device?.lastError
              ? html`<div class="callout warn" style="margin-top: 10px;">${device.lastError}</div>`
              : ""
          }
          ${
            props.error
              ? html`<div class="callout danger" style="margin-top: 10px;">${props.error}</div>`
              : ""
          }
          ${
            status?.lastError
              ? html`<div class="callout warn" style="margin-top: 10px;">${status.lastError}</div>`
              : ""
          }
        </section>

        <section class="card wecom-status-card">
          <h2>${tr("wecom.status.miniProgram")}</h2>
          <div class="wecom-placeholder" style="margin-top: 12px;">${tr("wecom.status.placeholder")}</div>
        </section>
      </div>

      <section class="card" style="margin-top: 16px;">
        <h2>${tr("wecom.gatewayMapping")}</h2>
        <div class="row" style="gap: 16px; flex-wrap: wrap;">
          <label class="field" style="min-width: 260px; flex: 1;">
            <span>LINGSHI_SERVER_BASE_URL</span>
            <input
              class="input"
              .value=${serverBaseUrl}
              placeholder="http://8.148.182.238:8080"
              @input=${(ev: Event) =>
                props.onConfigPatch(
                  ["plugins", "entries", "wecom-kf", "config", "serverBaseUrl"],
                  (ev.target as HTMLInputElement).value,
                )}
            />
          </label>
          <label class="field" style="min-width: 260px; flex: 1;">
            <span>LINGSHI_DEVICE_ID</span>
            <input
              class="input"
              .value=${deviceId}
              placeholder=${tr("wecom.deviceIdPlaceholder")}
              ?disabled=${deviceIdLocked}
              @input=${(ev: Event) =>
                props.onConfigPatch(
                  ["plugins", "entries", "wecom-kf", "config", "deviceId"],
                  (ev.target as HTMLInputElement).value,
                )}
            />
          </label>
        </div>
        ${
          deviceIdLocked
            ? html`<div class="callout warn" style="margin-top: 10px;">
                ${tr("wecom.deviceIdLocked")}
              </div>`
            : ""
        }
      </section>
    </section>
  `;
}
