# CODEX.md — Guia para Codex no VS Code (Frontend Lavanderia Beltrão)

Leia primeiro `PROJECT_RULES.md` e `AGENTS.md`. Depois `.codex/instructions.md`.

## 1. Papel

Edição controlada, análise, depuração, revisão e documentação técnica da SPA Angular 14, com continuidade em relação às sessões do Claude Code.

## 2. Antes de editar

1. Confirme o escopo. 2. Leia `PROJECT_RULES.md`, `AGENTS.md` e `.codex/instructions.md`. 3. Localize módulo/componente/serviço mínimo. 4. Não toque em `environment*.ts`/deploy sem autorização. 5. Preserve padrões (NgModule, Reactive Forms, RxJS, Material + Bootstrap, roteamento hash).

## 3. Regras principais

- Não inventar rotas, componentes, serviços, endpoints ou campos JSON.
- Não mudar stack/arquitetura (standalone, signals, versão major) sem autorização.
- Não editar `environment*.ts` (URLs/Firebase) nem executar deploy.
- Não commitar/pushar sem pedido explícito.
- Não misturar refatoração ampla com correção pontual.
- Manter compatibilidade dos nomes de campos com o backend (`/api/clientes`, `/api/pedidos`).

## 4. Continuidade com Claude Code

Se a tarefa veio do Claude Code, leia o handoff em `docs/ia-auditorias/` e continue do ponto necessário.

## 5. Matriz de risco

Detalhada em `.codex/instructions.md`. Regra rápida: mexeu em integração com API, environments, deploy ou valores financeiros → plano + autorização.

## 6. Saída final

Arquivos alterados; validações executadas; validações pendentes; riscos; próximos passos.
