---
summary: "CLI reference for `lingshi logs` (tail gateway logs via RPC)"
read_when:
  - You need to tail Gateway logs remotely (without SSH)
  - You want JSON log lines for tooling
title: "logs"
---

# `lingshi logs`

Tail Gateway file logs over RPC (works in remote mode).

Related:

- Logging overview: [Logging](/logging)

## Examples

```bash
lingshi logs
lingshi logs --follow
lingshi logs --json
lingshi logs --limit 500
```
