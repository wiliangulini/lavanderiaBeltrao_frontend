# Auditoria UX/UI integral — Lavanderia Beltrão (frontend)

> **Versão pública sanitizada.** Este relatório é de base estática (HTML/CSS/TypeScript) e não continha valores de infraestrutura, credenciais, PII nem resultados reais de banco — nenhum conteúdo precisou ser redigido. Achados, severidades, evidências de código e recomendações foram preservados na íntegra.

## 1. Resumo

- **Objetivo:** auditoria UX/UI integral de todas as telas da SPA (não é revisão pontual),
  combinando análise estática do agente principal, 3 agentes paralelos independentes e validação
  independente de evidências.
- **Escopo:** `spa-completa` — as 7 linhas da `coverage-matrix.md`: `registrar-pedido`,
  `pesquisar-pedido`, `cadastrar-clientes`, `editar-clientes`, `buscar-cep`, `navbar`,
  `shared/error-msg`. Usuário-alvo: operador de balcão.
- **Data:** 2026-07-27. Branch `dev`, árvore limpa, último commit `ef9b264`.
- **Metodologia:** (1) leitura estática do agente principal; (2) 3 agentes paralelos
  (`ux-flow-auditor`, `ux-a11y-auditor`, `ux-visual-responsive-auditor`), só leitura, sem executar
  o app; (3) runtime — **não executado**, ver abaixo; (4) validação independente
  (`ux-evidence-validator`), que reabriu cada arquivo citado.
- **Runtime: NÃO TESTADO.** Nenhuma ferramenta de controle de browser estava registrada nesta
  sessão (apenas `WebFetch`, inadequado para SPA renderizada no cliente) e o app não estava no ar
  (portas 4200 e 8080 fora). Não foi iniciado nenhum serviço sem autorização. Todos os achados
  abaixo são de base **estática**, salvo onde explicitamente creditado à auditoria anterior.
- **Resultado:** 6 críticos, 30 importantes, 25 melhorias. Nenhum achado foi rejeitado por falta
  de evidência na validação; 6 tiveram severidade ou descrição corrigidas; 2 hipóteses críticas
  foram **refutadas** (§3).
- **Nenhuma alteração de código, configuração ou documentação preexistente foi feita.**

### Relação com a auditoria de 2026-07-26

O documento `2026-07-26-auditoria-ux-ui-v2.md` cobre o mesmo escopo e **teve runtime**. Parte
relevante dele está **obsoleta** em relação ao código atual — por exemplo, os achados 8, 22 e 41
descrevem os botões de item e de Editar/Deletar como `<a>` sem `href`, mas hoje são
`<button type="button">` (`formulario.component.html:252,490,539`;
`pesquisa.component.html:38,41`); e os achados 7/58 (mensagem de erro `undefined` para validador
não mapeado) não se aplicam mais, pois `form-validations.ts:41` já tem o fallback
`?? \`${fieldName} inválido.\``. Esta auditoria reflete o código atual. Onde o runtime daquela
sessão resolve um ponto desta, o crédito está explícito.

---

## 2. Achados por tela

Ordem da `coverage-matrix.md`. Severidade conforme `methodology.md`: **crítico** (quebra
uso/acessibilidade básica) > **importante** (inconsistência visível, contornável) > **melhoria**
(polimento, não bloqueia).

### 2.1 `registrar-pedido` (`PedidosComponent` + `FormularioComponent`)

1. **Crítico** — Sair do campo "Cliente" substitui o pedido inteiro pelo primeiro cliente
   encontrado. `pedidosClientes` está em `[(ngModel)]` de todos os campos, então data, itens,
   `total*` e `valorFinal` viram `undefined`. Agravante: `match` é um registro de **cliente**, logo
   `pedidosClientes.id` passa a ser o id do cliente e o Salvar seguinte dispara
   `PUT /api/pedidos/{idDoCliente}` — deixa de ser problema de UX e vira integridade de dados.
   A validação confirmou que o `if` de `:251` é alcançável: `setValue()` sem opções emite
   `ngModelChange` (`@angular/forms/fesm2020/forms.mjs:3641-3646`, `:4083-4086`), então
   `aplicarEstadoInicial` (`:133`) grava `pedidosClientes.pedidoRegistrado = true`.
   Evidência: `formulario.component.ts:249-256`, `:133`; `formulario.component.html:14`, `:503`;
   `data-crud.service.ts:30-35,41-43`. Origem: ux-flow-auditor + ux-evidence-validator.

2. **Crítico** — Clicar em Salvar uma segunda vez cria um pedido **duplicado** em vez de atualizar.
   Após o `POST`, `:603` guarda a resposta (com `id`) em `pedidosClientes`, mas `onBeforeSave`
   (`:586`) substitui tudo por `formulario.value`, e o FormGroup (`:57-99`) não tem controle `id`;
   `save()` decide POST/PUT pelo `id`. Como o formulário permanece na tela por decisão de design,
   corrigir um detalhe após salvar gera dois pedidos e dois números diários. Não há trava de duplo
   clique (`:536` sem `[disabled]` nem flag de "salvando").
   Evidência: `formulario.component.ts:586`, `:591-606`, `:57-99`; `data-crud.service.ts:30-35`;
   `formulario.component.html:536`. Origem: ux-flow-auditor + ux-evidence-validator.

3. **Crítico** — "Imprimir" e "Enviar Pedido" viram no-op silencioso quando um item tem descrição
   sem total. `ds` filtra com `!== null` (aceita string vazia), `totais` filtra com `!= null`
   (descarta); os arrays saem com tamanhos diferentes e o laço chama `totais[i].toFixed(2)` sobre
   `undefined`, estourando `TypeError` antes de abrir a impressão/WhatsApp. Gatilhos reais:
   digitar a descrição e ainda não o valor; ou excluir um item e clicar em Imprimir —
   `removerItem` grava `descricao=''` mas `total=null`, produzindo exatamente essa divergência.
   Evidência: `formulario.component.ts:500`, `:494`, `:514-519`, `:364-368`; WhatsApp em `:422`,
   `:428`, `:445-450`. Origem: ux-flow-auditor + ux-evidence-validator.

4. **Crítico** — O botão "Cancelar" não tem `type="button"`; dentro de um `<form>` com
   `(ngSubmit)`, o default é `submit`. O clique executa `resetar()` e em seguida dispara o submit,
   que chama `verificaValidacoesForm()` e marca os 40 controles como `touched`/`dirty`. O operador
   cancela e recebe a tela limpa **coberta de alertas vermelhos**.
   Evidência: `formulario.component.html:537`, `:1`; `form-cadastro.component.ts:26-39`.
   Origem: ux-flow-auditor + ux-a11y-auditor + fase estática.

