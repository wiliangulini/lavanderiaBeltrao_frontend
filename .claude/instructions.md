# .claude/instructions.md — Protocolo operacional (Frontend)

Complementa `CLAUDE.md`. Não duplica `PROJECT_RULES.md`.

## Protocolo de sessão

1. Identifique objetivo e escopo.
2. Leia só os documentos necessários (regra central → rule do domínio → arquivos impactados).
3. Verifique se a tarefa toca área sensível (integração com a API, environments, deploy, valores financeiros).
4. Planeje antes de editar quando não for trivial.
5. Aplique menor mudança suficiente e preserve padrões (NgModule, Reactive Forms, RxJS, Material + Bootstrap, SCSS, roteamento hash).
6. Valide com `npm run build` e/ou `npm test`. Não rode deploy.
7. Registre resultado e pendências.

## Parar e pedir autorização explícita

- Alterar `DataCrudService`, `environment*.ts` ou `proxy.conf.js` (integração/URLs).
- Alterar nomes de campos que trafegam para o backend (`numberPedido`, `valorFinal`, `entrega_estimada`, etc.).
- Alterar cálculo/máscara de valores financeiros no formulário de pedido.
- Deploy (Firebase/Docker), push, comando destrutivo, leitura/edição de secrets.
- Migração de stack (standalone, signals, versão major) ou troca de lib de UI.

## Economia de tokens

Não leia `package-lock.json`, `node_modules` nem `docs/ia-auditorias/` por inteiro. Leia só o relatório relacionado à tarefa.
