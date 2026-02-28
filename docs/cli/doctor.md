---
summary: "CLI reference for `lingshi doctor` (health checks + guided repairs)"
read_when:
  - You have connectivity/auth issues and want guided fixes
  - You updated and want a sanity check
title: "doctor"
---

# `lingshi doctor`

Health checks + quick fixes for the gateway and channels.

Related:

- Troubleshooting: [Troubleshooting](/gateway/troubleshooting)
- Security audit: [Security](/gateway/security)

## Examples

```bash
lingshi doctor
lingshi doctor --repair
lingshi doctor --deep
```

Notes:

- Interactive prompts (like keychain/OAuth fixes) only run when stdin is a TTY and `--non-interactive` is **not** set. Headless runs (cron, Telegram, no terminal) will skip prompts.
- `--fix` (alias for `--repair`) writes a backup to `~/.lingshi/lingshi.json.bak` and drops unknown config keys, listing each removal.

## macOS: `launchctl` env overrides

If you previously ran `launchctl setenv LINGSHI_GATEWAY_TOKEN ...` (or `...PASSWORD`), that value overrides your config file and can cause persistent “unauthorized” errors.

```bash
launchctl getenv LINGSHI_GATEWAY_TOKEN
launchctl getenv LINGSHI_GATEWAY_PASSWORD

launchctl unsetenv LINGSHI_GATEWAY_TOKEN
launchctl unsetenv LINGSHI_GATEWAY_PASSWORD
```
