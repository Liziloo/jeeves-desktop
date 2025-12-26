---
tags:
  - jeeves
  - context-injection
  - governance
  - cost-control
date: 2025-12-26
---

## Purpose

This document defines **which canonical documents are injected into model calls, when, and why**.

The goal is to:
- preserve correctness and continuity,
- avoid silent drift,
- and minimize token cost.

Injection rules are **deterministic**.  
No document is injected by implication.

---

## Canonical Documents

- **A — Purpose & Task Scope**
- **B — Interaction Doctrine (Canonical)**
- **C — API Capability & Constraints Reference**
- **D — Context & Rehydration Model**

---

## Injection Rules (Authoritative)

### Document B — Interaction Doctrine (Canonical)
**Injection:** ALWAYS  
**When:** Every model call  
**Granularity:** Full document (or compiled runtime prompt derived from it)

**Rationale:**  
Defines behavioral contract.  
Must never be omitted.

---

### Document A — Purpose & Task Scope
**Injection:** SESSION-START ONLY  
**When:**  
- First call of a new session  
- Explicit rehydration  
- When scope confusion arises

**Granularity:** Full document or short canonical excerpt

**Rationale:**  
Prevents purpose drift.  
Unnecessary for every turn.

---

### Document D — Context & Rehydration Model
**Injection:** ON-DEMAND  
**When:**  
- Rehydration events  
- Discussion of context handling or continuity  
- Debugging state or cost behavior

**Granularity:** Full document for rehydration; excerpt otherwise

**Rationale:**  
Defines *how* continuity works, not day-to-day behavior.

---

### Document C — API Capability & Constraints Reference
**Injection:** CONDITIONAL  
**When:**  
- Discussing API behavior, limits, or feasibility  
- Designing routing, defaults, or escalation logic  
- Evaluating costs or model tradeoffs

**Granularity:**  
- Relevant model section only, unless explicitly requested

**Rationale:**  
Prevents hallucinated capabilities.  
Too heavy for routine reasoning.

---

## Default Call Profiles

### Lightweight Reasoning Call (most common)
Injected:
- B (Interaction Doctrine)

Not injected:
- A, C, D

---

### Session Initialization / Rehydration Call
Injected:
- B (Interaction Doctrine)
- A (Purpose & Task Scope)
- D (Context & Rehydration Model)
- Rehydration prompt (session-derived state)

---

### API Feasibility / Design Call
Injected:
- B (Interaction Doctrine)
- C (Relevant model sections)

Optional:
- A (if scope relevance is unclear)

---

## Prohibited Behaviors

The app must not:
- inject all documents by default,
- rely on conversational history instead of explicit injection,
- inject summaries without marking them as such,
- or silently vary injection rules.

Any deviation from this strategy must be:
- explicit,
- user-visible,
- and reversible.

---

## Status

This document defines **locked injection policy**.

It is the operational bridge between:
- governance (Documents A–D),
- and implementation.

Changes affect correctness and cost and must be versioned.
