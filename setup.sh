#!/usr/bin/env bash
set -euo pipefail

if [ -f "apps/web/package.json" ]; then
  echo "[setup] Installing Node deps in apps/web..."
  pushd apps/web >/dev/null
  npm ci
  # pokud buildíš statiku, odkomentuj
  # npm run build
  popd >/dev/null
else
  echo "[setup] apps/web/package.json not found. Skipping."
fi

# uklid neplatné npm config (to tvoje http-proxy)
npm config delete http-proxy || true
npm config delete https-proxy || true
