# Vertical Slice Execution Plan — Artifact-Driven Runtime

## Status
**Planning complete. Execution not yet begun.**

This directory contains the complete, planning-only runbook for implementing
a minimal vertical slice of the artifact-driven runtime for the desktop app.

All documents here are:
- non-executing
- stop-safe
- resumable
- mutually consistent
- authoritative for execution planning

No code should be written until execution is explicitly authorized.

---

## Purpose

The purpose of this vertical slice is to:

- prove the artifact model end-to-end
- enforce strict runtime boundaries
- eliminate implicit state, narrative governance, and leakage
- validate that the system can hard-stop safely

This is **not** a feature implementation.
This is **infrastructure correctness**.

---

## Structure

Execution is decomposed into **six linear phases**.
Each phase is atomic and independently verifiable.

| Phase | Document | Scope |
|------:|---------|-------|
| 0 | `00-preconditions.md` | Verify artifacts and directory boundaries |
| 1 | `01-artifact-loader.md` | Artifact loading & validation (read-only) |
| 2 | `02-prompt-assembly.md` | Pure prompt assembly rules |
| 3 | `03-api-boundary.md` | Single OpenAI API call boundary |
| 4 | `04-persistence-hygiene.md` | Persistence vs non-persistence rules |
| 5 | `05-failure-semantics.md` | Terminal failure cases & outcomes |

Phases must be addressed **in order**.

---

## Governing Principles

- **Artifacts are infrastructure, not content**
- **Incorrect refusal is better than incorrect execution**
- **Conversation history is data, not state**
- **No implicit compilation**
- **No narrative governance at runtime**

Any deviation from these principles is a design regression.

---

## What This Plan Does *Not* Do

This plan does not:
- redesign the app
- add features
- optimize UX
- introduce memory
- loosen refusal rules
- generalize routing
- permit shortcuts

Those may come later, if explicitly authorized.

---

## Transition to Execution

When you are ready to move forward, execution must proceed as:

1. **Phase-by-phase execution checklists**
2. One checklist item at a time
3. Explicit GO / STOP points
4. No skipping, batching, or improvisation

The first execution artifact will be:

execution/phase-1-artifact-loader-checklist.md


No execution begins without that checklist.

---

## Canonical Boundary

If behavior during execution contradicts *any* document in this directory,
execution must stop and return to planning.

This directory is the authoritative planning source for the vertical slice.
