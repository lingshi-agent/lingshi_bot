import type { OpenClawPluginApi } from "lingshi/plugin-sdk";
import { resolveWecomKfConfig } from "./src/config.js";
import { createWecomKfRuntime } from "./src/runtime.js";

const wecomConfigSchema = {
  parse(value: unknown) {
    return resolveWecomKfConfig(value);
  },
};

const plugin = {
  id: "wecom-kf",
  name: "WeCom KF",
  description: "Remote WeCom customer service binding integration",
  configSchema: wecomConfigSchema,
  register(api: OpenClawPluginApi) {
    const runtime = createWecomKfRuntime({
      logger: api.logger,
      runtime: api.runtime,
      stateDir: api.runtime.state.resolveStateDir(),
      wehelperDir: api.resolvePath("../wehelper"),
    });

    const loadConfig = async () => {
      const full = await api.runtime.config.loadConfig();
      const raw =
        full?.plugins &&
        typeof full.plugins === "object" &&
        (full.plugins as Record<string, unknown>).entries &&
        typeof (full.plugins as Record<string, unknown>).entries === "object"
          ? ((full.plugins as Record<string, unknown>).entries as Record<string, unknown>)[
              "wecom-kf"
            ]
          : undefined;

      const pluginConfig =
        raw && typeof raw === "object" && !Array.isArray(raw)
          ? (raw as Record<string, unknown>).config
          : undefined;
      return resolveWecomKfConfig(pluginConfig);
    };

    runtime.startDevicePolling(loadConfig);

    api.registerGatewayMethod("wecom_kf.status", async ({ respond }) => {
      try {
        const cfg = await loadConfig();
        respond(true, runtime.status(cfg));
      } catch (err) {
        respond(false, { error: err instanceof Error ? err.message : String(err) });
      }
    });

    api.registerGatewayMethod("wecom_kf.device.sync", async ({ respond }) => {
      try {
        const cfg = await loadConfig();
        const current = await runtime.syncDeviceNow(cfg, true);
        respond(true, current.device);
      } catch (err) {
        respond(false, { error: err instanceof Error ? err.message : String(err) });
      }
    });

    api.registerGatewayMethod("wecom_kf.device.unbind", async ({ respond }) => {
      try {
        const cfg = await loadConfig();
        const current = await runtime.unbindDeviceNow(cfg);
        respond(true, current.device);
      } catch (err) {
        respond(false, { error: err instanceof Error ? err.message : String(err) });
      }
    });
  },
};

export default plugin;
