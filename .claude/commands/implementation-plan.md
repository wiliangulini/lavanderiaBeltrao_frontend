---
description: Plano técnico antes de implementação sensível ou grande (frontend)
---

# implementation-plan

Use antes de editar quando a tarefa for ambígua, grande ou tocar integração com a API, environments, deploy ou valores financeiros.

## Leituras obrigatórias
`PROJECT_RULES.md`, `AGENTS.md` e a rule do domínio afetado (`.claude/rules/`).

## O plano deve conter
- objetivo;
- módulo/componente/serviço prováveis;
- rules aplicáveis;
- impacto na integração com `/api/*` e nos campos JSON compartilhados com o backend;
- riscos e pontos que exigem autorização;
- estratégia de menor mudança;
- validações (`npm run build`, `npm test`);
- critérios de aceite.

## Saída
Plano curto e acionável. Não editar até autorização.
