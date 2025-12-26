---
tags:
  - jeeves
  - app-development
  - execution-plan
  - artifact-runtime
status: planning
scope: vertical-slice
---

## Purpose

Define a **stop-safe execution plan** for implementing a minimal vertical slice of the artifact-driven runtime.

This plan is:
- planning-only
- linear and atomic
- resumable at any step
- explicitly non-executing

No code is written under this plan.  
Each phase ends with a clear verification condition.

---

## Preconditions (Phase 0 — No Work)

Verified artifacts exist on disk:

- Unified Behavior Prompt (UBP-1.0.0)
- Scope Guardrail (SG-1.0.0)
- Rehydration Prompt (RP-1.0.0)
- Immediate Task Input (ITI-1.0.0)

Verified directory boundaries exist:

- `/artifacts/`
- `/governance/`
- `/data/`

**Exit condition:**  
All artifacts present and versioned. No changes made.

---

## Phase 1 — Artifact Loader (Read-Only Planning)

Define how the backend will locate and load artifacts.

Questions to answer:
- Where are artifact paths resolved?
- How are versions validated?
- What is the hard-stop behavior if an artifact is missing or mismatched?

Constraints:
- Read-only
- No API calls
- No persistence

**Exit condition:**  
A clear, written rule for artifact loading and failure behavior.

---

## Phase 2 — Prompt Assembly Function (Pure)

Define a single, pure prompt assembly operation.

Inputs:
- Artifact texts (UBP, SG, RP)
- One ITI instance

Output:
- One fully assembled runtime prompt string

Constraints:
- Strict artifact order
- Required delimiters
- No conditional logic beyond presence/absence
- No side effects

**Exit condition:**  
Prompt assembly rules are fully specified and deterministic.

---

## Phase 3 — API Call Boundary (Thin)

Define the exact boundary where the OpenAI API is invoked.

Questions to answer:
- Where does the API call live?
- What request shape is used?
- What is considered a terminal failure?

Constraints:
- One call site
- No retries
- No fallbacks
- No streaming
- Text + image input only

**Exit condition:**  
A single, clearly defined API boundary with failure semantics.

---

## Phase 4 — Persistence Hygiene (Negative Space)

Define what is persisted vs explicitly never persisted.

Must enumerate:
- Persisted:
  - user messages
  - assistant outputs
- Never persisted:
  - artifacts
  - system/runtime control text
  - rehydration state
  - ITI payloads

Likely requirement:
- Message type enum or equivalent discriminator

**Exit condition:**  
A written persistence policy with zero ambiguity.

---

## Phase 5 — Failure Semantics

Enumerate all hard-stop cases and user-visible outcomes.

Required cases:
- Missing artifact
- Version mismatch
- Scope violation
- Ambiguity gate triggered
- Uncertainty gate triggered
- API error

Constraints:
- Failure stops execution
- No “best effort” continuation
- No silent degradation

**Exit condition:**  
Complete list of failure cases and corresponding user-visible behavior.

---

## Completion Criteria

The vertical slice plan is considered complete when:

- All phases have explicit exit conditions
- No phase requires memory of future phases
- Execution can begin without architectural decisions

Execution does not begin until explicitly authorized.
