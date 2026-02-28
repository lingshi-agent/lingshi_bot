---
summary: "CLI reference for `lingshi agents` (list/add/delete/set identity)"
read_when:
  - You want multiple isolated agents (workspaces + routing + auth)
title: "agents"
---

# `lingshi agents`

Manage isolated agents (workspaces + auth + routing).

Related:

- Multi-agent routing: [Multi-Agent Routing](/concepts/multi-agent)
- Agent workspace: [Agent workspace](/concepts/agent-workspace)

## Examples

```bash
lingshi agents list
lingshi agents add work --workspace ~/.lingshi/workspace-work
lingshi agents set-identity --workspace ~/.lingshi/workspace --from-identity
lingshi agents set-identity --agent main --avatar avatars/lingshi.png
lingshi agents delete work
```

## Identity files

Each agent workspace can include an `IDENTITY.md` at the workspace root:

- Example path: `~/.lingshi/workspace/IDENTITY.md`
- `set-identity --from-identity` reads from the workspace root (or an explicit `--identity-file`)

Avatar paths resolve relative to the workspace root.

## Set identity

`set-identity` writes fields into `agents.list[].identity`:

- `name`
- `theme`
- `emoji`
- `avatar` (workspace-relative path, http(s) URL, or data URI)

Load from `IDENTITY.md`:

```bash
lingshi agents set-identity --workspace ~/.lingshi/workspace --from-identity
```

Override fields explicitly:

```bash
lingshi agents set-identity --agent main --name "Lingshi" --emoji "🦞" --avatar avatars/lingshi.png
```

Config sample:

```json5
{
  agents: {
    list: [
      {
        id: "main",
        identity: {
          name: "Lingshi",
          theme: "space lobster",
          emoji: "🦞",
          avatar: "avatars/lingshi.png",
        },
      },
    ],
  },
}
```
