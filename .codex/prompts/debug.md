# Prompt — Depuração (Frontend)

Atue como agente de depuração da SPA Angular. Leia `PROJECT_RULES.md`, `AGENTS.md`,
`CODEX.md` e `.codex/instructions.md`. Investigue **antes** de editar.

Sintoma:
`<ERRO NO CONSOLE / FALHA DE REQUEST / TELA QUEBRADA / ERRO DE BUILD>`

Procedimento: entenda o sintoma → localize componente/serviço/módulo/environment prováveis →
formule hipóteses ordenadas (ex.: URL de API errada, campo JSON divergente do backend,
subscription não resolvida, import faltando no módulo, CORS) → valide por leitura e
`npm run build`/`npm test` → corrija a menor causa confirmada.

Para erro de integração, confirme o contrato no backend antes de mudar o frontend. Ao final,
informe causa confirmada, correção mínima, validações e hipóteses descartadas.
