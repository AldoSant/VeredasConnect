# Rodada Geral de Expansão e Estabilização — Fila de Implementação

> **Para Hermes:** usar este plano como fila operacional. Antes de cada bloco: criar/atualizar todo, implementar em passos pequenos, rodar validação, revisar e commitar. Não avançar para features novas se `lint/test/build` estiverem quebrados.

**Goal:** Finalizar a rodada atual transformando a base técnica de webhooks/automações em um fluxo estável, validado e compreensível para pequenos empresários.

**Architecture:** Manter a robustez no backend, mas esconder jargões técnicos na UI. Priorizar estabilidade primeiro, depois experiência de uso, depois recursos de controle. Evitar novas integrações ou premissas externas nesta rodada.

**Tech Stack:** Next.js 15, TypeScript, Drizzle SQLite, Vitest, Biome, React components em `src/components/editor`, APIs em `src/app/api`.

---

## Contexto atual verificado

- Branch: `main...origin/main [ahead 8]`.
- Existem alterações não commitadas em:
  - `src/lib/db/schema.ts`
  - `src/lib/webhook-deliveries.ts`
- Estado atual está **quebrado no lint** por alterações de retry feitas sem validação final:
  - variável `initialRecordInput` não usada;
  - variável `status` não usada;
  - `currentStoredDelivery` com `any` implícito;
  - `deliveryResult` com `any` implícito;
  - formatação Biome pendente.
- Importante: qualquer relatório anterior dizendo que essa parte estava concluída deve ser tratado como impreciso até passar `npm run lint && npm run test:run && npm run build`.

---

## Critérios de encerramento da rodada

A rodada só termina quando todos forem verdadeiros:

1. `git status --short` limpo, exceto se houver plano/documentação deliberadamente não commitada.
2. `npm run lint` passando.
3. `npm run test:run` passando.
4. `npm run build` passando.
5. Fluxo principal do editor explicado em linguagem simples:
   - configurar automação;
   - testar envio;
   - ver se está funcionando;
   - entender quando há problema;
   - saber o que fazer em seguida.
6. Nenhuma UI principal usando termos técnicos desnecessários como “latência”, “HTTP status”, “endpoint” ou “webhook” sem explicação amigável.
7. Nenhuma funcionalidade nova sem teste mínimo ou validação manual documentada.

---

## Fila de implementação

### Bloco 0 — Parar sangramento e recuperar estado confiável

**Objetivo:** Voltar para um estado compilável antes de qualquer expansão.

**Arquivos:**
- Modificar: `src/lib/webhook-deliveries.ts`
- Modificar: `src/lib/db/schema.ts`
- Verificar: `drizzle/0002_add_webhook_deliveries.sql`

**Passos:**
1. Rodar `git diff src/lib/webhook-deliveries.ts src/lib/db/schema.ts` e revisar exatamente o que foi alterado.
2. Decidir uma de duas opções:
   - **Opção A, recomendada:** remover temporariamente a tentativa de retry automático bloqueante e manter apenas histórico/saúde já commitados.
   - **Opção B:** completar a implementação de retry, mas com testes e migration corretos.
3. Se escolher Opção A:
   - reverter `src/lib/webhook-deliveries.ts` para a versão commitada em `511c00f`;
   - decidir se `attemptCount`/`isRetrying` ficam fora do schema por enquanto ou entram em uma migration completa posterior.
4. Rodar:
   ```bash
   npm run lint
   npm run test:run
   npm run build
   ```
5. Commit:
   ```bash
   git add -A
   git commit -m "chore: restore stable webhook delivery flow"
   ```

**Aceite:** gates verdes e sem código de retry quebrado.

---

### Bloco 1 — Consolidar linguagem user friendly do fluxo de automação

**Objetivo:** Trocar linguagem técnica por linguagem de ação para pequenos empresários.

**Arquivos:**
- Modificar: `src/components/editor/profile-form.tsx`
- Modificar: `src/components/editor/webhook-health-panel.tsx`
- Modificar: `src/components/editor/webhook-delivery-history.tsx`
- Opcional criar: `src/lib/automation-copy.ts`
- Testar: `src/lib/__tests__/automation-copy.test.ts`

**Diretriz de copy:**
- “Webhook” só aparece em campo avançado ou ajuda contextual.
- Usar termos como:
  - “Conexão de automação”
  - “Enviar teste”
  - “Funcionando”
  - “Precisa de atenção”
  - “Não conseguimos entregar”
  - “Verifique o endereço configurado”
- Evitar na tela principal:
  - “latência”
  - “HTTP”
  - “endpoint”
  - “retry”
  - “payload”
  - “idempotência”

**Passos:**
1. Criar mapa de estados amigáveis:
   - sem dados → “Ainda não testado”
   - saudável → “Funcionando”
   - degradado → “Precisa de atenção”
   - falhando → “Não está entregando”
