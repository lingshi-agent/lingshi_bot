---
summary: "CLI reference for `lingshi voicecall` (voice-call plugin command surface)"
read_when:
  - You use the voice-call plugin and want the CLI entry points
  - You want quick examples for `voicecall call|continue|status|tail|expose`
title: "voicecall"
---

# `lingshi voicecall`

`voicecall` is a plugin-provided command. It only appears if the voice-call plugin is installed and enabled.

Primary doc:

- Voice-call plugin: [Voice Call](/plugins/voice-call)

## Common commands

```bash
lingshi voicecall status --call-id <id>
lingshi voicecall call --to "+15555550123" --message "Hello" --mode notify
lingshi voicecall continue --call-id <id> --message "Any questions?"
lingshi voicecall end --call-id <id>
```

## Exposing webhooks (Tailscale)

```bash
lingshi voicecall expose --mode serve
lingshi voicecall expose --mode funnel
lingshi voicecall unexpose
```

Security note: only expose the webhook endpoint to networks you trust. Prefer Tailscale Serve over Funnel when possible.
