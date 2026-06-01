# Guia E2E — Veredas Connect

A aplicação roda sob o base path `/connect`. Qualquer teste E2E deve derivar rotas a partir de:

```text
http://localhost:3000/connect
```

## Fluxo recomendado

1. Iniciar o servidor local:

```bash
npm run dev
```

2. Esperar o readiness check responder `200`:

```bash
curl -I http://localhost:3000/connect
```

3. Rodar a suíte E2E existente:

```bash
npm run test:e2e
```

## Rotas críticas para cobrir

- `/connect` — landing pública.
- `/connect/signup` — cadastro.
- `/connect/login` — login.
- `/connect/editor` — edição do perfil.
- `/connect/[slug]` — página pública.
- `/connect/api/vcard/[slug]` — download de contato.
- `/connect/api/click/[id]` — redirecionamento e analytics de clique.
- `/connect/n/[cardId]` — rota NFC/QR.

## Cuidados

- Não hardcodar rotas sem `/connect`.
- Não depender de dados reais de produção.
- Usar usuário/fixtures locais próprios para teste.
- Não publicar screenshots com dados sensíveis.
