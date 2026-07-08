---
name: safe-refactor
description: Método de refatoração sem alterar comportamento na SPA Angular. Use para melhorar estrutura preservando rotas, seletores, API de serviços e integração.
---

# safe-refactor

Metodologia de refatoração (entrada via command `refactor-code`).

## Restrições
- Não alterar rotas (hash), seletores de componentes nem a API pública dos serviços.
- Não alterar nomes de campos JSON trocados com o backend.
- Não migrar para standalone/signals nem trocar libs de UI.
- Não mudar regra de negócio nem combinar com feature nova.
- Passos pequenos; validar `npm run build` antes/depois; `npm test` se houver spec.

## Confirmar ao final
Comportamento, rotas e integração idênticos; build ok.
