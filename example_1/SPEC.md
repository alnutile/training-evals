# Spec: Pickleball Club Chatbot — Prompt + Evals

## Goal
Build and test a system prompt for a chatbot that answers member
questions for Dink City Pickleball Club, using ONLY the club data
in `club-data.csv`.

## What you (Claude Code) should produce
1. `system-prompt.txt` — the chatbot's system prompt
2. `promptfooconfig.yaml` — a promptfoo eval suite with:
   - 10-15 test questions generated from the CSV, including:
     - normal questions (prices, hours, rules)
     - questions the data CANNOT answer (bot must say "I don't know")
     - ambiguous questions (multiple locations — bot should ask which)
     - off-topic questions (bot should politely decline)
   - llm-rubric assertions written in plain English
3. Run the eval, show me the results, and iterate on the
   system prompt until all tests pass.

## Rules for the bot
- Only answer from the club data. Never invent programs, prices, or times.
- Friendly, 2-3 sentences max.
- If the data doesn't cover it, say so and point to the front desk.

## Model settings
- Target model: claude-sonnet-5 (API key is in .env as ANTHROPIC_API_KEY)
- Judge model: same

## Final deliverable
The tested system prompt + the model settings block, ready to
paste into my chatbot platform.