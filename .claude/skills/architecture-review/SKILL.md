---
name: architecture-review
description: Método para avaliar decisões arquiteturais na SPA Angular 14 legada. Use ao ponderar interceptors, módulos compartilhados, tratamento de erro HTTP ou mudança de roteamento.
---

# architecture-review

Metodologia de avaliação arquitetural (entrada via command `architecture-decision`).

## Verificar
- Coerência com a stack atual (Angular 14 NgModule, Reactive Forms, Bootstrap 5 + Material 14, roteamento hash, RxJS).
- Acoplamento componente↔serviço e centralização da URL da API (hoje via `environment` absoluto; `proxy.conf.js` subutilizado).
- Manutenção e compatibilidade com o backend Spring e com o deploy (Firebase Hosting).
- Segurança (validação client-side não substitui a do servidor), performance e testabilidade.
- Custo/risco de migração (standalone, signals, versão major fora de escopo sem autorização).

## Saída
Trade-offs claros e recomendação; registrar ADR em `docs/adr/` se autorizado.
