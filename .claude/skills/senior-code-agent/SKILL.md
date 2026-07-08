---
name: senior-code-agent
description: Método de implementação controlada na SPA Angular 14 (menor mudança suficiente). Use ao implementar feature/correção em componente/serviço/rota.
---

# senior-code-agent

Metodologia de implementação (entrada via command `create-code`).

## Método
1. Entender o contexto mínimo (só os arquivos impactados).
2. Confirmar escopo e checar rules do domínio (`angular-components-services`, `integracao-api-proxy`).
3. Ler componente/serviço/módulo afetados; se o contrato com o backend mudar, confirmar no backend.
4. Planejar a menor mudança; sinalizar impacto em integração/valores financeiros.
5. Implementar incrementalmente, preservando padrões (NgModule, Reactive Forms, RxJS `take(1)`), declarando novos componentes no `AppModule`.
6. Validar com `npm run build` (e `npm test` se houver spec).
7. Relatar com evidências.

## Não fazer
Migrar para standalone/signals, trocar libs de UI, alterar `environment*.ts`/deploy ou inventar rotas/campos sem autorização.
