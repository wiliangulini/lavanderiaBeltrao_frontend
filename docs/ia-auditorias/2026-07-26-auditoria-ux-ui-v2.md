# Auditoria UX/UI integral — Lavanderia Beltrão (frontend)

## 1. Resumo

- **Objetivo:** auditoria UX/UI integral de todas as telas da SPA (não é revisão pontual), combinando análise estática de código, 3 agentes paralelos independentes, exploração runtime num Chrome real, e validação independente das evidências.
- **Escopo:** `spa-completa` — as 7 linhas da coverage-matrix: `registrar-pedido`, `pesquisar-pedido`, `cadastrar-clientes`, `editar-clientes`, `buscar-cep`, `navbar`, `shared/error-msg`. Prioridade: operador de balcão em desktop; cobertura desktop/tablet/mobile; acessibilidade com WCAG 2.2 AA como referência de leitura.
- **Data:** 2026-07-26.
- **Metodologia:** (1) leitura estática do agente principal; (2) 3 agentes paralelos (`ux-flow-auditor`, `ux-a11y-auditor`, `ux-visual-responsive-auditor`), só leitura, sem executar o app; (3) runtime real no Chrome desta sessão (`http://127.0.0.1:4200`, loopback, dados sintéticos, sem submit); (4) validação independente (`ux-evidence-validator`), que reabriu cada arquivo citado e confirmou/rejeitou/fundiu achados.
- **Runtime:** disponível nesta sessão (extensão Chrome conectada após reinstalação pelo usuário). Usado para confirmar ou refutar hipóteses da análise estática — ver rótulo "confirmado em runtime" nos achados abaixo. Testes de breakpoint mobile/tablet reais (redimensionar viewport) **não foram possíveis** nesta sessão — a ferramenta de redimensionamento de janela não alterou o viewport real do Chrome conectado (ambiente com display fixo); esses itens estão marcados **não testado**.
- **Nenhuma alteração de código foi feita** — auditoria 100% somente-leitura.

---

## 2. Achados por tela

### `registrar-pedido` (`PedidosComponent` + `FormularioComponent`)

1. **Melhoria** — `PedidosComponent.ngOnInit()` acessa `document.querySelector('.btn-whats')` sem checagem de nulidade. É código morto/duplicado (a própria `FormularioComponent` filha já esconde/mostra os mesmos elementos corretamente). **Confirmado em runtime**: 2 reloads reais com console aberto não geraram nenhum `TypeError` — a ordem de criação de views do Angular garante que o DOM do filho já existe quando o `ngOnInit` do pai roda.
   Evidência: `src/app/pedidos/pedidos.component.ts:28-34`. Origem: ux-flow-auditor + runtime.

2. **Melhoria (arquitetura)** — `PedidosComponent` estende `FormularioComponent` (herda FormGroup de 47 controles + serviços HTTP/CEP/DataCrud/SnackBar) mas o template só usa `<app-formulario>` filho — instância de estado/serviços sem uso real.
   Evidência: `pedidos.component.ts:15`; `pedidos.component.html:5`. Origem: ux-flow-auditor.

3. **Importante** — Mistura `formControlName` + `[(ngModel)]` no mesmo elemento (padrão deprecated pelo Angular v6+) recorrente em praticamente todos os campos. **Confirmado em runtime**: warning de depreciação observado no console real ao carregar a tela.
   Evidência: `formulario.component.html:10-11,25-26,43,156-157` (e repetição nos itens 1..5). Origem: ux-flow-auditor + runtime.

4. **Importante** — `onEdit()` só faz `this.pedidosClientes = data`, sem `patchValue()`/`setValue()`; a exibição dos valores carregados depende inteiramente do binding deprecated do achado 3.
   Evidência: `formulario.component.ts:173-209`. Origem: ux-flow-auditor.

5. **Confirmação (sem defeito)** — ADR 0007 implementado corretamente: `numberPedido` fica vazio até o `POST` retornar; Imprimir/WhatsApp ficam ocultos até a resposta. **Confirmado em runtime**: ao carregar a tela, só "Salvar"/"Cancelar" ficam visíveis.
   Evidência: `formulario.component.ts:131,591-617,605`. Origem: ux-flow-auditor + runtime.

