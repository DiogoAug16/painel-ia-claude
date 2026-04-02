# Frontend - Painel IA Claude

Interface web moderna para conversas com Claude AI, com design minimalista e suporte a Markdown.

## 🎨 Tecnologias

- **HTML5** + **CSS3** (Vanilla)
- **JavaScript** puro (sem frameworks)
- **Serve** - Servidor estático para desenvolvimento
- **Google Fonts** - Sora + JetBrains Mono

## 📋 Pré-requisitos

- Node.js 18+
- Backend rodando em `http://localhost:3000`

## 🔧 Instalação

```bash
npm install
```

## 🏃 Executando

```bash
npm start
```

A aplicação será iniciada em `http://localhost:8080`

## ✨ Funcionalidades

### Interface
- 🎨 **Design Dark Mode** com paleta roxa minimalista
- 📱 **Responsivo** - sidebar colapsável em mobile
- ⌨️ **Atalhos de teclado**:
  - `Enter` - Enviar mensagem
  - `Shift+Enter` - Nova linha
- 🔄 **Auto-resize** do textarea conforme digitação

### Chat
- 💬 **Múltiplos chats** gerenciados na sidebar
- 💾 **Persistência automática** no backend
- 🔖 **Preview** da primeira mensagem de cada chat
- 🗑️ **Deletar chats** com botão de lixeira
- 📊 **Contador de tokens** exibido em cada chat

### Markdown
- 📝 **Renderização completa** de Markdown
- 🎯 **Blocos de código** com syntax highlighting visual
- 📋 **Botão de copiar** em cada bloco de código
- ✅ **Feedback visual** ao copiar ("Copiado!")
- **Suporte a**: negrito, itálico, listas, links, código inline

## 🏗️ Estrutura do Projeto

```
frontend/
├── index.html      # Estrutura da página
├── style.css       # Estilos (dark theme)
├── script.js       # Lógica da aplicação
└── package.json    # Dependências
```

## 🎨 Paleta de Cores

```css
--bg:          #0d0d0f  /* Background principal */
--surface:     #161618  /* Superfícies */
--surface2:    #1e1e21  /* Superfícies elevadas */
--border:      #2a2a2e  /* Bordas */
--text:        #e8e8ed  /* Texto principal */
--muted:       #6e6e7a  /* Texto secundário */
--accent:      #c98eff  /* Roxo accent */
--accent2:     #7b5ea7  /* Roxo escuro */
--user-bg:     #1e1a2e  /* Background mensagens do usuário */
--user-border: #4a3570  /* Borda mensagens do usuário */
```

## 🔌 Integração com Backend

A aplicação se comunica com o backend via REST API:

- `GET /chats` - Lista todos os chats
- `POST /chat` - Cria novo chat
- `GET /chat/:id` - Obtém mensagens de um chat
- `POST /chat/:id` - Envia mensagem
- `DELETE /chat/:id` - Deleta chat

## 💾 Armazenamento Local

Utiliza `localStorage` para:
- Armazenar o ID do chat ativo
- Manter a sessão entre recarregamentos

## 📱 Responsividade

### Desktop (> 768px)
- Sidebar fixa e sempre visível
- Layout em duas colunas

### Mobile (< 768px)
- Sidebar overlay (toggle com botão)
- Layout full-width
- Gestos otimizados para toque

## 🎯 Componentes Principais

### Parser de Markdown
- Converte Markdown em HTML seguro
- Escape de caracteres HTML
- Suporte a código multi-linha
- Formatação inline (negrito, itálico)

### Gerenciador de Chats
- Lista dinâmica na sidebar
- Preview truncado em 60 caracteres
- Badge com contagem de mensagens
- Indicador visual do chat ativo

### Área de Input
- Auto-resize até 160px de altura
- Contador de linhas automático
- Botão de envio com ícone SVG
- Hint de atalhos de teclado

## 🔒 Segurança

- Escape de HTML em mensagens do usuário
- Sanitização de Markdown antes da renderização
- Proteção contra XSS em blocos de código

## 🚀 Performance

- Assets mínimos (sem bundler necessário)
- CSS e JS inline otimizados
- Fontes com preconnect
- Lazy loading de mensagens
