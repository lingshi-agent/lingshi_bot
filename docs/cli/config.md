---
summary: "CLI reference for `lingshi config` (get/set/unset config values)"
read_when:
  - You want to read or edit config non-interactively
title: "config"
---

# `lingshi config`

Config helpers: get/set/unset values by path. Run without a subcommand to open
the configure wizard (same as `lingshi configure`).

## Examples

```bash
lingshi config get browser.executablePath
lingshi config set browser.executablePath "/usr/bin/google-chrome"
lingshi config set agents.defaults.heartbeat.every "2h"
lingshi config set agents.list[0].tools.exec.node "node-id-or-name"
lingshi config unset tools.web.search.apiKey
```

## Paths

Paths use dot or bracket notation:

```bash
lingshi config get agents.defaults.workspace
lingshi config get agents.list[0].id
```

Use the agent list index to target a specific agent:

```bash
lingshi config get agents.list
lingshi config set agents.list[1].tools.exec.node "node-id-or-name"
```

## Values

Values are parsed as JSON5 when possible; otherwise they are treated as strings.
Use `--json` to require JSON5 parsing.

```bash
lingshi config set agents.defaults.heartbeat.every "0m"
lingshi config set gateway.port 19001 --json
lingshi config set channels.whatsapp.groups '["*"]' --json
```

Restart the gateway after edits.
