---
tags:
  - jeeves
  - governance
  - runtime-artifacts
  - prompt-compilation
  - determinism
date: 2025-12-26
---

## Purpose

This document specifies **what runtime artifacts exist** and **how they are compiled into API prompts**.

It explicitly distinguishes:
- **Design-time governance sources** (Documents A–D), from
- **Runtime artifacts** (what the model actually sees).

No design-time document is injected verbatim unless explicitly stated here.

---

## Core Principle

**Runtime prompts contain artifacts, not governance documents.**

Design-time documents define intent and rules.  
Runtime artifacts are **derived, minimal, and purpose-built** for model execution.

---

## Design-Time Sources (Not Injected)

The following documents are **authoritative sources only**:

- **Document A — Purpose & Task Scope**
- **Document B — Interaction Doctrine (Canonical)**
- **Document C — API Capability & Constraints Reference**
- **Document D — Context & Rehydration Model**

They are used to **derive** runtime artifacts but are **not themselves runtime artifacts**.

---

## Runtime Artifacts (Canonical)

Only the following artifacts may appear in runtime prompts.

No others are permitted.

---

### Artifact 1 — Unified Behavior Prompt (UBP)

**Derived from:** Document B  
**Purpose:** Enforce interaction doctrine and mode behavior

**Properties:**
- Stable, imperative, model-facing
- Versioned
- Minimal (no design rationale)

**Inclusion Rules:**
- Included in **every governed API call**
- Always appears at the top of the prompt

**Notes:**
- This is the compiled form of Document B
- Document B itself is never injected

---

### Artifact 2 — Scope Guardrail (Optional)

**Derived from:** Document A  
**Purpose:** Prevent task-purpose drift when relevant

**Properties:**
- 1–2 sentences max
- Task-agnostic framing
- Stable wording

**Inclusion Rules:**
- Included only when:
  - starting a new session, or
  - scope confusion is likely or detected
- Omitted from routine calls

**Notes:**
- Document A itself is never injected

---

### Artifact 3 — Rehydration Prompt

**Derived from:** Document D + session output  
**Purpose:** Restore state safely after context loss

**Properties:**
- Structured state vector
- Explicitly user-reviewed
- No narrative prose

**Must Contain:**
- Locked decisions
- Open questions
- Current phase
- Active constraints
- References to any injected user-model context

**Inclusion Rules:**
- Included only on:
  - session initialization, or
  - explicit rehydration events

**Notes:**
- Document D defines *what* this looks like
- The rehydration prompt is the runtime artifact

---

### Artifact 4 — User-Model Context Slice (Optional)

**Derived from:** Stable User-Model Context (per Document D)  
**Purpose:** Calibrate reasoning based on Liz’s real constraints

**Properties:**
- Explicit
- Inspectable
- Task-relevant subset only

**Inclusion Rules:**
- Included only when it materially affects reasoning
- Never inferred
- Never updated silently

**Notes:**
- This is a *slice*, not the full user model

---

### Artifact 5 — Constraint Excerpt (Rare)

**Derived from:** Document C  
**Purpose:** Prevent hallucinated API capabilities in edge cases

**Properties:**
- Narrow, model- or feature-specific
- Quoted or paraphrased from documentation
- Clearly marked as a constraint

**Inclusion Rules:**
- Included only for:
  - API feasibility discussions
  - routing or cost design
- Omitted from normal reasoning calls

**Notes:**
- Document C itself is not injected

---

### Artifact 6 — Immediate Task Input

**Purpose:** Define the user’s current request

**Properties:**
- Explicit
- Self-contained
- Phase-appropriate

**Inclusion Rules:**
- Included in every call
- Always last in the prompt

---

## Prompt Assembly Order (Strict)

When included, runtime artifacts must appear in this order:

1. **Unified Behavior Prompt**
2. **Scope Guardrail** (if included)
3. **Rehydration Prompt** (if included)
4. **User-Model Context Slice** (if included)
5. **Constraint Excerpt** (if included)
6. **Immediate Task Input**

This order must not change.

---

## Delimiters

Each artifact must be wrapped with stable markers:

=== BEGIN <ARTIFACT NAME> ===  
<artifact content>  
=== END <ARTIFACT NAME> ===


Artifact names must be exact and version-stable.

---

## Prohibited Runtime Content

Runtime prompts must not include:

- full governance documents,
- design rationale or commentary,
- capability tables,
- implicit references to prior calls,
- or reliance on conversational memory.

---

## Versioning

Each runtime prompt must include:
- a **UBP version identifier**
- optional artifact version identifiers

Versions change only when source documents change.

---

## Status

This document defines **locked runtime compilation rules**.

If runtime behavior drifts, the cause must be:
- a change to a runtime artifact, or
- a change to its derivation source.

Both must be explicit and traceable.
