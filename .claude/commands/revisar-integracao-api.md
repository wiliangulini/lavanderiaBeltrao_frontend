---
description: Revisão da integração com a API do backend (frontend)
---

# revisar-integracao-api

Use para revisar a comunicação com o backend Spring. Rule base: `integracao-api-proxy`.

## Contexto real
- `DataCrudService` monta URL absoluta: `environment.backend.baseUrl` + `environment.API` (`api/`) + recurso.
  - dev: `http://localhost:8080/api/...`; prod: `http://lavanderiabeltrao.com.br:8080/api/...`.
- Endpoints usados: `pedidos`, `pedidos/{id}`, `pedidos/next-number`, `pedidos/search?query`, `clientes`, `clientes/{id}`, `clientes/search?query`.
- `proxy.conf.js` mapeia `/api` → `lavanderiabeltrao.com.br:8080`, mas o service usa baseUrl absoluta (proxy subutilizado).

## Verificar
- URLs/verbos/params batendo com o contrato do backend (`/api/clientes`, `/api/pedidos`).
- Nomes de campos JSON casando com as entidades (`numberPedido`, `valorFinal`, `entrega_estimada`, flags de status).
- Tratamento de erro HTTP e de resposta vazia; uso de `take(1)`/`first()`.
- Coerência entre `environment.ts`, `environment.prod.ts` e `proxy.conf.js`.
- Efeito de CORS (backend libera `localhost:4200` e domínios de produção).

## Saída esperada
Achados de integração classificados, sinalizando qualquer divergência que quebre a comunicação com o backend. Não editar sem pedido.
