---
summary: "CLI reference for `lingshi plugins` (list, install, enable/disable, doctor)"
read_when:
  - You want to install or manage in-process Gateway plugins
  - You want to debug plugin load failures
title: "plugins"
---

# `lingshi plugins`

Manage Gateway plugins/extensions (loaded in-process).

Related:

- Plugin system: [Plugins](/plugin)
- Plugin manifest + schema: [Plugin manifest](/plugins/manifest)
- Security hardening: [Security](/gateway/security)

## Commands

```bash
lingshi plugins list
lingshi plugins info <id>
lingshi plugins enable <id>
lingshi plugins disable <id>
lingshi plugins doctor
lingshi plugins update <id>
lingshi plugins update --all
```

Bundled plugins ship with Lingshi but start disabled. Use `plugins enable` to
activate them.

All plugins must ship a `lingshi.plugin.json` file with an inline JSON Schema
(`configSchema`, even if empty). Missing/invalid manifests or schemas prevent
the plugin from loading and fail config validation.

### Install

```bash
lingshi plugins install <path-or-spec>
```

Security note: treat plugin installs like running code. Prefer pinned versions.

Supported archives: `.zip`, `.tgz`, `.tar.gz`, `.tar`.

Use `--link` to avoid copying a local directory (adds to `plugins.load.paths`):

```bash
lingshi plugins install -l ./my-plugin
```

### Update

```bash
lingshi plugins update <id>
lingshi plugins update --all
lingshi plugins update <id> --dry-run
```

Updates only apply to plugins installed from npm (tracked in `plugins.installs`).
