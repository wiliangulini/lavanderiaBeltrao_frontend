# Rule — Fluxo de pedidos e relatórios (frontend)

Use ao mexer nas telas de pedido/cliente ou na impressão de recibos.

## Domínio real (confirmado)
- Telas: `registrar-pedido` (PedidosComponent), `pesquisar-pedido` (PesquisaComponent), `cadastrar-clientes` (CadastroComponent), `editar-clientes` (EditarComponent), `buscar-cep` (BuscaCepComponent).
- Pedido tem cabeçalho + até 6 itens (`quantidade`/`descricao`/`total`/`retirada` e variantes `1..5`), `valorFinal` e flags `pedidoRegistrado`/`pedidoPago`/`pedidoRetirado` — espelho do backend.
- Numeração diária atômica gerada no servidor dentro do `POST /api/pedidos` (ADR 0007): código
  público `yyyyMMdd-NNN`, reinicia a cada dia. `GET /api/pedidos/next-number` foi removida (Gate
  D) — o formulário não pré-busca mais número; adota o valor retornado pelo `POST` e só então
  revela Imprimir/WhatsApp. Legado (antes da migração) mantém o número sequencial antigo. Busca
  via `/search?query`.
- CEP via `ConsultaCepService` (ViaCEP; cidade Francisco Beltrão/PR). Impressão via `print-js`.

## Regras
- Não inventar nova tela, status, cálculo de total server-side, desconto, frete ou pagamento sem autorização (não existem hoje).
- Campos financeiros (`total*`, `valorFinal`) e máscaras são sensíveis: validar antes de alterar.
- Manter os nomes de campos casando com o backend (serialização direta).
- Alterar o layout de impressão deve preservar o recibo existente.
- Mudanças no fluxo de pedido geralmente afetam também o backend: sincronizar.
