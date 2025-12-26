# Phase 5 — Failure Semantics
**Execution Checklist**

## Status
Execution checklist.  
Defines terminal failure cases and required user-visible outcomes.  
No recovery logic, no retries, no fallbacks.

---

## Purpose

Implement **explicit, terminal failure semantics** across the request lifecycle so that:
- incorrect execution never occurs,
- failures are attributable and minimal,
- no hidden continuation or improvisation is possible,
- and runtime behavior remains deterministic and traceable.

This phase assumes Phases 1–4 are complete.

---

## Preconditions (Must Already Be True)

- Phase 1 — Artifact Loader is complete.
- Phase 2 — Prompt Assembly is complete.
- Phase 3 — API Call Boundary is complete.
- Phase 4 — Persistence Hygiene is complete.
- All runtime artifacts are injected ephemerally.
- Persistence is isolated and schema-enforced.

If any precondition fails → STOP.

---

## Checklist Items

### 1. Enumerate Terminal Failure Types

Define a closed set of terminal failure categories:

- [ ] Missing required artifact
- [ ] Artifact version mismatch
- [ ] Artifact delimiter / integrity failure
- [ ] Filesystem read error
- [ ] Scope violation
- [ ] Ambiguity gate triggered
- [ ] Uncertainty gate triggered
- [ ] Mode incompatibility
- [ ] API error — transport/auth/rate
- [ ] API error — request invalid
- [ ] Persistence write failure

**Stop condition:**  
All failures map to exactly one category.

---

### 2. Lock Failure Stop Points

For each failure category, verify the stop point:

- [ ] Loader-stage failures stop **before** prompt assembly.
- [ ] Scope violations stop **before** API call.
- [ ] Ambiguity/uncertainty stop **at model response**, with constrained output.
- [ ] API failures stop **at the API boundary**.
- [ ] Persistence failures stop **after response, before durability**.

**Stop condition:**  
No failure can propagate past its defined stop point.

---

### 3. Define User-Visible Outcomes (Minimal)

For each failure category, ensure the user-visible output is:

- [ ] minimal
- [ ] specific
- [ ] non-explanatory
- [ ] non-recovering

Rules:
- No rationale text
- No suggestions unless explicitly permitted (ambiguity/uncertainty only)
- No exposure of artifacts or system prompts

**Stop condition:**  
Every failure produces exactly one allowed output shape.

---

### 4. Enforce Ambiguity Gate Output Shape

When ambiguity is detected:

- [ ] Output **exactly one** clarifying question.
- [ ] Do not include analysis, context, or options.
- [ ] Stop immediately after the question.

Persistence rule:
- Only the assistant-visible question is persisted.

**Stop condition:**  
Ambiguity cannot produce multi-part responses.

---

### 5. Enforce Uncertainty Gate Output Shape

When required information is unknown/unverifiable:

- [ ] Output **only**:
  1. what is unknown
  2. what input/tool is required
  3. one question or request for data
- [ ] Stop immediately after.

Persistence rule:
- Only the assistant-visible output is persisted.

**Stop condition:**  
Uncertainty responses are strictly structured and bounded.

---

### 6. Prohibit Recovery, Retry, and Fallback

Across all failures:

- [ ] No retries
- [ ] No fallback models
- [ ] No parameter mutation and reattempt
- [ ] No partial continuation

**Stop condition:**  
One request yields one terminal outcome.

---

### 7. Prevent Artifact and Control Leakage

On all failures:

- [ ] Ensure no runtime artifacts are surfaced to the user.
- [ ] Ensure no system/control text is persisted.
- [ ] Ensure logs cannot reconstruct prompts.

**Stop condition:**  
Failure paths cannot leak governance or runtime content.

---

### 8. Persistence Behavior on Failure

Verify persistence behavior:

- [ ] No persistence on:
  - loader failure
  - assembly failure
  - API failure
- [ ] Persistence occurs only after:
  - successful API response
  - successful write operation

**Stop condition:**  
Failed requests leave no durable traces.

---

## Explicit Non-Responsibilities (Verify None Are Added)

Failure handling must **not**:

- explain failures narratively
- attempt to “help” beyond allowed outputs
- infer user intent
- modify runtime configuration
- mutate artifacts
- persist partial state

If any occur → STOP and revert.

---

## Phase 5 Completion Criteria

Phase 5 is complete when:

- Every failure is categorized, terminal, and attributable.
- User-visible outputs are minimal and constrained.
- No retry, fallback, or silent continuation exists.
- No failure path contaminates persistence or runtime state.

---

## End of Vertical Slice Execution Checklists

All five execution phases are now specified.

Further work requires explicit authorization to:
- implement code, or
- extend the system beyond the minimal vertical slice.
