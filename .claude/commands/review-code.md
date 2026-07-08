---
description: Revisão técnica de código, diff ou implementação (frontend)
---

# review-code

Use para revisar sem alterar por padrão. Metodologia: skill `senior-code-review`.

## Leituras obrigatórias
Diff/área indicada + rules relevantes (`angular-components-services`, `integracao-api-proxy`, `ui-ux-bootstrap-material`, `seguranca-frontend`).

## Verificar
- aderência ao escopo;
- correção funcional (formulários, rotas hash, chamadas RxJS);
- integração com a API (URLs de `environment`, verbos, campos JSON) casando com o backend;
- gestão de subscriptions/observables (`take(1)`/`first()`), evitando memory leak;
- tipagem TypeScript e contratos dos modelos (`clientes.ts`, `pedidos-clientes.ts`);
- UI/UX: responsividade, Material + Bootstrap, acessibilidade básica;
- valores financeiros e máscaras;
- redundância/complexidade desnecessária.

## Saída esperada
Achados classificados (crítico→melhoria) com impacto e recomendação. Não editar sem pedido.
