# Automação operacional

Este guia explica o fluxo de automação do Editor em linguagem prática.

## O que é

A automação envia eventos importantes do perfil para uma ferramenta externa configurada pelo usuário. Exemplos:

- teste de configuração;
- novo contato recebido;
- ação importante capturada pela página.

A tela do Editor evita termos técnicos e mostra apenas o que o usuário precisa saber: se está configurado, se o teste foi enviado e se os últimos envios deram certo.

## Como configurar

1. Acesse o Editor.
2. Vá até a seção **Automação**.
3. Cole o **Endereço da automação** recebido da ferramenta externa.
4. Clique em **Salvar**.
5. Clique em **Enviar teste**.
6. Confira o **status da automação** e os **últimos envios**.

## O que cada status significa

- **Sem testes ainda:** nenhum envio foi registrado. Envie um teste para confirmar.
- **Funcionando:** os envios recentes chegaram normalmente.
- **Atenção:** houve falhas recentes. Confira o endereço configurado e envie outro teste.
- **Precisa de ajuste:** os envios recentes falharam. Corrija a configuração antes de depender da automação.

## Quando o teste falhar

1. Confira se o endereço foi colado corretamente.
2. Verifique se a ferramenta externa está ativa.
3. Salve novamente o perfil.
4. Envie outro teste.
5. Consulte os últimos envios para confirmar o resultado.

## Reenvio manual

Nesta rodada, o sistema não promete reenviar registros antigos automaticamente.

Motivo: por segurança, os dados completos do evento não são salvos no histórico. Assim, se um envio antigo falhou, o painel explica o limite e orienta o usuário a enviar um novo teste após corrigir a configuração.

Para liberar reenvio real no futuro, será necessário implementar armazenamento seguro do payload, com redaction de dados sensíveis, limite de tamanho e política de retenção.

## Regras de segurança

- Não colar senhas, tokens ou chaves secretas no campo de endereço.
- Não expor query strings sensíveis no histórico; a interface mostra host e caminho, não a URL completa.
- Não salvar payload completo sem política clara de privacidade e retenção.
- Mensagens para usuário final devem permanecer simples e acionáveis.

## Validação técnica desta rodada

Comandos esperados para fechamento:

```bash
npm run lint
npm run test:run
npm run build
npm run test:e2e
```
