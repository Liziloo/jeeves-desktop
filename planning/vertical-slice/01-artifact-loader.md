# Phase 1 — Artifact Loader (Read-Only Planning)

## Purpose
Define a deterministic, read-only mechanism for locating, loading, validating, and failing on runtime artifacts before prompt assembly.

---

## Artifact Source of Truth

- Filesystem only
- Repo-local
- Compiled artifacts only (`/artifacts/**`)
- Governance documents are explicitly excluded

---

## Required Artifact Set

Always required:
- UBP-1.0.0
- SG-1.0.0

Conditionally required:
- RP-1.0.0 (rehydrated sessions only)
- ITI-1.0.0 (task-present sessions only)

Missing required artifact ⇒ hard stop.

---

## Version Resolution Rules

- Version is authoritative in filename
- Exact version match only
- No `latest`, no ranges, no fallback

Version mismatch ⇒ hard stop.

---

## Delimiter Integrity

Each artifact must contain:
- `=== BEGIN … ===`
- `=== END … ===`
with matching artifact name and version.

Invalid delimiters ⇒ hard stop.

---

## Read-Only Guarantee

The loader:
- reads files
- validates
- returns strings

The loader does not:
- write files
- cache artifacts
- persist content

---

## Failure Semantics

Failures are terminal and explicit:
- missing artifact
- version mismatch
- delimiter failure
- filesystem read error

---

## Exit Condition

It is unambiguous:
- which files are read
- which conditions cause failure
- where version authority lives