6. **Crítico** — Label "Cliente" sem `for`, input correspondente sem `id` — quebra a associação label↔campo (WCAG 1.3.1/4.1.2/3.3.2), diferente do campo "Telefone" (correto). **Confirmado em runtime**: clicar no texto do label "Cliente" não move o foco para o campo; clicar em "Telefone" corretamente foca o input (cursor visível).
   Evidência: `formulario.component.html:4` vs `:18,21`. Origem: ux-a11y-auditor + runtime.

7. **Crítico** — O `pattern="[0-9]{10,12}"` do campo Telefone ativa o validador nativo do Angular, gerando erro `pattern`; `FormValidations.getErrorMsg` só mapeia `required`/`cepInvalido` e retorna `undefined` para `pattern`; como `*ngIf="errorMessage != null"` trata `undefined` como `null`, **a mensagem de erro nunca aparece** para telefone em formato inválido — falha silenciosa (mesma raiz do achado 61, shared/error-msg).
   Evidência: `formulario.component.html:19-31`; `shared/form-validations.ts:35-42`; `shared/error-msg/error-msg.component.ts:39-47`. Origem: ux-a11y-auditor.

8. **Crítico** — Botões "Excluir item" (×5), "Novo Campo" e WhatsApp são `<a>` sem `href`, operados só por `(click)` — inoperáveis via teclado. **Confirmado em runtime**: focar o campo anterior (`valorFinal`) e pressionar Tab real do teclado pula direto para o próximo campo, sem passar pelo botão "Novo Campo" no meio do DOM.
   Evidência: `formulario.component.html:251,305,359,413,470,489,538`. Origem: ux-a11y-auditor + runtime.

9. **Crítico** — Botão WhatsApp usa um `<svg>` sem `aria-label`/`title`/texto — nenhum nome acessível.
   Evidência: `formulario.component.html:538`. Origem: ux-a11y-auditor.

10. **Melhoria** — Ícones com texto em inglês ("delete"/"add"), inconsistente com o pt-BR do app; "Novo Campo" nem tem `title` (diferente de "Excluir item").
    Evidência: `formulario.component.html:251` vs `:489`. Origem: ux-a11y-auditor.

11. ~~**Crítico — não testado em runtime, baseado em leitura de código**~~ — O recibo impresso via `print-js` provavelmente sai vazio/desatualizado: o elemento impresso é um `<textarea [(ngModel)]="this.msg">`; a lib clona o elemento e só copia `.value` ao vivo para `SELECT`/`CANVAS`, não para `TEXTAREA`. Clicar em "Imprimir" dispara um diálogo nativo de impressão do SO, que a automação não deve acionar — recomenda-se **validação manual** antes de qualquer correção.
    Evidência: `formulario.component.html:539`; `formulario.component.ts:533-555`; `node_modules/print-js/src/js/html.js:28-65`. Origem: ux-visual-responsive-auditor.
    **Atualização 2026-07-27 — Refutado por evidência empírica.** Ver Adendo §6. `cloneNode()` em `<textarea>` preserva o `.value` ao vivo por regra da própria especificação HTML (o `switch` que só trata `SELECT`/`CANVAS` era desnecessário para o caso do textarea); o nó clonado é inserido no iframe de impressão via `appendChild()` (objeto DOM vivo, não HTML serializado), então o navegador renderiza o valor corretamente. **Não há bug de recibo vazio; nenhuma correção necessária.**

12. **Importante** — print-js carregado em duplicidade: CDN externo + pacote npm.
    Evidência: `src/index.html:12,17`; `package.json:26`; `formulario.component.ts:8`. Origem: ux-visual-responsive-auditor.

13. **Importante** — `ViewEncapsulation.None` torna o SCSS de `FormularioComponent` global; classes genéricas (`.form-label`, `.form-check-label`, `.remove`/`.add`) vazam para outros componentes que reusam os mesmos nomes.
    Evidência: `formulario.component.ts:16`; uso cross-componente confirmado em `form-cliente.component.html`. Origem: ux-visual-responsive-auditor.

