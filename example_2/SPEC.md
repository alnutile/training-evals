# Spec: Opt-Out Email Extraction — Prompt + Evals (local judge)

## Goal
Build and test a prompt that reads privacy opt-out emails
(`sample-emails.csv`) and outputs structured JSON.

## Output schema per email
- request_type: "delete" or "know" (exact match, no other values)
- reply_to: the address to respond to — check the BODY and signature,
  it is not always the From address
- first_name, last_name, address, phone
- Any field not present in the email must be null. NEVER invent data.
  A missing phone number must stay missing.

## What you (Claude Code) should produce
1. `extraction-prompt.txt`
2. `promptfooconfig.yaml` with test emails from the CSV, including:
   - reply-to buried in a signature
   - nickname in signature vs legal name in body
   - an email with no phone number (must come back null)
   - an ambiguous delete-vs-know request
3. Run the eval, show failures, iterate until passing.

## Judge settings — LOCAL, not the API
Use my local model as the grader so eval runs are free.
LM Studio is serving an OpenAI-compatible API:

    defaultTest:
      options:
        provider:
          id: openai:chat:gemma-3-12b
          config:
            apiBaseUrl: http://localhost:1234/v1
            apiKey: lm-studio

The extraction model under test is still claude-sonnet-5 via my API key.

## Final deliverable
The tested extraction prompt + model settings.