5. **Crítico (a11y)** — Seis botões com nome acessível errado: os cinco de excluir item e o "Novo
   Campo". `aria-hidden="false"` expõe a ligadura textual do `mat-icon`, que vira o nome acessível
   (o conteúdo prevalece sobre `title` na spec de accname). Resultado: cinco botões chamados
   "delete" e um "add", em inglês, sem indicar qual item removem — numa ação destrutiva.
   Evidência: `formulario.component.html:252,306,360,414,471` e `:490`. Contraste com o botão
   WhatsApp (`:539`), o único com marcação correta (`aria-label` + `<svg aria-hidden="true">`).
   Origem: ux-a11y-auditor (contagem corrigida de 5 para 6 pelo ux-evidence-validator).

6. **Importante** — Desmarcar "Pesagem na Retirada" zera o total do item. Todos os `case` fazem
   `setValue(0)` sem olhar `e.target.checked`; como `setValue` propaga para `pedidosClientes.totalN`,
   o `onChange()` seguinte recalcula `valorFinal` já com 0 — o valor digitado é perdido de fato,
   não só na exibição.
   Evidência: `formulario.component.ts:307-337`. Origem: ux-flow-auditor (impacto agravado pelo
   ux-evidence-validator).

7. **Importante** — O recibo pode sair com `Status: undefined`. A cadeia `if/else if` não tem
   `else`; um pedido com as três flags falsas (possível na tela de pesquisa, onde `:133` grava
   `pedidoRegistrado=false`) imprime literalmente `Status: undefined` no papel entregue ao cliente.
   Evidência: `formulario.component.ts:523-531`, usado em `:538`; equivalente no WhatsApp em
   `:454-464`. Origem: ux-flow-auditor.

8. **Importante** — A formatação do dinheiro muda no instante do salvamento: a prévia local gera
   `"12,50"` e o backend devolve número, então o campo passa a exibir `12.5` — justamente o valor
   que o operador lê em voz alta para cobrar.
   Evidência: `formulario.component.ts:603`, `:290`; `formulario.component.html:184`, `:484`;
   `shared/pedidos-clientes.ts:18,40`. Origem: ux-flow-auditor.

9. **Importante** — Recibo e WhatsApp recalculam o total a partir dos `total*` da tela em vez de
   usar o `valorFinal` retornado pelo servidor. Na tela de pesquisa, alterar um item e imprimir
   **sem salvar** produz um recibo com valor não persistido. `loopForTotais` ainda **muta**
   `pedidosClientes.totalN` como efeito colateral. (Divergência com rule — ver §4.)
   Evidência: `formulario.component.ts:494-498`, `:422-426`, `:262-278`. Origem: ux-flow-auditor.

10. **Importante** — Um item salvo com descrição/quantidade e **sem** total volta invisível ao
    editar o pedido, mas continua no formulário e é reenviado no `PUT`. O operador não vê o item
    que está prestes a regravar.
    Evidência: `formulario.component.ts:221-229`. Origem: ux-flow-auditor.

11. **Importante** — `class="was-validated"` força os estilos de validação do Bootstrap desde a
    primeira renderização, antes de qualquer interação, enquanto o texto do erro só aparece após
    `touched`. No estado inicial há sinal visual de erro **sem nenhum equivalente textual ou
    programático** (informação transmitida só por cor). O ícone de validação ainda reserva ~42px de
    `padding-right`, que em colunas de ~66px não deixa espaço para o texto.
    Evidência: `formulario.component.html:1`; `error-msg.component.ts:42`;
    `form-cadastro.component.ts:48-50`. Origem: ux-a11y-auditor + ux-visual-responsive-auditor.

12. **Importante** — Linhas de item ficam ilegíveis entre 576px e 991.98px. As 5 colunas usam
    sempre o mesmo N (`col-sm-3 col-md-3 col-lg-3 col-xl-3` etc.), então nunca reflowam. A coluna
    do botão fica com 21px (sm) / 36px (md) de conteúdo para um botão de ~50px que não encolhe;
    o "Total" fica com ~66px para um input de `font-size: 20px !important`. Ok a partir de `lg`.
    Evidência: `formulario.component.html:201,214,227,240,251-252` (e blocos gêmeos 255-307,
    309-361, 363-415, 417-472); `styles.scss:8-12`; nenhuma media query em
    `formulario.component.scss` cobre as linhas de item. Origem: ux-visual-responsive-auditor
    (severidade rebaixada de crítico para importante pelo ux-evidence-validator).
    **Renderização exata: não testada** (runtime não executado).

13. **Importante** — Textareas de Descrição travados em `min-height: 50px !important; height: 50px`
    com fonte de 20px: ~1 linha visível no campo que concentra o conteúdo do item.
    Evidência: `formulario.component.scss:85-88`; `styles.scss:8-12`;
    `formulario.component.html:163-171, 216-224, 271-278, 325-332, 379-386, 433-441`.
    Origem: ux-visual-responsive-auditor.

14. **Importante** — Contraste do botão WhatsApp reprova: `#fff` sobre `#38b553` = **2,66:1**
    (luminância recalculada e conferida na validação). Com 20px e peso 500 o texto não se
    qualifica como "texto grande" (WCAG exige ≥24px, ou ≥18,66px com bold ≥700), então o limiar é
    4,5:1 — reprovaria mesmo no limiar 3:1. É o único par de cores explícitas do projeto que
    reprova; navbar (`#FFF` sobre `#0380dd`, ~4,1:1 com limiar 3:1) e `#FFF` sobre `#1b1e1f`
    passam.
    Evidência: `formulario.component.scss:59-61`, `:37-42`. Origem: ux-a11y-auditor +
    ux-evidence-validator.

15. **Importante** — O foco é perdido ao excluir um item: `removerItem()` aplica `.remove`
    (`display:none`) ao bloco que contém **o próprio botão acionado**, e o foco volta para
    `<body>`. Não há nenhuma chamada de `focus()` no projeto (grep) nem anúncio da remoção.
    Evidência: `formulario.component.ts:359-374`; `formulario.component.scss:53-55`.
    Origem: ux-a11y-auditor.

16. **Importante** — Mistura de `formControlName` com `[(ngModel)]` em praticamente todos os
    campos (padrão deprecado desde o Angular v6). É a raiz da dessincronia entre `formulario.value`
    e `pedidosClientes` que `onBeforeSave()` precisa contornar escolhendo a fonte conforme a URL.
    Evidência: `formulario.component.html:11-13, 26-28, 45, 57, 72, 181-184` (e todo o restante);
    `formulario.component.ts:586`. Origem: ux-flow-auditor + fase estática.