14. **Importante** — Grid Bootstrap decorativo: `col-sm-*`==`col-md-*`==`col-lg-*`==`col-xl-*` idênticos em todos os blocos de item — sem adaptação real entre breakpoints (sem "buraco" visual abaixo de 576px, cai para 100% via fallback do Bootstrap).
    Evidência: `formulario.component.html:3,17,35,49,63,75,88,99...`. Origem: ux-visual-responsive-auditor.

15. **Importante** — Botões Salvar/Cancelar/Imprimir com `width:20%` fixo, sem variantes por breakpoint.
    Evidência: `formulario.component.scss:29-34`. Origem: ux-visual-responsive-auditor.

16. **Melhoria** — 3 estilos de botão-ícone diferentes convivendo na mesma tela (retangular padrão / circular "Novo Campo" / circular WhatsApp).
    Evidência: `formulario.component.scss:4-12,41-52`. Origem: ux-visual-responsive-auditor.

17. **Melhoria** — "Pesagem na Retirada" em coluna estreita (`col-sm-2`, ~16,6%) com fonte 20px — risco de quebra de texto.
    Evidência: `formulario.component.html:186`; `formulario.component.scss:62-64`. Origem: ux-visual-responsive-auditor.

18. **Melhoria** — Ícones Material dependem de fonte via CDN sem fallback local.
    Evidência: `src/index.html:11`. Origem: ux-visual-responsive-auditor.

### `pesquisar-pedido` (`PesquisaComponent`)

19. **Importante (arquitetura/fluxo)** — `PesquisaComponent` estende `FormularioComponent` **e** ainda embute `<app-formulario>` filho separado — duas instâncias de estado de formulário convivendo (o próprio código comenta essa decisão).
    Evidência: `pesquisa.component.html:4,48`; `formulario.component.ts:29-33`. Origem: ux-flow-auditor.

20. **Importante** — `<form>` aninhado dentro de `<form>` (HTML inválido): o form do pai envolve `<app-formulario>`, cujo template raiz também é `<form>`. **Confirmado visualmente em runtime**: tabela de resultados seguida por um `<app-formulario>` completo embutido abaixo, na mesma página renderizada.
    Evidência: `pesquisa.component.html:4,48`; `formulario.component.html:1`. Origem: ux-flow-auditor + ux-visual-responsive-auditor + runtime.

21. **Melhoria** — Sem estado "nenhum resultado encontrado" na busca.
    Evidência: `formulario.component.ts:157-171`; `pesquisa.component.html:27`. Origem: ux-flow-auditor.

22. **Crítico** — Links "Editar"/"Deletar" são `<a>` sem `href`, só `(click)` — mesmo problema estrutural do achado 8.
    Evidência: `pesquisa.component.html:38,41`. Origem: ux-a11y-auditor.

23. **Importante** — Sem `aria-live` após a busca popular resultados — usuário de leitor de tela não é informado.
    Evidência: `pesquisa.component.html:27`. Origem: ux-a11y-auditor.

24. **Melhoria** — Sem heading (h1/h2) identificando a tela, diferente de `buscar-cep`.
    Evidência: `pesquisa.component.html:1-52` vs `busca-cep.component.html:6`. Origem: ux-a11y-auditor.

25. **Importante** — Tabela de resultados sem `.table-responsive` (classe não existe em nenhum lugar do projeto).
    Evidência: `pesquisa.component.html:16-45`. Origem: ux-visual-responsive-auditor.

26. **Melhoria** — Botões "Editar"/"Deletar" com `w-100` em célula estreita, sem largura mínima.
    Evidência: `pesquisa.component.html:38,41`. Origem: ux-visual-responsive-auditor.

> Nota: os achados 11-18 (print-js, encapsulamento global, grid decorativo, botões, ícones) também se aplicam aqui via `<app-formulario>` reaproveitado — não recontados para evitar duplicidade.

### `cadastrar-clientes` (`CadastroComponent` + `form-cliente`)

