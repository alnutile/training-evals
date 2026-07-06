#!/usr/bin/env bash
# Run the Dink City Pickleball eval.
# The .env stores the Anthropic key as CLAUDE_API_KEY; promptfoo (and the
# Anthropic SDK) expect ANTHROPIC_API_KEY, so we map it here.
set -euo pipefail
cd "$(dirname "$0")"

export ANTHROPIC_API_KEY="$(grep '^CLAUDE_API_KEY=' ../.env | cut -d= -f2-)"

# Global promptfoo has a Node ABI mismatch on this machine, so use npx which
# pulls a build matching the current Node.
npx -y promptfoo@latest eval -c promptfooconfig.yaml --no-progress-bar "$@"

echo
echo "Open the web viewer with: npx -y promptfoo@latest view"
