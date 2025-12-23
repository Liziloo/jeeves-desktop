require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cors = require("cors");
const OpenAI = require("openai");
const systemPrompt = require("./systemPrompt");

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY not set");
}

const MODEL = "gpt-4.1-mini";
const TEMPERATURE = 0.2;

// Max context to send
const CONTEXT_MAX_MESSAGES = 20;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function buildSystemPrompt(prompt_profile) {
  if (!prompt_profile) {
    throw new Error("prompt_profile is required");
  }

  return systemPrompt;
}

async function getAIResponse(
  conversationId,
  upToTimestamp,
  options,
  directMessages = null
) {
  const { prompt_profile, active_mode, task_type, available_tools } =
    options || {};

  if (!prompt_profile) {
    throw new Error("prompt_profile is required");
  }

  const historyMessages = directMessages
    ? directMessages
    : store.messages
        .filter(
          (m) =>
            m.conversation_id === conversationId && m.timestamp <= upToTimestamp
        )
        .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
        .slice(-CONTEXT_MAX_MESSAGES)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

  const messages = [
    {
      role: "system",
      content: buildSystemPrompt(prompt_profile),
    },
    ...historyMessages,
  ];

  const payload = {
    model: MODEL,
    temperature: TEMPERATURE,
    messages,
  };

  if (active_mode) payload.active_mode = active_mode;
  if (task_type) payload.task_type = task_type;
  if (available_tools) payload.available_tools = available_tools;

  const response = await openai.chat.completions.create(payload);

  return response.choices[0].message.content;
}

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(cors({ origin: "*" }));

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "conversations.json");

let store = {
  conversations: [],
  messages: [],
};

function loadStore() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
    return;
  }

  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  store = JSON.parse(raw);
}

function saveStore() {
  const tmp = DATA_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(store, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// List conversations (title + date)
app.get("/conversations", (req, res) => {
  const conversations = [...store.conversations].sort((a, b) => {
    const ad = a.updated_at || a.created_at;
    const bd = b.updated_at || b.created_at;
    return bd.localeCompare(ad);
  });

  res.json(conversations);
});

app.post("/quick-ask", async (req, res) => {
  const { content, taskType, targetLanguage } = req.body;

  if (typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "invalid content" });
  }

  const TASKTYPE_TO_MODE = {
    general: "Mode 1 — Neutral Analytical",
    search: "Mode 7 — Practical Solutions",
    summarize: "Mode 1 — Neutral Analytical",
    translate: "Mode 4 — Constraint-Execution",
    explain_code: "Mode 3 — Code-First Analytical",
    rewrite: "Mode 4 — Constraint-Execution",
    check_logic: "Mode 1 — Neutral Analytical",
  };

  const activeMode = TASKTYPE_TO_MODE[taskType];
  if (!activeMode) {
    return res.status(400).json({ error: "unsupported taskType" });
  }

  if (taskType === "translate" && !targetLanguage) {
    return res.status(400).json({ error: "targetLanguage required" });
  }

  const instruction =
    taskType === "general"
      ? "instruction: Answer the user's question directly.\n"
      : "";

  const systemContextMessage = {
    role: "system",
    content:
      `SYSTEM CONTEXT\n` +
      `prompt_profile: quick_ask\n` +
      `task_type: ${taskType}\n` +
      `active_mode: ${activeMode}\n` +
      instruction +
      (taskType === "translate" ? `target_language: ${targetLanguage}\n` : "") +
      `available_tools: []\n`,
  };

  let aiText;
  try {
    aiText = await getAIResponse(null, null, { prompt_profile: "quick_ask" }, [
      systemContextMessage,
      { role: "user", content },
    ]);
  } catch (err) {
    console.error("AI error:", err);
    return res.status(500).json({ error: "AI request failed" });
  }

  return res.json({ content: aiText });
});


app.post("/conversations", async (req, res) => {
  const now = new Date().toISOString();
  const conversation = {
    id: crypto.randomUUID(),
    title: "New Conversation",
    created_at: now,
    updated_at: now,
  };

  store.conversations.push(conversation);
  saveStore();

  res.json(conversation);
});

app.post("/conversations/:id/messages", async (req, res) => {
  const { role, content } = req.body;

  if (!["user", "assistant"].includes(role) || typeof content !== "string") {
    return res.status(400).json({ error: "invalid role or content" });
  }

  const conversation = store.conversations.find((c) => c.id === req.params.id);

  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  const userMessage = {
    conversation_id: conversation.id,
    role,
    content,
    timestamp: new Date().toISOString(),
  };

  store.messages.push(userMessage);
  conversation.updated_at = userMessage.timestamp;
  saveStore();

  // Phase 4: AI response ONLY when user sends message
  if (role === "user") {

    let aiText;
    try {
      aiText = await getAIResponse(conversation.id, userMessage.timestamp, {
        prompt_profile: "conversation",
      });
    } catch (err) {
      console.error("AI error:", err);
      return res.status(500).json({ error: "AI request failed" });
    }


    const assistantMessage = {
      conversation_id: conversation.id,
      role: "assistant",
      content: aiText,
      timestamp: new Date().toISOString(),
    };

    store.messages.push(assistantMessage);
    conversation.updated_at = assistantMessage.timestamp;
    saveStore();

    return res.json(assistantMessage);
  }

  // Fallback (not used by UI)
  res.json(userMessage);
});

app.get("/conversations/:id", (req, res) => {
  const conversation = store.conversations.find((c) => c.id === req.params.id);

  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  const messages = store.messages.filter(
    (m) => m.conversation_id === conversation.id
  );

  res.json({ conversation, messages });
});

// Rename conversation
app.patch("/conversations/:id/rename", (req, res) => {
  const title =
    typeof req.body?.title === "string" ? req.body.title.trim() : "";

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const conversation = store.conversations.find((c) => c.id === req.params.id);

  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  conversation.title = title;
  conversation.updated_at = new Date().toISOString();
  saveStore();

  res.json(conversation);
});

loadStore();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