2. Escrever teste para função de mapeamento, se extraída para `automation-copy.ts`.
3. Refatorar `WebhookHealthPanel` para mostrar:
   - título: “Status da automação”;
   - frase curta de orientação;
   - botão: “Atualizar status”;
   - métrica simples: “Últimos envios” e “Funcionaram”.
4. Refatorar `WebhookDeliveryHistory` para usar labels simples:
   - “Enviado” / “Não entregue”;
   - “Quando”;
   - “Destino” apenas se útil;
   - detalhes técnicos recolhidos/menores.
5. Rodar:
   ```bash
   npm run lint
   npm run test:run
   npm run build
   ```
6. Commit:
   ```bash
   git add -A
   git commit -m "feat: simplify automation status experience"
   ```

**Aceite:** tela compreensível para usuário não técnico sem perder histórico para suporte.

---

### Bloco 2 — Fluxo guiado de configuração e teste

**Objetivo:** O usuário saber exatamente o que fazer, sem conhecer termos técnicos.

**Arquivos:**
- Modificar: `src/components/editor/profile-form.tsx`
- Possível criar: `src/components/editor/automation-setup-card.tsx`
- Possível criar: `src/lib/automation-setup-state.ts`
- Testar: `src/lib/__tests__/automation-setup-state.test.ts`

**Passos:**
1. Criar uma seção clara “Automação”.
2. Mostrar checklist simples:
   - “Cole o endereço da automação”;
   - “Salve as alterações”;
   - “Envie um teste”;
   - “Confira se está funcionando”.
3. Exibir estados:
   - sem URL configurada;
   - URL configurada, ainda não testada;
   - teste enviado com sucesso;
   - teste falhou.
4. Adicionar microcopy de ajuda:
   - “Use esta opção se você quer enviar novos contatos/cliques para outra ferramenta.”
   - Sem citar plataformas externas específicas.
5. Rodar gates.
6. Commit:
   ```bash
   git commit -m "feat: add guided automation setup flow"
   ```

**Aceite:** empresário entende o próximo passo sem manual.

---

### Bloco 3 — Validação segura antes de enviar teste

**Objetivo:** Evitar erro bobo e mensagem confusa quando a URL está ausente/inválida.

**Arquivos:**
- Modificar: `src/app/api/webhook/test/route.ts`
- Modificar: `src/components/editor/profile-form.tsx`
- Possível modificar: `src/lib/webhook-dispatcher.ts`
- Testar: `src/lib/__tests__/webhook-dispatcher.test.ts`

**Passos:**
1. Garantir validação de URL antes de disparar teste.
2. Retornar erro amigável na API:
   - “Configure o endereço da automação antes de testar.”
   - “O endereço informado não parece válido.”
3. Mostrar toast amigável no editor.
4. Garantir que erro de URL inválida não gera histórico poluído como falha operacional.
5. Rodar gates.
6. Commit:
   ```bash
   git commit -m "fix: improve automation test validation"
   ```

**Aceite:** erros previsíveis viram orientação, não falha técnica.

---

### Bloco 4 — Reenvio manual, não retry automático bloqueante

**Objetivo:** Dar controle ao usuário sem criar fila/infra complexa nesta rodada.

**Arquivos:**
- Criar: `src/app/api/webhook/deliveries/[id]/retry/route.ts`
- Modificar: `src/lib/webhook-deliveries.ts`
- Modificar: `src/components/editor/webhook-delivery-history.tsx`
- Testar: novo teste unitário para função de retry manual, se possível.

**Decisão técnica:** Não usar `await setTimeout` dentro de request HTTP para simular fila. Isso piora UX, build/test e confiabilidade. Nesta rodada, preferir **reenvio manual imediato** do último evento quando houver dados suficientes para reenviar com segurança. Se não houver payload persistido, mostrar “Não é possível reenviar este evento antigo”.

**Passos:**
1. Verificar se o payload original está persistido. Se não estiver, não implementar reenvio real ainda.
2. Se payload não existir:
   - criar apenas UI/estado “Reenvio manual indisponível para eventos antigos”;
   - planejar persistência segura de payload para rodada futura.
3. Se payload existir ou puder ser persistido com segurança:
   - criar endpoint `POST /api/webhook/deliveries/[id]/retry`;
   - aplicar RBAC por perfil;
   - limitar ação a falhas;
   - registrar nova entrega no histórico.
4. Botão na UI: “Tentar enviar de novo”.
5. Rodar gates.
6. Commit:
   ```bash
   git commit -m "feat: add manual automation resend"
   ```

**Aceite:** controle manual claro, sem pseudo-fila bloqueante.

---

### Bloco 5 — Persistência correta para tentativas futuras

**Objetivo:** Se reenvio real for prioridade, preparar modelo de dados seguro.

**Arquivos:**
- Modificar: `src/lib/db/schema.ts`
- Criar migration: `drizzle/0003_add_webhook_delivery_retry_fields.sql`
- Modificar: `src/lib/webhook-deliveries.ts`
- Testar: `src/lib/__tests__/webhook-deliveries.test.ts`

