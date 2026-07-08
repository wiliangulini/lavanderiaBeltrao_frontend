---
description: Registro de decisão arquitetural (frontend)
---

# architecture-decision

Use quando a tarefa envolver escolha técnica relevante (ex.: centralizar URL da API, adotar interceptors, extrair módulo compartilhado, padronizar tratamento de erro HTTP, migrar roteamento hash→path). Metodologia: skill `architecture-review`.

## Responder
- problema e contexto real (Angular 14 NgModule, Reactive Forms, Bootstrap 5 + Material 14, roteamento hash, integração via `environment` absoluto + `proxy.conf.js` subutilizado);
- opções consideradas;
- decisão recomendada;
- trade-offs (segurança, manutenção, performance, compatibilidade com o backend);
- impacto em usuários e no deploy (Firebase Hosting);
- como registrar em `docs/adr/` (use `TEMPLATE-adr.md`) se autorizado.

## Saída esperada
ADR curto e recomendação clara. Não implementar sem autorização.
