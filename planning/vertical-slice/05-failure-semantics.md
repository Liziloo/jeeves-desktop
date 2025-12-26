# Phase 5 — Failure Semantics

## Purpose
Enumerate all terminal failure cases and define user-visible outcomes.

---

## Failure Cases

F1: Missing artifact  
F2: Artifact version mismatch  
F3: Artifact delimiter failure  
F4: Filesystem read error  
F5: Scope violation  
F6: Ambiguity gate triggered  
F7: Uncertainty gate triggered  
F8: Mode incompatibility  
F9: API transport/auth/rate error  
F10: API request invalid  
F11: Persistence write failure

---

## Rules

- All failures are terminal
- No retries
- No fallbacks
- No “best effort” continuation

---

## User-Visible Outcomes

- Minimal, specific notices only
- No rationale or explanations
- No artifact leakage

---

## Persistence Rules

- Only user-visible assistant output is persisted
- No runtime artifacts are stored

---

## Exit Condition

Every failure case has:
- a stop point
- a defined user-visible outcome
- no ambiguity
