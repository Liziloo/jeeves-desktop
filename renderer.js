document.addEventListener("DOMContentLoaded", () => {
  const messagesDiv = document.getElementById("messages");
  const input = document.getElementById("input");
  const sendButton = document.getElementById("send");
  const newConversationButton = document.getElementById("newConversation");
  const conversationListDiv = document.getElementById("conversationList");
  const renameConversationButton = document.getElementById("renameConversation");
  const renameDialog = document.getElementById("renameDialog");
  const renameInput = document.getElementById("renameInput");

  console.log("renameConversationButton =", renameConversationButton);


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
      activeConversationId = null;
      clearUI();
      refreshConversationList();
      return;
    }

    const data = await res.json();

    // AUTHORITATIVE state update
    conversationId = id;
    activeConversationId = id;
    localStorage.setItem("conversationId", id);

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

    if (!activeConversationId) {
      await startConversation();
    }

    const userDiv = document.createElement("div");
    userDiv.textContent = `You: ${content}`;
    messagesDiv.appendChild(userDiv);

    const res = await fetch(
      `http://localhost:3000/conversations/${activeConversationId}/messages`,
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
    renameInput.value = "";
    renameDialog.showModal();

    const result = await new Promise((resolve) => {
      renameDialog.addEventListener(
        "close",
        () => {
          resolve(renameDialog.returnValue);
        },
        { once: true }
      );
    });

    if (result !== "confirm") return;

    const title = renameInput.value.trim();
    if (!title) return;

    const res = await fetch(`http://localhost:3000/conversations/${id}/rename`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
      }
  );

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

  (async () => {
    if (conversationId) {
      await loadConversation(conversationId);
    }
  })();


  sendButton.addEventListener("click", sendMessage);
  newConversationButton.addEventListener("click", startNewConversation);
  renameConversationButton.addEventListener("click", async () => {
    if (activeConversationId) {
      await renameConversation(activeConversationId);
    }
  });

  refreshConversationList();
});
