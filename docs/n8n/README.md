# Integração n8n — Veredas Connect

Este diretório contém uma base importável para o n8n local da VPS receber eventos do Veredas Connect.

## Workflow inicial

Importe no n8n:

- `docs/n8n/veredas-lead-created-starter.json`

Ele começa com o evento `lead.created`. A partir desta sprint, o endpoint do Veredas também pode enviar outros eventos para a mesma URL de webhook; no n8n, basta adicionar um nó **Switch** usando `{{$json.event}}`.

## Eventos disponíveis

### `lead.created`

Disparado quando um visitante envia o formulário público de lead com consentimento LGPD.

Payload resumido:

```json
{
  "event": "lead.created",
  "occurredAt": "2026-06-01T12:00:00.000Z",
  "source": "veredas-connect",
  "profile": {
    "id": "profile-id",
    "slug": "ana-costa",
    "displayName": "Ana Costa",
    "company": "Veredas Imóveis",
    "organizationId": "org-id",
    "teamId": "team-id",
    "publicUrl": "https://veredasinc.com.br/connect/ana-costa"
  },
  "lead": {
    "id": "lead-id",
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "+55 77 99999-0000",
    "company": "Fazenda Boa Vista",
    "message": "Quero uma proposta",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

### `webhook.test`

Disparado manualmente pelo endpoint autenticado `POST /api/webhook/test` para validar a URL configurada no perfil.

Body recomendado:

```json
{
  "profileId": "profile-id-opcional"
}
```

Se `profileId` for omitido, o backend usa o primeiro perfil acessível ao usuário logado dentro do escopo RBAC.

### `link.clicked`

Disparado quando um visitante abre um link público rastreado via `/api/click/:id`.

```json
{
  "event": "link.clicked",
  "profile": { "slug": "ana-costa" },
  "link": {
    "id": "link-id",
    "title": "WhatsApp",
    "url": "https://wa.me/5577999990000"
  },
  "visitor": {
    "ipHash": "sha256-do-ip",
    "userAgent": "Mozilla/5.0"
  }
}
```

### `vcard.downloaded`

Disparado quando alguém baixa o vCard público do perfil via `/api/vcard/:slug`.

```json
{
  "event": "vcard.downloaded",
  "profile": { "slug": "ana-costa" },
  "visitor": {
    "ipHash": "sha256-do-ip",
    "userAgent": "Mozilla/5.0"
  }
}
```

## Como amarrar na VPS

1. No n8n, importe `docs/n8n/veredas-lead-created-starter.json`.
2. Ative o workflow.
3. Copie a URL de produção do nó Webhook.
4. No Veredas Connect, edite o perfil e cole a URL no campo `Integrações (Webhook / n8n)`.
5. Envie um evento de teste via `POST /api/webhook/test` autenticado.
6. Envie um lead de teste pela página pública.
7. Clique em um link público e baixe o vCard para validar os eventos extras.
8. No n8n, adicione um nó **Switch** por `event`:
   - `lead.created`: Google Sheets/Airtable, CRM/Odoo, alerta Telegram/WhatsApp;
   - `link.clicked`: pontuação de interesse, remarketing, analytics;
   - `vcard.downloaded`: alerta comercial leve ou score;
   - `webhook.test`: apenas confirmação/log.

## Cuidados

- Não coloque token secreto no campo de webhook do perfil.
- Se quiser autenticação, use path randômico no n8n ou proxy da VPS.
- O Veredas não bloqueia a ação principal se o n8n estiver fora: ele salva/registra primeiro e tenta notificar depois.
- Falhas de entrega aparecem no log do servidor como `Lead webhook delivery failed`, `Link webhook delivery failed` ou `vCard webhook delivery failed`.
- IP é enviado apenas como hash SHA-256 (`ipHash`), não como IP bruto.

## Próximos eventos recomendados

- `profile.published`
- `weekly.report.requested`
- `card.assigned`
- `automation.delivery.failed`