27. **Melhoria** — `FormClienteComponent.submit()` chama `onSuccess()` incondicionalmente e, na sequência síncrona, o ternário correto — código redundante. Como `MatSnackBar.open()` substitui instantaneamente qualquer snackbar em exibição, o usuário provavelmente só vê a última mensagem (a correta); o impacto de UX descrito originalmente não foi confirmado em runtime.
    Evidência: `form-cliente.component.ts:45-55`. Origem: ux-flow-auditor.

28. **Importante** — Mesma mistura `ngModel`+`formControlName` recorrente em todos os campos.
    Evidência: `form-cliente.component.html:5-14,19-27,34-44,64-74,78-88,94-104`. Origem: ux-flow-auditor.

29. **Importante** — `consultarCep()` (compartilhado com registrar-pedido/editar-clientes) não dá feedback visível de erro/CEP inválido — só `console.error`.
    Evidência: `form-cadastro.component.ts:57-79`. Origem: ux-flow-auditor + ux-a11y-auditor.

30. **Crítico** — Label "Telefone" (`for="telefone"`) sem `id` correspondente no input.
    Evidência: `form-cliente.component.html:18-27`. Origem: ux-a11y-auditor.

31. **Crítico** — Label "Complemento" (`for="complemento"`) sem `id` correspondente.
    Evidência: `form-cliente.component.html:107-114`. Origem: ux-a11y-auditor.

32. **Melhoria** — Wrapper de layout inconsistente: `CadastroComponent` não usa `.container`/`.row`, diferente de outras telas.
    Evidência: `src/app/cadastro/cadastro.component.html:1-4`. Origem: ux-visual-responsive-auditor.

33. **Melhoria** — Botões Salvar/Cancelar com `w-25` fixo, sem breakpoints.
    Evidência: `form-cliente.component.html:121-122`. Origem: ux-visual-responsive-auditor.

34. **Melhoria** — Mesmo padrão de breakpoints decorativos do registrar-pedido.
    Evidência: `form-cliente.component.html:3,17,32,46,62,76,92,106`. Origem: ux-visual-responsive-auditor.

### `editar-clientes` (`EditarComponent`)

35. **Importante** — `<form>` aninhado dentro de `<form>`: mesmo padrão do achado 20, aqui entre `EditarComponent` e `<app-form-cliente>`.
    Evidência: `editar.component.html:2,44`; `form-cliente.component.html:1`. Origem: ux-flow-auditor + ux-visual-responsive-auditor.

36. **Importante** — `onEdit()` só atribui `this.clientes = data`; `FormClienteComponent` não implementa `OnChanges` — exibição depende do binding deprecated.
    Evidência: `editar.component.ts:54-58`; `form-cliente.component.ts:13-43`. Origem: ux-flow-auditor.

37. **Melhoria** — `searchCliente()`: se o campo de busca nunca foi tocado, a comparação vira a string literal `"undefined"` — busca vazia sempre retorna nada, sem explicação.
    Evidência: `editar.component.ts:38-52`. Origem: ux-flow-auditor.

38. **Melhoria** — `list()`/`listClient()` do `DataCrudService` não usam `take(1)`/`first()`, diferente do resto do serviço (diverge da rule, sem vazamento funcional comprovado).
    Evidência: `data-crud.service.ts:19-21,49-51`. Origem: ux-flow-auditor.

39. **Crítico** — Herda os achados 30/31 (labels sem `id`) via `<app-form-cliente>` reaproveitado.
    Evidência: `editar.component.html:44`. Origem: ux-a11y-auditor.

40. **Crítico** — Label "Pesquisar Cliente" tem `for="cliente"`, mas o único input da seção tem `id="pesquisa"` (nenhum elemento com `id="cliente"` existe na tela); input ainda tem `aria-label="Search"` em inglês. **Confirmado exatamente em runtime** via inspeção JS do DOM real.
    Evidência: `editar.component.html:5-6`. Origem: ux-a11y-auditor + runtime.

41. **Crítico** — Links "Editar"/"Deletar" são `<a>` sem `href`.
    Evidência: `editar.component.html:35,38`. Origem: ux-a11y-auditor.

42. **Importante** — Sem `aria-live` após a busca popular a lista de clientes.
    Evidência: `editar.component.html:24`. Origem: ux-a11y-auditor.

