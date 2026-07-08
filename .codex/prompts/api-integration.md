# Prompt — Integração com a API (Frontend)

Atue como responsável pela integração do frontend com a API Spring do backend. Leia
`PROJECT_RULES.md`, `AGENTS.md`, `.codex/instructions.md` e as rules `integracao-api-proxy`
e `fluxo-pedidos-relatorios`.

Contexto:
`<DESCREVA A MUDANÇA DE INTEGRAÇÃO>`

Regras: antes de alterar contrato, confirmar endpoint/campos no backend
(`lavanderiaBeltrao_backend`, `/api/clientes`, `/api/pedidos`); reutilizar `DataCrudService`;
manter nomes de campos JSON idênticos às entidades do backend (`numberPedido`, `valorFinal`,
`entrega_estimada`, flags de status); tratar erro HTTP e completar observables (`take(1)`/`first()`);
não alterar `environment*.ts`/`proxy.conf.js` sem autorização.

Entregue: análise de compatibilidade, mudanças, validações (`npm run build`), riscos e próximos passos.
