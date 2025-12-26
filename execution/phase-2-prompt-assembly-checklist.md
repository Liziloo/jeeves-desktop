# Phase 2 — Prompt Assembly Function (Pure)  
**Execution Checklist**

## Status
Execution checklist.  
No side effects permitted.  
No code beyond the scope of each checklist item.

---

## Purpose

Implement a **single, pure prompt assembly function** that:

- accepts validated artifact text from Phase 1,
- assembles the runtime system prompt in **strict order**,
- preserves artifact content **verbatim**,
- and produces **exactly one system prompt string**.

This phase must introduce **no behavior**, **no validation**, and **no persistence**.

---

## Preconditions (Must Already Be True)

- Phase 1 (Artifact Loader) is complete.
- Artifact loader returns an ordered map:
  - `{ artifact_name → artifact_text }`
- Artifact texts have already been validated for:
  - presence
  - version
  - delimiter integrity

If any precondition fails → STOP.

---

## Checklist Items

### 1. Declare Assembly Function Boundary

- [ ] Define exactly **one function/module** responsible for prompt assembly.
- [ ] Ensure no other code path concatenates artifacts or constructs system prompts.

**Stop condition:**  
There is exactly one assembly boundary in the codebase.

---

### 2. Define Assembly Inputs Explicitly

The function may accept **only**:

- [ ] `UBP` (string, required)
- [ ] `SG` (string, required)
- [ ] `RP` (string, optional; present only if rehydration flag is true)
- [ ] `ITI` (string, optional; present only if task-present flag is true)

No other inputs are permitted:
- no conversation history
- no user messages
- no defaults
- no environment state

**Stop condition:**  
Given a call signature, it is impossible to pass undeclared inputs.

---

### 3. Lock Assembly Order (Strict)

Assemble artifacts in **exactly this order**:

1. Unified Behavior Prompt (UBP)
2. Scope Guardrail (SG)
3. Rehydration Prompt (RP) — *only if present*
4. Immediate Task Input (ITI) — *only if present*

- [ ] Order must not vary based on runtime conditions other than presence/absence.
- [ ] No reordering, grouping, or prioritization.

**Stop condition:**  
Given the same inputs, order is always identical.

---

### 4. Preserve Artifact Content Verbatim

- [ ] Concatenate artifact texts **without modification**.
- [ ] Preserve:
  - all whitespace
  - all delimiters
  - all internal formatting
- [ ] Insert **exactly one newline** between artifacts.

Prohibited:
- trimming
- normalization
- indentation
- wrapping
- parsing
- inspection

**Stop condition:**  
Artifact text reaches the model exactly as stored on disk.

---

### 5. Absence Semantics (No Placeholders)

- [ ] If `RP` is absent, omit it entirely.
- [ ] If `ITI` is absent, omit it entirely.
- [ ] Do not insert:
  - empty blocks
  - placeholder text
  - explanatory comments

**Stop condition:**  
Absence is represented only by non-inclusion.

---

### 6. Output Contract

- [ ] Output is a **single string**.
- [ ] This string is the **entire system prompt**.
- [ ] No additional system messages may be constructed elsewhere.

**Stop condition:**  
There is exactly one system prompt per request.

---

### 7. Failure Semantics (Assembly-Level Only)

The assembly function may fail **only** if:

- [ ] a required artifact string is missing (programming error)
- [ ] the function is called with an invalid signature

It must **not** fail based on:
- task content
- scope
- ambiguity
- uncertainty

Those belong to later phases.

**Stop condition:**  
Assembly failures are structural, not semantic.

---

## Explicit Non-Responsibilities (Verify None Are Added)

The prompt assembly function must **not**:

- inspect task content
- enforce scope
- interpret modes
- validate ambiguity
- call the API
- log prompt text
- persist anything

If any occur → STOP and revert.

---

## Phase 2 Completion Criteria

Phase 2 is complete when:

- Prompt assembly is deterministic and pure.
- Behavior cannot change without changing artifact files.
- There is exactly one assembly path in the codebase.
- No side effects exist.

Only after this may Phase 3 execution begin.

---

## Next Phase (Locked)

**Phase 3 — API Call Boundary (Thin)**  
May not begin until Phase 2 is complete.
