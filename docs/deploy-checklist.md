# Checklist de Deploy — Veredas Connect

Use este checklist antes de publicar mudanças em produção.

## Gates técnicos

1. Rodar `npm run lint`.
2. Rodar `npm run test:run`.
3. Rodar `npm run build`.
4. Validar localmente `http://localhost:3000/connect`.
5. Conferir `robots.txt` e `sitemap.xml` sob o base path `/connect`.
6. Revisar `git diff` para evitar arquivos fora do escopo.

## Configuração de produção

- Confirmar `basePath: "/connect"` em `next.config.ts`.
- Configurar variáveis de ambiente reais na plataforma de deploy.
- Nunca publicar segredos no repositório.
- Confirmar domínio final: `https://veredasinc.com.br/connect`.

## Smoke tests pós-deploy

- Abrir `/connect` e confirmar carregamento da landing.
- Testar cadastro/login.
- Testar editor de perfil.
- Testar página pública por slug.
- Testar QR/NFC ou rota `/connect/n/[cardId]`.
- Testar download de vCard.
- Testar redirecionamento/analytics de links.
