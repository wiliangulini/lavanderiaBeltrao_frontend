---
description: Auditoria final antes de encerrar a tarefa (frontend)
---

# final-audit

Use ao final de implementação, correção ou refatoração.

## Checklist
- Escopo original atendido?
- Houve alteração fora do escopo?
- Integração com o backend preservada (URLs, verbos, campos JSON)?
- Rotas/roteamento hash intactos?
- Novos componentes declarados no `AppModule`?
- Build validado (`npm run build`)? Testes rodados quando aplicável (`npm test`)?
- `environment*.ts` e config de deploy preservados?
- Riscos pendentes e handoff claros?

## Saída
Relatório objetivo: resumo, arquivos alterados, validações, riscos, pendências, próximos passos. Registrar em `docs/ia-auditorias/` se for handoff relevante.
