# Phase 5 CLI `lingshi` Migration Evidence

Date: 2026-02-28
Branch: `codex/phase5-cli-lingshi`

## Scope

- CLI command name switched to `lingshi`.
- Default state/config path switched to `~/.lingshi/lingshi.json`.
- CLI/user-visible runtime logs switched from `OpenClaw` to `Lingshi` in core CLI paths.
- `ai.openclaw` subsystem namespace migrated to `ai.lingshi` in runtime config/constants.

## Static scans

### Command

```bash
rg -n --hidden -S "~/.openclaw|\.openclaw|openclaw\.json|openclaw\.mjs|ai\.openclaw" \
  /Users/fanyuhang/Documents/wehelper_project/lingshi_bot \
  -g '!**/.git/**' -g '!**/node_modules/**' -g '!**/.bundle/**' \
  -g '!**/src/canvas-host/a2ui/a2ui.bundle.js'
```

### Result

- No `~/.openclaw` / `.openclaw` / `openclaw.json` / `openclaw.mjs` / `ai.openclaw` residuals in active source paths (with exclusions above).

## Allowed residuals (whitelist)

1. `lingshi_bot/.bundle/lean_test/**`

- Snapshot/fixture bundle content; not production runtime path.

2. `lingshi_bot/src/canvas-host/a2ui/a2ui.bundle.js`

- Generated bundle artifact; source files were migrated, bundle is treated as generated output.

3. macOS app bundle/product identifiers such as `OpenClaw.app`

- Packaging/product naming path not part of this CLI command/state-dir migration scope.

## Test evidence

### Executed

```bash
pnpm -C /Users/fanyuhang/Documents/wehelper_project/lingshi_bot exec vitest run \
  src/config/paths.test.ts \
  src/cli/update-cli.test.ts \
  src/commands/dashboard.test.ts \
  src/wizard/onboarding.test.ts \
  src/commands/status.test.ts \
  src/agents/system-prompt.test.ts
```

### Result

- `6` files passed, `70` tests passed.

## Platform test notes

1. `apps/macos` tests (`swift test`) could not be completed in current environment:

- sandbox denied writes to SwiftPM cache directories under `$HOME/Library/...`
- local Swift toolchain/SDK mismatch reported by compiler

2. `OpenClawChatUI` test path was requested in plan wording, but directory was not present at:

- `/Users/fanyuhang/Documents/wehelper_project/OpenClawChatUI`
