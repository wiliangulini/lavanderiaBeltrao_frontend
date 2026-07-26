# Rule — Integração com a API e proxy

Use para chamadas HTTP, URLs, environments e proxy. O contrato precisa casar com o backend Spring.

## Fatos
- `DataCrudService` monta URL absoluta: `environment.backend.baseUrl` + `environment.API` (`api/`) + recurso.
  - dev `http://localhost:8080/api/...`; prod `http://lavanderiabeltrao.com.br:8080/api/...`.
- Endpoints: `pedidos`(+`/{id}`,`/search?query`), `clientes`(+`/{id}`,`/search?query`).
- **`pedidos/next-number` foi removida (ADR 0007, Gate D)** — não existe mais no backend nem tem
  consumidor no frontend. `numberPedido` (`yyyyMMdd-NNN` para pedidos novos) é gerado no servidor
  dentro do `POST /pedidos` e adotado da resposta; não pré-buscar nem calcular no cliente.
- `proxy.conf.js`: `/api` → `http://lavanderiabeltrao.com.br:8080/`. Como o service usa baseUrl absoluta, o proxy **praticamente não é exercido** hoje — não assumir o contrário sem verificar.
- Backend (`CorsConfig`) libera `http://localhost:4200` e os domínios de produção; `allowCredentials(true)`.

## Regras
- Antes de alterar contrato, confirmar endpoint/campos no backend (`lavanderiaBeltrao_backend`).
- Nomes de campos JSON idênticos às entidades do backend (`numberPedido`, `valorFinal`, `entrega_estimada`, flags de status) — divergência quebra a integração silenciosamente.
- Não alterar `environment*.ts` (URLs/Firebase) nem `proxy.conf.js` sem autorização; mantê-los coerentes entre si.
- Tratar erro HTTP e resposta vazia; completar observables de request (`take(1)`/`first()`).
- Reutilizar `DataCrudService`; não criar acesso paralelo à API.
