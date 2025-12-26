# Phase 2 — Prompt Assembly Function (Pure)

## Purpose
Define a single, deterministic, side-effect-free operation that assembles the runtime prompt from validated artifacts.

---

## Inputs

- UBP (always)
- SG (always)
- RP (only if present)
- ITI (only if present)

No other inputs are permitted.

---

## Assembly Order (Strict)

1. Unified Behavior Prompt (UBP)
2. Scope Guardrail (SG)
3. Rehydration Prompt (RP) — if present
4. Immediate Task Input (ITI) — if present

Artifacts are concatenated verbatim with exactly one newline between them.

---

## Delimiter Preservation

- All delimiters preserved exactly
- No trimming, indentation, or rewriting
- No additional headers or separators

---

## Absence Semantics

- Absent artifacts are omitted entirely
- No placeholders
- No empty blocks

---

## Output Contract

- Output is a single string
- This string is the entire system prompt
- Exactly one system prompt per request

---

## Non-Responsibilities

The assembly function does not:
- inspect task content
- enforce scope
- parse artifacts
- persist data
- log content

---

## Exit Condition

The assembled prompt is identical for identical inputs, with no hidden variability.
