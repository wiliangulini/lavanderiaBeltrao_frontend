---
name: senior-code-review
description: Método de revisão técnica de código/diff na SPA Angular. Use para revisar sem editar.
---

# senior-code-review

Metodologia de revisão (entrada via command `review-code`).

## Critérios
- Correção funcional (formulários, rotas hash, chamadas HTTP/RxJS).
- Integração com o backend (URLs de `environment`, verbos, campos JSON) coerente.
- Gestão de observables/subscriptions (`take(1)`/`first()`), sem vazamento.
- Tipagem TypeScript e modelos (`clientes.ts`, `pedidos-clientes.ts`).
- UI/UX: responsividade, Material + Bootstrap, acessibilidade básica.
- Simplicidade e risco de regressão.

## Saída
Achados classificados (crítico→melhoria) com impacto e recomendação objetiva.
