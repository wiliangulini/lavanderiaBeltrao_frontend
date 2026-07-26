---
name: frontend-api-integration
description: Método para manter a integração do frontend Angular com a API Spring do backend. Use ao criar/alterar chamadas HTTP, URLs, modelos ou tratamento de resposta.
---

# frontend-api-integration

Metodologia para integração segura com o backend `/api/*`.

## Contexto real
- `DataCrudService` centraliza o CRUD; monta URL absoluta com `environment.backend.baseUrl` + `environment.API` (`api/`).
- dev `http://localhost:8080/api/...`; prod `http://lavanderiabeltrao.com.br:8080/api/...`.
- Endpoints: `pedidos`(+`/{id}`,`/search?query`), `clientes`(+`/{id}`,`/search?query`).
- `pedidos/next-number` foi removida (ADR 0007, Gate D) — `numberPedido` (`yyyyMMdd-NNN` para pedidos novos) é gerado no servidor dentro do `POST` e adotado da resposta, nunca pré-buscado.
- `proxy.conf.js` (`/api` → domínio:8080) existe, mas o service usa baseUrl absoluta (proxy subutilizado).

## Método
1. Antes de alterar contrato, **confirmar o endpoint/campos no backend** (`lavanderiaBeltrao_backend`).
2. Reutilizar `DataCrudService`; não criar `HttpClient` paralelo.
3. Manter nomes de campos JSON idênticos às entidades do backend (`numberPedido`, `valorFinal`, `entrega_estimada`, flags de status).
4. Tratar erro HTTP e resposta vazia; usar `take(1)`/`first()` para completar observables de request.
5. Manter `environment.ts`, `environment.prod.ts` e `proxy.conf.js` coerentes; não expor/alterar sem autorização.

## Cuidados
- Divergência de nome de campo = quebra silenciosa da integração.
- CORS: backend libera `localhost:4200` e domínios de produção; mudanças de origem exigem ajuste no backend.
