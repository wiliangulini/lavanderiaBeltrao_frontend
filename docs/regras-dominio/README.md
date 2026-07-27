# Regras de domínio — Frontend Lavanderia Beltrão

Documentos longos de domínio que não cabem em `PROJECT_RULES.md`. Lidos sob demanda.
Não devem contradizer `PROJECT_RULES.md` nem as rules em `.claude/rules/`.

## Domínio confirmado (resumo)
- **Registrar pedido** (`PedidosComponent`): cabeçalho + até 6 itens (`quantidade`/`descricao`/`total`/`retirada` + `1..5`), `valorFinal`, flags de status. Numeração diária (`yyyyMMdd-NNN`) gerada no servidor dentro do `POST /api/pedidos` (ADR 0007); `GET /api/pedidos/next-number` foi removida (Gate D).
- **Pesquisar pedido** (`PesquisaComponent`): busca via `/api/pedidos/search?query`.
- **Cadastrar/editar clientes** (`CadastroComponent`/`EditarComponent`): CRUD via `/api/clientes`.
- **Buscar CEP** (`BuscaCepComponent` + `ConsultaCepService`): ViaCEP, cidade Francisco Beltrão/PR.
- Impressão de recibos via `print-js`.

## Não confirmado no projeto (não inventar)
- Login/autenticação/rota administrativa.
- Cálculo de total server-side, desconto, frete, pagamento/gateway.
- Módulos lazy-loaded (roteamento é único e hash).
- Relatórios além da impressão via `print-js`.

## Sugestões de documentos futuros (criar quando houver necessidade real)
- `pedidos.md` — regras detalhadas do formulário de pedido e impressão.
- `clientes.md` — regras de cadastro/validação e integração com CEP.

Cada documento novo deve citar a evidência no código que o fundamenta.