17. **Importante** — O estado dos itens 1..5 é controlado por manipulação direta de DOM
    (`document.querySelector` + classes `.add`/`.remove`) em vez de `*ngIf`/`[hidden]` ligados ao
    array `slotsVisiveis`, que existe e é mantido em paralelo — duas fontes de verdade.
    Evidência: `formulario.component.ts:359-393`; `formulario.component.scss:53-58`.
    Origem: fase estática.

18. **Melhoria** — `PedidosComponent.ngOnInit()` faz `document.querySelector('.btn-whats')` e
    acessa `.style` sem guarda de nulidade, e o elemento só existe no `<app-formulario>` filho.
    A hipótese de `TypeError` a cada carga **foi refutada** (§3). O trecho permanece frágil e
    **redundante** com `ocultarAcoesPedidoCriado()`, que já esconde o mesmo botão nessa rota.
    Evidência: `pedidos.component.ts:30-32`; `formulario.component.ts:150-155`;
    `formulario.component.html:539`. Origem: fase estática + ux-flow-auditor (M6).

19. **Melhoria** — O snackbar "FORMULARIO INVALIDO!!!" é **inalcançável** pelo caminho do botão
    Salvar: `onSubmit()` só chama `submit()` se o formulário for válido. Num formulário longo,
    submeter inválido não produz feedback global, não rola a página e não foca o campo errado.
    Evidência: `formulario.component.ts:614-616`; `form-cadastro.component.ts:26-28`.
    Origem: ux-flow-auditor (severidade rebaixada pelo ux-evidence-validator).

20. **Melhoria** — `ViewEncapsulation.None` vaza os estilos do formulário globalmente. Regras
    genéricas como `.form-label`, `.remove`/`.add` e `textarea.form-control { min-height: 50px
    !important }` passam a valer em toda a app — mas **só depois** que a tela de pedido é visitada
    uma vez, então a mesma tela renderiza diferente conforme o caminho percorrido.
    Evidência: `formulario.component.ts:16`; `formulario.component.scss:81-84, 53-58, 85-88, 14-18`.
    Origem: ux-visual-responsive-auditor.

21. **Melhoria** — Colisão de nome de classe: o `MatIcon` adiciona o valor de `fontIcon` como
    classe CSS no host, então `<mat-icon fontIcon="add">` recebe a classe `add` e é atingido pelo
    `.add { display: flex }` global vazado pelo achado 20. O único elemento afetado é o ícone do
    "Novo Campo", que vira flex container 24×24 — desalinhamento sutil. O risco relevante é o nome
    genérico de classe global.
    Evidência: `formulario.component.scss:56-58`; `formulario.component.html:490`;
    `@angular/material/fesm2015/icon.mjs:877-882`. Origem: ux-visual-responsive-auditor
    (severidade rebaixada pelo ux-evidence-validator).

22. **Melhoria** — Valor Final só recalcula no `(change)` (ao sair do campo), não no `keyup` que já
    roda a máscara. `formatarMoeda` transforma vazio em `"0,00"`, e um recorte com o mouse pode
    produzir `NaN` no Valor Final.
    Evidência: `formulario.component.html:182,235,289,343,397,452`;
    `formulario.component.ts:294-305`, `:262-278`, `:290`. Origem: ux-flow-auditor.

23. **Melhoria** — `<app-error-msg>` pendurado em 10 campos de item que não têm validador nenhum —
    nunca exibem nada. Os rótulos ainda carregam o índice técnico do slot (`label="Quantidade1"`),
    que vazaria para o operador como "Quantidade1 é obrigatório".
    Evidência: `formulario.component.html:212,225,267,279,321,333,375,387,429,442`;
    `formulario.component.ts:74-93`; `form-validations.ts:37`. Origem: ux-flow-auditor +
    ux-a11y-auditor.

24. **Melhoria** — `<label>` órfão (sem `for`) usado como título do grupo de checkboxes de status;
    `<fieldset>/<legend>` seria o elemento semântico. O `<textarea id="printJS-form">` sem label
    entra na ordem de tabulação por ~2s durante a impressão, com 350px de altura, empurrando o
    layout. Classe inexistente `in-valid` (o correto é `is-invalid`) no campo readonly.
    Evidência: `formulario.component.html:494`, `:540`, `:55`; `formulario.component.ts:533-535`,
    `:551-555`; `formulario.component.scss:14-18`. Origem: ux-a11y-auditor +
    ux-visual-responsive-auditor.

25. **Melhoria** — `console.log` com dados reais de cliente (nome, telefone, endereço e o recibo
    completo). Contraria `.claude/rules/seguranca-frontend.md`.
    Evidência: `formulario.component.ts:185, 255, 295, 302, 452, 473, 477, 493, 521, 536, 540`.
    Origem: ux-flow-auditor + fase estática.

26. **Melhoria** — `total*` sai como string com vírgula no POST de criação: `onBeforeSave` converte
    os totais no objeto antigo (`:577`) e logo em seguida descarta a conversão ao substituir por
    `formulario.value` (`:586`); só `valorFinal` vai numérico. Se o backend aceita esse formato é
    **não confirmado no projeto** — o ponto de UX é que o valor exibido e o enviado seguem caminhos
    diferentes.
    Evidência: `formulario.component.ts:577`, `:586`. Origem: ux-flow-auditor.

### 2.2 `pesquisar-pedido` (`PesquisaComponent`)

27. **Crítico** — "Deletar" remove o pedido com um clique, **sem nenhuma confirmação**. Não existe
    `confirm()`, `window.confirm` nem `MatDialog` em lugar nenhum do projeto (grep em `src/`: zero
    ocorrências). O botão fica colado no "Editar", ambos `btn btn-primary w-100`, visualmente
    idênticos. Exclusão irreversível, sem desfazer nem histórico.
    Evidência: `pesquisa.component.html:41`, `:38`; `formulario.component.ts:231-240`.
    Origem: ux-flow-auditor + fase estática + ux-evidence-validator.

28. **Importante** — Sem estado vazio: busca sem resultado devolve só o cabeçalho da tabela,
    indistinguível de "ainda não pesquisei" ou de erro já dispensado. A busca com query vazia zera
    a lista e retorna em silêncio. Não há `aria-live`/`role="status"` nem movimentação de foco após
    a busca, nem ao clicar "Editar" (o pedido carrega no formulário abaixo sem anúncio).
    Evidência: `pesquisa.component.html:26-44`; `formulario.component.ts:157-171`, `:173-209`.
    Origem: ux-flow-auditor + ux-a11y-auditor.

