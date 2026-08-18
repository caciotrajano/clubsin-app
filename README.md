# 🏆 Clubsin Ceará — Portal de Gamificação

Aplicativo Next.js + Supabase para gamificação de associados do Clubsin Ceará.

## 📦 Estrutura

```
clubsin-app/
├── components/
│   ├── Layout.jsx          # Layout principal com sidebar
│   └── Sidebar.jsx          # Navegação lateral
├── pages/
│   ├── _app.jsx             # App wrapper (AuthProvider + Toaster)
│   ├── login.jsx            # Tela de login/cadastro
│   ├── dashboard.jsx        # Ranking e estatísticas
│   ├── atividades.jsx       # Registrar/enviar atividades
│   ├── perfil.jsx           # Editar dados pessoais
│   └── admin/
│       └── index.jsx        # Módulo Admin completo
├── hooks/
│   ├── useAuth.js           # Contexto de autenticação
│   └── useRanking.js        # Hook para buscar ranking
├── lib/
│   └── supabase.js          # Cliente Supabase
├── styles/
│   └── globals.css          # Estilos globais + Tailwind
└── package.json
```

## 🚀 Como começar

### 1. Instalar dependências
```bash
cd clubsin-app
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.local.example .env.local
# Edite .env.local com suas credenciais do Supabase
```

### 3. Rodar o schema no Supabase
1. Acesse o SQL Editor do seu projeto Supabase
2. Cole e execute os arquivos:
   - `clubsin_schema_final.sql` (schema base)
   - `clubsin_schema_security_update.sql` (segurança + configurações)
   - `clubsin_importacao_dados.sql` (dados da planilha)

### 4. Iniciar o servidor
```bash
npm run dev
# Acesse http://localhost:3000
```

## 🔐 Funcionalidades de Segurança

| Recurso | Descrição |
|---|---|
| **Bloqueio por tentativas** | Configurável: X tentativas em Y minutos |
| **Reset de senha** | Admin/Manager gera senha temporária |
| **Desbloqueio manual** | Admin/Manager desbloqueia conta a qualquer momento |
| **Audit logs** | Todas as ações administrativas registradas |
| **RLS** | Row Level Security em todas as tabelas |

## 🎨 Cores do Clubsin

| Token | Valor | Uso |
|---|---|---|
| `--clubsin-green` | `#1a5c3a` | Primária (botões, destaques) |
| `--clubsin-green-light` | `#2d8f5a` | Hover, gradientes |
| `--clubsin-green-pale` | `#e8f5ee` | Backgrounds sutis |
| `--clubsin-gold` | `#c9a84c` | Ranking, badges |

## 📋 Papéis de usuário

| Papel | Pode fazer |
|---|---|
| **Associado** | Ver ranking, enviar atividades, editar perfil |
| **Manager** | Tudo do associado + aprovar atividades, resetar senhas, desbloquear contas |
| **Admin** | Tudo + editar configurações de segurança, ver audit logs, gerenciar regras de pontuação |

## 🛠️ Stack

- **Next.js 14** (App Router / Pages Router)
- **React 18**
- **Supabase** (Auth, Database, Storage, Realtime)
- **Tailwind CSS**
- **Lucide React** (ícones)
- **React Hot Toast** (notificações)
