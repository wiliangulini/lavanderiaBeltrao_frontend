---
description: Refatoração segura sem mudança de comportamento (frontend)
---

# refactor-code

Use só para melhorar estrutura mantendo comportamento. Metodologia: skill `safe-refactor`.

## Regras
- Preservar rotas (hash), seletores de componentes e a API pública dos serviços.
- Preservar nomes de campos JSON trocados com o backend.
- Não misturar refatoração com feature nova.
- Não migrar para standalone/signals sem autorização.
- Alterar em passos pequenos; validar `npm run build` antes/depois; rodar `npm test` se houver spec.

## Saída esperada
Descrição do que foi reorganizado, prova de que comportamento e integração não mudaram, validação de build.