29. **Importante** — `<form>` aninhado dentro de `<form>` (HTML inválido): o form da busca envolve
    `<app-formulario>`, cujo template raiz também é `<form>`. O mapeamento de controles e o submit
    implícito por Enter ficam ambíguos entre o form de busca e o de edição.
    Evidência: `pesquisa.component.html:4`, `:48`; `formulario.component.html:1`.
    Origem: ux-a11y-auditor + fase estática.

30. **Importante** — "Imprimir" e "Enviar Pedido" já aparecem habilitados ao abrir a tela, antes de
    qualquer pedido ser carregado (fora de `registrar-pedido` o código sempre chama
    `mostrarAcoesPedidoCriado`). Clicar cai em `celular!.replace(...)` com `telefone` `undefined` e
    estoura, sem nada visível.
    Evidência: `formulario.component.ts:136`, `:143-148`, `:490`, `:417`;
    `pesquisa.component.html:48`. Origem: ux-flow-auditor.

31. **Importante** — Botões "Editar"/"Deletar" sem nome acessível distinto por linha: navegando por
    botões, o usuário ouve "Deletar" N vezes sem saber a qual pedido pertence — agravando o
    achado 27. Falta `aria-label` contextual.
    Evidência: `pesquisa.component.html:38`, `:41`. Origem: ux-a11y-auditor.

32. **Importante** — Tabela sem `.table-responsive` (grep: zero ocorrências no projeto): 5 colunas
    com `th` de 25px estouram a viewport abaixo de 768px, gerando scroll horizontal na página.
    Evidência: `pesquisa.component.html:16-45`; `pesquisa.component.scss:20-22`.
    Origem: ux-visual-responsive-auditor. **Não testado** em viewport real.

33. **Melhoria** — Botão "Pesquisar" com texto + `mat-icon` dentro de `col-*-3` (~111px em `sm`) e
    `height: 50px` fixo: o texto quebra em 2 linhas e transborda a altura. O ícone entra no nome
    acessível ("Pesquisar Pedidosearch"), por faltar `aria-hidden="true"`.
    Evidência: `pesquisa.component.html:10-11`; `pesquisa.component.scss:1-3`.
    Origem: ux-visual-responsive-auditor + ux-a11y-auditor.

34. **Melhoria** — Botão de busca sem `type` dentro de `<form>` (default `submit`). O
    `FormGroupDirective` intercepta e previne o reload, então não quebra — é acidental.
    Evidência: `pesquisa.component.html:11`. Origem: fase estática.

35. **Melhoria** — Landmark inconsistente: usa `<div class="main">` enquanto `pedidos`, `editar` e
    `busca-cep` usam `<main>`, removendo o atalho "ir para o conteúdo principal".
    Evidência: `pesquisa.component.html:1`. Origem: ux-a11y-auditor.

36. **Melhoria** — Desalinhamento de 12px entre a linha de busca e o card de resultados: `.row
    w-100` dentro de `.container` fica deslocado pela margem negativa, enquanto o `.card` é filho
    direto do container.
    Evidência: `pesquisa.component.html:5-6`, `:14-15`. Origem: ux-visual-responsive-auditor.

### 2.3 `cadastrar-clientes` (`CadastroComponent` + `form-cadastro`/`form-cliente`)

37. **Crítico** — O botão "Cancelar" não tem `type="button"`, mesmo defeito do achado 4, aqui num
    formulário com `(ngSubmit)="onSubmit()"`.
    Evidência: `form-cliente.component.html:124`, `:1`; `form-cadastro.component.ts:26-39`.
    Origem: ux-flow-auditor + ux-a11y-auditor.

38. **Importante** — Feedback de sucesso duplicado e errado: `onSuccess()` é chamado
    incondicionalmente e **de novo** no ternário da linha seguinte. Sempre aparece "CLIENTE SALVO
    COM SUCESSO"; em contexto de edição os dois snackbars disparam.
    Evidência: `form-cliente.component.ts:49-50`. Origem: fase estática + ux-flow-auditor.
    Nota: a auditoria de 2026-07-26 (achado 27) observou em runtime que o `MatSnackBar` substitui
    instantaneamente a mensagem anterior, então o usuário provavelmente vê só a última — o defeito
    de código permanece, o impacto percebido é menor.

39. **Importante** — CEP inválido ou inexistente não gera nenhum feedback: o serviço devolve
    `of({})` para CEP fora do padrão e o ramo `else` apenas restaura o valor digitado; o erro vai
    só para o console. `FormValidations.cepValidator` **existe e não é usado em nenhum FormGroup**,
    e a mensagem "CEP Inválido." nunca é alcançada.
    Evidência: `consulta-cep.service.ts:17-26`; `form-cadastro.component.ts:61-78`, `:77`;
    `form-validations.ts:5-17`, `:38`. Origem: ux-flow-auditor + ux-a11y-auditor.

40. **Importante** — Regra de telefone divergente entre as telas: o pedido exige
    `pattern="[0-9]{10,12}"` (o atributo **ativa** o validador do Angular —
    `forms.mjs:6431`), o cadastro de cliente não exige nada. O mesmo telefone aceito aqui é
    recusado lá, sem máscara e com a mensagem genérica "Telefone inválido.".
    Evidência: `form-cliente.component.html:19-28`; `formulario.component.html:20-31`;
    `form-validations.ts:41`. Origem: ux-flow-auditor + ux-evidence-validator.

41. **Importante** — `subscribe()` com callbacks posicionais deprecados no RxJS 7, divergindo do
    objeto `{next, error}` usado no resto do projeto.
    Evidência: `form-cliente.component.ts:47-54`. Origem: fase estática.

42. **Melhoria** — `required` declarado no HTML mas ausente do FormGroup para Cidade, Rua e Bairro.
    O validador **é** aplicado em runtime (`RequiredValidator` tem seletor
    `:not([type=checkbox])[required][formControlName]`, `forms.mjs:6170`) e as mensagens aparecem
    normalmente — é armadilha de manutenção (quem lê o FormGroup conclui o contrário), não falha de
    validação.
    Evidência: `form-cliente.component.ts:24-33`; `form-cliente.component.html:51,67,97`.
    Origem: ux-flow-auditor (severidade rebaixada pelo ux-evidence-validator).

43. **Melhoria** — `ngAfterViewInit` decide o contexto sniffando o DOM de **outra** tela
    (`document.getElementById('pesquisa')`), acoplando o componente ao id de um input alheio.
    Evidência: `form-cliente.component.ts:38-43`; padrão equivalente em
    `formulario.component.ts:129`. Origem: fase estática.

44. **Melhoria** — Componente morto: `app-input-client` está declarado mas o seletor não aparece em
    nenhum template (grep). Usa `[(ngModel)]` puro, divergente do padrão do projeto. Também mortos:
    `FormValidations.requiredMinCheckbox` e `cepValidator`, sem consumidor.
    Evidência: `input-client/input-client.component.ts:10`; `form-validations.ts:5,19`.
    Origem: ux-flow-auditor + fase estática.

