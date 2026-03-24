import express from "express";
import cors from "cors";
import { gerarResposta } from "./bedrock.js";
import {
  criarChat,
  obterMensagens,
  adicionarMensagem,
  adicionarTokens,
  listarChats,
  deletarChat,
} from "./chatStore.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", (req, res) => {
  const id = criarChat();
  res.json({ id });
});

app.get("/chats", (req, res) => {
  const chats = listarChats();
  res.json(chats);
});

app.get("/chat/:id", (req, res) => {
  const messages = obterMensagens(req.params.id);
  if (!messages) return res.status(404).json({ erro: "Chat não encontrado" });
  res.json(messages);
});

app.post("/chat/:id", async (req, res) => {
  const { message } = req.body;
  const id = req.params.id;

  if (!message) return res.status(400).json({ erro: "Mensagem vazia" });

  const ok = adicionarMensagem(id, "user", message);
  if (!ok) return res.status(404).json({ erro: "Chat não encontrado" });

  const messages = obterMensagens(id);

  try {
    const { resposta, tokens } = await gerarResposta(messages);

    adicionarMensagem(id, "assistant", resposta);
    adicionarTokens(id, tokens);

    res.json({ resposta, tokens });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao gerar resposta", detalhes: err.message });
  }
});

app.delete("/chat/:id", (req, res) => {
  const ok = deletarChat(req.params.id);
  if (!ok) return res.status(404).json({ erro: "Chat não encontrado" });
  res.json({ ok: true });
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));