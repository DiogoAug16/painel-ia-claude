# 💬 Chat Privado — Claude via AWS Bedrock

Interface de chat privada com o Claude, rodando localmente via **AWS Bedrock**. Histórico de conversas salvo em arquivo local, design inspirado no Claude.ai e ChatGPT.

---

## 📁 Estrutura do Projeto

```
projeto/
├── backend/
│   ├── src/
│   │   ├── index.js        # Servidor Express + rotas da API
│   │   ├── bedrock.js      # Integração com AWS Bedrock
│   │   └── chatStore.js    # Persistência dos chats em arquivo JSON
│   ├── chats.json          # Banco de dados local (gerado automaticamente)
│   ├── .env                # Credenciais AWS
│   └── package.json
│
└── frontend/
    ├── index.html          # Estrutura HTML
    ├── style.css           # Estilos
    ├── script.js           # Lógica do cliente
    └── package.json
```

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- Conta AWS com acesso ao **Amazon Bedrock**
- Modelo Claude habilitado no Bedrock (o primeiro uso pode exigir preencher um formulário de uso na AWS)

---

## 🚀 Instalação e uso

### 1. Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` na raiz do backend:

```env
AWS_REGION=sua_regiao
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
BEDROCK_MODEL_ID=modelo_ia
```

Inicie o servidor:

```bash
npm start
```

O backend sobe em `http://localhost:3000`.

---

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

O frontend sobe em `http://localhost:8080`.

---

## 🔑 Configuração da AWS

1. Acesse o **AWS Console → Amazon Bedrock → Model catalog**
2. Selecione um modelo Anthropic e preencha o formulário de primeiro uso (feito apenas uma vez por conta)
3. Os modelos ficam disponíveis automaticamente após isso

**Model IDs disponíveis:**

| Modelo | ID |
|---|---|
| Claude Sonnet 4.6 | `us.anthropic.claude-sonnet-4-6` |
| Claude Opus 4.6 | `us.anthropic.claude-opus-4-6` |
| Claude Haiku 3.5 | `us.anthropic.claude-haiku-3-5-20241022-v1:0` |

---

## ✨ Funcionalidades

- **Múltiplos chats** — crie, alterne e delete conversas pela sidebar
- **Persistência** — histórico salvo em `chats.json`, sobrevive a reinicializações do servidor
- **Contador de tokens** — exibe o total de tokens consumidos por chat
- **Formatação Markdown** — renderiza `**negrito**`, `# títulos`, listas, blocos de código, links, etc.
- **Copiar mensagem** — botão para copiar o texto completo de uma resposta
- **Copiar código** — botão dentro de cada bloco de código para copiar apenas aquele trecho
- **Typing indicator** — animação enquanto o Claude processa a resposta
- **Auto-resize** — o campo de texto cresce conforme você digita
- **Shift+Enter** — quebra de linha sem enviar; Enter envia

---

## 🌐 API do Backend

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/chat` | Cria novo chat |
| `GET` | `/chats` | Lista todos os chats |
| `GET` | `/chat/:id` | Retorna mensagens de um chat |
| `POST` | `/chat/:id` | Envia mensagem e recebe resposta |
| `DELETE` | `/chat/:id` | Deleta um chat |

---

## 🛠️ Tecnologias

**Backend**
- [Express](https://expressjs.com/) — servidor HTTP
- [AWS SDK v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/) — integração com Bedrock
- `fs` nativo — persistência em JSON

**Frontend**
- HTML, CSS e JavaScript puros (sem frameworks)
- [Sora](https://fonts.google.com/specimen/Sora) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) — tipografia
- [serve](https://www.npmjs.com/package/serve) — servidor estático para desenvolvimento

---