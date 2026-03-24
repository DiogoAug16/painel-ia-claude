import { randomUUID } from "crypto";
import { readFileSync, writeFileSync, existsSync } from "fs";

const DB_FILE = "./chats.json";

function load() {
  if (!existsSync(DB_FILE)) return {};
  try {
    return JSON.parse(readFileSync(DB_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function save(data) {
  writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function normalizar(entry) {
  if (Array.isArray(entry)) return { messages: entry, tokens: 0 };
  return entry;
}

export function criarChat() {
  const chats = load();
  const id = randomUUID();
  chats[id] = { messages: [], tokens: 0 };
  save(chats);
  return id;
}

export function obterMensagens(id) {
  const chats = load();
  if (!chats[id]) return null;
  return normalizar(chats[id]).messages;
}

export function adicionarMensagem(id, role, content) {
  const chats = load();
  if (!chats[id]) return false;
  chats[id] = normalizar(chats[id]);
  chats[id].messages.push({ role, content });
  save(chats);
  return true;
}

export function adicionarTokens(id, quantidade) {
  const chats = load();
  if (!chats[id]) return false;
  chats[id] = normalizar(chats[id]);
  chats[id].tokens = (chats[id].tokens || 0) + quantidade;
  save(chats);
  return true;
}

export function listarChats() {
  const chats = load();
  return Object.entries(chats).map(([id, data]) => {
    const { messages, tokens } = normalizar(data);
    return {
      id,
      preview: messages.find((m) => m.role === "user")?.content?.slice(0, 60) || "Novo chat",
      tokens:  tokens || 0,
      count:   messages.length,
    };
  });
}

export function deletarChat(id) {
  const chats = load();
  if (!chats[id]) return false;
  delete chats[id];
  save(chats);
  return true;
}