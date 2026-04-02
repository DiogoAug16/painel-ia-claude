# Backend - Painel IA Claude

API REST para gerenciamento de conversas com Claude AI via AWS Bedrock.

## 🚀 Tecnologias

- **Node.js** com ES Modules
- **Express** - Framework web
- **AWS Bedrock Runtime** - Integração com Claude AI
- **CORS** - Habilitado para requisições cross-origin

## 📋 Pré-requisitos

- Node.js 18+
- Conta AWS com acesso ao Bedrock
- Credenciais AWS configuradas

## 🔧 Instalação

```bash
npm install
```

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do backend baseado no `.env.example`:

```env
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=us.anthropic.claude-sonnet-4-6
```

## 🏃 Executando

```bash
npm start
```

O servidor será iniciado em `http://localhost:3000`

## 📚 API Endpoints

### Criar novo chat
```http
POST /chat
```
**Resposta:**
```json
{ "id": "uuid-do-chat" }
```

### Listar todos os chats
```http
GET /chats
```
**Resposta:**
```json
[
  {
    "id": "uuid",
    "preview": "Primeira mensagem do usuário...",
    "tokens": 1500,
    "count": 4
  }
]
```

### Obter mensagens de um chat
```http
GET /chat/:id
```
**Resposta:**
```json
[
  { "role": "user", "content": "Olá!" },
  { "role": "assistant", "content": "Oi, como posso ajudar?" }
]
```

### Enviar mensagem para um chat
```http
POST /chat/:id
Content-Type: application/json

{
  "message": "Sua mensagem aqui"
}
```
**Resposta:**
```json
{
  "resposta": "Resposta do Claude",
  "tokens": 245
}
```

### Deletar um chat
```http
DELETE /chat/:id
```
**Resposta:**
```json
{ "ok": true }
```

## 💾 Armazenamento

Os chats são armazenados localmente em `chats.json` com a seguinte estrutura:

```json
{
  "chat-uuid": {
    "messages": [
      { "role": "user", "content": "..." },
      { "role": "assistant", "content": "..." }
    ],
    "tokens": 1500
  }
}
```

## 🏗️ Estrutura do Projeto

```
backend/
├── src/
│   ├── index.js       # Servidor Express e rotas
│   ├── bedrock.js     # Integração com AWS Bedrock
│   └── chatStore.js   # Gerenciamento de chats (JSON)
├── chats.json         # Banco de dados local
├── .env               # Variáveis de ambiente
└── package.json
```

## 🔒 Recursos de Segurança

- Validação de mensagens vazias
- Tratamento de erros para chats não encontrados
- Limite de 10 mensagens de contexto enviadas ao Claude
- Variáveis sensíveis em arquivo .env (não commitado)

## 📝 Notas

- O modelo padrão é `us.anthropic.claude-sonnet-4-6`
- Máximo de 20.000 tokens por resposta
- Apenas as últimas 10 mensagens são enviadas como contexto
