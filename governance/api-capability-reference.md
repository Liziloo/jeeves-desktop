---
tags:
  - jeeves
  - api
  - openai
  - constraints
  - reference
date: 2025-12-26
---

## Purpose of This Document

This document defines the **authoritative reference for OpenAI API capabilities and constraints** relevant to the desktop app.

Its purpose is to:
- prevent false assumptions about what the API or models can do,
- provide a decision-grade basis for app design and routing,
- serve as an injectable, rehydratable reference in future conversations,
- and constrain both human and model reasoning to **documented reality**.

This is a **reference document**, not a policy or recommendation.

---

## Scope

This document covers only:

- **Documented OpenAI API behavior**
- **Documented model capabilities and limits**
- **Documented configuration surfaces**

It applies specifically to the following models, selected for cost-efficiency and suitability to the app’s goals:

- `gpt-4.1-nano`
- `gpt-4.1-mini`
- `gpt-4o-mini`

---

## Explicit Non-Goals

This document does **not**:

- recommend a “best” model,
- define default routing logic,
- speculate about undocumented behavior,
- infer capabilities from other models,
- or describe ChatGPT-specific features unless explicitly documented for the API.

Any capability not listed here should be treated as **unsupported or uncertain**.

---

## API Ground Rules (Canonical)

- The OpenAI API is **stateless**.
- Models have **no durable semantic memory** across calls.
- All context the model is expected to use must be supplied explicitly in each request.
- Platform features such as **prompt caching** optimize cost and latency only; they do **not** provide semantic continuity.

---

## Model Capability Reference

### gpt-4.1-nano

**Capabilities**
- **Modalities (API):** Text in/out; image input only; audio/video not supported
- **Tool / function calling:** Supported
- **Structured outputs:** Supported (schema-enforced via Structured Outputs when used)

**Limits**
- **Context window (documented):** 1,047,576 tokens
- **Max output tokens (documented):** 32,768 tokens

**Generation controls (documented, Responses API)**
- `temperature`
- `top_p`
- `top_logprobs`
- **Reasoning controls:** `reasoning` request field is **for gpt-5 and o-series only** → not applicable

**Constraints / signals**
- **Known parameter incompatibilities / error conditions:** None explicitly documented (**uncertain / requires testing**)
- **Pricing (standard):**
  - $0.10 / 1M input tokens
  - $0.03 / 1M cached input tokens
  - $0.40 / 1M output tokens
- **Snapshots / stability signals:** Snapshots listed (e.g. `gpt-4.1-nano-2025-04-14`)
- **Deprecation / stability:** Not labeled “Deprecated” on the Models index (**no deprecation signal found**)

---

### gpt-4.1-mini

**Capabilities**
- **Modalities (API):** Text in/out; image input only; audio/video not supported
- **Tool / function calling:** Supported
- **Structured outputs:** Supported (schema-enforced via Structured Outputs when used)

**Limits**
- **Context window (documented):** 1,047,576 tokens
- **Max output tokens (documented):** 32,768 tokens

**Generation controls (documented, Responses API)**
- `temperature`
- `top_p`
- `top_logprobs`
- **Reasoning controls:** `reasoning` request field is **for gpt-5 and o-series only** → not applicable

**Constraints / signals**
- **Known parameter incompatibilities / error conditions:** None explicitly documented (**uncertain / requires testing**)
- **Pricing (standard):**
  - $0.40 / 1M input tokens
  - $0.10 / 1M cached input tokens
  - $1.60 / 1M output tokens
- **Snapshots / stability signals:** Snapshots listed (e.g. `gpt-4.1-mini-2025-04-14`)
- **Deprecation / stability:** Not labeled “Deprecated” on the Models index (**no deprecation signal found**)

---

### gpt-4o-mini

**Capabilities**
- **Modalities (API):** Text in/out; image input only; audio/video not supported (per model page)
- **Tool / function calling:** Supported
- **Structured outputs:** Supported (model page explicitly states Structured Outputs)

**Limits**
- **Context window (documented):** 128,000 tokens
- **Max output tokens (documented):** 16,384 tokens

**Generation controls (documented, Responses API)**
- `temperature`
- `top_p`
- `top_logprobs`
- **Reasoning controls:** `reasoning` request field is **for gpt-5 and o-series only** → not applicable

**Constraints / signals**
- **Known parameter incompatibilities / error conditions:** None explicitly documented (**uncertain / requires testing**)
- **Pricing (standard):**
  - $0.15 / 1M input tokens
  - $0.075 / 1M cached input tokens
  - $0.60 / 1M output tokens
- **Snapshots / stability signals:** Snapshots listed (model page indicates snapshot / alias list)
- **Deprecation / stability:** Not labeled “Deprecated” on the Models index (**no deprecation signal found**)

---

## Status

This document is a **locked reference artifact**.

It should be updated only when:
- OpenAI documentation changes materially, or
- a model is deprecated, replaced, or re-priced.

Any update must preserve the distinction between:
- documented guarantees,
- uncertainty,
- and non-goals.