45. **Melhoria** — Landmark `<main>` ausente (usa `<div class="main">`); botões com `w-25` dentro
    de um `.buttons` que é filho direto de `.row` sem classe `col-*`, então a porcentagem resolve
    contra uma caixa shrink-to-fit, sem tratamento por breakpoint.
    Evidência: `cadastro.component.html:1`; `form-cliente.component.html:121-126`
    (`form-cliente.component.scss` está vazio). Origem: ux-a11y-auditor +
    ux-visual-responsive-auditor.

### 2.4 `editar-clientes` (`EditarComponent`)

46. **Crítico** — "Deletar" remove o cliente com um clique, sem confirmação. Mesma situação do
    achado 27.
    Evidência: `editar.component.html:38`; `editar.component.ts:61-70`.
    Origem: ux-flow-auditor + fase estática + ux-evidence-validator.

47. **Importante** — A lista não atualiza depois de salvar a edição: `<app-form-cliente>` não tem
    nenhum `@Output` e o componente não emite evento após salvar — contraste com o `pedidoEditado`
    que existe no fluxo de pedidos. O operador reedita achando que não salvou.
    Evidência: `editar.component.html:44`; `form-cliente.component.ts:45-55`;
    `formulario.component.ts:34`, `:628`. Origem: ux-flow-auditor.

48. **Importante** — Busca client-side: carrega **todos** os clientes e filtra no navegador,
    enquanto a tela de pedidos já usa busca server-side via `/search?query`.
    Evidência: `editar.component.ts:38-52`; `formulario.component.ts:165`.
    Origem: ux-flow-auditor + fase estática.

49. **Importante** — Buscar com o campo vazio falha em silêncio: `client` é `undefined` e
    `elm.includes(undefined)` compara com a string `"undefined"`, nunca casando. A tabela fica
    vazia sem nenhuma mensagem, e não há estado vazio.
    Evidência: `editar.component.ts:40-45`; `editar.component.html:23-41`.
    Origem: fase estática + ux-flow-auditor.

50. **Importante** — `<form>` aninhado dentro de `<form>` (mesmo defeito do achado 29), aqui
    envolvendo `<app-form-cliente>`.
    Evidência: `editar.component.html:2`, `:44`; `form-cliente.component.html:1`.
    Origem: ux-a11y-auditor.

51. **Importante** — Tabela sem `.table-responsive`; botões "Editar"/"Deletar" sem nome acessível
    distinto por linha. Mesmos defeitos dos achados 31 e 32.
    Evidência: `editar.component.html:13-42`, `:35`, `:38`; `editar.component.scss:20-22`.
    Origem: ux-visual-responsive-auditor + ux-a11y-auditor.

52. **Melhoria** — Botão "Pesquisar" com o mesmo transbordo e o mesmo ícone entrando no nome
    acessível do achado 33; desalinhamento de 12px do achado 36.
    Evidência: `editar.component.html:8-9`, `:3` vs `:12`; `editar.component.scss:1-3`.
    Origem: ux-visual-responsive-auditor + ux-a11y-auditor.

### 2.5 `buscar-cep` (`BuscaCepComponent` + `ConsultaCepService`)

53. **Crítico** — Os resultados **acumulam** entre buscas: `consultarRua()` faz `push` nos quatro
    arrays sem limpá-los antes. Buscar uma segunda rua empilha os resultados sobre os da primeira,
    e a tabela passa a misturar ruas diferentes sem nenhuma indicação. Só `resetar()` limpa, o que
    exige clicar em Cancelar.
    Evidência: `busca-cep.component.ts:76-87`, `:55-61`; `busca-cep.component.html:22`.
    Origem: ux-flow-auditor + fase estática + ux-evidence-validator.

54. **Importante** — Erro de consulta e "nenhum resultado" não produzem nenhum feedback: o único
    destino é `console.error`. A célula "Feedback de erro acessível" da coverage-matrix não tem
    implementação nesta tela.
    Evidência: `busca-cep.component.ts:85`. Origem: ux-a11y-auditor + ux-flow-auditor.

55. **Importante** — A busca dispara só no `blur`, sem botão nem Enter: o operador digita e nada
    acontece até clicar fora do campo — diferente das outras telas, que têm botão "Pesquisar".
    Evidência: `busca-cep.component.html:22`. Origem: fase estática + ux-flow-auditor.

56. **Importante** — A estrutura da tabela quebra a relação linha/coluna: existe uma única `<tr>`
    e cada `<td>` contém um `<ul>` com **todos** os valores daquela coluna. O 3º CEP e o 3º bairro
    não estão na mesma linha semanticamente — são itens de listas separadas. Os `<th scope="col">`
    prometem uma associação que a estrutura não entrega.
    Evidência: `busca-cep.component.html:38-68`, `:31-34`. Origem: ux-a11y-auditor +
    fase estática.

57. **Melhoria** — Tabela sem `.table-responsive`; botão "Cancelar" sem `type` (aqui **sem efeito
    prático**: o form não tem `(ngSubmit)`, `FormGroupDirective.onSubmit` retorna `false` e
    `reset()` marca untouched, então não há submit nem enxurrada de erros).
    Evidência: `busca-cep.component.html:27-70`, `:73`; `forms.mjs:4946-4951`.
    Origem: ux-visual-responsive-auditor + ux-evidence-validator (correção de escopo).

### 2.6 `navbar` (`NavbarComponent`)

58. **Crítico** — O menu expandido em mobile fica confinado em 90px. `header` e `nav` têm altura
    fixa de 90px, o `.navbar-collapse` e o `.navbar-nav` recebem `h-100`, e abaixo de 992px o
    Bootstrap empilha os 5 `li` (que a SCSS força a `width: 100%`) com `font-size: 28px` — algo
    em torno de 250px de conteúdo numa caixa de 90px sem `overflow` definido. Agravado por três
    níveis aninhados de `ps-5 pe-5`, que consomem ~132px por lado (em viewport de 360px sobram
    ~96px úteis).
    Evidência: `navbar.component.scss:1-4`, `:5-10`, `:75-80`; `navbar.component.html:9-10`,
    `:2`, `:3`, `:5`. Origem: ux-visual-responsive-auditor.
    **Aparência exata: não testada** nesta auditoria. A auditoria de 2026-07-26 (achado 53,
    Adendo §6) confirmou empiricamente corte de texto em telas ≲576px.

