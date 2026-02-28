import type { OpenClawPluginApi } from "lingshi/plugin-sdk";
import { emptyPluginConfigSchema } from "lingshi/plugin-sdk";
import { feishuPlugin } from "./src/channel.js";

const plugin = {
  id: "feishu",
  name: "Feishu",
  description: "Feishu (Lark) channel plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    api.registerChannel({ plugin: feishuPlugin });
  },
};

export default plugin;
