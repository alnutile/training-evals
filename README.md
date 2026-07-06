# training-evals

Worked examples of building and testing prompts with [promptfoo](https://promptfoo.dev) — each one takes a `SPEC.md`, produces a system/extraction prompt, and grades it against a suite of test cases with `llm-rubric` assertions.

The pattern to notice across both examples: **let a capable (paid) model do the real work, and use a cheap model — even a free local one — only as the judge.** Grading ("does this output match the expected answer?") is a far easier job than the task itself, so a small model handles it well.

## Prerequisites

- Node.js + `npx` (the scripts call `npx promptfoo@latest`, which pulls a build matching your Node version).
- A `.env` file at the repo root with your Anthropic key:
  ```
  CLAUDE_API_KEY=sk-ant-...
  ```
  `.env` is git-ignored — it is **never** committed. The run scripts map `CLAUDE_API_KEY` → `ANTHROPIC_API_KEY` (what the SDK expects).
- For the local-judge runs: [LM Studio](https://lmstudio.ai) serving its OpenAI-compatible API at `http://localhost:1234` with a model loaded.

Each example is self-contained. `cd` into it and run its script.

## example_1 — Pickleball club chatbot (API judge)

A grounded Q&A bot for a pickleball club that answers **only** from the club schedule: normal questions, "I don't know" fallbacks, ambiguity ("which day?"), and off-topic declines.

- **Target:** `claude-sonnet-5` (paid)
- **Judge:** `claude-haiku-4-5` (paid, but cheap)
- Run: `cd example_1 && ./run-eval.sh` → **14/14 pass**

## example_2 — Opt-out email extraction (local judge)

Reads privacy opt-out emails and extracts structured JSON (request type, reply-to, name, address, phone), with traps: reply-to buried in a signature, nickname vs. legal name, missing fields that must stay `null`, and ambiguous delete-vs-know requests.

Two modes:

| Mode | Config | Extractor | Judge | Speed |
|------|--------|-----------|-------|-------|
| **Paid extract + local judge** (recommended) | `promptfooconfig.yaml` | `claude-sonnet-5` (paid) | local model in LM Studio | fast |
| **Fully offline** | `promptfooconfig.local.yaml` | local model in LM Studio | local model in LM Studio | slow (reasoning model) |

- Recommended: `cd example_2 && ./run-eval.sh` → **12/12 pass**, judged locally for free.
- Fully offline (no API key at all): `cd example_2 && ./run-eval-local.sh`.

The judge model id in each config points at whatever you have loaded in LM Studio (e.g. `google/gemma-3-4b`) — change that one line to match your loaded model.

## Notes / gotchas

- **`temperature` is deprecated on `claude-sonnet-5`.** promptfoo's built-in `anthropic:` provider always sends it, causing a 400. Each example uses a small custom `provider.js` that calls the Messages API directly and omits `temperature`. The Haiku judge still uses promptfoo's built-in provider.
- **Reasoning local models** (e.g. Gemma QAT) emit a separate reasoning channel and need a generous `max_tokens` so the JSON isn't truncated; `example_2/transform.js` strips any `<think>`/fence wrapping before assertions run.
- **LM Studio serves one model instance**, so the local runs use `-j 1` (serial) to avoid overloading it.

View any run's report in the browser with `npx promptfoo@latest view`.