59. **Importante** — Clicar em "Registrar Pedido" recarrega a SPA inteira, **vindo de qualquer
    rota**. A condição compara a className com `"nav-link active"`, mas essa classe está hardcoded
    no `<a>` e nunca muda (o `routerLinkActive` está no `<li>`), então é sempre verdadeira. Reload
    completo com 500ms de atraso, perdendo foco e qualquer coisa digitada.
    Evidência: `navbar.component.ts:15-19`; `navbar.component.html:11-12`.
    Origem: ux-a11y-auditor + ux-flow-auditor + ux-evidence-validator (precisão corrigida).

60. **Importante** — `aria-current="page"` fixo no primeiro link: "Registrar Pedido" é anunciado
    como página atual em todas as rotas e nenhum outro link jamais o recebe. Mesma raiz do
    achado 59 — o operador nunca sabe em que tela está pela navbar.
    Evidência: `navbar.component.html:11-12`. Origem: ux-a11y-auditor + ux-flow-auditor.

61. **Importante** — O menu mobile não fecha após navegar: o colapso usa `data-bs-toggle` sem
    `data-bs-dismiss` nem fechamento programático nos links, então permanece aberto sobre a tela
    recém-navegada.
    Evidência: `navbar.component.html:6-9`. Origem: fase estática. **Não testado.**

62. **Melhoria** — `.navbar` sem `navbar-light`/`navbar-dark`: o Bootstrap usa os defaults claros,
    deixando o ícone do toggler em `rgba(0,0,0,.55)` sobre o header `#0380dd`.
    Evidência: `navbar.component.html:4`, `:6-8`; `navbar.component.scss:1-4`.
    Origem: ux-visual-responsive-auditor.

63. **Melhoria** — `href="#"` redundante sob `[routerLink]` em todos os links: o `RouterLink`
    sobrescreve o `href`, então é código morto que mascara o destino real. `aria-label="Toggle
    navigation"` em inglês numa interface pt-BR.
    Evidência: `navbar.component.html:12,15,18,21,24`, `:6`. Origem: ux-a11y-auditor.

### 2.7 `shared/error-msg`

64. **Importante** — A mensagem de erro não é associada ao campo: o `<div role="alert">` não tem
    `id` e nenhum input do projeto tem `aria-describedby` apontando para ele; também não há
    `aria-invalid` refletindo o estado do controle. Ao revisitar o campo por Tab, o erro é
    silencioso.
    Evidência: `error-msg.component.html:1-7`; `formulario.component.html:5-16`;
    `form-cliente.component.html:5-15`. Origem: ux-a11y-auditor + fase estática.

65. **Melhoria (arquitetura)** — `ErrorMsgComponent` **estende** `FormularioComponent`: cada
    instância monta um FormGroup de 40 controles e herda `ngAfterViewInit`, que roda
    `aplicarEstadoInicial()` mexendo em `#imprimir`/`.btn-whats` do documento inteiro. São 14
    instâncias em `formulario.component.html` e 7 em `form-cliente.component.html`. A validação
    confirmou que os hooks herdados **rodam** (`core.mjs:2338` lê os hooks da cadeia de
    protótipos), mas não encontrou bug visível decorrente — os `querySelector` são idempotentes por
    tela. É custo e acoplamento, não defeito de UI.
    Evidência: `error-msg.component.ts:17`, `:33`; `formulario.component.ts:109-118`, `:128-155`.
    Origem: ux-visual-responsive-auditor + ux-flow-auditor + ux-evidence-validator.

66. **Melhoria** — Binding morto: o template chama `aplicaCssErro(nome)` com `nome` sempre `''`,
    consultando o `formulario` da própria instância herdada em vez do `control` recebido. Nenhum
    uso no projeto passa `nome`.
    Evidência: `error-msg.component.html:2`; `error-msg.component.ts:19`. Origem: ux-a11y-auditor.

### 2.8 Global (`index.html`, `styles.scss`, `app.module.ts`, roteamento)

67. **Importante** — `lang="en"` numa aplicação inteiramente em português: leitor de tela pronuncia
    o conteúdo com fonética inglesa. Afeta todas as telas de uma vez.
    Evidência: `index.html:2`. Origem: ux-a11y-auditor + fase estática.

68. **Importante** — Nenhuma tela tem `<h1>`, exceto `buscar-cep`. Sem hierarquia de headings o
    leitor de tela não oferece navegação por título nem identifica a tela — agravado pelo `<title>`
    fixo `Lavanderia`, que nunca muda por rota (não há uso do `Title` service).
    Evidência: `index.html:5`; `busca-cep.component.html:6`; ausência em `pedidos.component.html`,
    `pesquisa.component.html`, `cadastro.component.html`, `editar.component.html`;
    `styles.scss:31-36`. Origem: ux-a11y-auditor + ux-visual-responsive-auditor.

69. **Melhoria** — Recursos externos sem fallback: Google Fonts, Material Icons e o
    `print.min.js`/`print.min.css` de CDN. Sem rede externa os ícones viram texto ("delete",
    "search") e a impressão quebra — relevante para balcão com internet instável. O print-js ainda
    é carregado **duas vezes** (CDN + pacote npm, sendo o import npm o que executa), e o iframe de
    impressão não recebe CSS (`params.css` não informado), com `documentTitle` no default
    `'Document'`.
    Evidência: `index.html:10-12`, `:17`; `formulario.component.ts:8`, `:542-549`;
    `print-js/src/js/init.js:34`, `:116-131`. Origem: ux-visual-responsive-auditor + fase estática.

70. **Melhoria** — Sem rota curinga `{path:'**'}`: uma hash inválida (link antigo, erro de
    digitação) mostra só a navbar e uma área vazia, sem 404 nem redirecionamento.
    Evidência: `app-routing.module.ts:10-17`. Origem: ux-flow-auditor.

71. **Melhoria** — Sem indicação de carregamento em salvar, buscar pedido/cliente e consultar CEP:
    nenhum spinner nem estado `disabled` durante a requisição.
    Evidência: `formulario.component.html:535-540`; `pesquisa.component.html:11`;
    `editar.component.html:9`. Origem: ux-flow-auditor.

72. **Melhoria** — Tema Material `indigo-pink` carregado mas sem efeito visível: só `MatIconModule`
    e `MatSnackBarModule` são usados, e a única superfície tematizada é sobrescrita com
    `!important`. Convivem três azuis — `#0380dd` (navbar/snackbar), `#0d6efd` (`.btn-primary`) e o
    indigo que nunca aparece. `MatRadioModule` é importado e exportado sem uso. Registro de
    inconsistência dentro do padrão atual, **não** proposta de troca de tema ou lib.
    Evidência: `angular.json:31`; `styles.scss:40-45`; `navbar.component.scss:2`;
    `app.module.ts:21,44-47,51`. Origem: ux-visual-responsive-auditor.