43. **Importante** — Tabela de clientes sem `.table-responsive`.
    Evidência: `editar.component.html:13-42`. Origem: ux-visual-responsive-auditor.

### `buscar-cep` (`BuscaCepComponent`)

44. **Importante** — Nenhum estado de erro/CEP-inválido visível ao usuário; `consultarRua()` só loga no console, sem `MatSnackBar` nem elemento de erro no template — a própria dimensão que a coverage-matrix atribuiu a esta tela.
    Evidência: `busca-cep.component.ts:72-88`; `busca-cep.component.html:37-68`. Origem: ux-flow-auditor + ux-a11y-auditor.

45. **Importante** — Tabela sem `.table-responsive`, agravado por listas (`<ul>`) dentro de cada célula.
    Evidência: `busca-cep.component.html:27-70,41,48,55,62`. Origem: ux-visual-responsive-auditor.

46. **Melhoria** — Único campo (`rua`) sem classe de coluna Bootstrap, diferente do padrão das outras telas.
    Evidência: `busca-cep.component.html:12-25`. Origem: ux-visual-responsive-auditor.

47. **Melhoria** — Resultados sem `aria-live`.
    Evidência: `busca-cep.component.html:38-67`. Origem: ux-a11y-auditor.

### `navbar` (`NavbarComponent`)

48. **Melhoria** — `edit()` compara `className` por igualdade estrita de string — frágil a qualquer classe adicional.
    Evidência: `navbar.component.ts:15-19`. Origem: ux-flow-auditor.

49. **Importante** — Clicar em "Registrar Pedido" já na rota ativa força `window.location.reload()` em vez de navegação Angular.
    Evidência: `navbar.component.ts:16-18`. Origem: ux-flow-auditor.

50. **Importante** — Sem rota coringa (`**`); hash inválido renderiza tela em branco.
    Evidência: `app-routing.module.ts:10-17`. Origem: ux-flow-auditor.

51. **Importante** — `aria-current="page"`/classe `active` hard-coded (string estática) no link "Registrar Pedido" — permanece anunciado como página atual mesmo em outra rota.
    Evidência: `navbar.component.html:11-12` vs `:14-25`. Origem: ux-a11y-auditor.

52. ~~**Crítico**~~ **(rebaixado para Melhoria em 2026-07-27, ver abaixo)** — Larguras de item de menu somam 107% da largura do container (`22,5%×4 + 17%`). **Nuance de runtime**: em viewport desktop real (~1568-1920px, único testável na sessão original), os 5 itens renderizam sem overflow visível — provável absorção via `flex-shrink`. A parte estática (CSS soma 107%) permanece confirmada; a manifestação em mobile/tablet (breakpoints menores, menu colapsado) estava **não testada** na sessão original — limitação de ambiente (redimensionamento de janela não afetou o viewport real do Chrome conectado), não decisão de escopo.
    Evidência: `navbar.component.scss:14-19`; `navbar.component.html:10`. Origem: ux-visual-responsive-auditor + runtime (parcial).
    **Atualização 2026-07-27 — testado em toda a faixa de viewport (1920px→~500px), ver Adendo §6.** Zero overflow visível de 1920px até 992px (modo linha) e de 900px até 768px (modo coluna/mobile); o `flex-shrink` absorve os 107% em toda essa faixa. Só aparece corte real de texto em telas de celular muito estreitas (≲576px). Como a prioridade definida para esta auditoria é operador de balcão em desktop, o impacto real é bem menor que "Crítico" sugeria → **rebaixado para Melhoria**.

53. **Importante** ~~— não testado (mobile/tablet)~~ — As mesmas larguras fixas continuam aplicadas no colapso mobile (`navbar-expand-lg`, abaixo de 992px); não há nenhuma regra `@media` no `.scss` ajustando para 100% no menu vertical.
    Evidência: `navbar.component.scss` (arquivo completo, sem `@media`). Origem: ux-visual-responsive-auditor.
    **Atualização 2026-07-27 — Confirmado em runtime, ver Adendo §6.** Em telas de celular ≲576px, o texto dos itens do menu realmente corta/estoura o container (até ~19px de texto cortado em ~500px de largura). Mantido Importante, agora com confirmação empírica de impacto real (não só leitura estática).

