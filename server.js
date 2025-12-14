const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cors = require("cors");
const OpenAI = require("openai");


if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY not set");
}

const MODEL = "gpt-4.1-mini";
const TEMPERATURE = 0.2;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getAIResponse(userText) {
  const response = await openai.chat.completions.create({
    model: MODEL,
    temperature: TEMPERATURE,
    messages: [{ role: "user", content: userText }],
  });

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
    const aiText = await getAIResponse(content);

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

loadStore();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
