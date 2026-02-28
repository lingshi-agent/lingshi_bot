---
summary: "CLI reference for `lingshi reset` (reset local state/config)"
read_when:
  - You want to wipe local state while keeping the CLI installed
  - You want a dry-run of what would be removed
title: "reset"
---

# `lingshi reset`

Reset local config/state (keeps the CLI installed).

```bash
lingshi reset
lingshi reset --dry-run
lingshi reset --scope config+creds+sessions --yes --non-interactive
```
