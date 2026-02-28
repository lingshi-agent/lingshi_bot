#!/usr/bin/env bash
set -euo pipefail

cd /repo

export LINGSHI_STATE_DIR="/tmp/lingshi-test"
export LINGSHI_CONFIG_PATH="${LINGSHI_STATE_DIR}/lingshi.json"

echo "==> Build"
pnpm build

echo "==> Seed state"
mkdir -p "${LINGSHI_STATE_DIR}/credentials"
mkdir -p "${LINGSHI_STATE_DIR}/agents/main/sessions"
echo '{}' >"${LINGSHI_CONFIG_PATH}"
echo 'creds' >"${LINGSHI_STATE_DIR}/credentials/marker.txt"
echo 'session' >"${LINGSHI_STATE_DIR}/agents/main/sessions/sessions.json"

echo "==> Reset (config+creds+sessions)"
pnpm lingshi reset --scope config+creds+sessions --yes --non-interactive

test ! -f "${LINGSHI_CONFIG_PATH}"
test ! -d "${LINGSHI_STATE_DIR}/credentials"
test ! -d "${LINGSHI_STATE_DIR}/agents/main/sessions"

echo "==> Recreate minimal config"
mkdir -p "${LINGSHI_STATE_DIR}/credentials"
echo '{}' >"${LINGSHI_CONFIG_PATH}"

echo "==> Uninstall (state only)"
pnpm lingshi uninstall --state --yes --non-interactive

test ! -d "${LINGSHI_STATE_DIR}"

echo "OK"
