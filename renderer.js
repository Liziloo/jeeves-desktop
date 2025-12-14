const messagesDiv = document.getElementById("messages");
const input = document.getElementById("input");
const sendButton = document.getElementById("send");

let conversationId = localStorage.getItem("conversationId");

// 1) Load persisted UI state
async function startConversation() {
  const res = await fetch("http://localhost:3000/conversations", {
    method: "POST",
  });
  const convo = await res.json();
  conversationId = convo.id;
  localStorage.setItem("conversationId", conversationId);
}

async function loadConversation(id) {
  const res = await fetch(`http://localhost:3000/conversations/${id}`);
  if (!res.ok) {
    localStorage.removeItem("conversationId");
    conversationId = null;
    return;
  }

  const data = await res.json();
  messagesDiv.innerHTML = "";

  for (const msg of data.messages) {
    const msgDiv = document.createElement("div");
    msgDiv.textContent =
      msg.role === "user" ? `You: ${msg.content}` : `Assistant: ${msg.content}`;
    messagesDiv.appendChild(msgDiv);
  }
}


async function sendMessage() {
  const content = input.value;
  if (!content) return;

  if (!conversationId) {
    await startConversation();
  }

  const res = await fetch(
    `http://localhost:3000/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "user", content }),
    }
  );

  const msg = await res.json();

  const msgDiv = document.createElement("div");
  msgDiv.textContent = `You: ${msg.content}`;
  messagesDiv.appendChild(msgDiv);

  input.value = "";
}

if (conversationId) {
  loadConversation(conversationId);
}

sendButton.addEventListener("click", sendMessage);