54. **Importante** — 3 níveis de padding lateral (`ps-5`/`pe-5`) empilhados somam ~144px, sem classes responsivas.
    Evidência: `navbar.component.html:2,3,5`. Origem: ux-visual-responsive-auditor.

55. **Melhoria** — Altura fixa (90px) e fonte fixa (28px) sem ajuste por breakpoint.
    Evidência: `navbar.component.scss:1-9`. Origem: ux-visual-responsive-auditor.

### `shared/error-msg` (`ErrorMsgComponent`)

56. **Importante (arquitetura/fluxo)** — `ErrorMsgComponent` estende `FormularioComponent` em vez de ser um componente simples de exibição; cada uso (~23 no app) instancia um FormGroup de 47 controles + HTTP/CEP/DataCrud/SnackBar só para mostrar uma `<div class="alert-danger">`.
    Evidência: `error-msg.component.ts:9,17,25-34`. Origem: ux-flow-auditor.

57. **Melhoria** — `@Input() nome` nunca é preenchido por nenhum consumidor — código morto (a mensagem em si continua correta via `*ngIf="errorMessage"`).
    Evidência: `error-msg.component.html:1-2`; `error-msg.component.ts:19`. Origem: ux-flow-auditor.

58. **Crítico** — `errorMessage` pode retornar `undefined` quando o validador disparado não está mapeado em `FormValidations` (não só `pattern`); `*ngIf="errorMessage != null"` trata `undefined` como `null` — silencia erros reais de qualquer campo com validador não mapeado (raiz do achado 7).
    Evidência: `error-msg.component.ts:39-47`; `shared/form-validations.ts:35-42`. Origem: ux-a11y-auditor.

59. **Importante** — `<div role="alert">` sem `id`; nenhum input usa `aria-describedby` apontando para ele — associação só posicional, não programática.
    Evidência: `error-msg.component.html:1-7`. Origem: ux-a11y-auditor.

---

## 3. Achados descartados por falta de evidência

| Achado original | Motivo da rejeição |
|---|---|
| "`editar.component.scss` está vazio (sem achado)" (ux-visual-responsive-auditor) | **Contradiz o código real**: o arquivo tem 23 linhas de CSS real (`.btn.btn-outline-success.w-100`, `.card`, `tbody tr td`, `tr th`). Rejeitado pelo `ux-evidence-validator` ao reabrir o arquivo. |

Nenhum outro achado foi descartado — todos os demais têm evidência `arquivo:linha` verificável ou confirmação de runtime coerente com o código.

**Correções de severidade aplicadas na validação** (não rejeições, ajustes): achado 1 (TypeError previsto) rebaixado de Importante→Melhoria por refutação em runtime; achado 27 (mensagem dupla) rebaixado de Importante→Melhoria por análise do comportamento real do `MatSnackBar`; achado 11 (print-js) e achados 52/53 (navbar mobile) marcados explicitamente como não testados em runtime, mantendo só a base estática — **ver Adendo §6 para a validação de runtime desses 3 achados, feita em sessão posterior (2026-07-27)**.

## 4. Divergência documentação × código

Nenhuma divergência relevante entre rules/ADR e o código foi encontrada. O fluxo do ADR 0007 (numeração pós-POST, sem pré-busca) confere exatamente com o código e foi confirmado em runtime. A única inconsistência próxima disso — `list()`/`listClient()` sem `take(1)`/`first()`, divergindo da rule `angular-components-services.md` — foi tratada como achado de código (item 38), não como documentação desatualizada, pois a rule está correta; é o código que diverge dela.

## 5. Não editar

Esta auditoria é 100% somente-leitura. Nenhum arquivo de código, template, SCSS, spec, configuração ou dependência foi alterado. Nenhum dado real foi consultado, salvo, editado ou excluído; nenhuma requisição POST/PUT/PATCH/DELETE foi feita; WhatsApp não foi aberto; backend/banco/Docker/Firebase não foram iniciados.

---

