# Integração n8n — Veredas Connect

Este diretório contém uma base importável para o n8n local da VPS receber eventos do Veredas Connect.

## Evento disponível agora

### `lead.created`

Disparado quando um visitante envia o formulário público de lead com consentimento LGPD.

Payload enviado pelo Veredas:

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

## Como amarrar na VPS

1. No n8n, importe `docs/n8n/veredas-lead-created-starter.json`.
2. Ative o workflow.
3. Copie a URL de produção do nó Webhook.
4. No Veredas Connect, edite o perfil e cole a URL no campo `Integrações (Webhook)`.
5. Envie um lead de teste pela página pública.
6. No n8n, adicione os próximos nós conforme operação:
   - Google Sheets/Airtable para registro;
   - Telegram/WhatsApp para alerta imediato;
   - Email para confirmação;
   - CRM ou Odoo para pipeline;
   - Wait/Delay para follow-up automático.

## Cuidados

- Não coloque token secreto no campo de webhook do perfil.
- Se quiser autenticação, use path randômico no n8n ou proxy da VPS.
- O Veredas não bloqueia a captura do lead se o n8n estiver fora: ele salva primeiro e tenta notificar depois.
- Falhas de entrega aparecem no log do servidor como `Lead webhook delivery failed`.

## Próximos eventos recomendados

- `profile.published`
- `link.clicked`
- `vcard.downloaded`
- `weekly.report.requested`
- `card.assigned`
