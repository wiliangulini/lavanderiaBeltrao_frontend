---
name: implementation-planning
description: Método para planejar antes de executar tarefas sensíveis/grandes no frontend. Use para produzir um plano mínimo com riscos e critérios de aceite.
---

# implementation-planning

Metodologia de planejamento (entrada via command `implementation-plan`).

## Plano mínimo
- objetivo;
- módulo/componente/serviço prováveis;
- rules aplicáveis;
- impacto na integração com `/api/*` e nos campos JSON;
- riscos e pontos que exigem autorização;
- sequência de passos;
- validações (`npm run build`, `npm test`);
- rollback conceitual;
- critérios de aceite.

## Regra
Não editar antes da autorização quando houver risco médio/alto.
