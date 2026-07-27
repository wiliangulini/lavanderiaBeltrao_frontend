# Coverage matrix — telas × dimensões

| Tela / componente | Fluxo & Forms (`ux-flow-auditor`) | Acessibilidade (`ux-a11y-auditor`) | Visual & Responsivo (`ux-visual-responsive-auditor`) |
|---|---|---|---|
| `registrar-pedido` (`PedidosComponent` + `FormularioComponent`) | Reactive Forms, validators, `onChange()` (prévia de `valorFinal`), fluxo de itens 1..5, revelar Imprimir/WhatsApp só após retorno do `POST` | Labels dos campos monetários/itens, foco entre itens, `error-msg` | Grid Bootstrap × Material nos campos, responsividade em telas estreitas, layout de impressão (`print-js`) |
| `pesquisar-pedido` (`PesquisaComponent`) | Busca via `/search?query`, estados vazio/erro | Semântica da lista/tabela de resultados, foco após busca | Responsividade da tabela/lista de resultados |
| `cadastrar-clientes` (`CadastroComponent` + `form-cadastro`/`form-cliente`) | Validators de cadastro, integração com `buscar-cep` | Labels, mensagens de erro, foco em campo inválido | Consistência visual do formulário |
| `editar-clientes` (`EditarComponent`) | Carregamento e edição de cliente existente, validators | Labels, foco, feedback de sucesso/erro | Consistência visual do formulário |
| `buscar-cep` (`BuscaCepComponent` + `ConsultaCepService`) | Estados de busca (sucesso/erro/CEP inválido) | Feedback de erro acessível | Layout do resultado da busca |
| `navbar` (`NavbarComponent`) | Navegação entre rotas hash | Semântica de navegação, foco visível, ordem de tabulação | Responsividade (colapso em mobile) |
| `shared/error-msg` | Vínculo com o controle do formulário (`formControlName`) | Associação label/erro, `aria-*` se houver | Consistência visual entre usos |

Telas/comportamentos fora desta lista (login, descontos, frete, pagamento, relatórios além de
impressão) não existem no código — não auditar como se existissem.
