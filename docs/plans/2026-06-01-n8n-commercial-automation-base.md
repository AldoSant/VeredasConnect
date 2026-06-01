# Base n8n e Comercial do Veredas Connect — Implementation Plan

> **For Hermes:** Use subagent-driven-development skill for broad read-only review, but centralize edits because API/profile/editor files overlap.

**Goal:** preparar o Veredas Connect para vender, capturar e distribuir leads via n8n local/VPS sem depender de integrações improvisadas.

**Architecture:** manter o app como fonte de verdade para perfis/leads e expor/acionar webhooks compatíveis com n8n. O n8n receberá eventos estruturados (`lead.created`, depois outros eventos) e fará automações externas: Telegram, email, planilha, CRM, WhatsApp/API, follow-up.

**Tech Stack:** Next.js 15 App Router, Drizzle SQLite, Zod, Vitest, Biome, n8n Webhook Trigger, JSON payloads HTTP.

---

## Referências pesquisadas

- `enescingoz/awesome-n8n-templates` — grande coleção de templates n8n para WhatsApp, Telegram, CRM, Gmail e automações.
- `lucaswalter/n8n-ai-automations` — exemplos de automações n8n com IA/agentes.
- `Danitilahun/n8n-workflow-templates` — coleção grande de workflows documentados.
- `felipfr/awesome-n8n-workflows` — curadoria de workflows n8n por produtividade/integração.
- `tanaymehhta/n8n-smart-webhook-router` — padrão simples de webhook router com validação/roteamento.
- `chroline/lynk` — referência open-source de produto “link in bio”.

Não copiar código desses repositórios agora. Usar como referência de arquitetura: eventos limpos, payload previsível, documentação para importar no n8n e templates reutilizáveis.

---

## Fase 1 — Fundação de automação n8n

### Task 1: Criar contrato de eventos de automação

**Objective:** documentar e testar o formato de payload que será enviado ao n8n.

**Files:**
- Create: `src/lib/automation-events.ts`
- Create: `src/lib/__tests__/automation-events.test.ts`

**Acceptance criteria:**
- helper `buildLeadCreatedEvent` retorna evento estável com `event`, `occurredAt`, `profile`, `lead`, `source`.
- não vaza campos internos desnecessários.
- testes cobrem lead com/sem telefone, empresa e mensagem.

### Task 2: Criar dispatcher HTTP seguro para webhook n8n

**Objective:** enviar eventos para URL configurada, com timeout e sem quebrar a criação do lead se o n8n estiver fora.

**Files:**
- Create: `src/lib/webhook-dispatcher.ts`
- Create: `src/lib/__tests__/webhook-dispatcher.test.ts`

**Acceptance criteria:**
- `dispatchWebhookEvent({ url, payload })` ignora URL vazia.
- aceita somente `http://` e `https://`.
- usa `POST` JSON.
- timeout curto via `AbortSignal.timeout` ou `AbortController`.
- retorna `{ delivered: boolean, status?: number, error?: string }`.
- não lança erro para chamador em falha de rede.

### Task 3: Disparar `lead.created` após criação de lead

**Objective:** conectar a captação real ao n8n.

**Files:**
- Modify: `src/app/api/leads/route.ts`

**Acceptance criteria:**
- depois de inserir lead no DB, se `profile.webhookUrl` existir, enviar evento `lead.created`.
- não bloquear resposta ao usuário por falha do webhook.
- logar aviso mínimo em server console se falhar.
- resposta do POST continua `{ lead }`.

### Task 4: Melhorar UI de integração n8n no editor

**Objective:** deixar claro para o usuário como conectar com n8n.

**Files:**
- Modify: `src/components/editor/profile-form.tsx`

**Acceptance criteria:**
- seção “Automação com n8n”.
- placeholder: `https://n8n.seudominio.com/webhook/veredas-lead`.
- explica que cada novo lead envia evento `lead.created`.
- inclui instrução curta: método POST, JSON, sem chave secreta no campo.

### Task 5: Documentar workflow n8n de referência

**Objective:** entregar base para Aldo amarrar na VPS.

**Files:**
- Create: `docs/n8n/lead-created-workflow.md`
- Create: `docs/n8n/lead-created-sample-payload.json`

**Acceptance criteria:**
- documentação descreve nodes n8n sugeridos: Webhook Trigger → IF/Set → Telegram/Email/Sheets/CRM.
- inclui payload exemplo válido.
- inclui checklist para configurar URL no editor.

---

## Fase 2 — Base comercial e ativação

### Task 6: Criar dados de planos/preços reutilizáveis

**Objective:** ter uma fonte única para landing/pricing.

**Files:**
- Create: `src/lib/pricing.ts`
- Create: `src/lib/__tests__/pricing.test.ts`

**Acceptance criteria:**
- planos Starter, Pro, Equipe.
- features, preço sugerido e CTA.
- destaque do Pro como melhor valor.

### Task 7: Criar seção comercial na homepage

**Objective:** transformar `/connect` em landing vendável.

**Files:**
- Modify: `src/app/page.tsx`

**Acceptance criteria:**
- headline posiciona como cartão digital + CRM + automação.
- mostra 3 segmentos iniciais.
- mostra planos a partir de `src/lib/pricing.ts`.
- CTA para cadastro/login.
- sem dependência externa nova.

### Task 8: Atualizar roadmap com status executável

**Objective:** manter a estratégia no papel e rastreável.

**Files:**
- Modify: `docs/product-roadmap.md`

**Acceptance criteria:**
- marcar Sprint 1 concluída.
- adicionar Sprint 2: automações n8n + landing/pricing.
- adicionar “Como conectar na VPS”.

---

## Gates obrigatórios

Após implementação:

```bash
npm run lint:fix
npm run lint
npm run test:run
npm run build
git status --short
git diff --stat HEAD~1..HEAD
```

Expected:
- lint sem erros;
- testes passando;
- build Next.js passando;
- working tree limpo depois do commit;
- nenhum push externo sem autorização.

---

## Fora de escopo por enquanto

- configurar a VPS/n8n real;
- criar credenciais ou segredos;
- integrar WhatsApp API pago;
- billing real;
- migrations destrutivas;
- push para GitHub/produção.

