# Phase 4 — Persistence Hygiene (Negative Space)

## Purpose
Explicitly define what is persisted and what is never persisted.

---

## Persisted Content

Only:
- user messages
- assistant messages
- minimal metadata (timestamp, role, optional id)

---

## Never Persist

- Any artifact (UBP, SG, RP, ITI)
- Any system prompt text
- Any control or governance content
- Rehydration state
- Raw API payloads or responses

---

## Ephemeral Runtime State

Lives only in:
- `/data/runtime/`

Includes:
- transient request ids
- artifact version references
- in-flight task flags

Never mixed with conversation storage.

---

## Message Typing Contract

Persisted messages must be:
- role: `user` or `assistant`
- kind: `message`

System, artifact, or control kinds are prohibited.

---

## Rehydration Policy

- Rehydration prompt is injected ephemerally
- Message history is optional context only
- History is never authoritative state

---

## Exit Condition

Persistence rules are unambiguous and prevent artifact leakage by construction.
