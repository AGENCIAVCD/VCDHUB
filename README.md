# WPP Hub (Mini-CRM WhatsApp)

MVP de mini-CRM estilo "Kommo caseiro" com foco em custo zero:

- Next.js (App Router)
- Tailwind CSS
- PostgreSQL via Supabase (free tier)
- Deploy na Vercel Hobby
- Integração com WhatsApp Cloud API (webhook + envio)
- Autenticação simples por email/senha

## 1. Variaveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

Obrigatorias:

- `WHATSAPP_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `VERIFY_TOKEN`
- `DATABASE_URL`

Recomendada para sessao:

- `AUTH_SECRET`

## 2. Banco de dados (Supabase)

No SQL Editor do Supabase, rode:

- [`supabase/schema.sql`](./supabase/schema.sql)

Isso cria as tabelas:

- `contacts`
- `conversations`
- `messages`
- `pipeline_stages`
- `deals`
- `users` (suporte a autenticacao)

## 3. Rodar local

```bash
npm install
npm run dev
```

Acesse:

- `http://localhost:3000/register` para criar o primeiro usuario
- `http://localhost:3000/inbox` para inbox
- `http://localhost:3000/pipeline` para funil

## 4. Endpoints principais

- `GET /api/webhook` valida webhook (`VERIFY_TOKEN`)
- `POST /api/webhook` recebe mensagens e salva no banco
- `POST /api/send-message` envia mensagem via WhatsApp e salva no banco

Regras implementadas ao receber nova mensagem:

1. Cria contato se nao existir
2. Cria conversa se nao existir
3. Salva mensagem

## 5. Deploy na Vercel (Hobby)

1. Suba o projeto para GitHub
2. Importe o repo na Vercel
3. Configure as mesmas variaveis de ambiente no painel da Vercel
4. Deploy

## Estrutura

- `src/lib/whatsapp.ts`
- `src/lib/db.ts`
- `src/app/inbox`
- `src/app/pipeline`
- `src/app/conversation/[id]`
- `src/app/api/webhook`
- `src/app/api/send-message`

## Observacoes

- O webhook trata mensagens de texto (`type = text`) para manter simplicidade e custo zero.
- Para producao, configure politicas de seguranca adicionais (rate limit, logging externo, monitoramento).
