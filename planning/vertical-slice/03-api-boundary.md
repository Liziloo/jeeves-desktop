# Phase 3 — API Call Boundary (Thin)

## Purpose
Define a single, auditable boundary where the OpenAI API is called.

---

## Single Call Site Rule

- Exactly one module/function calls OpenAI
- No secondary clients
- No direct calls elsewhere

---

## Inputs

- Explicit model name
- Final assembled prompt
- Optional image inputs (only if explicitly provided)
- Whitelisted generation controls

No implicit context.

---

## API Surface

- Canonical surface: Responses API
- Legacy APIs allowed only behind this boundary

---

## Outputs

- Assistant-visible output text
- Minimal trace metadata (model, artifact versions, request id)

No raw prompt returned downstream.

---

## Error Handling

- No retries
- No fallbacks
- No parameter mutation

Any API error ⇒ terminal failure.

---

## Logging Policy

May log:
- timestamp
- model
- artifact versions
- success/failure code

Must not log:
- prompt text
- user content
- conversation history

---

## Exit Condition

There is exactly one OpenAI call path, fully attributable and failure-explicit.
