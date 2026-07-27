---
paths:
  - "src/app/{pedidos,pesquisa,formulario,cadastro,editar}/**"
  - "src/app/shared/{pedidos-clientes,clientes}.ts"
---

# Rule — Fluxo de pedidos e relatórios (frontend)

Use ao mexer nas telas de pedido/cliente ou na impressão de recibos.

## Domínio real (confirmado)
- Telas: `registrar-pedido` (PedidosComponent), `pesquisar-pedido` (PesquisaComponent), `cadastrar-clientes` (CadastroComponent), `editar-clientes` (EditarComponent), `buscar-cep` (BuscaCepComponent).
- Pedido tem cabeçalho + até 6 itens (`quantidade`/`descricao`/`total`/`retirada` e variantes `1..5`), `valorFinal` e flags `pedidoRegistrado`/`pedidoPago`/`pedidoRetirado` — espelha o **contrato JSON** do backend (`PedidosResponseDTO`/`PedidosRequestDTO`). No backend os itens são armazenados normalizados (`pedido_itens`) e o DTO achata para esses mesmos 6 slots; `valorFinal` é calculado de forma autoritativa no servidor a partir dos itens. O frontend (`onChange()` em `formulario.component.ts`) soma os `total*` no cliente e escreve uma **prévia** local em `valorFinal` só para UX durante o preenchimento — essa prévia nunca é fonte de verdade; o valor exibido após o `POST`/consulta é sempre o retornado pelo backend.
- Numeração diária atômica gerada no servidor dentro do `POST /api/pedidos` (ADR 0007): código
  público `yyyyMMdd-NNN`, reinicia a cada dia. `GET /api/pedidos/next-number` foi removida (Gate
  D) — o formulário não pré-busca mais número; adota o valor retornado pelo `POST` e só então
  revela Imprimir/WhatsApp. Legado (antes da migração) mantém o número sequencial antigo. Busca
  via `/search?query`.
- CEP via `ConsultaCepService` (ViaCEP; cidade Francisco Beltrão/PR). Impressão via `print-js`.

## Regras
- Não inventar nova tela, status, desconto, frete ou pagamento sem autorização (não existem hoje). Cálculo de `valorFinal` já é feito no backend (`PedidosService`) — não duplicar a soma no frontend como fonte de verdade.
- Campos financeiros (`total*`, `valorFinal`) e máscaras são sensíveis: validar antes de alterar.
- Manter os nomes de campos casando com o DTO do backend — é o contrato real, não a entidade/schema.
- Alterar o layout de impressão deve preservar o recibo existente.
- Mudanças no fluxo de pedido geralmente afetam também o backend: sincronizar.