**Campos possíveis:**
- `attemptCount`
- `lastAttemptAt`
- `sourceDeliveryId`
- `canRetry`
- `payloadSnapshot` somente se não contiver dados sensíveis ou se houver redaction.

**Passos:**
1. Definir se payload pode ser salvo. Se tiver dados pessoais, evitar ou redigir.
2. Criar teste de redaction antes de salvar snapshot.
3. Criar migration manual alinhada ao schema.
4. Atualizar resumo/listagem para não expor payload.
5. Rodar gates.
6. Commit.

**Aceite:** base para retry sem vazar dados sensíveis.

---

### Bloco 6 — Demonstração ponta a ponta local

**Objetivo:** Provar que o fluxo realmente funciona, em vez de só compilar.

**Arquivos:**
- Possível criar script: `scripts/verify-automation-flow.mjs` ou teste de integração.
- Não usar serviço externo real.

**Passos:**
1. Subir servidor local se necessário.
2. Criar endpoint local fake que responde sucesso e outro que responde erro.
3. Disparar `/api/webhook/test` com sucesso.
4. Confirmar via `/api/webhook/deliveries` que apareceu no histórico.
5. Confirmar via `/api/webhook/health` que status mudou.
6. Repetir cenário de falha e confirmar mensagem amigável.
7. Documentar resultado no commit ou em `docs/`.

**Aceite:** evidência real de execução local.

---

### Bloco 7 — Limpeza de produto: reduzir ruído técnico

**Objetivo:** Deixar o produto polido antes de avançar para novas funcionalidades.

**Arquivos:**
- Revisar componentes em `src/components/editor/`
- Revisar APIs de webhook em `src/app/api/webhook/`
- Revisar testes em `src/lib/__tests__/`

**Passos:**
1. Remover `console.log/warn/error` desnecessários ou trocar por logging controlado.
2. Garantir nomes consistentes: “automação” na UI, “webhook” no código interno.
3. Verificar mensagens de erro em português simples.
4. Garantir botões com loading/disabled correto.
5. Rodar gates.
6. Commit:
   ```bash
   git commit -m "chore: polish automation flow"
   ```

**Aceite:** sem ruído técnico na experiência principal.

---

### Bloco 8 — Documentação operacional mínima

**Objetivo:** Registrar como usar e validar o fluxo sem transformar o usuário em técnico.

**Arquivos:**
- Criar: `docs/automation-flow.md`
- Possível modificar: README ou docs existentes.

**Conteúdo:**
1. O que a automação faz.
2. Como configurar.
3. Como testar.
4. O que significa cada status.
5. O que fazer quando não entrega.
6. Limites atuais: sem prometer integrações não existentes.

**Commit:**
```bash
git commit -m "docs: document automation flow"
```

**Aceite:** documentação curta, prática e alinhada à UI.

---

### Bloco 9 — Revisão final e checkpoint

**Objetivo:** Encerrar a rodada com estado confiável e decisão clara do próximo ciclo.

**Passos:**
1. Rodar:
   ```bash
   npm run lint
   npm run test:run
   npm run build
   git status --short --branch
   git log --oneline -10
   ```
2. Revisão somente leitura com subagente local:
   - segurança;
   - RBAC;
   - UX simples;
   - regressões;
   - jargão técnico na UI.
3. Corrigir blockers reais.
4. Commit final se houver ajustes.
5. Reportar ao Aldo:
   - o que mudou;
   - evidência de validação;
   - commits;
   - riscos restantes;
   - próximos 2 caminhos possíveis.

**Aceite:** rodada fechada e sem pendências técnicas ocultas.

---

## Riscos e decisões abertas

1. **Retry automático bloqueante:** não deve seguir como está. Pode causar lentidão e instabilidade em requests.
2. **Payload para reenvio:** sem persistir payload, não há reenvio real de eventos antigos. Persistir payload pode envolver dados pessoais; precisa redaction/limite.
3. **Fila real:** só implementar em rodada futura se houver necessidade clara. Nesta rodada, não adicionar Redis/SQS/infra externa.
4. **Jargão técnico:** a base interna pode usar termos técnicos, mas a UI não deve exigir isso do usuário.
5. **Escopo:** não assumir integrações externas nem plataformas não citadas pelo Aldo.

---

## Ordem recomendada de execução

1. Bloco 0 — recuperar estabilidade.
2. Bloco 1 — simplificar linguagem.
3. Bloco 2 — fluxo guiado.
4. Bloco 3 — validação amigável.
5. Bloco 4 — reenvio manual somente se tecnicamente seguro.
6. Bloco 6 — demonstração E2E local.
7. Bloco 7 — polimento.
8. Bloco 8 — documentação.
9. Bloco 9 — revisão final.

Bloco 5 fica condicionado à decisão sobre persistência segura de payload.
