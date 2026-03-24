const API = "http://localhost:3000";
let chatId = localStorage.getItem("chatId");

// ── AUTO-RESIZE TEXTAREA ──────────────────────────────────────────
const input = document.getElementById("input");
input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 160) + "px";
});

// ── SIDEBAR TOGGLE (mobile) ───────────────────────────────────────
document.getElementById("sidebarToggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});

// ── COPY UTILS ────────────────────────────────────────────────────
async function copyText(text, btn) {
  await navigator.clipboard.writeText(text);
  const original = btn.innerHTML;
  btn.innerHTML = iconCheck() + " Copiado!";
  btn.classList.add("copied");
  setTimeout(() => {
    btn.innerHTML = original;
    btn.classList.remove("copied");
  }, 2000);
}

function iconCopy() {
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
}

function iconCheck() {
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
}

// ── MARKDOWN PARSER ───────────────────────────────────────────────
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function parseMarkdown(raw) {
  let text = raw;

  // 1. Blocos de código — extrair e proteger com placeholder
  const codeBlocks = [];
  text = text.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const trimmed  = code.trim();
    const escaped  = escapeHtml(trimmed);
    const label    = lang ? `<span class="code-lang">${escapeHtml(lang)}</span>` : "";
    const dataRaw  = trimmed.replace(/\\/g, "\\\\").replace(/"/g, "&quot;");
    const copyBtn  = `<button class="copy-code-btn" data-raw="${dataRaw}" title="Copiar código">${iconCopy()} Copiar</button>`;
    codeBlocks.push(`<pre>${label}${copyBtn}<code>${escaped}</code></pre>`);
    return `\x00CODE${codeBlocks.length - 1}\x00`;
  });

  // 2. Inline code
  const inlineCodes = [];
  text = text.replace(/`([^`]+)`/g, (_, c) => {
    inlineCodes.push(`<code>${escapeHtml(c)}</code>`);
    return `\x00INLINE${inlineCodes.length - 1}\x00`;
  });

  // 3. Headings
  text = text.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
  text = text.replace(/^#####\s+(.+)$/gm,  "<h5>$1</h5>");
  text = text.replace(/^####\s+(.+)$/gm,   "<h4>$1</h4>");
  text = text.replace(/^###\s+(.+)$/gm,    "<h3>$1</h3>");
  text = text.replace(/^##\s+(.+)$/gm,     "<h2>$1</h2>");
  text = text.replace(/^#\s+(.+)$/gm,      "<h1>$1</h1>");

  // 4. Bold + italic ***texto***
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");

  // 5. Bold **texto** ou __texto__
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__(.+?)__/g,      "<strong>$1</strong>");

  // 6. Italic *texto* ou _texto_
  text = text.replace(/\*([^*\n]+?)\*/g, "<em>$1</em>");
  text = text.replace(/_([^_\n]+?)_/g,   "<em>$1</em>");

  // 7. Strikethrough ~~texto~~
  text = text.replace(/~~(.+?)~~/g, "<del>$1</del>");

  // 8. Blockquote
  text = text.replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>");

  // 9. Horizontal rule
  text = text.replace(/^(-{3,}|\*{3,}|_{3,})$/gm, "<hr>");

  // 10. Listas não-ordenadas
  text = text.replace(/((?:^[ \t]*[-*+] .+\n?)+)/gm, (block) => {
    const items = block.trim().split("\n").map((line) => {
      const content = line.replace(/^[ \t]*[-*+] /, "");
      return `<li>${content}</li>`;
    }).join("");
    return `<ul>${items}</ul>`;
  });

  // 11. Listas ordenadas
  text = text.replace(/((?:^[ \t]*\d+\. .+\n?)+)/gm, (block) => {
    const items = block.trim().split("\n").map((line) => {
      const content = line.replace(/^[ \t]*\d+\. /, "");
      return `<li>${content}</li>`;
    }).join("");
    return `<ol>${items}</ol>`;
  });

  // 12. Links [texto](url)
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // 13. Quebras de linha
  text = text.replace(/(?<!>)\n(?!<)/g, "<br>");

  // 14. Restaurar placeholders
  text = text.replace(/\x00CODE(\d+)\x00/g,   (_, i) => codeBlocks[i]);
  text = text.replace(/\x00INLINE(\d+)\x00/g, (_, i) => inlineCodes[i]);

  return text;
}

// ── MENSAGENS ─────────────────────────────────────────────────────
function addMessage(role, rawText, animate = true) {
  document.getElementById("emptyState")?.remove();

  const chat = document.getElementById("chat");
  const wrap = document.createElement("div");
  wrap.className = "message-wrap";
  if (!animate) wrap.style.animation = "none";

  const msg = document.createElement("div");
  msg.className = `message ${role}`;

  // ── cabeçalho: role + botão copiar tudo
  const header = document.createElement("div");
  header.className = "msg-header";

  const label = document.createElement("div");
  label.className = "msg-role";
  label.textContent = role === "user" ? "Você" : "Claude";
  header.appendChild(label);

  if (role === "assistant") {
    const copyAll = document.createElement("button");
    copyAll.className = "copy-all-btn";
    copyAll.title = "Copiar mensagem completa";
    copyAll.innerHTML = iconCopy() + " Copiar tudo";
    copyAll.addEventListener("click", () => copyText(rawText, copyAll));
    header.appendChild(copyAll);
  }

  // ── conteúdo formatado
  const content = document.createElement("div");
  content.className = "msg-content";
  content.innerHTML = parseMarkdown(rawText);

  // ── eventos dos botões de copiar código
  content.querySelectorAll(".copy-code-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const raw = btn.dataset.raw
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
      copyText(raw, btn);
    });
  });

  msg.appendChild(header);
  msg.appendChild(content);
  wrap.appendChild(msg);
  chat.appendChild(wrap);
  chat.scrollTop = chat.scrollHeight;
}

function showTyping() {
  document.getElementById("emptyState")?.remove();
  const chat = document.getElementById("chat");
  const wrap = document.createElement("div");
  wrap.className = "message-wrap";
  wrap.id = "typingWrap";

  const msg = document.createElement("div");
  msg.className = "message assistant";

  const label = document.createElement("div");
  label.className = "msg-role";
  label.textContent = "Claude";

  const dots = document.createElement("div");
  dots.className = "typing-indicator";
  dots.innerHTML = "<span></span><span></span><span></span>";

  msg.appendChild(label);
  msg.appendChild(dots);
  wrap.appendChild(msg);
  chat.appendChild(wrap);
  chat.scrollTop = chat.scrollHeight;
}

function removeTyping() {
  document.getElementById("typingWrap")?.remove();
}

// ── TOKENS ────────────────────────────────────────────────────────
function formatTokens(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

// ── CHAT LIST ─────────────────────────────────────────────────────
async function loadChatList() {
  try {
    const res = await fetch(`${API}/chats`);
    const chats = await res.json();
    renderChatList(chats);
  } catch { /* silently fail */ }
}

function renderChatList(chats) {
  const list = document.getElementById("chatList");
  list.innerHTML = "";

  chats.forEach((c) => {
    const item = document.createElement("div");
    item.className = "chat-item" + (c.id === chatId ? " active" : "");
    item.dataset.id = c.id;

    const text = document.createElement("span");
    text.className = "chat-item-text";
    text.textContent = c.preview || "Novo chat";

    const right = document.createElement("div");
    right.className = "chat-item-right";

    if (c.tokens > 0) {
      const badge = document.createElement("span");
      badge.className = "token-badge";
      badge.title = `${c.tokens.toLocaleString("pt-BR")} tokens totais`;
      badge.textContent = formatTokens(c.tokens);
      right.appendChild(badge);
    }

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.title = "Deletar";
    del.textContent = "×";
    del.addEventListener("click", async (e) => {
      e.stopPropagation();
      await deleteChat(c.id);
    });
    right.appendChild(del);

    item.appendChild(text);
    item.appendChild(right);
    item.addEventListener("click", () => switchChat(c.id));
    list.appendChild(item);
  });
}

async function switchChat(id) {
  chatId = id;
  localStorage.setItem("chatId", id);

  document.querySelectorAll(".chat-item").forEach((el) =>
    el.classList.toggle("active", el.dataset.id === id)
  );

  const chat = document.getElementById("chat");
  chat.innerHTML = "";

  const res = await fetch(`${API}/chat/${id}`);
  const messages = await res.json();

  if (messages.length === 0) {
    chat.innerHTML = `<div class="empty-state" id="emptyState">
      <div class="empty-logo">✦</div>
      <h2>Chat vazio</h2>
      <p>Envie uma mensagem para começar.</p>
    </div>`;
    return;
  }

  messages.forEach((m) => addMessage(m.role, m.content, false));
}

async function deleteChat(id) {
  await fetch(`${API}/chat/${id}`, { method: "DELETE" });
  if (id === chatId) {
    chatId = null;
    localStorage.removeItem("chatId");
    await init();
  } else {
    await loadChatList();
  }
}

// ── INIT ──────────────────────────────────────────────────────────
async function init() {
  await loadChatList();

  if (!chatId) {
    const res = await fetch(`${API}/chat`, { method: "POST" });
    const data = await res.json();
    chatId = data.id;
    localStorage.setItem("chatId", chatId);
    await loadChatList();
    return;
  }

  const res = await fetch(`${API}/chat/${chatId}`);
  if (!res.ok) {
    localStorage.removeItem("chatId");
    chatId = null;
    return init();
  }

  const messages = await res.json();
  if (messages.length > 0) {
    document.getElementById("emptyState")?.remove();
    messages.forEach((m) => addMessage(m.role, m.content, false));
  }
}

// ── SEND ──────────────────────────────────────────────────────────
async function enviar() {
  const text = input.value.trim();
  if (!text) return;

  const sendBtn = document.getElementById("sendBtn");
  sendBtn.disabled = true;
  input.value = "";
  input.style.height = "auto";

  addMessage("user", text);
  showTyping();

  try {
    const res = await fetch(`${API}/chat/${chatId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();
    removeTyping();
    addMessage("assistant", data.resposta);
    await loadChatList();
  } catch {
    removeTyping();
    addMessage("assistant", "⚠️ Erro ao conectar com o servidor.");
  } finally {
    sendBtn.disabled = false;
    input.focus();
  }
}

// ── NEW CHAT ──────────────────────────────────────────────────────
document.getElementById("newChatBtn").addEventListener("click", async () => {
  const res = await fetch(`${API}/chat`, { method: "POST" });
  const data = await res.json();
  chatId = data.id;
  localStorage.setItem("chatId", chatId);

  document.getElementById("chat").innerHTML = `
    <div class="empty-state" id="emptyState">
      <div class="empty-logo">✦</div>
      <h2>Como posso ajudar?</h2>
      <p>Inicie uma conversa. Suas mensagens são salvas automaticamente.</p>
    </div>`;

  await loadChatList();
  input.focus();
});

document.getElementById("sendBtn").addEventListener("click", enviar);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    enviar();
  } else if (e.key === "Enter" && e.shiftKey) {
    setTimeout(() => {
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, 160) + "px";
    }, 0);
  }
});

init();