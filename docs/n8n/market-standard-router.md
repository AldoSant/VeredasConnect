# Router de automações em padrão de mercado

Este guia define o padrão de produto para automações do Veredas Connect: vender fluxos de negócio reutilizáveis, não integrações presas a ferramentas específicas.

## Princípio

O Veredas emite eventos estáveis. O orquestrador recebe, decide o caminho e conecta com as ferramentas que o cliente já usa.

Camada Veredas:

- perfil público;
- lead;
- clique;
- vCard;
- consentimento;
- contexto de origem;
- envelope JSON estável.

Camada de orquestração:

- validação;
- roteamento;
- enriquecimento;
- sincronização;
- comunicação;
- relatórios;
- tratamento de erro.

Camada do cliente:

- sistema de relacionamento;
- base operacional;
- canal de atendimento;
- agenda;
- dashboard;
- data warehouse;
- ferramenta de enriquecimento.

## Eventos recebidos

Use `{{$json.event}}` para rotear:

- `webhook.test`
- `lead.created`
- `link.clicked`
- `vcard.downloaded`

## Receitas de automação recomendadas

### 1. Captação e qualificação

Evento principal: `lead.created`

Objetivo:

- registrar o contato;
- normalizar telefone/email;
- classificar intenção;
- marcar origem, perfil e campanha;
- definir próxima ação.

Saída genérica:

- sistema de relacionamento;
- base operacional;
- fila comercial.

### 2. Roteamento inteligente

Evento principal: `lead.created`

Regras típicas:

- perfil responsável;
- território;
- tipo de serviço;
- horário comercial;
- prioridade;
- capacidade da equipe.

Saída genérica:

- fila de atendimento;
- responsável comercial;
- sistema de tarefas.

### 3. Sequência de follow-up

Eventos:

- `lead.created`
- `link.clicked`
- `vcard.downloaded`

Objetivo:

- esperar uma janela de tempo;
- verificar se houve resposta/conversão;
- criar lembrete ou acionar canal de contato;
- parar a sequência quando o lead avança.

Saída genérica:

- agenda operacional;
- canal de comunicação;
- tarefa de atendimento.

### 4. Enriquecimento de contato

Evento principal: `lead.created`

Objetivo:

- completar dados comerciais;
- segmentar empresa/pessoa;
- apoiar abordagem consultiva.

Cuidados:

- respeitar consentimento e base legal;
- salvar fonte do dado;
- evitar enriquecimento desnecessário.

### 5. Sincronização de pipeline

Eventos:

- `lead.created`
- `webhook.test`

Objetivo:

- criar ou atualizar oportunidade;
- evitar duplicidade com chave idempotente;
- registrar status de sincronização;
- separar falhas recuperáveis de falhas definitivas.

Saída genérica:

- CRM;
- banco operacional;
- sistema de registro do cliente.

### 6. Score de engajamento

Eventos:

- `lead.created`
- `link.clicked`
- `vcard.downloaded`

Objetivo:

- converter ações em pontos;
- priorizar oportunidades quentes;
- mostrar motivo do score;
- comparar ativos e perfis.

### 7. Resumo de performance

Eventos:

- agregados por período;
- pode ser acionado por agenda no orquestrador.

Objetivo:

- consolidar leads, cliques, downloads e conversão;
- comparar campanhas e perfis;
- apontar gargalos de resposta;
- gerar leitura executiva.

## Estrutura n8n recomendada

1. Webhook Trigger
2. Validate Envelope
3. Switch por `event`
4. Sub-workflow por receita
5. Normalize Result
6. Error Handler
7. Delivery Log

## Contrato mínimo para cada ramo

Cada ramo deve produzir:

```json
{
  "recipe": "lead-intake-qualification",
  "event": "lead.created",
  "status": "ok",
  "idempotencyKey": "lead.created:profile-id:lead-id",
  "nextAction": "route-owner"
}
```

## Idempotência

Sugestões de chave:

- `lead.created:{profile.id}:{lead.id}`
- `link.clicked:{profile.id}:{link.id}:{occurredAt}`
- `vcard.downloaded:{profile.id}:{occurredAt}`
- `webhook.test:{profile.id}:{occurredAt}`

Para produção, prefira salvar as chaves processadas em uma base operacional antes de criar registros externos.

## Tratamento de erro

Classifique erros em:

- `retryable`: timeout, limite temporário, rede instável;
- `invalid_payload`: payload incompleto ou versão incompatível;
- `provider_rejected`: ferramenta destino recusou dado;
- `duplicate`: evento já processado;
- `ignored`: evento não relevante para aquele cliente.

## O que não fazer

- Não tratar uma planilha, um app de mensagem ou um CRM específico como o produto.
- Não enviar IP bruto para ferramentas externas.
- Não disparar mensagem sem consentimento e regra clara.
- Não criar lead duplicado a cada retry.
- Não esconder falhas silenciosamente em produção; registre status e causa.
