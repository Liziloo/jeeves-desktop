---
tags:
  - jeeves
  - app-design
  - scope
  - governance
date: 2025-12-26
---

## Purpose (Canonical)

The purpose of this desktop app is to provide a reliable, well-constrained interface to large language models via the OpenAI API in order to amplify **real work**.

The app exists to support user-directed work outcomes (analysis, planning, drafting, transformation, and tool design) under explicit constraints. It is not a venue for showcasing AI capabilities.

---

## Core Principle (Non-Negotiable)

**Interaction constraints are infrastructure, not the mission.**

- Interaction doctrine defines *how* the model behaves.
- This document defines *what the app is for*.
- These layers must never be conflated.

Governance exists only to make work support trustworthy, inspectable, and controllable.

---

## In-Scope Work Support Capabilities

The app is intended to support work that falls into one or more of the following capability categories:

### 1. Analysis & Reasoning Support
- Interpreting and analyzing user-provided material
- Comparing alternatives, tradeoffs, and hypotheses
- Producing decision-oriented reasoning under declared constraints

### 2. Drafting & Transformation
- Producing drafts in user-specified formats
- Editing, rewriting, restructuring, and summarizing user-provided text
- Transforming inputs into structured outputs (e.g., tables, outlines, JSON/CSV) when explicitly requested

### 3. Organization & Artifact Production
- Producing durable artifacts suitable for external systems (notes, checklists, templates, plans)
- Maintaining internal consistency within a user-specified artifact set provided in the session
- Creating outputs intended for later reuse and iteration

### 4. Micro-Tool Design Support
- Assisting with the design of small, purpose-built tools and scripts
- Reasoning about data structures, edge cases, and interfaces
- Generating implementation-ready specifications when the user explicitly enters execution

### 5. Resource Discovery & Synthesis
- Identifying candidate external resources when explicitly requested
- Synthesizing and comparing sources after they are provided or retrieved
- Supporting user decision-making without presuming universal “best practices”

---

## Explicit Non-Goals

The desktop app is **not** intended to:

- Be a general conversational companion
- Replace specialized domain software or databases
- Perform bulk data processing autonomously
- Act independently or make decisions on a user’s behalf
- Hide assumptions, context, or state from the user
- Serve as a showcase for advanced or cutting-edge AI features

---

## Scope Guardrail

When evaluating any future design decision, feature, or behavior, the following question must be answerable in the affirmative:

> “Does this directly support user-directed real work via one or more in-scope capability categories above?”

If the primary justification is instead:
- “to manage model failure modes,” or
- “because the model behaves better this way,”

then the decision belongs in **interaction doctrine or infrastructure**, not in app purpose.

---

## Status

This document defines **locked scope**.  
Changes to it should be rare, explicit, and intentional, as they redefine the app’s reason for existence.
