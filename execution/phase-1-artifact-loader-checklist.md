# Phase 1 — Artifact Loader (Execution Checklist)

## Status
Execution checklist.  
No code may be written beyond the scope of each checklist item.

---

## Purpose

Implement a **read-only artifact loader** that:
- locates compiled runtime artifacts,
- validates their presence, version, and integrity,
- hard-stops on any violation,
- and returns artifact text only.

This loader must complete **before** any prompt assembly or API call.

---

## Preconditions (Must Already Be True)

- `/artifacts/` directory exists.
- Compiled artifacts exist on disk:
  - `UBP-1.0.0.txt`
  - `SG-1.0.0.txt`
  - `RP-1.0.0.txt`
  - `ITI-1.0.0.txt`
- No execution code currently depends on dynamic prompt assembly.

If any precondition fails → STOP.

---

## Checklist Items

### 1. Declare Artifact Paths (No IO Yet)

- [ ] Identify the **absolute or repo-relative paths** for:
  - UBP
  - SG
  - RP
  - ITI
- [ ] Centralize these paths in **one location only** (config or constant).
- [ ] Do not infer versions from directory contents.

**Stop condition:**  
You can point to exactly one place in code where artifact paths are defined.

---

### 2. Define Required vs Conditional Artifacts

- [ ] Mark **always required**:
  - UBP
  - SG
- [ ] Mark **conditionally required**:
  - RP (rehydration flag = true)
  - ITI (task-present flag = true)
- [ ] Define a single boolean input for each condition.

**Stop condition:**  
Given a runtime config, you can answer “which artifacts are required?” without ambiguity.

---

### 3. Implement Read-Only Load Operation

- [ ] Read artifact files **as raw text**.
- [ ] Do not modify content.
- [ ] Do not trim whitespace.
- [ ] Do not parse beyond delimiter checks (next step).

**Constraints:**
- No writes
- No caching
- No persistence
- No side effects

**Stop condition:**  
Loader returns raw strings or throws a terminal error.

---

### 4. Enforce Version Authority

- [ ] Treat version as authoritative in the filename.
- [ ] Reject any artifact whose filename does not match the expected version exactly.
- [ ] Do not support:
  - `latest`
  - ranges
  - fallbacks
  - aliasing

**Failure behavior:**  
Hard stop with explicit error: `Artifact version mismatch`.

**Stop condition:**  
A mismatched version cannot reach prompt assembly.

---

### 5. Validate Delimiter Integrity

For each loaded artifact:

- [ ] Verify presence of:
  - `=== BEGIN <ARTIFACT NAME> v<version> ===`
  - `=== END <ARTIFACT NAME> v<version> ===`
- [ ] Verify names and versions match filename.
- [ ] Do not parse internal content.

**Failure behavior:**  
Hard stop with explicit error: `Invalid artifact format`.

**Stop condition:**  
Malformed artifacts cannot proceed.

---

### 6. Enforce Missing Artifact Hard Stop

- [ ] If a **required artifact** is missing:
  - stop immediately
  - return explicit failure reason
- [ ] Do not attempt partial loading.

**Failure behavior:**  
Hard stop with explicit error: `Missing required artifact`.

**Stop condition:**  
No partial artifact sets exist.

---

### 7. Filesystem Error Handling

- [ ] Treat filesystem errors as terminal:
  - permission denied
  - file not found
  - IO error
- [ ] Surface the error category only (no stack traces).

**Failure behavior:**  
Hard stop with explicit error: `Artifact read error`.

**Stop condition:**  
IO failure cannot be silently ignored.

---

### 8. Return Contract

- [ ] Return artifacts as an **ordered map**:
  - `{ artifact_name → artifact_text }`
- [ ] Preserve load order **separately** from assembly order.
- [ ] Do not return:
  - prompt text
  - metadata beyond artifact identity

**Stop condition:**  
The loader output is pure data, not behavior.

---

## Explicit Non-Responsibilities (Verify None Are Added)

The artifact loader must **not**:

- assemble prompts
- inspect task content
- enforce scope
- call the API
- persist conversations
- log artifact contents

If any of these occur → STOP and revert.

---

## Phase 1 Completion Criteria

Phase 1 is complete when:

- Missing or malformed artifacts always cause a hard stop.
- Artifact text can reach the next phase **only** if fully validated.
- No artifact content is persisted or modified.
- There is exactly **one artifact loader** in the codebase.

Only after this may Phase 2 execution begin.

---

## Next Phase (Locked)

**Phase 2 — Prompt Assembly Function (Pure)**  
May not begin until Phase 1 is complete.
