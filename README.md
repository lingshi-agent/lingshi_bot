# Lingshi

Lingshi 是一个面向多渠道消息接入与 AI 自动化编排的控制平台，支持本地网关、插件扩展、会话与运维管理。

## 官网

- [www.wehelper.cloud](https://www.wehelper.cloud/)

## 使用说明

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动 CLI

```bash
node lingshi.mjs --help
```

### 3. 启动本地网关（本地验收常用）

```bash
node lingshi.mjs gateway --allow-unconfigured --auth token --token dev-token-123 --bind loopback --verbose
```

### 4. 健康检查

```bash
LINGSHI_GATEWAY_TOKEN=dev-token-123 node lingshi.mjs gateway call health --url ws://127.0.0.1:18789 --json
```
