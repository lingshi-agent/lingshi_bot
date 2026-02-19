import type { GatewayBrowserClient } from "../gateway.ts";

export type WecomKfStatus = {
  lastError: string | null;
  device: {
    enabled: boolean;
    baseUrl: string | null;
    deviceId: string;
    connectToken?: string | null;
    isBound: boolean;
    shortCode: string | null;
    qrImageUrl?: string | null;
    expiresAt: number | null;
    expiresInSeconds: number | null;
    binding: {
      externalUserid: string | null;
      openKfid: string | null;
      boundAt: number | null;
    } | null;
    polling: boolean;
    wsConnected?: boolean;
    wsConnecting?: boolean;
    wsLastConnectedAt?: number | null;
    wsLastMessageAt?: number | null;
    wsLastError?: string | null;
    online?: boolean;
    lastSeenAt?: number | null;
    lastSyncAt: number | null;
    lastError: string | null;
  };
};

type WecomKfHost = {
  client: GatewayBrowserClient | null;
  wecomKfLoading: boolean;
  wecomKfBusy: boolean;
  wecomKfStatus: WecomKfStatus | null;
  wecomKfError: string | null;
};

export async function loadWecomKfStatus(host: WecomKfHost, options: { quiet?: boolean } = {}) {
  if (!host.client) {
    host.wecomKfError = "gateway not connected";
    return;
  }
  if (!options.quiet) {
    host.wecomKfLoading = true;
  }
  host.wecomKfError = null;
  try {
    const status = (await host.client.request("wecom_kf.status")) as WecomKfStatus;
    host.wecomKfStatus = status;
  } catch (err) {
    host.wecomKfError = err instanceof Error ? err.message : String(err);
  } finally {
    if (!options.quiet) {
      host.wecomKfLoading = false;
    }
  }
}

export async function syncWecomKfDevice(host: WecomKfHost) {
  if (!host.client) {
    host.wecomKfError = "gateway not connected";
    return;
  }
  host.wecomKfBusy = true;
  host.wecomKfError = null;
  try {
    await host.client.request("wecom_kf.device.sync");
    const status = (await host.client.request("wecom_kf.status")) as WecomKfStatus;
    host.wecomKfStatus = status;
  } catch (err) {
    host.wecomKfError = err instanceof Error ? err.message : String(err);
  } finally {
    host.wecomKfBusy = false;
  }
}

export async function unbindWecomKfDevice(host: WecomKfHost) {
  if (!host.client) {
    host.wecomKfError = "gateway not connected";
    return;
  }
  host.wecomKfBusy = true;
  host.wecomKfError = null;
  try {
    await host.client.request("wecom_kf.device.unbind");
    const status = (await host.client.request("wecom_kf.status")) as WecomKfStatus;
    host.wecomKfStatus = status;
  } catch (err) {
    host.wecomKfError = err instanceof Error ? err.message : String(err);
  } finally {
    host.wecomKfBusy = false;
  }
}
