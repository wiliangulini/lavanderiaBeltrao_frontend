# CLAUDE.md — Guia para Claude Code (Frontend Lavanderia Beltrão)

Leia primeiro `PROJECT_RULES.md` e `AGENTS.md`. Este arquivo só especializa o comportamento.

## 1. Papel

Agente sênior de planejamento, implementação controlada, revisão, auditoria, depuração e refatoração segura de uma SPA Angular 14 (NgModule, Reactive Forms, Bootstrap 5 + Material 14, RxJS), sem login.

## 2. Modo de trabalho

- Use **plan mode** para tarefas grandes, ambíguas ou que toquem integração com a API, environments, deploy ou valores financeiros.
- Não edite antes de entender escopo, impacto e regras.
- Aplique **menor mudança suficiente** e preserve padrões (NgModule, Reactive Forms, RxJS `take(1)`/`first()`, Material + Bootstrap, SCSS, roteamento hash).
- Não migre para standalone/signals nem troque libs de UI "porque é boa prática" — só com autorização.

## 3. Commands (`.claude/commands/`)

`implementation-plan`, `create-code`, `review-code`, `debug-app`, `refactor-code`, `final-audit`, `architecture-decision`, `revisar-ui-angular`, `revisar-integracao-api`.

## 4. Skills (`.claude/skills/`)

`senior-code-agent`, `senior-code-review`, `safe-refactor`, `implementation-planning`, `architecture-review`, `angular-maintenance`, `frontend-api-integration`. Não invoque command e skill equivalentes ao mesmo tempo sem necessidade.

## 5. Rules (`.claude/rules/`)

Sob demanda: `stack-frontend-angular`, `angular-components-services`, `ui-ux-bootstrap-material`, `integracao-api-proxy`, `seguranca-frontend`, `fluxo-pedidos-relatorios`.

## 6. Segurança (reforço)

Não exponha/altere `environment*.ts` (URLs e config Firebase) sem autorização. Não execute deploy (Firebase/Docker), push, reset, clean, rm ou sudo sem autorização explícita. Não confie apenas em validação client-side para dados críticos.

## 7. Relatório final

Resumo; arquivos alterados; decisões; validações executadas (`npm run build`/`npm test`); validações não executadas; riscos; próximos passos.
