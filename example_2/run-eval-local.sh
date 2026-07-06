#!/usr/bin/env bash
# Fully-local run: extractor AND judge both run in LM Studio. No API key needed.
set -euo pipefail
cd "$(dirname "$0")"

if ! curl -sf http://localhost:1234/v1/models >/dev/null; then
  echo "ERROR: LM Studio is not reachable at http://localhost:1234"
  echo "Open LM Studio, load google/gemma-4-12b-qat, and start the local server."
  exit 1
fi

npx -y promptfoo@latest eval -c promptfooconfig.local.yaml --no-progress-bar "$@"

echo
echo "Open the web viewer with: npx -y promptfoo@latest view"
