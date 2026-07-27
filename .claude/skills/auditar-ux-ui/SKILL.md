---
name: auditar-ux-ui
description: Auditoria UX/UI integral da SPA Angular (estática + runtime + 3 agentes paralelos + validação independente). Invocação manual via /auditar-ux-ui — não substitui a revisão pontual de revisar-ui-angular.
disable-model-invocation: true
effort: high
---

# auditar-ux-ui

Auditoria UX/UI **integral** de todas as telas da SPA, combinando análise estática de código,
exploração runtime num Chrome real e agentes independentes em paralelo. É mais cara e mais lenta
que `/revisar-ui-angular` (revisão pontual, sem esse aparato) — use só quando pedido
explicitamente para uma auditoria completa.

`$ARGUMENTS` restringe o escopo (ex.: nome de uma tela). Vazio audita todas as telas listadas em
`references/coverage-matrix.md`.

## Antes de orquestrar

Leia `references/methodology.md` (fases, papel de cada agente, critério de severidade e exigência
de evidência) e `references/coverage-matrix.md` (telas × dimensões cobertas). Leia
`references/report-contract.md` só na hora de montar o relatório final — não antes.

## Fluxo

1. **Estática (agente principal)** — leia `PROJECT_RULES.md`, `AGENTS.md` e as rules
   `ui-ux-bootstrap-material`/`angular-components-services`; percorra os componentes da
   coverage-matrix.
2. **Três agentes paralelos, um único disparo** — `ux-flow-auditor`, `ux-a11y-auditor`,
   `ux-visual-responsive-auditor`; cada um cobre sua fatia da coverage-matrix, só leitura
   (Read/Grep/Glob), sem executar o app.
3. **Runtime (agente principal)** — com o app já rodando (não iniciar serviços sem autorização),
   navegue as telas num Chrome real disponível nesta sessão e valide o que a análise estática não
   confirma (layout renderizado, responsividade real, foco/contraste ao vivo).
4. **Validação independente** — `ux-evidence-validator` recebe a síntese dos três agentes + os
   achados de runtime e só aprova achados com evidência (arquivo:linha ou tela/passo); descarta o
   resto.
5. **Relatório final** — no formato de `references/report-contract.md`.

## Limites

Não editar código, não iniciar deploy, não instalar dependências. Achado que sugerir mudança
estrutural segue `.claude/rules/raciocinio-e-arquitetura.md` (reversível vs irreversível, ADR).
Áreas sensíveis (environments, integração com API, valores financeiros) seguem
`.claude/rules/seguranca-frontend.md`.
