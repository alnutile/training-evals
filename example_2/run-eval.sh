#!/usr/bin/env bash
# Run the opt-out email extraction eval.
#   - Target model: claude-sonnet-5 via the API (needs ANTHROPIC_API_KEY).
#   - Judge model:  LOCAL model in LM Studio at http://localhost:1234 (free).
# The .env stores the key as CLAUDE_API_KEY; the SDK wants ANTHROPIC_API_KEY.
set -euo pipefail
cd "$(dirname "$0")"

export ANTHROPIC_API_KEY="$(grep '^CLAUDE_API_KEY=' ../.env | cut -d= -f2-)"

# Make sure LM Studio is up before we start (judge runs locally).
if ! curl -sf http://localhost:1234/v1/models >/dev/null; then
  echo "ERROR: LM Studio is not reachable at http://localhost:1234"
  echo "Open LM Studio, load a model, and start the local server."
  exit 1
fi

npx -y promptfoo@latest eval -c promptfooconfig.yaml --no-progress-bar "$@"

echo
echo "Open the web viewer with: npx -y promptfoo@latest view"
