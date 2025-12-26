# Phase 4 — Persistence Hygiene (Negative Space)
**Execution Checklist**

## Status
Execution checklist.  
Defines persistence boundaries and prohibitions.  
No runtime behavior beyond persistence rules.

---

## Purpose

Implement **strict separation** between:

- persisted conversational data, and
- ephemeral runtime/system artifacts,

so that **no implicit state, artifact leakage, or control contamination** can occur.

This phase assumes Phases 1–3 are complete.

---

## Preconditions (Must Already Be True)

- Phase 1 — Artifact Loader is complete.
- Phase 2 — Prompt Assembly is complete.
- Phase 3 — API Call Boundary is complete.
- A persistent conversation store exists (e.g., JSON or DB).
- An ephemeral runtime location exists (e.g., `/data/runtime/`).

If any precondition fails → STOP.

---

## Checklist Items

### 1. Declare Persistent Store Contract

- [ ] Identify the **single persistent store** for conversations.
- [ ] Confirm it is used **only** for user-visible dialogue.

Persisted content may include **only**:
- user messages
- assistant messages
- minimal metadata:
  - timestamp
  - role (`user` | `assistant`)
  - optional message id

**Stop condition:**  
There is exactly one persistence mechanism for conversation data.

---

### 2. Enforce “Never Persist” Set

Verify that the following are **never written** to persistent storage:

- [ ] Unified Behavior Prompt (UBP)
- [ ] Scope Guardrail (SG)
- [ ] Rehydration Prompt (RP)
- [ ] Immediate Task Input (ITI)
- [ ] Any delimiter-wrapped runtime artifact
- [ ] Any system prompt text
- [ ] Any control or governance text
- [ ] Any rehydration state
- [ ] Raw API request payloads
- [ ] Raw API response objects (beyond assistant-visible text)

**Stop condition:**  
No code path can persist any item from this list.

---

### 3. Define Message Typing Schema

- [ ] Ensure every persisted record has:
  - `role`: `user` | `assistant`
  - `kind`: `message`
- [ ] Prohibit persisted records with:
  - `kind: system`
  - `kind: artifact`
  - `kind: control`

**Stop condition:**  
The persistence schema structurally forbids system/artifact records.

---

### 4. Isolate Ephemeral Runtime State

- [ ] Confirm ephemeral runtime state lives **only** under:
  - `/data/runtime/`
- [ ] Limit runtime state to:
  - transient request ids
  - artifact version references
  - in-flight task flags

Prohibited in runtime state:
- prompt text
- conversation history
- user content
- assistant content

**Stop condition:**  
Ephemeral state cannot be mistaken for persisted conversation data.

---

### 5. Enforce Rehydration Separation

- [ ] Ensure rehydration state is **constructed at runtime**.
- [ ] Inject Rehydration Prompt (RP) ephemerally.
- [ ] Treat persisted message history as **optional context only**, never authoritative state.

**Stop condition:**  
Conversation continuity does not depend on replaying system artifacts.

---

### 6. Verify Persistence Write Boundary

- [ ] Identify the **single location** where conversation writes occur.
- [ ] Ensure persistence happens **only after** a successful API response.
- [ ] Confirm no persistence occurs on:
  - loader failure
  - assembly failure
  - API failure

**Stop condition:**  
No partial or failed requests create persisted records.

---

### 7. Persistence Failure Handling

- [ ] Treat persistence write errors as terminal.
- [ ] Do not auto-repair, truncate, or retry silently.
- [ ] Surface a clear persistence failure notice upward.

**Stop condition:**  
Persistence errors cannot be ignored or auto-corrected.

---

## Explicit Non-Responsibilities (Verify None Are Added)

The persistence layer must **not**:

- store runtime artifacts
- store system prompts
- infer state from history
- reconstruct rehydration implicitly
- modify stored messages post-write

If any occur → STOP and revert.

---

## Phase 4 Completion Criteria

Phase 4 is complete when:

- Persisted data contains **only** user/assistant dialogue.
- Runtime artifacts are provably ephemeral.
- Rehydration does not rely on message replay.
- Persistence failures are explicit and terminal.

Only after this may Phase 5 execution begin.

---

## Next Phase (Locked)

**Phase 5 — Failure Semantics**  
May not begin until Phase 4 is complete.
