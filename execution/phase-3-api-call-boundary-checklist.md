# Phase 3 — API Call Boundary (Thin)  
**Execution Checklist**

## Status
Execution checklist.  
No retries, no fallbacks, no side effects beyond the API call itself.

---

## Purpose

Implement a **single, narrow boundary** where the OpenAI API is invoked, such that:

- the only model-facing input is the fully assembled prompt,
- all failures are terminal and explicit,
- no retries or parameter mutation occur,
- and no persistence or state mutation happens here.

This phase assumes Phases 1 and 2 are complete.

---

## Preconditions (Must Already Be True)

- Phase 1 — Artifact Loader is complete.
- Phase 2 — Prompt Assembly is complete.
- A single `finalPrompt : string` is produced deterministically.
- Artifact versions used for the request are known.

If any precondition fails → STOP.

---

## Checklist Items

### 1. Declare the Single API Call Site

- [ ] Identify or create **exactly one module/function** responsible for calling OpenAI.
- [ ] Ensure no other code path calls the OpenAI client directly.
- [ ] Enforce this boundary structurally (imports, visibility, or convention).

**Stop condition:**  
There is exactly one OpenAI call path in the codebase.

---

### 2. Lock the Supported API Surface

- [ ] Select the **Responses API** as the canonical interface.
- [ ] If legacy APIs exist, route them *only* through this boundary.
- [ ] Do not expose multiple client implementations.

**Stop condition:**  
All OpenAI calls converge on this boundary.

---

### 3. Define Explicit Inputs

The API boundary may accept **only**:

- [ ] `model` (explicit, no defaults)
- [ ] `finalPrompt` (string)
- [ ] optional `image_inputs` (only if explicitly supplied)
- [ ] whitelisted generation controls (e.g. `temperature`, `top_p`)
- [ ] trace context:
  - artifact versions
  - conversation/request id

Prohibited inputs:
- conversation history
- raw user messages
- artifacts as separate fields
- inferred or global state

**Stop condition:**  
All inputs are explicit and passed in by the caller.

---

### 4. Construct the API Request Deterministically

- [ ] Build the request payload directly from declared inputs.
- [ ] Do not alter parameters dynamically.
- [ ] Do not inject defaults implicitly.
- [ ] Do not branch on task content or scope here.

**Stop condition:**  
Given identical inputs, the request payload is identical.

---

### 5. Enforce No-Retry / No-Fallback Rule

- [ ] Disable or avoid automatic retries.
- [ ] Do not switch models on failure.
- [ ] Do not mutate parameters and reattempt.

**Failure behavior:**  
Any API failure immediately returns a terminal error.

**Stop condition:**  
One request → one outcome.

---

### 6. Handle API Errors Explicitly

On API failure:

- [ ] Classify error minimally:
  - transport/auth/rate
  - request invalid
- [ ] Return a terminal failure object upward.
- [ ] Do not catch-and-continue.

Do not:
- swallow errors
- log prompt content
- attempt recovery

**Stop condition:**  
Errors are explicit and propagate upward unchanged.

---

### 7. Define Output Contract

On success, return **only**:

- [ ] assistant-visible output text
- [ ] minimal metadata:
  - model used
  - artifact versions
  - request id (if available)

Do not return:
- full API response objects
- prompt text
- tokens or logprobs (unless explicitly required later)

**Stop condition:**  
Downstream code receives no raw API internals.

---

### 8. Logging Constraints (Minimal)

If logging is enabled:

- [ ] Log only:
  - timestamp
  - model
  - artifact versions
  - success/failure code
- [ ] Do not log:
  - prompt text
  - user content
  - conversation history

**Stop condition:**  
Logs cannot reconstruct a prompt.

---

## Explicit Non-Responsibilities (Verify None Are Added)

The API boundary must **not**:

- assemble prompts
- enforce scope
- interpret ambiguity or uncertainty
- persist conversations
- update rehydration state
- perform retries or fallbacks

If any occur → STOP and revert.

---

## Phase 3 Completion Criteria

Phase 3 is complete when:

- There is exactly one OpenAI call boundary.
- All inputs and outputs are explicit.
- All failures are terminal and unambiguous.
- No persistence or hidden behavior exists at this layer.

Only after this may Phase 4 execution begin.

---

## Next Phase (Locked)

**Phase 4 — Persistence Hygiene**  
May not begin until Phase 3 is complete.
