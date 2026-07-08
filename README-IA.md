# Configuração de IA — Frontend Lavanderia Beltrão

Esta configuração orienta agentes de IA (Claude Code e Codex no VS Code) a trabalhar com
segurança nesta SPA Angular 14 (Bootstrap 5 + Material 14, RxJS, Firebase Hosting).

## Como funciona

- `PROJECT_RULES.md` é a **fonte de verdade**. Os demais arquivos apontam para ele.
- `AGENTS.md` roteia o agente entre regras, commands, skills e rules.
- `CLAUDE.md` / `CODEX.md` especializam o comportamento por ferramenta.
- `.claude/` = permissões seguras (`settings.json`), commands, skills e rules por domínio.
- `.codex/` = configuração e prompts do Codex, alinhados às mesmas regras.
- `docs/` = templates de relatório (handoff), ADR e regras de domínio.

## Antes de pedir uma tarefa

1. Abra o Claude Code na raiz **deste** repositório (não na pasta pai `LavanderiaBeltrao`).
2. Peça ao agente para ler apenas o necessário.
3. Para integração com a API, environments, deploy ou valores financeiros: exija plano antes da edição.

## Limites sempre válidos

- Não editar `environment*.ts` (URLs/Firebase) sem autorização.
- Não executar deploy (Firebase/Docker), push ou comandos destrutivos.
- Não inventar rotas, componentes, endpoints ou campos que não existem.
- Manter os nomes de campos JSON casando com o backend Spring.
