document.addEventListener("DOMContentLoaded", () => {
  const messagesDiv = document.getElementById("messages");
  const input = document.getElementById("input");
  const sendButton = document.getElementById("send");
  const newConversationButton = document.getElementById("newConversation");
  const conversationListDiv = document.getElementById("conversationList");
  const renameConversationButton = document.getElementById("renameConversation");

  let conversationId = localStorage.getItem("conversationId");
  let activeConversationId = conversationId;

  async function startConversation() {
    const res = await fetch("http://localhost:3000/conversations", {
      method: "POST",
    });
    const convo = await res.json();
    conversationId = convo.id;
    activeConversationId = convo.id;
    localStorage.setItem("conversationId", conversationId);
  }

  function clearUI() {
    messagesDiv.innerHTML = "";
    input.value = "";
  }

  async function startNewConversation() {
    await startConversation();
    clearUI();
    refreshConversationList();
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
        msg.role === "user"
          ? `You: ${msg.content}`
          : `Assistant: ${msg.content}`;
      messagesDiv.appendChild(msgDiv);
    }
  }

  async function sendMessage() {
    const content = input.value;
    if (!content) return;

    if (!conversationId) {
      await startConversation();
    }

    const userDiv = document.createElement("div");
    userDiv.textContent = `You: ${content}`;
    messagesDiv.appendChild(userDiv);

    const res = await fetch(
      `http://localhost:3000/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "user", content }),
      }
    );

    const msg = await res.json();

    const assistantDiv = document.createElement("div");
    assistantDiv.textContent = `Assistant: ${msg.content}`;
    messagesDiv.appendChild(assistantDiv);

    input.value = "";
    refreshConversationList();
  }

  function formatConversationDate(convo) {
    const iso = convo.updated_at || convo.created_at;
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString();
  }

  async function renameConversation(id) {
    const newTitle = window.prompt("Enter new conversation title:");
    if (!newTitle) return;

    const res = await fetch(`http://localhost:3000/conversations/${id}/rename`, { 
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    
    if (res.ok) {
      await refreshConversationList();
    }
  }

  async function refreshConversationList() {
    const res = await fetch("http://localhost:3000/conversations");
    const conversations = await res.json();
    renderConversationList(conversations);
  }

  function renderConversationList(conversations) {
    conversationListDiv.innerHTML = "";

    for (const convo of conversations) {
      const row = document.createElement("div");
      row.className = "conversation-row";
      if (convo.id === activeConversationId) {
        row.classList.add("active");
      }

      const titleSpan = document.createElement("span");
      titleSpan.className = "conversation-title";
      titleSpan.textContent = convo.title;

      const dateSpan = document.createElement("span");
      dateSpan.className = "conversation-date";
      dateSpan.textContent = formatConversationDate(convo);

      row.appendChild(titleSpan);
      row.appendChild(dateSpan);

      row.addEventListener("click", async () => {
        activeConversationId = convo.id;
        conversationId = convo.id;
        localStorage.setItem("conversationId", conversationId);
        await loadConversation(convo.id);
        refreshConversationList();
      });

      row.addEventListener("dblclick", async (e) => {
        e.preventDefault();
        await renameConversation(convo.id);
      });

      conversationListDiv.appendChild(row);
    }
  }

  if (conversationId) {
    loadConversation(conversationId);
  }

  sendButton.addEventListener("click", sendMessage);
  newConversationButton.addEventListener("click", startNewConversation);
  renameConversationButton.addEventListener("click", async () => {
    if (activeConversationId) {
      await renameConversation(activeConversationId);
    }
  });

  refreshConversationList();
});