73. **Melhoria** — CSS morto e resíduos: o `pedidos.component.scss` **inteiro** não casa com nada
    (o template só contém `<app-formulario>` e a encapsulação emulada impede alcançar o filho),
    incluindo uma cópia obsoleta e divergente do estilo dos botões (45px vs 50px); classes do
    Bootstrap 4 e erros de digitação (`ml-0`/`mr-0`, `align-item-center`, `form-group`,
    `needs-validation` sem init JS); prefixos que nunca existiram (`-ms-`/`-o-border-radius`);
    tabelas sem `<caption>` e com todas as bordas removidas globalmente, sem zebra striping.
    Evidência: `pedidos.component.html:1-8` vs `pedidos.component.scss:1-51` (compare `:40-45` com
    `formulario.component.scss:37-42`); `styles.scss:5-7`, `:17-25`;
    `formulario.component.html:1`, `:495`, `:519`; `pesquisa.component.html:4`;
    `navbar.component.scss:23-26,36-39,63-66`. Origem: ux-visual-responsive-auditor.

---

## 3. Achados rejeitados por falta de evidência

**O `ux-evidence-validator` não rejeitou nenhum achado por falta de evidência.** Todos os itens
submetidos tinham evidência `arquivo:linha` verificável. Seis tiveram severidade ou descrição
corrigidas (registradas em §5).

Esta seção registra, por transparência, as **hipóteses levantadas durante a auditoria e
descartadas antes de virarem achado** — o descarte foi feito por verificação, não por omissão.

### 3.1 Refutadas por evidência contrária

1. **"O recibo impresso sai em branco"** — levantada pelo `ux-visual-responsive-auditor` como
   crítico (V-03) e sustentada por mim na leitura de `print-js/src/js/html.js`, cujo
   `switch (element.tagName)` trata apenas `SELECT` e `CANVAS`, sem `TEXTAREA`.
   **Refutada.** A spec HTML define cloning steps próprias para `textarea` que propagam o *raw
   value* e o *dirty value flag* do nó original para a cópia — `cloneNode()` preserva o valor sem
   precisar de tratamento na lib, e o nó clonado é inserido no iframe via `appendChild()` (objeto
   DOM vivo, não HTML serializado). O tratamento especial existe para `SELECT`/`CANVAS`
   justamente porque esses **não** têm cloning steps equivalentes. A auditoria de 2026-07-26
   (Adendo §6, datado de 2026-07-27) chegou à mesma conclusão com verificação empírica.
   **Não há bug de recibo vazio.** O erro da hipótese foi inferir a ausência de suporte a partir do
   `switch`, sem checar as cloning steps da spec.

2. **"`PedidosComponent.ngOnInit()` estoura `TypeError` a cada carga de `registrar-pedido`"** —
   levantada por mim na fase estática, a partir de `document.querySelector('.btn-whats')` sem
   guarda de nulidade, sendo `.btn-whats` um elemento do componente filho.
   **Refutada.** A auditoria de 2026-07-26 (achado 1) verificou em runtime: dois reloads reais com
   console aberto, nenhum `TypeError`. No Ivy o `renderView` cria o DOM da subárvore antes de o
   `refreshView` executar o `ngOnInit` do pai, então o `querySelector` já encontra o botão.
   O código permanece frágil e redundante, e por isso foi mantido como **melhoria** (achado 18) —
   mas não como defeito funcional.

### 3.2 Descartadas por verificação (não chegaram a virar achado)

3. **Contraste insuficiente nas tabelas de resultado.** Suspeita de que o `--bs-table-color` do
   Bootstrap (herdado de `--bs-body-color`, escuro) renderizasse texto quase invisível sobre o
   fundo escuro do `body` (`styles.scss:2-4`), já que `--bs-table-bg` é `transparent`.
   **Descartada:** `pesquisa.component.scss:15-19` e `editar.component.scss:15-19` forçam
   `tbody tr td { color:#FFF }`, `busca-cep.component.scss:1-3` força
   `.table > :not(caption) > * > * { color:#FFF }`, e os `<th>` são cobertos por
   `styles.scss:26-30`. Sem problema de contraste nas tabelas.

4. **Violação dos budgets de estilo do `angular.json`** (warning 2kb / erro 4kb por componente).
   **Descartada:** o maior SCSS de componente é `navbar.component.scss` (1816 bytes), seguido de
   `formulario.component.scss` (1696 bytes) — ambos abaixo do aviso, e o budget é aferido sobre o
   CSS emitido/minificado. Quatro folhas estão vazias. De todo modo, um warning de budget
   apareceria no `npm run build` e não seria achado de UX.

5. **Foco visível removido por CSS.** **Descartada:** grep por `outline`, `:focus` e `tabindex` em
   `src/` não retorna nenhuma ocorrência — nenhum estilo remove o anel de foco padrão e não há
   `tabindex` manual distorcendo a ordem de tabulação, que segue a ordem do DOM.

6. **Campos sem `<label>` ou com `for` apontando para `id` inexistente.** **Descartada:** a
   associação `label`/`for` está correta em todos os campos de `formulario`, `form-cliente`,
   `input-client`, `pesquisa`, `editar` e `busca-cep`, incluindo os checkboxes "Pesagem na
   Retirada". O uso de `form-check-label` fora do wrapper `.form-check` é questão visual, não de
   acessibilidade. `<th scope="col">` está presente e correto em todas as tabelas.

7. **Descumprimento do ADR 0007 (numeração de pedido).** **Descartada:** o fluxo está correto —
   `numberPedido` nasce vazio (`formulario.component.ts:60`, `:131`), é `readonly` no template
   (`formulario.component.html:52-60`) e só recebe valor da resposta do `POST` (`:604`), que é
   quando Imprimir/WhatsApp são revelados (`:605`). Não há pré-busca de `next-number`.

### 3.3 Não decidido — depende de runtime

8. **"Autocomplete de cliente nunca dispara num pedido novo"** — hipótese de inversão do achado 1,
   levantada por mim: se `setValue()` programático não emitisse `ngModelChange`, a propriedade
   `pedidosClientes.pedidoRegistrado` continuaria `undefined` e o `if` de `:251` nunca passaria.
   **Resolvida na validação, a favor do achado original:** `setValue` sem opções tem
   `emitViewToModelChange !== false` (`forms.mjs:3641-3646`), logo chama `viewToModelUpdate` e
   emite `ngModelChange`. O achado 1 vale na forma publicada. Confirmação empírica permanece
   **não testada**.

---

## 4. Divergência documentação × código

Seção separada, conforme `report-contract.md` §4. Não são bugs de UI.