## 6. Adendo — validação de runtime dos achados 11, 52 e 53 (2026-07-27)

Após a correção dos 11 achados críticos isolados/reversíveis (ver commits da sessão original), o
usuário pediu a validação em runtime dos 3 achados críticos restantes que a auditoria havia
deixado como "não testado" (achado 11 — print-js; achado 52 — navbar). Esta é uma sessão
posterior à data da auditoria original; mantida como adendo, não como reescrita do relatório.

### Diferença de método em relação à auditoria original

Nesta sessão, a extensão do Chrome usada para o runtime original **não estava conectada** (sem
nenhuma ferramenta de automação de navegador disponível). Em vez de marcar novamente como "não
testado", usei uma alternativa igualmente rigorosa e também 100% somente-leitura: o Chrome real do
sistema (`google-chrome`, `/usr/bin`) em **modo headless**, executando:

1. Para o achado 11: a função `cloneElement()` **real**, copiada diretamente de
   `node_modules/print-js/src/js/html.js` (código do próprio projeto, não uma reconstrução), contra
   um `<textarea>` com `.value` setado via propriedade JS — o mesmo mecanismo que o
   `NgModel`/`DefaultValueAccessor` do Angular usa.
2. Para os achados 52/53: uma reconstrução estática fiel da navbar real — HTML idêntico ao
   `navbar.component.html`, CSS verbatim de `navbar.component.scss`, e o `bootstrap.min.css` real de
   `node_modules/bootstrap` — medindo overflow real (`scrollWidth` vs `clientWidth`) em 11 larguras
   de viewport, de 1920px a ~500px.

Nenhum diálogo nativo de impressão foi acionado; nenhuma requisição de rede foi feita; nenhum dado
real foi usado; nenhum arquivo do projeto foi alterado por esses testes (arquivos de teste ficaram
fora do repositório, em diretório temporário de scratchpad).

**Ressalva de confiança**: para o achado 11, o teste roda o código-fonte real da lib em um Chrome
real — confiança alta. Para os achados 52/53, é uma reconstrução fiel (não o app Angular completo
rodando via `ng serve`) — confiança alta, mas não idêntica a testar o app vivo; a fonte Roboto Bold
via Google Fonts pode não ter carregado no ambiente headless (sem confirmação de acesso à rede),
o que afeta a métrica de texto em poucos pixels, sem mudar a conclusão geral.

### Resultados

- **Achado 11 (print-js)** — **refutado**. `cloneNode()` em `<textarea>` preserva o `.value` ao
  vivo (regra da especificação HTML para elementos de formulário); o nó clonado é anexado ao
  iframe de impressão como objeto DOM vivo (`appendChild()`), não serializado como string. O
  recibo impresso mostra o valor correto. Nenhuma correção necessária.
- **Achado 52 (navbar, soma 107%)** — **confirmado no CSS, mas impacto visual rebaixado de
  Crítico para Melhoria**. Zero overflow visível de 1920px até 992px (modo linha) e de 900px até
  768px (modo coluna/mobile); `flex-shrink` absorve os 107% em toda essa faixa. Overflow real só
  aparece em celulares muito estreitos (≲576px).
- **Achado 53 (navbar, larguras fixas no mobile)** — **confirmado com evidência empírica de
  impacto real**: em ≲576px, o texto de vários itens do menu corta/estoura visivelmente (até
  ~19px de texto cortado em ~500px de largura). Mantido Importante.

### Correção aplicada (2026-07-27)

O usuário autorizou a correção sugerida acima. Adicionado um breakpoint `@media (max-width:
991.98px)` (mesmo valor do breakpoint `navbar-expand-lg` do Bootstrap, onde o menu colapsa) em
`navbar.component.scss`, fazendo `ul li`/`ul li.cep` ocuparem 100% de largura no menu mobile —
resolve #52 e #53 ao mesmo tempo, sem alterar o comportamento em modo linha (≥992px).

Revalidado com o mesmo método headless: **zero overflow** em toda a faixa de 500px a 1920px
(antes: overflow real em ≲576px). `npm run build` executado sem novos erros/warnings.

- Achado 52 → **feito**.
- Achado 53 → **feito**.
