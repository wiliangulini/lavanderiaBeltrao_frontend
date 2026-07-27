# Metodologia — auditoria UX/UI integral

## Fases

1. **Estática** — o agente principal lê rules/domínio e percorre os componentes reais (não
   inventa telas/campos). Serve de base para orientar os 3 agentes paralelos.
2. **Paralela (3 agentes, um único disparo)**:
   - `ux-flow-auditor` — fluxo de tela, Reactive Forms, navegação (roteamento hash), estados de
     erro/validação.
   - `ux-a11y-auditor` — acessibilidade básica: labels, foco, contraste, semântica HTML, ARIA.
   - `ux-visual-responsive-auditor` — consistência visual Bootstrap × Material, responsividade,
     layout de impressão (`print-js`).
   Cada agente só lê código (Read/Grep/Glob) — não executa o app, não tem memória, não escreve.
3. **Runtime** — só o agente principal (não os 3 paralelos) usa um Chrome real disponível na
   sessão para confirmar visualmente o que a leitura estática não resolve sozinha (renderização
   real, quebra de layout, foco visível). Não inicia servidor sem autorização explícita.
4. **Validação independente** — `ux-evidence-validator` recebe a síntese das 3 fases anteriores e
   audita se cada achado tem evidência verificável (arquivo:linha para achados estáticos,
   tela/passo para achados de runtime). Achado sem evidência é descartado antes do relatório.
5. **Relatório** — formato de `report-contract.md`.

## Critério de severidade

Mesma escala usada em `/revisar-ui-angular`: **crítico** (quebra uso/acessibilidade básica) →
**importante** (inconsistência visível, mas contornável) → **melhoria** (polimento, não
bloqueia). Todo achado declara a severidade e a evidência.

## Regras gerais

- Não editar código nesta auditoria — só relatar.
- Não inventar tela, campo, endpoint ou comportamento que não exista no código real.
- Divergência entre o que o código faz e o que uma rule/doc afirma é, em si, um achado (classificar
  como "documentação desatualizada", não como bug de UI).