1. **"Formulários com Reactive Forms"** — `.claude/rules/angular-components-services.md` e
   `.claude/rules/ui-ux-bootstrap-material.md` descrevem um padrão que o código não segue: o
   formulário de pedido e o de cliente combinam Reactive Forms com `[(ngModel)]` em praticamente
   todos os campos, além de manipulação direta de DOM para visibilidade.
   Evidência: `formulario.component.html:12,27,45,57,72,...`;
   `form-cliente.component.html:12,26,41,...`; `formulario.component.ts:144,151,371,379,389,533`.

2. **"Não deixar subscription sem término (`take(1)`/`first()`)"** — mesma rule. O operador está só
   no `DataCrudService`, e nem lá em tudo: `list()` e `listClient()` não têm; `consultarCep`
   também não. Nenhum componente aplica operador próprio.
   Evidência: `data-crud.service.ts:19-21`, `:49-51`, `:26,38,42,46,56,69,75,79,86,93`;
   `form-cadastro.component.ts:61`.

3. **"Erros exibidos via `shared/error-msg`"** — `.claude/rules/ui-ux-bootstrap-material.md`.
   Vários campos exibem erro apenas pelo `was-validated`/`is-invalid` do Bootstrap, sem
   `app-error-msg`: CEP, Cidade, Rua e todos os `total*`.
   Evidência: `formulario.component.html:66-74`, `:78-85`, `:176-185`.

4. **`valorFinal` como fonte de verdade** — `.claude/rules/fluxo-pedidos-relatorios.md` estabelece
   que a soma no cliente é só prévia e o `valorFinal` do backend é autoritativo. As rotinas de
   impressão e de WhatsApp recalculam o total localmente e ignoram o `valorFinal` retornado
   (achado 9).
   Evidência: `formulario.component.ts:494-498`, `:422-426`.

5. **Memória do projeto desatualizada** — o índice
   `~/.claude/projects/.../memory/MEMORY.md` ainda descreve `PedidosClientes` como "faltam
   `retirada*`/`entrega_estimada`", mas o model já os tem e o próprio arquivo de detalhe marca o
   ponto como resolvido em 2026-07-11.
   Evidência: `shared/pedidos-clientes.ts:15,19,23,27,31,35,39`.

---

## 5. Correções aplicadas na validação

Ajustes do `ux-evidence-validator` sobre a síntese das fases 1 e 2 — nenhum é rejeição.

| Achado | Correção |
|---|---|
| 4 / 57 | "Cancelar sem `type`" **não** se aplica a `busca-cep.component.html:73`: o form não tem `(ngSubmit)`, `FormGroupDirective.onSubmit` retorna `false` e `reset()` marca untouched. Efeito praticamente nulo ali. |
| 5 | São **6** botões com nome acessível errado, não 5 — inclui "Novo Campo" (`:490`). |
| 12 | Severidade rebaixada de **crítico** para **importante**: transborda e gera scroll horizontal, mas o botão continua clicável. Quebra em sm e md; ok a partir de lg. |
| 42 | Rebaixado de **importante** para **melhoria**: o `required` do HTML **é** aplicado pelo `RequiredValidator` e as mensagens aparecem; é armadilha de manutenção, não falha de validação. |
| 19 | Rebaixado para **melhoria** (código morto comprovadamente inalcançável). |
| 21 | Rebaixado para **melhoria**: atinge só o ícone do "Novo Campo". |
| 65 | Contagem corrigida: 14 instâncias em `formulario.component.html` e 7 em `form-cliente.component.html` (não 13). |
| 6 | Impacto **agravado**: o valor é perdido de fato, não só na exibição, porque `setValue` propaga e o `onChange()` recalcula `valorFinal` com 0. |
| 59 | Precisão **corrigida**: dispara ao clicar em "Registrar Pedido" vindo de qualquer rota, não só ao reclicar a tela ativa. |
| 9 | Acrescentado: `loopForTotais` **muta** `pedidosClientes.totalN` como efeito colateral. |

---

## 6. Validações executadas e não executadas

- **Executado:** leitura estática integral das 7 linhas da coverage-matrix; 3 auditorias paralelas
  independentes; validação independente com reabertura de cada arquivo citado; verificação pontual
  no código-fonte de dependências (`print-js`, `@angular/forms`, `@angular/material`, `bootstrap`)
  para sustentar ou derrubar hipóteses.
- **Não testado — runtime.** Nenhuma navegação real foi feita nesta auditoria: não havia
  ferramenta de controle de browser registrada na sessão e o app não estava no ar. Ficam
  explicitamente **não testados**: a renderização e os breakpoints reais (achados 12, 32, 51, 58,
  61), a manifestação dos `TypeError` previstos nos achados 3 e 30, a sequência de duplicação do
  achado 2, a sobrescrita do achado 1, e o comportamento observável dos achados 6, 7 e 53.
- **Não executado:** `npm run build` e `npm test` — auditoria somente-leitura, sem alteração de
  código que justificasse compilação.
- **Não confirmado no projeto:** se o backend aceita `total*` como string com vírgula no POST de
  criação (achado 26).

### Roteiro sugerido para uma sessão com runtime

Priorizado pelos achados cuja severidade depende de observação:

1. Preencher itens, voltar ao campo Cliente, corrigir o nome e sair do campo — os itens somem?
   (achado 1, o mais grave)
2. Salvar um pedido, alterar um detalhe, salvar de novo — viram dois pedidos? (achado 2)
3. Digitar descrição sem total → Imprimir; e excluir um item → Imprimir (achado 3)
4. Clicar em Cancelar com o formulário preenchido (achado 4)
5. Marcar e desmarcar "Pesagem na Retirada" com valor já digitado (achado 6)
6. Imprimir um pedido com as três flags de status falsas (achado 7)
7. Abrir `pesquisar-pedido` e clicar em Imprimir sem carregar pedido (achado 30)
8. Buscar duas ruas seguidas em `buscar-cep` sem clicar em Cancelar (achado 53)
9. Viewport 375px / 768px: linhas de item, tabelas e menu hambúrguer (achados 12, 32, 51, 58, 61)
10. Tabular do primeiro campo até os botões de item, observando o foco (achados 5, 15)

---

## 7. Nota final

**Esta auditoria não editou código.** Nenhum arquivo de código, configuração ou documentação
preexistente foi alterado — a única escrita autorizada e realizada foi a criação deste relatório.

Correções derivadas destes achados são tarefa separada e devem seguir
`.claude/rules/raciocinio-e-arquitetura.md` (bug pontual vs refatoração, decisão reversível vs
irreversível, quando abrir ADR). Em particular, os achados 1 e 2 tocam integridade de dados e
`DataCrudService`, e o achado 9 toca `.claude/rules/fluxo-pedidos-relatorios.md` — áreas sensíveis
que exigem confirmação antes de qualquer alteração.
