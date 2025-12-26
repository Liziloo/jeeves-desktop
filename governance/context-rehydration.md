---
tags:
  - jeeves
  - context
  - rehydration
  - governance
  - stateless-design
date: 2025-12-26
---

## Purpose of This Document

This document defines how **context, continuity, and personalization** are handled in the desktop app **without relying on model memory**.

Its purpose is to:
- enable long-lived projects across short-lived AI sessions,
- preserve relevant state while shedding conversational entropy,
- support calibrated personalization within cost constraints,
- and prevent silent drift, hidden assumptions, or accidental “memory.”

This document governs **what context exists, where it lives, and when it is injected**.

---

## Core Principle

**All continuity is explicit.**

The model has no durable semantic memory.  
Any apparent continuity is produced by **deliberate reintroduction of context** by the application or the user.

---

## Context Taxonomy (Canonical)

All context used by the app falls into **exactly three categories**.

No other category of context is permitted.

---

### 1. Project Context

**Definition:**  
Information that defines the enduring state of a specific project or body of work.

**Examples:**
- project goals and scope
- domain-specific assumptions
- reference materials or canonical artifacts
- decisions that are considered “locked” for the project

**Properties:**
- Long-lived
- Stable across sessions
- Explicitly curated
- Stored externally to the model

**Injection Rules:**
- Injected at session start or rehydration
- Updated only by explicit user action
- Not implicitly modified by the model

---

### 2. Session-Derived Context

**Definition:**  
Context that emerges during a single work session and may or may not remain relevant later.

**Examples:**
- tentative conclusions
- explored options
- unresolved questions
- current interaction phase (exploration / convergence / execution)

**Properties:**
- Short-lived
- Disposable by default
- Becomes durable only if promoted

**Injection Rules:**
- Included in rehydration prompts when explicitly requested
- Must be reviewed and edited by the user before reuse
- Never carried forward automatically

---

### 3. Stable User-Model Context

**Definition:**  
A structured representation of **Liz’s stable constraints, resources, capabilities, and preferences** that materially affect reasoning.

This is **not memory**.  
It is a **user-authored or user-approved artifact**.

**Examples:**
- budget sensitivity
- available tools and software
- health, energy, or time constraints
- skill levels relevant to tasks
- household or collaborator context

**Properties:**
- Broad in scope
- Stable but editable
- Human-readable and inspectable
- Stored outside the model

**Injection Rules:**
- Injected selectively, not by default
- Included only when relevant to the current task
- Never inferred or updated silently by the model

---

## Rehydration Prompt (First-Class Artifact)

A **rehydration prompt** is the primary mechanism for safe continuity.

### Mode Neutrality Requirement

A rehydration prompt must be **mode-neutral**.

It may:
- describe the intended phase of work,
- name the mode(s) expected to be used later,
- specify evaluation order or constraints.

It must not:
- activate a mode,
- declare a mode as currently active,
- or issue instructions that would cause an immediate mode switch.

Mode activation must always be performed by an explicit user action outside the rehydration prompt.


### What a Rehydration Prompt Is
- A **state vector**, not a narrative summary
- A bridge between sessions
- A way to discard conversational noise while preserving intent

### What It Must Capture
- Locked project decisions
- Open questions or forks
- Current interaction phase
- Active interaction constraints or overlays
- Relevant session-derived context
- References to any injected user-model context

### What It Must Not Be
- Prose-heavy
- Auto-generated without review
- A complete replay of prior conversation
- A substitute for project context artifacts

---

## Injection Strategy (Cost-Aware)

Because the API is stateless and token-costed:

- **Project context** is injected sparingly and deliberately
- **Session-derived context** is injected only via rehydration
- **User-model context** is injected only when it materially affects reasoning

Most API calls include:
- interaction doctrine
- immediate task input

Only some calls include:
- project context
- user-model facets

This selective injection is required to remain within budget.

Context injection is governed by **event type**, not UI convenience.

The application distinguishes:
- session initialization / rehydration events
- per-run execution events
- The default state of any new session or run is **no optional context selected**.
    
Optional context is eligible for injection **only** during these events and **only** by explicit user action. A _per-run execution event_ is a user-initiated request that sends an API call.

Before any execution request is sent, the user must be able to review which context artifacts will be injected for that run.

---

## Prohibited Mechanisms

The app must not:
- rely on conversational history as implicit state
- rely on or assume semantic memory across API calls
- update user or project context without explicit user action
- infer stable user traits from behavior alone
- depend on platform-level caching for semantic continuity

---

## Relationship to Other Documents

- **Document A (Purpose & Task Scope):** defines *why* the app exists
- **Document B (Interaction Doctrine):** defines *how* the model behaves
- **Document C (API Capability & Constraints):** defines *what is possible*
- **This document:** defines *how continuity is achieved safely*

No document supersedes this one on matters of context persistence.

---

## Status

This document defines **locked rules for context and rehydration**.

Any change to these rules materially alters:
- correctness
- cost behavior
- and long-term usability

Modifications must therefore be explicit, deliberate, and versioned.
