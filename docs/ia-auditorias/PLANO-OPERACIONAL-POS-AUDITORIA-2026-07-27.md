# Plano operacional de implementação da auditoria — Lavanderia Beltrão
### Conversão dos achados aprovados em tarefas atômicas, com ondas, dependências e prompts

> **Versão pública sanitizada.** Contagens exatas de duplicatas do legado e tamanhos precisos de artefato foram generalizados para publicação neste repositório. Tarefas, ordem, dependências, aceite e prompts foram preservados na íntegra.

> **Este documento não implementa nada.** Nenhum código, configuração, teste, dependência, banco,
> script, branch, commit ou PR foi criado ou alterado na sessão que o produziu. A única escrita foi
> a criação deste arquivo, com caminho autorizado previamente.

---

## 1. Baseline aceita

### 1.1 HEADs registrados no início da sessão

| Repositório | Branch | HEAD | Último commit | Working tree |
|---|---|---|---|---|
| `lavanderiaBeltrao_frontend` | `dev` | `ef9b26484c345c511eb40cfc47f7331f78461596` | `ef9b264` — *fix(formulario): corrige botao WhatsApp deformado na barra de acoes* (2026-07-27 13:49 −03) | limpa, exceto 3 relatórios de auditoria não rastreados |
| `lavanderiaBeltrao_backend` | `dev` | `dcfcadf0f7b0443b58d059bbaed071cfa15b882f` | `dcfcadf` — *docs(ia): corrige rules desatualizadas (ADR 0002-0005) e aplica paths:* (2026-07-26 13:45 −03) | limpa, exceto 1 relatório de auditoria não rastreado |

Os dois HEADs são **exatamente** os declarados pelas quatro auditorias de 2026-07-27. Nenhum código
mudou desde elas → a baseline é aceita sem reconciliação e toda referência `arquivo:linha` das
fontes é conferível nesses commits.

### 1.2 Fontes

| # | Documento | Repo | Papel |
|:-:|---|---|---|
| 1 | `AUDITORIA-ARQUITETURA-BACKEND-BD-2026-07-27.md` | backend | origem — 55 achados |
| 2 | `AUDITORIA-ARQUITETURA-FRONTEND-2026-07-27.md` | frontend | origem — 51 achados |
| 3 | `AUDITORIA-UX-UI-INTEGRAL-2026-07-27.md` | frontend | origem — 86 achados |
| 4 | `AUDITORIA-INTEGRAL-SISTEMA-2026-07-27.md` | frontend | consolidação — 9 clusters P0, 6 rejeições |

### 1.3 Método de revalidação

- **Somente estática**, conforme autorizado: leitura direta dos arquivos + `grep`, com a evidência
  **relida no HEAD atual**, nunca copiada da fonte.
- **Nenhum** comando de build, teste, banco, VPS, deploy ou rede foi executado. Em particular,
  `./mvnw test` sem seletor **não foi executado** — é o próprio achado `BE-TEST-001`.
- Nenhum dado real de cliente foi lido; URLs de produção aparecem apenas pelo esquema.

### 1.4 Resultado da revalidação — achados P0/P1/CRÍTICOS/ALTOS

**CONFIRMADO por evidência relida hoje (28 itens):**

| Achado | Evidência relida no HEAD atual |
|---|---|
| `SYS-001` / `FE-STATE-001` | `formulario.component.html:536` — `<button id="salvar" type="submit">` **sem** `[disabled]`; `formulario.component.ts:57-99` — FormGroup com 40 controles e **sem** `id`; `:586` `onBeforeSave` sobrescreve `pedidosClientes` com `formulario.value`; `:603` guarda a resposta; `data-crud.service.ts:30-35` decide POST/PUT por `pedido.id` |
| `BE-DB-008` (parte de `SYS-001`) | `grep -rn 'unique\|uniqueConstraints' src/main/java/` → **zero ocorrências** em todo o backend |
| `SYS-002` / `BE-TEST-001` | `SpringLavanderiaApplicationTests.java` — `@SpringBootTest` puro, sem `@TestPropertySource`/`@ActiveProfiles`; `src/test/resources/` contém só `schema.sql` e `test-h2.properties` |
| `SYS-002` / `FE-TEST-001` `FE-TEST-003` | `karma.conf.js:39-41` — `autoWatch: true`, `browsers: ['Chrome']`, `singleRun: false`; `package.json:9` — `"test": "ng test"`, sem `test:ci` |
| `BE-DB-003` | `PedidosClientsRepository.java:47,58` — `pedido_contador_diario` só em native query; `@Entity` existe apenas em `Pedidos`, `PedidoItem`, `Client` |
| `SYS-003` / `FE-SEC-001` | `environment.ts:9` e `environment.prod.ts:5` — esquema `http`, **zero** `https` |
| `SYS-003` / `BE-SEC-001` | `pom.xml` sem `spring-boot-starter-security`; `CorsConfig:18-27` — `addMapping("/**")`, `allowedMethods(... PUT, POST, DELETE ...)`, `allowCredentials(true)` |
| `UX-2.1-01` / `FE-STATE-005` | `formulario.component.ts:253` — `this.pedidosClientes = match` (registro de **cliente**); `:251` guarda por `pedidoRegistrado`; `:133` grava `pedidoRegistrado` |
| `UX-2.1-03` / `FE-ARCH-008` | `:428` `ds` filtra por `!== null` (aceita `''`) × `:265` `loopForTotais` filtra por `!= null`; `removerItem` `:365-367` grava `total=null` e `descricao=''` → arrays desalinhados → `totais[i].toFixed(2)` sobre `undefined`. Bloco duplicado **integralmente** em `:427-462` (WhatsApp) e `:499-531` (impressão) |
| `UX-2.2-27` / `UX-2.4-46` | `grep -rn 'MatDialog\|window.confirm\|confirm('` em `src/app/` → **zero**; `pesquisa.component.html:41` e `editar.component.html:38` — `Deletar` como `btn btn-primary w-100`, idêntico ao `Editar` |
| `FE-FORM-003` | `formulario.component.html:537` — `<button (click)="resetar()">Cancelar</button>` **sem** `type`; `form-cliente.component.html:73` — idem |
| `FE-SEC-003` | **15** `console.log` (11 em `formulario.component.ts`, 3 em `form-cliente.component.ts`, 1 em `input-client.component.ts`) + 2 `console.error`; `angular.json` não remove console |
| `FE-API-002` | `editar.component.ts:41` usa `listClient()` (base inteira) enquanto `data-crud.service.ts:90` já expõe `searchClientes(query)` e o backend já tem `ClientController:42 @GetMapping("/search")` |
| `FE-TEST-004` | `app.component.spec.ts:29-34` — `it('should render title')` afirma `.content span` com `'lavanderia app is running!'`; `app.component.html` não tem esse template |
| `UX-2.8-67` | `index.html:2` — `<html lang="en">` |
| `BE-SEC-002` | `ClientController.java:60` — `create(@RequestBody Client client)`; `:65` — `clientRepository.save(client)` |
| `BE-TEST-003/004/006/015` | `grep -rln 'valorFinal\|somarItens\|jsonPath' src/test/` → **nenhum arquivo**; a suíte tem 4 classes |
| `BE-TEST-010` | `PedidosService.java:25,45` — `LocalDate.now(FUSO_OPERACIONAL)`, sem `Clock` injetável |
| `BE-DB-005` | `src/test/resources/schema.sql` recria `pedido_contador_diario` e `uq_pedido_data_seq`, mas **não** `UNIQUE(pedido_id, ordem)` |
| `BE-DB-006` | mesma evidência — a constraint vive só no SQL, com comentário explicando a decisão deliberada |
| `SYS-004` / `FE-API-001` / `BE-API-002` | backend: `Map.of("erro", mensagem)` em `PedidosClientsController:118` e `ClientController:115`, **sem** `@ControllerAdvice`; frontend: 10 handlers `error:`, dos quais **8** são `error: () =>` com frase fixa (descartam o `err` inteiro) e 2 apenas `console.error` |
| `BE-API-001` | `grep '@Valid\|@NotNull\|@NotBlank\|validation'` em `src/main/java/` e `pom.xml` → **zero** |
| `FE-ARCH-001` | `error-msg.component.ts:17` — `ErrorMsgComponent extends FormularioComponent`; `pesquisa.component.ts:14` e `pedidos.component.ts:15` idem |
| `FE-ARCH-006` | `formulario.component.ts:18-23` — `implements ChangeDetectorRef` com `checkNoChanges`, `detach`, `detectChanges`, `markForCheck`, `reattach` **todos vazios** |
| `FE-ARCH-004` | `formulario.component.ts:135` e `:574` — `window.location.hash.slice(2)` decide estado e modo de salvamento; `pedidos.component.ts:29` faz o mesmo com `location.href` |
| `UX-2.1-06` | `formulario.component.ts:307-330` — `pesarRetirada` lê `e.target.checked` só para o próprio checkbox e depois faz `setValue(0)` no `total` correspondente **incondicionalmente** |
| `UX-2.1-07` | `:454-462` e `:523-531` — cadeia `if/else if` sem `else`; `status` fica `undefined` e é concatenado na mensagem em `:464` e `:538` |
| `UX-2.5-53` | `busca-cep.component.ts:78-83` — `consultarRua()` faz `push` sem limpar; os arrays só são limpos em `resetar()` (`:57-60`), acionado apenas pelo botão Cancelar |
| `FE-API-006` | `pedidos-clientes.ts` — **9** campos com `?:` em **42** declarados |
| `FE-API-003` | `proxy.conf.js` aponta `/api` do **dev** para o host de **produção** |
| `BE-SEC-005` | `git ls-files` → `out/artifacts/spring_lavanderia_jar/spring-lavanderia.jar` rastreado |
| `BE-DOC-002` | `PROJECT_RULES.md` do backend, linhas **24, 41, 127**, afirmam suíte contra H2 — a linha 24 cita explicitamente "contexto da aplicação", que é a classe que não roda em H2 |
| `FE-DOC-003` | `README.md:19` (*"Run `ng test`"*), `PROJECT_RULES.md:23,43,94,111` publicam `npm test` como validação canônica |

**CONFIRMADO COM RESSALVA (divergência numérica ou de caminho — a tarefa usa o dado corrigido):**

| Achado | Ressalva |
|---|---|
| `FE-SEC-003` | as fontes dizem "13 `console.log`"; a contagem de hoje é **15 `console.log` + 2 `console.error`** |
| `FE-FORM-003` | o consolidado cita `src/app/shared/form-cliente/form-cliente.component.html:124`; o caminho real é `src/app/form-cliente/form-cliente.component.html:73` |
| `UX-2.1-03` | o mecanismo é o descrito, mas o predicado de `totais` está em `loopForTotais` (`:265`), não inline nos dois blocos — a correção mínima é **um** ponto, não dois |
| fonte 3 (contagem) | o §1 da fonte 3 diz "6 críticos"; o documento contém **9** marcações `**Crítico**`. O consolidado (9) está certo; o resumo da própria fonte subconta |

**NÃO VERIFICÁVEL ESTATICAMENTE — permanece como marca, não vira fato (9 itens):**

| Item | O que falta | Consequência no plano |
|---|---|---|
| Estado real de `pedido_contador_diario` na VPS / Gate F executado | consulta ao banco de produção | `T-P0-01` é tarefa de verificação, não de correção |
| Backup agendado do MySQL (`BE-OPS-013`) | pergunta ao responsável | `T-P0-02` |
| Conteúdo do fat-jar versionado (`BE-SEC-005`) | inspeção autorizada do artefato | `T-P0-03`; a rotação de senha depende do resultado |
| Exposição efetiva da porta 8080 à internet | teste de rede externo | severidade de `SYS-003` mantida CRÍTICA pelo código, não pela rede |
| Suíte do frontend "10 de 15 falhando" | execução de `npm test` | herdado da fonte 2 (execução real dela). O que foi confirmado hoje: **13 arquivos** `.spec.ts` e a config que impede terminar |
| Bundle inicial de 989 kB vs budget de erro (`FE-PERF-003`) | execução de `npm run build` | confirmado hoje só o **budget** (`angular.json:41-46`: warning 500 kB, **erro 1 MB**). A medida é herdada |
| Efeito real do `HHH000104` (`BE-PERF-002`) | runtime do backend | mantido rebaixado |
| Corpo real do `POST /api/pedidos` (`FE-FORM-001`) | DevTools → Network | a tarefa entra como *redução de risco*, não como correção de bug |
| Todas as severidades de UX que dependem de navegador (`UX-2.1-12`, `32`, `51`, `58`, `61`) | runtime da SPA | permanecem em P2 |

---

## 2. Achados rejeitados ou adiados

| Achado | Veredito | Fundamento |
|---|---|---|
| `FE-OPS-001` — corrigir 20→16 dígitos hex em `firebase.json` | **REJEITADO** (mantida a rejeição da fonte 4) | O padrão de 20 hex foi reconfirmado hoje (`firebase.json:10`), mas o site é servido por **Apache na VPS**. O arquivo não está no caminho de entrega: a correção não entrega nada. Não vira tarefa |
| `FE-OPS-002` / `FE-OPS-003` — "corrigir o Dockerfile" | **ADIADO — vira decisão** | `Dockerfile` termina em `nginx:alpine`; produção é Apache. Corrigir caminho morto é trabalho perdido. Entra como **ADR-2** (adotar ou apagar), 90 dias |
| `BE-PERF-002` — paginação com `@EntityGraph` | **REBAIXADO para BAIXA/latente** | Confirmado hoje: `data-crud.service.ts` **não envia `page`/`size` em nenhuma chamada**. Ninguém paga o custo. Vira pré-requisito de *quando* a paginação for adotada |
| `UNIQUE(numberPedido)` | **REJEITADO** | A ADR 0007 já rejeitou (um número relevante de duplicatas no legado). `SYS-001` se resolve no frontend, sem tocar o schema |
| `UX-2.1-26` — "`total*` sai como string com vírgula no POST" | **SUPERADO** | Arbitrado pela fonte 2 no código-fonte do Angular (`updateModel` é síncrono). O risco remanescente é de *timing* e está em `FE-FORM-001` |
| Recibo impresso sai em branco | **REFUTADO nas fontes — não reabrir** | Cloning steps da spec HTML preservam o valor do `textarea` |
| `PedidosComponent.ngOnInit()` estoura `TypeError` | **REFUTADO nas fontes — não reabrir** | Verificado em runtime na auditoria de 2026-07-26 |
| Autenticação na aplicação · CI/CD · Flyway/Liquibase · Spring Profiles · `ddl-auto=validate` · NgRx · `HttpInterceptor` global · `retry` automático · `OnPush`/`trackBy`/lazy loading · `FormArray` para itens · upgrade major do Angular · ESLint com preset completo · Sentry · standalone/signals | **ADIADOS com gatilho** | As três fontes rejeitaram e a consolidação confirmou. Reproduzidos na §6 (backlog P3) com o gatilho de cada um. **Nenhum vira tarefa de onda** |
| `BE-OPS-006` (CI/CD) | **ADIADO** | Seria vermelho por `SYS-002`; um CI ingênuo com credencial de produção aplicaria DDL a cada push |
| `BE-TEST-005` (`saveAndFlush` intestável com mock) | **ADIADO para P2** | Depende de `T-P1-12` (constraint no schema de teste) para o teste ter o que capturar |
| `BE-OPS-012`, `BE-OPS-014`, `BE-OPS-011` | **ADIADOS** para 60/90 dias | Nenhum causa perda de dado ou dinheiro hoje; `BE-OPS-011` exige ADR-3 |

**Classificação por natureza** — o plano não trata tudo como obrigatório:

| Natureza | O que é | Onde está |
|---|---|---|
| **OBRIGATÓRIA** | perda de dado, dinheiro errado ou PII de terceiro exposta | `T-P0-01`, `T-P0-04`, `T-P0-08`, `T-P0-09`, `T-P0-10`, `T-P0-11`, `T-P0-13`, `T-P0-16`, `T-P1-01` |
| **REDUÇÃO DE RISCO** | não há dano hoje; a próxima mudança o cria | `T-P0-02/03/05/06/07`, `T-P1-02/03/04/05/12/13/14` |
| **MELHORIA** | coesão, a11y, legibilidade, performance | `T-P0-12/14/15`, `T-P1-06/07/08/09/10/11/15`, toda a onda P2 |
| **MODERNIZAÇÃO OPCIONAL** | só com gatilho declarado | backlog P3 inteiro |

---

## 3. Primeira onda — P0

16 tarefas. Ordem global de execução na coluna própria de cada card.

### `T-P0-01` — Verificar `pedido_contador_diario` e o Gate F na VPS · **OBRIGATÓRIA**

| Campo | Conteúdo |
|---|---|
| **Achados** | `BE-DB-003` (CRÍTICO) |
| **Repositório** | backend (operação — nenhum arquivo do repo é alterado) |
| **Objetivo** | Responder, por escrito, se a tabela contadora existe em produção e se o Gate F foi executado. Enquanto não responder, o único fluxo de escrita do negócio pode estar a um restart de parar |
| **Arquivos envolvidos** | `tools/migracao-numeracao-diaria/sql/01_schema_numeracao_diaria.sql` (só as queries de conferência que ele já contém) |
| **Escopo autorizado** | Executar **apenas** as queries de conferência (`SELECT`) do próprio script no MySQL de produção |
| **Fora de escopo** | Rodar o script de criação, `ALTER`, `INSERT`, restart de serviço, qualquer DDL |
| **Dependências** | nenhuma — é a primeira tarefa do plano |
| **Riscos** | nenhum (somente `SELECT`). Risco de **não** fazer: 500 no primeiro `POST` após o próximo deploy |
| **Contrato/schema** | nenhum |
| **ADR** | não |
| **Estratégia de teste** | N/A — é verificação |
| **Aceite** | Resposta escrita para: (a) a tabela existe? (b) tem linha para a data de hoje? (c) `uq_pedido_data_seq` existe em `pedidos`? |
| **Rollback** | N/A |
| **Esforço** | S |
| **Ordem** | **1** |
| **Command** | `/revisar-banco-mysql` (para revisar as queries **antes** de executar) |
| **Skill** | `mysql-data-safety` |
| **Branch** | nenhuma |
| **Commits/PRs** | nenhum. O resultado é anexado como nota nova ao final da ADR 0007, em PR separada de documentação (junto de `T-P1-14`) |

### `T-P0-02` — Confirmar a existência de backup agendado do MySQL · **REDUÇÃO DE RISCO**

| Campo | Conteúdo |
|---|---|
| **Achados** | `BE-OPS-013` |
| **Repositório** | backend (operação) |
| **Objetivo** | Saber se existe backup automático do banco de produção. É o maior risco de continuidade do negócio e não é problema de código |
| **Arquivos envolvidos** | nenhum |
| **Escopo autorizado** | Pergunta ao responsável + inspeção de `crontab -l` / unit systemd de backup na VPS |
| **Fora de escopo** | Criar rotina de backup nesta tarefa (vira tarefa própria se a resposta for "não") |
| **Dependências** | nenhuma |
| **Riscos** | nenhum |
| **Contrato/schema** | nenhum |
| **ADR** | não |
| **Estratégia de teste** | N/A |
| **Aceite** | Resposta escrita: existe? com que frequência? o destino é fora da VPS? |
| **Rollback** | N/A |
| **Esforço** | S (5 minutos, maior retorno esperado do plano) |
| **Ordem** | **2** |
| **Command** | nenhum |
| **Skill** | `mysql-data-safety` |
| **Branch** | nenhuma |
| **Commits/PRs** | nenhum |

### `T-P0-03` — Verificar se o fat-jar versionado contém credencial · **REDUÇÃO DE RISCO**

| Campo | Conteúdo |
|---|---|
| **Achados** | `BE-SEC-005` |
| **Repositório** | backend |
| **Objetivo** | Decidir se a rotação de senha do MySQL entra no plano de 7 dias |
| **Arquivos envolvidos** | `out/artifacts/spring_lavanderia_jar/spring-lavanderia.jar` (dezenas de MB, rastreado — confirmado hoje) |
| **Escopo autorizado** | Extrair `BOOT-INF/classes/application.properties` do jar **fora do repositório** e verificar se há senha. Executado pelo responsável |
| **Fora de escopo** | Remover o jar do tracking, reescrever histórico, rotacionar senha — cada um é decisão/tarefa separada |
| **Dependências** | nenhuma |
| **Riscos** | manusear credencial real — não copiar o conteúdo para nenhum arquivo, log ou chat |
| **Contrato/schema** | nenhum |
| **ADR** | não |
| **Estratégia de teste** | N/A |
| **Aceite** | Resposta binária: contém credencial? Se sim, abre-se tarefa de rotação (fora deste plano, decisão do dono) |
| **Rollback** | N/A |
| **Esforço** | S |
| **Ordem** | **3** |
| **Command** | `/revisar-seguranca` |
| **Skill** | `senior-code-review` |
| **Branch** | nenhuma |
| **Commits/PRs** | nenhum nesta tarefa |

### `T-P0-04` — Fechar a borda: porta 8080 + proxy reverso + TLS no Apache · **OBRIGATÓRIA**

| Campo | Conteúdo |
|---|---|
| **Achados** | `SYS-003` = `FE-SEC-001` + `FE-SEC-002` + `BE-SEC-001` + `BE-SEC-003`/`FE-SEC-005` |
| **Repositório** | **nenhum** — infraestrutura da VPS. Produz apenas a ADR |
| **Objetivo** | PII de cliente deixar de trafegar em claro e a API deixar de aceitar `DELETE` de qualquer origem, **sem** construir autenticação na aplicação |
| **Arquivos envolvidos** | vhost do Apache na VPS; regra de firewall; (no repo) `docs/adr/0008-exposicao-api-e-tls.md` no backend |
| **Escopo autorizado** | (1) fechar 8080 para a internet; (2) expor a API por `mod_proxy` no mesmo host da SPA; (3) TLS via Let's Encrypt para SPA **e** API; (4) restrição por IP/VPN da loja ou Basic auth no proxy |
| **Fora de escopo** | Spring Security, OAuth/SSO, WAF, login na aplicação, mudança de código, **e a troca do esquema em `environment.prod.ts`** (é `T-P0-16`, obrigatoriamente depois) |
| **Dependências** | nenhuma técnica; depende da **decisão do dono** |
| **Riscos** | indisponibilidade na janela; bloquear acesso legítimo se a allowlist estiver errada; certificado mal emitido derrubar o vhost |
| **Contrato/schema** | muda o **contrato de ambiente** (esquema e porta da API). Paths permanecem idênticos → sem breaking change de aplicação |
| **ADR** | **SIM — ADR-1**, obrigatória e prévia |
| **Estratégia de teste** | `curl -I https://<host>/api/pedidos` → 200; `curl http://<host>:8080/api/pedidos` de fora → recusado; SPA carregada sem aviso de mixed content |
| **Aceite** | os três testes acima passam **e** o vhost HTTP antigo continua ativo até a validação terminar |
| **Rollback** | manter o vhost HTTP ativo durante toda a janela; reabrir 8080 é uma regra de firewall |
| **Esforço** | M |
| **Ordem** | **4** |
| **Command** | `/architecture-decision` (backend, para a ADR) |
| **Skill** | `architecture-review` |
| **Branch** | `docs/adr-0008-exposicao-api-tls` (backend, só a ADR) |
| **Commits/PRs** | 1 PR só com a ADR. A execução na VPS não gera commit |

### `T-P0-05` — `@TestPropertySource` em `SpringLavanderiaApplicationTests` · **REDUÇÃO DE RISCO**

| Campo | Conteúdo |
|---|---|
| **Achados** | `SYS-002` / `BE-TEST-001` (CRÍTICO) |
| **Repositório** | backend |
| **Objetivo** | Tornar `./mvnw test` seguro: hoje a classe sobe contexto real contra o banco que `application.properties` apontar, com `ddl-auto=update` |
| **Arquivos envolvidos** | `src/test/java/com/marina/springlavanderia/SpringLavanderiaApplicationTests.java` (uma anotação) |
| **Escopo autorizado** | Adicionar `@TestPropertySource(locations = "classpath:test-h2.properties")` — o mesmo arquivo já usado por `PedidosClientsRepositoryTest` |
| **Fora de escopo** | Spring Profiles, criar `src/test/resources/application.properties`, tocar `application.properties` de produção, mexer em `.claude/settings.json` |
| **Dependências** | nenhuma |
| **Riscos** | nenhum — a anotação só afeta a classe de teste |
| **Contrato/schema** | nenhum |
| **ADR** | não |
| **Estratégia de teste** | `./mvnw test -Dtest=SpringLavanderiaApplicationTests` **com seletor** e conferir no log que o datasource é `jdbc:h2:mem` |
| **Aceite** | o log mostra `jdbc:h2:mem`; nenhuma linha de DDL contra host remoto |
| **Rollback** | remover a anotação (`git revert`) |
| **Esforço** | S |
| **Ordem** | **5** — **bloqueia toda a onda P1 do backend** |
| **Command** | `/create-code` |
| **Skill** | `spring-boot-maintenance` |
| **Branch** | `test/contexto-spring-em-h2` |
| **Commits/PRs** | 1 commit, 1 PR. **Não** juntar com a correção de `PROJECT_RULES.md` (`T-P2`, só depois que a afirmação virar verdade) |

### `T-P0-06` — Script `test:ci` e Karma determinístico · **REDUÇÃO DE RISCO**

| Campo | Conteúdo |
|---|---|
| **Achados** | `SYS-002` / `FE-TEST-001` + `FE-TEST-003` (CRÍTICO) |
| **Repositório** | frontend |
| **Objetivo** | Fazer a validação exigida pelo `PROJECT_RULES.md` terminar com código de saída determinístico. Hoje `npm test` não termina |
| **Arquivos envolvidos** | `package.json` (novo script), `karma.conf.js:39-41` |
| **Escopo autorizado** | Adicionar `"test:ci": "ng test --watch=false --browsers=ChromeHeadless"`; ajustar `karma.conf.js` para não depender de GUI **sem** quebrar o `npm test` interativo |
| **Fora de escopo** | Corrigir as specs que falham (é `T-P1-03`), trocar Karma por Jest, adicionar CI, mexer em dependências |
| **Dependências** | nenhuma |
| **Riscos** | nenhum — não altera código de aplicação |
| **Contrato/schema** | nenhum |
| **Estratégia de teste** | rodar `npm run test:ci` e conferir que **termina** e imprime o total |
| **Aceite** | `npm run test:ci` termina sozinho, com código de saída não mascarado. O número de falhas pode continuar > 0 nesta tarefa |
| **ADR** | não |
| **Rollback** | `git revert` |
| **Esforço** | S |
| **Ordem** | **6** — **bloqueia `T-P1-03` e `T-P1-05`** |
| **Command** | `/create-code` |
| **Skill** | `senior-code-agent` |
| **Branch** | `test/suite-executavel` |
| **Commits/PRs** | 1 PR com `T-P0-07`, em **2 commits separados** (config × spec removida) — mesma responsabilidade (tornar a suíte utilizável), mesmo repo |

### `T-P0-07` — Remover o teste que afirma um template inexistente · **REDUÇÃO DE RISCO**

| Campo | Conteúdo |
|---|---|
| **Achados** | `FE-TEST-004` |
| **Repositório** | frontend |
| **Objetivo** | −1 falha na suíte; o teste verifica `'lavanderia app is running!'`, texto que nunca existiu neste `app.component.html` |
| **Arquivos envolvidos** | `src/app/app.component.spec.ts:29-34` |
| **Escopo autorizado** | Remover **apenas** o `it('should render title')` |
| **Fora de escopo** | Os outros 2 testes do arquivo; qualquer outra spec |
| **Dependências** | `T-P0-06` (para conseguir observar o efeito) |
| **Riscos** | nenhum |
| **Contrato/schema** | nenhum |
| **ADR** | não |
| **Estratégia de teste** | `npm run test:ci` antes e depois; a contagem de falhas cai em 1 |
| **Aceite** | a suíte não reporta mais essa falha e nenhuma nova aparece |
| **Rollback** | `git revert` |
| **Esforço** | S |
| **Ordem** | **7** |
| **Command** | `/create-code` |
| **Skill** | `senior-code-agent` |
| **Branch** | `test/suite-executavel` (mesma de `T-P0-06`) |
| **Commits/PRs** | commit próprio dentro da PR de `T-P0-06` |

### `T-P0-08` — Trava de duplo clique no Salvar · **OBRIGATÓRIA**

| Campo | Conteúdo |
|---|---|
| **Achados** | `SYS-001` = `FE-STATE-001` + `UX-2.1-02` + `BE-DB-008` |
| **Repositório** | frontend |
| **Objetivo** | Dois cliques rápidos deixarem de criar dois pedidos com números diferentes e sem chave para reconciliá-los |
| **Arquivos envolvidos** | `src/app/formulario/formulario.component.ts` (`submit()`, `:591-617`), `src/app/formulario/formulario.component.html:536` |
| **Escopo autorizado** | Flag `salvando` + `[disabled]="salvando"` no botão; liberar a flag por `finalize`/`complete`, **não** só em `next`/`error` |
| **Fora de escopo** | `UNIQUE(numberPedido)` no banco (rejeitado pela ADR 0007); `retry`; adicionar controle `id` ao FormGroup (é `T-P1-15`); refatorar `onBeforeSave` |
| **Dependências** | nenhuma |
| **Riscos** | **botão preso** se o observable não completar — mitigado obrigatoriamente por `finalize` |
| **Contrato/schema** | nenhum |
| **ADR** | não |
| **Estratégia de teste** | DevTools → Network com throttling: dois cliques rápidos → **um** `POST`. Teste unitário opcional em `T-P1-03` |
| **Aceite** | com rede lenta, dois cliques produzem 1 `POST`; após erro do servidor, o botão volta a ficar clicável |
| **Rollback** | `git revert` |
| **Esforço** | S |
| **Ordem** | **8** |
| **Command** | `/create-code` |
| **Skill** | `senior-code-agent` (+ `angular-maintenance`) |
| **Branch** | `fix/trava-duplo-clique-salvar` |
| **Commits/PRs** | 1 commit, 1 PR. **Não** juntar com `T-P1-15` (`@Input() modo`), que é refactor |

### `T-P0-09` — Confirmação antes de excluir pedido e cliente · **OBRIGATÓRIA**

| Campo | Conteúdo |
|---|---|
| **Achados** | `UX-2.2-27` ≡ `UX-2.4-46` |
| **Repositório** | frontend |
| **Objetivo** | Exclusão irreversível, sem desfazer e sem registro de autoria, deixar de acontecer com um clique acidental num botão idêntico ao de Editar |
| **Arquivos envolvidos** | `src/app/pesquisa/pesquisa.component.ts` (`onRemove`), `src/app/editar/editar.component.ts`, `pesquisa.component.html:41`, `editar.component.html:38` |
| **Escopo autorizado** | `confirm()` nativo nomeando o registro (número do pedido / nome do cliente) antes de chamar o serviço |
| **Fora de escopo** | `MatDialog` (adiciona superfície sem ganho aqui), soft delete, trilha de auditoria, redesenho dos botões (é P2) |
| **Dependências** | nenhuma |
| **Riscos** | nenhum funcional. `confirm()` bloqueia a thread — aceitável para ação destrutiva |
| **Contrato/schema** | nenhum |
| **ADR** | não |
| **Estratégia de teste** | manual nas duas telas: cancelar → nenhuma chamada `DELETE` (conferir em Network); confirmar → exclusão normal |
| **Aceite** | nas duas telas, Deletar exige confirmação que **nomeia** o registro |
| **Rollback** | `git revert` |
| **Esforço** | S |
| **Ordem** | **9** |
| **Command** | `/create-code` |
| **Skill** | `senior-code-agent` |
| **Branch** | `fix/confirmacao-antes-de-excluir` |
| **Commits/PRs** | 1 PR, 2 commits (pesquisa / editar) — mesma responsabilidade, telas diferentes |

### `T-P0-10` — `patchValue` no autofill do cliente · **OBRIGATÓRIA**

| Campo | Conteúdo |
|---|---|
| **Achados** | `UX-2.1-01` ≡ `FE-STATE-005` |
| **Repositório** | frontend |
| **Objetivo** | Sair do campo Cliente parar de apagar o pedido inteiro e parar de trocar o `id` do pedido pelo `id` do cliente |
| **Arquivos envolvidos** | `src/app/formulario/formulario.component.ts:249-256` |
| **Escopo autorizado** | Trocar `this.pedidosClientes = match` por `patchValue` **apenas** dos campos de endereço/telefone (`cep`, `cidade`, `rua`, `numCasa`, `bairro`, `complemento`, `telefone`), **sem** `id` |
| **Fora de escopo** | Redesenhar a busca de cliente, debounce/`switchMap` (é `FE-STATE-003`, P2), tocar `searchClientes` no serviço |
| **Dependências** | nenhuma. **Sinergia:** fazer depois de `T-P0-08` evita testar dois comportamentos do Salvar ao mesmo tempo |
| **Riscos** | o autofill deixar de preencher algum campo que hoje vem "de graça" pela substituição do objeto |
| **Contrato/schema** | nenhum. **Corrige** um envio errado (`PUT /api/pedidos/{idDoCliente}`) |
| **ADR** | não |
| **Estratégia de teste** | manual: preencher itens → voltar ao campo Cliente → corrigir o nome → sair → os itens e os totais permanecem |
| **Aceite** | itens preservados **e** o Salvar seguinte não dispara `PUT` com id de cliente |
| **Rollback** | `git revert` |
| **Esforço** | S |
| **Ordem** | **10** |
| **Command** | `/create-code` |
| **Skill** | `senior-code-agent` (+ `angular-maintenance`) |
| **Branch** | `fix/autofill-cliente-sem-sobrescrever-pedido` |
| **Commits/PRs** | 1 commit, 1 PR |

### `T-P0-11` — Unificar o predicado de itens do recibo e do WhatsApp · **OBRIGATÓRIA**

| Campo | Conteúdo |
|---|---|
| **Achados** | `UX-2.1-03` (+ contexto de `FE-ARCH-008`) |
| **Repositório** | frontend |
| **Objetivo** | Imprimir e Enviar Pedido pararem de virar no-op silencioso (`TypeError` em `totais[i].toFixed`) quando um item tem descrição sem total |
| **Arquivos envolvidos** | `src/app/formulario/formulario.component.ts` — `loopForTotais` (`:262-278`), blocos `:427-451` e `:499-520` |
| **Escopo autorizado** | Unificar o critério de "slot preenchido" entre `ds`/`qt` e `totais`, e proteger o laço contra índice ausente. Aplicar **nos dois blocos** |
| **Fora de escopo** | Extrair `montarResumoPedido()` (é `FE-ARCH-008`, P2, 90 dias) — aqui é a correção mínima; mudar o texto do recibo; mudar o cálculo de `valorFinal` |
| **Dependências** | nenhuma. **Recomendado** após `T-P1-03` se a correção crescer além do predicado |
| **Riscos** | divergência sutil entre recibo e WhatsApp se a correção for aplicada em só um dos blocos — o histórico do projeto já registra esse erro (commit `9b784cf`) |
| **Contrato/schema** | nenhum — é só apresentação |
| **ADR** | não |
| **Estratégia de teste** | manual: (a) item com descrição e sem total → Imprimir abre; (b) excluir um item → Enviar Pedido abre; (c) recibo idêntico ao atual no caso normal |
| **Aceite** | os três cenários acima passam, nos **dois** botões |
| **Rollback** | `git revert` |
| **Esforço** | S |
| **Ordem** | **11** |
| **Command** | `/debug-app` (reproduzir) → `/create-code` (corrigir) |
| **Skill** | `senior-code-agent` |
| **Branch** | `fix/recibo-whatsapp-item-sem-total` |
| **Commits/PRs** | 1 PR, 1 commit tocando os dois blocos (indivisível: separá-los recria a divergência) |

### `T-P0-12` — `type="button"` nos dois botões Cancelar · **MELHORIA**

| Campo | Conteúdo |
|---|---|
| **Achados** | `FE-FORM-003` + `UX-2.1-04` + `UX-2.3-37` |
| **Repositório** | frontend |
| **Objetivo** | Cancelar parar de submeter o formulário e cobrir a tela de alertas vermelhos de validação |
| **Arquivos envolvidos** | `src/app/formulario/formulario.component.html:537`; `src/app/form-cliente/form-cliente.component.html:73` (**caminho corrigido** — o consolidado citava `shared/form-cliente/...:124`) |
| **Escopo autorizado** | Adicionar `type="button"` nos dois |
| **Fora de escopo** | `busca-cep` (a fonte 3 já validou que **não** se aplica); mudar o comportamento de `resetar()` |
| **Dependências** | nenhuma |
| **Riscos** | nenhum |
| **Contrato/schema** | nenhum |
| **ADR** | não |
| **Estratégia de teste** | manual: clicar em Cancelar com o form inválido → nenhum alerta de validação aparece |
| **Aceite** | os dois Cancelar limpam o formulário sem dispararem submit |
| **Rollback** | `git revert` |
| **Esforço** | S |
| **Ordem** | **12** |
| **Command** | `/revisar-ui-angular` (revisão) · `/create-code` (aplicação) |
| **Skill** | `senior-code-agent` |
| **Branch** | `fix/higiene-p0-frontend` |
| **Commits/PRs** | commit próprio, na PR compartilhada de higiene com `T-P0-13` e `T-P0-15` (as três são frontend, sem mudança de comportamento de negócio) |

### `T-P0-13` — Remover `console.log` com PII do bundle publicado · **OBRIGATÓRIA**

| Campo | Conteúdo |
|---|---|
| **Achados** | `FE-SEC-003` + `UX-2.1-25` |
| **Repositório** | frontend |
| **Objetivo** | Cumprir `.claude/rules/seguranca-frontend.md:16` — hoje nome, telefone, endereço e o recibo completo vão para o console **do bundle de produção** |
| **Arquivos envolvidos** | `formulario.component.ts` (11 ocorrências), `form-cliente.component.ts` (3), `input-client.component.ts` (1) — **15 no total**, não 13 |
| **Escopo autorizado** | Remover os 15 `console.log`. Manter os 2 `console.error` (`form-cadastro:77`, `busca-cep:85`) — são de erro e não imprimem PII |
| **Fora de escopo** | Criar serviço de log, configurar drop de console no build, tocar `angular.json` |
| **Dependências** | nenhuma |
| **Riscos** | perder apoio de depuração usado pelo mantenedor — mitigado por `T-P1-06`/`T-P1-07` (erro legível) |
| **Contrato/schema** | nenhum |
| **ADR** | não |
| **Estratégia de teste** | `grep -rn 'console\.log' src/app/` → zero; `npm run build` continua exit 0 |
| **Aceite** | nenhum dado de cliente aparece no console em nenhum fluxo |
| **Rollback** | `git revert` |
| **Esforço** | S |
| **Ordem** | **13** |
| **Command** | `/create-code` |
| **Skill** | `senior-code-agent` |
| **Branch** | `fix/higiene-p0-frontend` |
| **Commits/PRs** | commit próprio na PR de higiene |

### `T-P0-14` — Busca de clientes server-side na tela Editar · **MELHORIA**

| Campo | Conteúdo |
|---|---|
| **Achados** | `FE-API-002` + `BE-PERF-001` + `UX-2.4-48` + `UX-2.4-49` |
| **Repositório** | frontend |
| **Objetivo** | Parar de transferir a base inteira de clientes a cada busca — **é privacidade, não só performance** |
| **Arquivos envolvidos** | `src/app/editar/editar.component.ts:41` |
| **Escopo autorizado** | Trocar `listClient()` por `searchClientes(query)` (já existe em `data-crud.service.ts:90`, com consumidor em produção), com guarda para query vazia — o mesmo padrão de `searchPedido()` (`formulario.component.ts:157-171`) |
| **Fora de escopo** | Criar endpoint novo (o backend já tem `ClientController:42 /search`), paginação, debounce |
| **Dependências** | nenhuma |
| **Riscos** | query vazia sem guarda passar a listar tudo de novo, ou passar a não listar nada — definir explicitamente o comportamento de estado inicial |
| **Contrato/schema** | nenhum — endpoint já existente dos dois lados |
| **ADR** | não |
| **Estratégia de teste** | DevTools → Network: a resposta tem tamanho proporcional ao resultado, não à base |
| **Aceite** | busca por nome funciona; query vazia tem comportamento definido e documentado no PR |
| **Rollback** | `git revert` |
| **Esforço** | S |
| **Ordem** | **14** |
| **Command** | `/revisar-integracao-api` |
| **Skill** | `frontend-api-integration` |
| **Branch** | `fix/editar-clientes-busca-server-side` |
| **Commits/PRs** | 1 commit, 1 PR — **separada** da PR de higiene (esta toca integração) |

### `T-P0-15` — `lang="pt-BR"` no `index.html` · **MELHORIA**

| Campo | Conteúdo |
|---|---|
| **Achados** | `UX-2.8-67` |
| **Repositório** | frontend |
| **Objetivo** | Leitor de tela parar de pronunciar português com fonética inglesa — afeta todas as telas de uma vez |
| **Arquivos envolvidos** | `src/index.html:2` |
| **Escopo autorizado** | `<html lang="en">` → `<html lang="pt-BR">` |
| **Fora de escopo** | `<title>` por rota, `<h1>` por tela, `aria-*` (bloco de a11y é P2) |
| **Dependências** | nenhuma |
| **Riscos** | nenhum |
| **Contrato/schema** | nenhum |
| **ADR** | não |
| **Estratégia de teste** | `npm run build` exit 0; inspeção do HTML servido |
| **Aceite** | atributo presente no build de produção |
| **Rollback** | `git revert` |
| **Esforço** | S |
| **Ordem** | **15** |
| **Command** | `/create-code` |
| **Skill** | `senior-code-agent` |
| **Branch** | `fix/higiene-p0-frontend` |
| **Commits/PRs** | commit próprio na PR de higiene |

### `T-P0-16` — `http` → `https` em `environment.prod.ts` · **OBRIGATÓRIA (bloqueada)**

| Campo | Conteúdo |
|---|---|
| **Achados** | `SYS-003` / `FE-SEC-001` |
| **Repositório** | frontend |
| **Objetivo** | Fechar o último ponto do `SYS-003`: a SPA passar a falar com a API por TLS |
| **Arquivos envolvidos** | `src/environments/environment.prod.ts:5` (uma linha) |
| **Escopo autorizado** | Trocar **apenas** o esquema, **somente após** `T-P0-04` validado. Exige autorização explícita por `.claude/rules/seguranca-frontend.md` |
| **Fora de escopo** | `environment.ts` (dev), `proxy.conf.js`, host, porta, qualquer outra chave |
| **Dependências** | **`T-P0-04` concluída e validada.** Fazer antes derruba a aplicação inteira |
| **Riscos** | indisponibilidade total se o TLS não estiver de fato ativo; mixed content se só uma ponta migrar |
| **Contrato/schema** | contrato de **ambiente** (esquema da URL). Sem mudança de payload ou path |
| **ADR** | coberta pela ADR-1 (`T-P0-04`) |
| **Estratégia de teste** | `npm run build` exit 0; publicar em janela combinada; abrir a SPA e registrar um pedido de teste |
| **Aceite** | SPA em produção opera por HTTPS ponta a ponta, sem aviso de mixed content |
| **Rollback** | reverter uma linha e refazer o build/publicação (manter o vhost HTTP ativo até validar) |
| **Esforço** | S |
| **Ordem** | **16** |
| **Command** | `/revisar-integracao-api` |
| **Skill** | `frontend-api-integration` |
| **Branch** | `ops/environment-prod-https` |
| **Commits/PRs** | 1 commit, 1 PR isolada — nunca junto de outra mudança, para o `revert` ser cirúrgico |

---

## 4. Segunda onda — P1

15 tarefas. **Nenhuma que toque cálculo financeiro começa antes de `T-P0-05` e `T-P0-06` estarem
concluídas** — essa é a dependência dura herdada da consolidação.

### `T-P1-01` — DTO de request em `POST /api/clientes` · **OBRIGATÓRIA**

| Campo | Conteúdo |
|---|---|
| **Achados** | `BE-SEC-002` ≡ `FE-API-007` |
| **Repositório** | backend |
| **Objetivo** | Impedir mass assignment: hoje `create(@RequestBody Client client)` aceita `id` e `save()` faz *merge*, sobrescrevendo outro cliente e respondendo 201 |
| **Arquivos envolvidos** | `controller/ClientController.java:59-70`, novo `dto/ClientRequestDTO.java`, espelhando `dto/PedidosRequestDTO.java` |
| **Escopo autorizado** | Criar o DTO sem `id`, usá-lo em `create`. Manter **exatamente** os mesmos nomes de campo JSON |
| **Fora de escopo** | `update` (o `id` vem do path e é legítimo), criar camada de service, Bean Validation (é P2), tocar `PedidosRequestDTO` |
| **Dependências** | `T-P0-05` (para poder rodar a suíte com segurança) |
| **Riscos** | esquecer um campo no DTO → o `POST` passa a perder dado silenciosamente. Conferir campo a campo contra `Client.java` |
| **Contrato/schema** | contrato de **entrada** muda: o `id` deixa de ser aceito. **Compatibilidade preservada** — nenhum cliente conhecido envia `id` no POST (`data-crud.service.ts:68-70` envia o objeto sem `id` na criação) |
| **ADR** | não — segue padrão já aprovado em Pedidos |
| **Estratégia de teste** | teste de controller: `POST` com `id` no payload cria registro **novo**, ignorando o `id`; `POST` normal continua 201 com todos os campos |
| **Aceite** | os dois testes acima verdes; nenhum campo perdido em relação ao comportamento atual |
| **Rollback** | reverter o controller (o DTO pode ficar) |
| **Esforço** | S |
| **Ordem** | **17** |
| **Command** | `/revisar-api-spring` (antes) · `/create-code` (implementar) |
| **Skill** | `spring-boot-maintenance` |
| **Branch** | `fix/clientes-dto-request-sem-id` |
| **Commits/PRs** | 2 commits (DTO / controller+teste), 1 PR |

### `T-P1-02` — Testes das regras de dinheiro do backend · **REDUÇÃO DE RISCO**

| Campo | Conteúdo |
|---|---|
| **Achados** | `BE-TEST-003` + `BE-TEST-004` + `BE-TEST-006` |
| **Repositório** | backend |
| **Objetivo** | Fazer com que alterar `somarItens`, o tratamento de `""` ou o achatamento por `ordem` **quebre um teste**. Hoje as três regras centrais do dinheiro não têm nenhum |
| **Arquivos envolvidos** | `src/test/java/.../PedidosServiceTest.java`, novo teste unitário de `PedidosResponseDTO.from()` |
| **Escopo autorizado** | 2-3 testes de `somarItens`/`criar()` (soma simples, `total=null`, arredondamento de escala); 1 teste de `quantidade=""`/`descricao=""` (bug já ocorrido em produção, commit `fdb21bc`); 1 teste de achatamento com itens esparsos (só slots 2 e 4) |
| **Fora de escopo** | Refatorar `PedidosService`, introduzir `Clock` (é `BE-TEST-010`, P2), mudar o cálculo |
| **Dependências** | `T-P0-05` |
| **Riscos** | nenhum — só adiciona testes |
| **Contrato/schema** | nenhum |
| **ADR** | não |
| **Estratégia de teste** | `./mvnw test -Dtest=PedidosServiceTest,PedidosResponseDTOTest` **com seletor** |
| **Aceite** | os testes passam **e** falham se `somarItens` for alterado de propósito (verificar invertendo o sinal antes de commitar) |
| **Rollback** | remover os testes |
| **Esforço** | S/M |
| **Ordem** | **18** |
| **Command** | `/create-code` |
| **Skill** | `spring-boot-maintenance` |
| **Branch** | `test/regras-financeiras-backend` |
| **Commits/PRs** | 3 commits (valorFinal / slot vazio / achatamento), 1 PR |

### `T-P1-03` — Testes das funções de dinheiro do frontend, sem TestBed · **REDUÇÃO DE RISCO**

| Campo | Conteúdo |
|---|---|
| **Achados** | `FE-TEST-002` (CRÍTICO) |
| **Repositório** | frontend |
| **Objetivo** | Criar a rede de segurança que torna seguro mexer em `formatarMoeda`, `loopForTotais`, `onChange` e `onBeforeSave` |
| **Arquivos envolvidos** | novas specs em `src/app/formulario/` e `src/app/shared/`; alvo: `formatarMoeda` (`:294`), `loopForTotais` (`:262`), `onChange` (`:281`), `onBeforeSave` (`:573`), `cepValidator` (`form-validations.ts`) |
| **Escopo autorizado** | Testes **sem TestBed** (funções puras ou instância direta), cobrindo vírgula×ponto, `null`, string vazia e arredondamento de 2 casas |
| **Fora de escopo** | Corrigir as 10 specs que falham hoje por `NullInjectorError` (tarefa própria, P2); alterar o código de produção |
| **Dependências** | `T-P0-06` (a suíte precisa terminar para o resultado significar algo) |
| **Riscos** | nenhum — mas o teste deve documentar o comportamento **atual**, mesmo onde ele parece errado; a correção vem em `T-P1-05` |
| **Contrato/schema** | nenhum |
| **ADR** | não |
| **Estratégia de teste** | `npm run test:ci`; as novas specs verdes e independentes de DOM |
| **Aceite** | alterar `formatarMoeda` ou `loopForTotais` quebra pelo menos um teste |
| **Rollback** | remover as specs |
| **Esforço** | M |
| **Ordem** | **19** — **bloqueia `T-P1-05`** |
| **Command** | `/create-code` |
| **Skill** | `senior-code-agent` |
| **Branch** | `test/funcoes-financeiras-frontend` |
| **Commits/PRs** | 1 PR, 1 commit por função testada |

### `T-P1-04` — Ancorar o contrato JSON com `jsonPath` · **REDUÇÃO DE RISCO**

| Campo | Conteúdo |
|---|---|
| **Achados** | `BE-TEST-015` |
| **Repositório** | backend |
| **Objetivo** | Proteger o contrato contra a classe de erro mais provável — um *rename symbol* de IDE mudando um nome de campo JSON gerado por Lombok `@Data` |
| **Arquivos envolvidos** | `src/test/java/.../PedidosClientsControllerTest.java` (linhas 64, 82, 93, 104 hoje só asseguram status) |
| **Escopo autorizado** | 2-3 `jsonPath` nos testes **já existentes**, ancorando `numberPedido` e `valorFinal` |
| **Fora de escopo** | Testes de contrato novos, `entrega_estimada` (o único `snake_case` — registrar como observação, não mudar), tocar DTOs |
| **Dependências** | `T-P0-05` |
| **Riscos** | nenhum |
| **Contrato/schema** | **congela** dois nomes de campo — é o objetivo |
| **ADR** | não |
| **Estratégia de teste** | `./mvnw test -Dtest=PedidosClientsControllerTest` |
| **Aceite** | renomear `valorFinal` no DTO quebra o teste |
| **Rollback** | remover as asserções |
| **Esforço** | S |
| **Ordem** | **20** |
| **Command** | `/revisar-api-spring` |
| **Skill** | `spring-boot-maintenance` |
| **Branch** | `test/contrato-json-pedidos` |
| **Commits/PRs** | 1 commit, 1 PR |

### `T-P1-05` — Normalizar os totais no formulário · **REDUÇÃO DE RISCO**

| Campo | Conteúdo |
|---|---|
| **Achados** | `FE-FORM-001` |
| **Repositório** | frontend |
| **Objetivo** | Tirar o contrato financeiro da dependência de um efeito colateral de ordem de eventos (`(change)` → `loopForTotais` → `updateModel` síncrono). Hoje funciona *por acidente* |
| **Arquivos envolvidos** | `formulario.component.ts` — `onChange` (`:281-292`), `onBeforeSave` (`:573-589`) |
| **Escopo autorizado** | Normalizar `total*`/`valorFinal` para número **no ponto de salvamento**, sem depender do evento de UI |
| **Fora de escopo** | Remover `ngModel`+`formControlName` (é `FE-FORM-002`, P3, exige ADR); mudar máscara de moeda; alterar quem calcula `valorFinal` (o servidor continua autoritativo) |
| **Dependências** | **`T-P1-03` obrigatória** — campo financeiro não se altera sem teste antes |
| **Riscos** | **alto se feito sem teste**: erro de centavos no recibo impresso e no WhatsApp, com build verde |
| **Contrato/schema** | payload do `POST`/`PUT` passa a ser numérico **por construção**, não por acidente. Sem mudança de nomes |
| **ADR** | não |
| **Estratégia de teste** | specs de `T-P1-03` + DevTools → Network conferindo o corpo real do `POST` (fecha a lacuna de evidência) |
| **Aceite** | o `POST` sai com `total*` numérico mesmo sem passar pelo `(change)`; recibo e WhatsApp inalterados |
| **Rollback** | `git revert` — o teste de `T-P1-03` permanece e prova o comportamento anterior |
| **Esforço** | S |
| **Ordem** | **21** |
| **Command** | `/implementation-plan` (antes) · `/create-code` |
| **Skill** | `implementation-planning` → `senior-code-agent` |
| **Branch** | `fix/normalizar-totais-no-form` |
| **Commits/PRs** | 1 commit, 1 PR isolada — **campo financeiro nunca compartilha PR** |

### `T-P1-06` — Formato único de erro no backend · **MELHORIA**

| Campo | Conteúdo |
|---|---|
| **Achados** | `SYS-004` / `BE-API-002` / `BE-REL-001` |
| **Repositório** | backend |
| **Objetivo** | Fazer o servidor devolver **um** formato de erro. Hoje há `Map.of("erro", ...)` nos dois controllers e o formato padrão do Spring em tudo mais |
| **Arquivos envolvidos** | `controller/PedidosClientsController.java:118`, `controller/ClientController.java:115`, possível `ExceptionHandler` mínimo |
| **Escopo autorizado** | Padronizar o corpo de erro **preservando** `{"erro": "<motivo>"}` como formato oficial (é o que o frontend vai consumir em `T-P1-07`) |
| **Fora de escopo** | `@ControllerAdvice` global com hierarquia de exceções, RFC 7807/Problem Details, Bean Validation (P2), logging estruturado |
| **Dependências** | `T-P0-05` |
| **Riscos** | mudar o formato de um erro que o frontend hoje ignora — inócuo agora, mas deve ser feito **antes** de `T-P1-07` para não haver janela de incompatibilidade |
| **Contrato/schema** | contrato de **erro**. Compatibilidade: `{"erro": ...}` já existe hoje → é ampliação, não quebra |
| **ADR** | não |
| **Estratégia de teste** | teste de controller conferindo `jsonPath("$.erro")` num 400 |
| **Aceite** | 400 e 500 respondem com o mesmo formato, e o teste ancora o nome do campo |
| **Rollback** | `git revert` |
| **Esforço** | S/M |
| **Ordem** | **22** — **antes** de `T-P1-07` |
| **Command** | `/revisar-api-spring` |
| **Skill** | `spring-boot-maintenance` |
| **Branch** | `fix/formato-unico-de-erro-api` |
| **Commits/PRs** | 1 PR. **Não** juntar com o frontend — repos diferentes |

### `T-P1-07` — Mostrar ao operador o motivo real do erro · **MELHORIA**

| Campo | Conteúdo |
|---|---|
| **Achados** | `SYS-004` / `FE-API-001` |
| **Repositório** | frontend |
| **Objetivo** | Parar de descartar a mensagem que o backend já envia. Hoje 400, 404, 0 e 500 produzem a mesma frase em 8 handlers `error: () =>` |
| **Arquivos envolvidos** | `formulario.component.ts` (`searchPedido`, `onEdit`, `onRemove`, `consultarCliente`, `submit`), `editar.component.ts`, `cadastro.component.ts`, `form-cliente.component.ts` |
| **Escopo autorizado** | Receber o `HttpErrorResponse`, exibir `err.error?.erro` quando existir e uma frase genérica quando não; distinguir status 0 (rede) de erro do servidor |
| **Fora de escopo** | `HttpInterceptor` global (rejeitado pelas fontes — 11 call sites, todos já com branch de erro), `catchError` em massa, `retry` (**perigoso**: `POST` não é idempotente), Sentry |
| **Dependências** | `T-P1-06` (para o formato ser único) |
| **Riscos** | expor mensagem técnica ou dado sensível ao operador — mostrar só o campo `erro`, nunca o stack |
| **Contrato/schema** | consumo do contrato de erro. Sem mudança de request |
| **ADR** | não |
| **Estratégia de teste** | manual com backend fora do ar (status 0) e com payload inválido (400); spec opcional do mapeamento de mensagem |
| **Aceite** | um erro de validação do backend chega legível ao operador; queda de rede tem mensagem distinta |
| **Rollback** | `git revert` |
| **Esforço** | S/M |
| **Ordem** | **23** |
| **Command** | `/revisar-integracao-api` |
| **Skill** | `frontend-api-integration` |
| **Branch** | `fix/erro-http-legivel` |
| **Commits/PRs** | 1 PR, commits por tela |

### `T-P1-08` — Desfazer a herança acidental do `ErrorMsgComponent` · **MELHORIA**

| Campo | Conteúdo |
|---|---|
| **Achados** | `FE-ARCH-001` + `FE-PERF-001` + `UX-2.7-65` |
| **Repositório** | frontend |
| **Objetivo** | Parar de instanciar 16 formulários de 40 controles (~640 `FormControl`) por tela para usar **1 método**. Maior alavanca de performance do app |
| **Arquivos envolvidos** | `src/app/shared/error-msg/error-msg.component.ts:17`, o método reaproveitado hoje por herança |
| **Escopo autorizado** | Remover `extends FormularioComponent` de `ErrorMsgComponent` e passar o necessário por `@Input`/função utilitária |
| **Fora de escopo** | `PesquisaComponent` e `PedidosComponent` (herdam de propósito, com estado próprio); quebrar o God Component (é `FE-ARCH-002`, P2); `OnPush` (bloqueado por `FE-ARCH-006`) |
| **Dependências** | nenhuma técnica; **recomendado** após `T-P1-03` |
| **Riscos** | regressão visual nas 14 mensagens de erro do formulário |
| **Contrato/schema** | nenhum |
| **ADR** | não — é remoção, não decisão nova |
| **Estratégia de teste** | `npm run test:ci`; conferência manual das 14 mensagens; contagem de instâncias no Angular DevTools (2, não 16) |
| **Aceite** | todas as mensagens de erro continuam idênticas e a tela instancia 2 formulários |
| **Rollback** | `git revert` |
| **Esforço** | S |
| **Ordem** | **24** |
| **Command** | `/refactor-code` |
| **Skill** | `safe-refactor` |
| **Branch** | `refactor/error-msg-sem-heranca` |
| **Commits/PRs** | 1 commit, 1 PR isolada (mudança estrutural) |

### `T-P1-09` — Desmarcar "Pesagem na Retirada" não pode zerar o total · **MELHORIA**

| Campo | Conteúdo |
|---|---|
| **Achados** | `UX-2.1-06` |
| **Repositório** | frontend |
| **Objetivo** | Parar de apagar o valor digitado: `pesarRetirada` faz `setValue(0)` **incondicionalmente**, mesmo ao **desmarcar** |
| **Arquivos envolvidos** | `formulario.component.ts:307-330` |
| **Escopo autorizado** | Zerar o total apenas quando `e.target.checked === true`; ao desmarcar, preservar o valor anterior |
| **Fora de escopo** | Refatorar o `switch` de 6 casos (P2), mudar a regra de negócio de pesagem, mexer no aviso do recibo |
| **Dependências** | **`T-P1-03`** — o campo é financeiro |
| **Riscos** | inverter a regra e deixar de zerar ao marcar; conferir os 6 slots |
| **Contrato/schema** | nenhum |
| **ADR** | não |
| **Estratégia de teste** | manual nos 6 slots: digitar valor → marcar → total 0 → desmarcar → valor de volta |
| **Aceite** | o valor digitado sobrevive ao ciclo marcar/desmarcar em todos os slots |
| **Rollback** | `git revert` |
| **Esforço** | S |
| **Ordem** | **25** |
| **Command** | `/create-code` |
| **Skill** | `senior-code-agent` |
| **Branch** | `fix/pesagem-nao-zera-total` |
| **Commits/PRs** | 1 commit, 1 PR |

### `T-P1-10` — Recibo nunca sair com `Status: undefined` · **MELHORIA**

| Campo | Conteúdo |
|---|---|
| **Achados** | `UX-2.1-07` |
| **Repositório** | frontend |
| **Objetivo** | Fechar a cadeia `if/else if` sem `else` que deixa `status` `undefined` e o concatena no recibo impresso e na mensagem do WhatsApp |
| **Arquivos envolvidos** | `formulario.component.ts:454-462` e `:523-531` |
| **Escopo autorizado** | Adicionar o `else` com um rótulo neutro, **nos dois blocos** |
| **Fora de escopo** | Deduplicar os blocos (é `FE-ARCH-008`, P2), mudar os textos existentes |
| **Dependências** | nenhuma. Sinergia com `T-P0-11` (mesmos blocos) |
| **Riscos** | divergência entre recibo e WhatsApp se aplicado em só um lugar |
| **Contrato/schema** | nenhum |
| **ADR** | não |
| **Estratégia de teste** | manual: pedido com todas as flags falsas → Imprimir e Enviar mostram rótulo legível |
| **Aceite** | a palavra `undefined` não aparece em nenhum dos dois artefatos |
| **Rollback** | `git revert` |
| **Esforço** | S |
| **Ordem** | **26** |
| **Command** | `/create-code` |
| **Skill** | `senior-code-agent` |
| **Branch** | `fix/status-recibo-sem-undefined` |
| **Commits/PRs** | 1 commit tocando os dois blocos, 1 PR |

### `T-P1-11` — `buscar-cep` parar de acumular resultados · **MELHORIA**

| Campo | Conteúdo |
|---|---|
| **Achados** | `UX-2.5-53` |
| **Repositório** | frontend |
| **Objetivo** | A tabela parar de misturar ruas de buscas diferentes — os arrays só são limpos pelo botão Cancelar |
| **Arquivos envolvidos** | `busca-cep.component.ts:72-88` (`consultarRua`) |
| **Escopo autorizado** | Limpar `arrCep`/`arrCidade`/`arrBairro`/`arrComp` no início de cada busca bem-sucedida |
| **Fora de escopo** | Redesenhar a tela, paginar resultados, `switchMap` para corrida de respostas (P2) |
| **Dependências** | nenhuma |
| **Riscos** | limpar antes da resposta chegar e deixar a tela vazia em caso de erro — limpar no `next`, não antes do `subscribe` |
| **Contrato/schema** | nenhum (ViaCEP, serviço externo, inalterado) |
| **ADR** | não |
| **Estratégia de teste** | manual: duas buscas seguidas por ruas diferentes → a tabela mostra só a segunda |
| **Aceite** | nenhuma linha da busca anterior permanece |
| **Rollback** | `git revert` |
| **Esforço** | S |
| **Ordem** | **27** |
| **Command** | `/create-code` |
| **Skill** | `senior-code-agent` |
| **Branch** | `fix/busca-cep-nao-acumula` |
| **Commits/PRs** | 1 commit, 1 PR |

### `T-P1-12` — `UNIQUE(pedido_id, ordem)` no schema de teste + regressão · **REDUÇÃO DE RISCO**

| Campo | Conteúdo |
|---|---|
| **Achados** | `BE-DB-005` (+ habilita `BE-TEST-005`) |
| **Repositório** | backend (banco **de teste**, não produção) |
| **Objetivo** | Fazer o H2 reproduzir a constraint que só existe no SQL de produção, para que remover o `saveAndFlush` defensivo **quebre um teste** |
| **Arquivos envolvidos** | `src/test/resources/schema.sql` (hoje só recria `pedido_contador_diario` e `uq_pedido_data_seq`), novo teste em `PedidosClientsRepositoryTest` |
| **Escopo autorizado** | Adicionar a constraint ao schema de teste, no mesmo padrão já usado para `uq_pedido_data_seq`, + 1 teste de regressão do cenário `"Duplicate entry 'X-0'"` |
| **Fora de escopo** | Declarar a constraint em JPA (`uniqueConstraints`) — decisão deliberada registrada no próprio arquivo; tocar o banco de produção; qualquer migration |
| **Dependências** | `T-P0-05` |
| **Riscos** | testes existentes passarem a falhar por dados de fixture que hoje violam a constraint — é o objetivo, mas exige ajustar as fixtures |
| **Contrato/schema** | **schema de teste apenas.** Produção já tem a constraint (`tools/migracao-itens/sql/01_schema_pedido_itens.sql:28`) |
| **ADR** | não |
| **Estratégia de teste** | `./mvnw test -Dtest=PedidosClientsRepositoryTest`; remover o `saveAndFlush` de propósito → o novo teste falha |
| **Aceite** | a verificação acima confirma que a rede de segurança existe |
| **Rollback** | reverter `schema.sql` e remover o teste |
| **Esforço** | S |
| **Ordem** | **28** |
| **Command** | `/revisar-banco-mysql` |
| **Skill** | `mysql-data-safety` |
| **Branch** | `test/constraint-ordem-item-em-h2` |
| **Commits/PRs** | 2 commits (schema / teste), 1 PR |

### `T-P1-13` — Verificação de `uq_pedido_data_seq` no smoke-test pós-deploy · **REDUÇÃO DE RISCO**

| Campo | Conteúdo |
|---|---|
| **Achados** | `BE-DB-006` |
| **Repositório** | backend (documental) |
| **Objetivo** | A rede de segurança contra duplicidade de numeração deixar de poder sumir em silêncio (ex.: restore de dump antigo) — `ddl-auto=update` não valida índices |
| **Arquivos envolvidos** | `tools/migracao-numeracao-diaria/RUNBOOK-homologacao.md` (ou runbook do Gate F) |
| **Escopo autorizado** | Tornar a query de conferência que **já existe** no script um item **obrigatório** do checklist pós-deploy |
| **Fora de escopo** | Criar health check no Actuator, declarar a constraint em JPA, automatizar verificação no boot |
| **Dependências** | `T-P0-01` (o resultado da verificação alimenta o texto) |
| **Riscos** | nenhum — documental |
| **Contrato/schema** | nenhum |
| **ADR** | não |
| **Estratégia de teste** | N/A — revisão do runbook |
| **Aceite** | o checklist tem um item verificável, com a query e o resultado esperado |
| **Rollback** | `git revert` |
| **Esforço** | S |
| **Ordem** | **29** |
| **Command** | `/revisar-banco-mysql` |
| **Skill** | `mysql-data-safety` |
| **Branch** | `docs/runbook-verificacao-constraints` |
| **Commits/PRs** | 1 PR de documentação, junto de `T-P1-14` |

### `T-P1-14` — Procedimento de rollback da numeração diária · **REDUÇÃO DE RISCO**

| Campo | Conteúdo |
|---|---|
| **Achados** | `BE-DB-008` |
| **Repositório** | backend (documental) |
| **Objetivo** | Impedir que um rollback reemita um `numberPedido` já impresso e entregue ao cliente — cenário **já observado em sessão real** |
| **Arquivos envolvidos** | `tools/migracao-numeracao-diaria/RUNBOOK-homologacao.md`; nota ao final de `docs/adr/0007-numeracao-diaria-pedidos.md` |
| **Escopo autorizado** | Documentar que qualquer rollback **precisa restaurar o contador ao ponto correto** antes de reabrir o cadastro — nunca zerar `pedido_contador_diario` |
| **Fora de escopo** | Criar `UNIQUE(numberPedido)` (rejeitado pela ADR 0007 — um número relevante de duplicatas no legado); alterar o algoritmo de numeração |
| **Dependências** | `T-P0-01` |
| **Riscos** | nenhum — documental |
| **Contrato/schema** | nenhum |
| **ADR** | não (a ADR 0007 já decidiu o trade-off; falta o procedimento) |
| **Estratégia de teste** | N/A |
| **Aceite** | o runbook descreve o passo de restauração do contador, com a query |
| **Rollback** | `git revert` |
| **Esforço** | S |
| **Ordem** | **30** |
| **Command** | `/revisar-banco-mysql` |
| **Skill** | `mysql-data-safety` |
| **Branch** | `docs/runbook-verificacao-constraints` (mesma de `T-P1-13`) |
| **Commits/PRs** | commit próprio na mesma PR documental |

### `T-P1-15` — Modo criar/editar por `@Input`, não por parsing da URL · **MELHORIA**

| Campo | Conteúdo |
|---|---|
| **Achados** | `FE-ARCH-004` |
| **Repositório** | frontend |
| **Objetivo** | Tirar a decisão de criar × editar do `window.location.hash.slice(2)` (2 pontos em `formulario.component.ts`, 1 em `pedidos.component.ts`) |
| **Arquivos envolvidos** | `formulario.component.ts:135`, `:574`; `pedidos.component.ts:29`; templates que embutem `<app-formulario>` |
| **Escopo autorizado** | `@Input() modo` com valor explícito nos dois usos; remover o parsing de URL |
| **Fora de escopo** | Trocar roteamento hash por path (**proibido** sem ADR); mexer no `Router`/`ActivatedRoute` como fonte alternativa; quebrar o God Component |
| **Dependências** | `T-P0-08` e `T-P0-10` (ambas tocam o mesmo arquivo — evitar conflito) |
| **Riscos** | passar o modo errado num dos usos → um `POST` virar `PUT` ou vice-versa. Conferir as duas telas |
| **Contrato/schema** | nenhum diretamente, mas **decide POST × PUT** — testar os dois caminhos |
| **ADR** | não |
| **Estratégia de teste** | manual nas duas telas: registrar-pedido cria; pesquisar-pedido → editar atualiza. Conferir o verbo em Network |
| **Aceite** | criar e editar funcionam com a URL irrelevante para a decisão |
| **Rollback** | `git revert` |
| **Esforço** | S/M |
| **Ordem** | **31** |
| **Command** | `/refactor-code` |
| **Skill** | `safe-refactor` |
| **Branch** | `refactor/modo-por-input` |
| **Commits/PRs** | 1 PR isolada |

---

## 5. Terceira onda — P2

Formato reduzido, agrupado por causa-raiz. Detalhe integral nas fontes; cards completos só quando
a onda for aberta.

| Cluster | Achados | Escopo mínimo | Esforço | Depende de |
|---|---|---|:--:|---|
| **Coesão do God Component** | `FE-ARCH-002` (634 linhas, 5 responsabilidades) · `FE-ARCH-008` (~60 linhas duplicadas recibo/WhatsApp) · `FE-ARCH-003` (estado no DOM; `slotsVisiveis` como segunda verdade) · `FE-ARCH-006` (`implements ChangeDetectorRef` com 5 métodos vazios, herdado por 3 subclasses) | extrair `montarResumoPedido()`; remover o contrato falso de `ChangeDetectorRef` | M | `T-P1-03`, `T-P1-08` |
| **Acessibilidade** | `UX-2.1-05` (6 botões com nome acessível "delete"/"add") · `UX-2.8-68` (nenhum `<h1>`, `<title>` fixo) · `UX-2.7-64` (erro sem `aria-describedby`/`aria-invalid`) · `UX-2.2-31`/`UX-2.4-51` · `UX-2.1-15` (foco perdido ao excluir item) · `UX-2.1-14` (contraste 2,66:1 no botão WhatsApp) | `aria-hidden` nos `mat-icon` + `aria-label` em pt-BR nos 6 destrutivos primeiro (maior retorno) | M | `T-P0-15` |
| **Estado e RxJS** | `FE-STATE-002` · `FE-STATE-003` (vence a última resposta, não a última pergunta) · `FE-STATE-004` (`loopForTotais` muta o modelo ao imprimir) · `FE-STATE-006` + `UX-2.2-28` + `UX-2.8-71` (sem loading nem estado vazio) | `switchMap` nas buscas; parar a mutação em `loopForTotais`. **Não** introduzir `takeUntil` em 11 lugares | M | `T-P1-03` |
| **Contrato e integração** | `FE-API-004` (111 `any`/`@ts-ignore` neutralizando `strict`) · `FE-API-003` (proxy morto apontando dev→produção) · `BE-API-001` (zero Bean Validation) · `FE-API-006` (9 de 42 campos opcionais) | tipar **um** ponto de entrada e medir; decidir o destino do `proxy.conf.js` | M | `T-P1-04` |
| **Dados** | `BE-DB-001`/`BE-REL-002` (sem `@Version` — edição concorrente apaga itens) · `BE-DB-002` (arredondamento item × soma) · `BE-DB-011` (28 colunas órfãs; `DROP` já decidido na ADR 0003) · `BE-DB-012` (`hibernate_sequence` compartilhada) · `BE-TEST-005` · `BE-TEST-010` (`Clock` injetável) | executar o `DROP` já decidido, com backup + verificação + rollback | M | `T-P1-02`, `T-P1-12` |
| **Operação** | `BE-OPS-011` (systemd só na VPS, 2 configs concorrentes → **ADR-3**) · `BE-OPS-003`/`004` (sem log útil, sem health check) · `BE-OPS-014`/`BE-DOC-004` (onboarding impossível) · `FE-OPS-005` · `FE-OPS-007` (ADRs citados no frontend vivem no backend) | versionar o `.service` e o runbook de publicação **com a exclusão dos artefatos do backend** (pasta compartilhada) | M | `T-P0-01` |
| **Visual e responsivo** | `UX-2.1-12` · `UX-2.2-32`/`UX-2.4-51` (tabelas sem `.table-responsive`) · `UX-2.6-58` (menu mobile em 90 px) · `UX-2.1-20` (`ViewEncapsulation.None`) · `UX-2.6-59`/`60` (navbar recarrega a SPA; `aria-current` fixo) · `FE-PERF-002` · `FE-PERF-003` (bundle a ~35 kB do budget de **erro**) · `FE-PERF-004` (flags do zone.js → **ADR-4**) | fechar antes a lacuna de runtime (roteiro de 10 passos da fonte 3) — várias severidades aqui dependem de observação | M | runtime |
| **Documentação × código** | `BE-DOC-002` (3 linhas do `PROJECT_RULES.md` afirmando H2) · `FE-DOC-003` (`README.md:19`, `PROJECT_RULES.md:23,43,94,111`) · `.claude/rules/fluxo-pedidos-relatorios.md` · `.claude/commands/revisar-api-spring.md` (cita `/next-number`, removido no Gate D) | corrigir **depois** que `T-P0-05`/`T-P0-06` tornarem as afirmações verdadeiras | S | `T-P0-05`, `T-P0-06` |

---

## 6. Backlog P3 — modernização condicionada

Nenhum item aqui é obrigatório. Nenhum entra em onda sem o gatilho.

| Item | Achados | Gatilho que o torna válido |
|---|---|---|
| Remover `ngModel`+`formControlName` (40 campos) | `FE-FORM-002` | Pré-requisito **obrigatório** de Angular 17+. Exige `T-P1-03` pronta **e ADR-5** |
| Atualização major do Angular / Node | `FE-OPS-006` | CVE explorável ou necessidade de API v15+ — **e** `FE-FORM-002` feito. Material 15 (MDC) + `ViewEncapsulation.None` amplia o raio |
| Spring Profiles por ambiente | `BE-OPS-012` | Segundo ambiente real (homolog permanente). **ADR-6** |
| CI/CD | `BE-OPS-006`, `FE-OPS-004` | `SYS-002` resolvido **e** segundo colaborador. Antes disso, um CI ingênuo aplicaria DDL a cada push |
| `ddl-auto=validate` | — | Depois de `BE-DB-005`/`006`/`014`. Bloqueado hoje por drift de tipo |
| `data` como `String` → tipo de data | `BE-DB-010` | Migration de dados com backup — sem gatilho hoje |
| ESLint | `FE-TEST-006` | Quando houver CI; hoje viraria ruído ignorado |
| Docker / Firebase: adotar ou apagar | `FE-OPS-002`/`003`, `firebase.json` | **ADR-2** — decisão binária, 90 dias |
| Higiene diversa | `FE-ARCH-005/007/009/010`, `FE-API-005/006`, `FE-DOC-001` a `FE-DOC-011` | oportunístico, junto de outra mudança na mesma área |
| NgRx · `HttpInterceptor` global · `retry` · `OnPush`/`trackBy` · `FormArray` · Flyway · autenticação na app · Sentry · standalone/signals | §15 da fonte 4 | rejeitados com gatilho registrado — **não reabrir sem o gatilho** |

---

## 7. Sequência 48h / 7d / 30d / 60d / 90d

### Primeiras 48 horas — sem escrever uma linha de código

`T-P0-01` · `T-P0-02` · `T-P0-03` · decisão de `T-P0-04`.

*Critério de saída:* as quatro perguntas respondidas **por escrito**. Duas delas
(`BE-DB-003`, `BE-OPS-013`) podem revelar risco maior que qualquer achado das auditorias.

### Primeiros 7 dias — parar de sangrar

`T-P0-05` → `T-P0-06` → `T-P0-07` → `T-P0-08` → `T-P0-09` → `T-P0-10` → `T-P0-11` →
`T-P0-12`/`T-P0-13`/`T-P0-15` (PR de higiene) → `T-P0-14` → execução de `T-P0-04` → `T-P0-16`.

*Critério de saída:* `npm run build` verde; `npm run test:ci` **termina**; nenhuma PII no console;
dois cliques em Salvar produzem um pedido; excluir exige confirmação; a API não responde da
internet.

### 30 dias — construir a rede de segurança

`T-P1-02` · `T-P1-03` · `T-P1-04` · `T-P1-01` · `T-P1-09` · `T-P1-10` · `T-P1-11` ·
cluster documental de P2 (só depois que `T-P0-05`/`T-P0-06` tornarem as afirmações verdadeiras).

*Critério de saída:* alterar `formatarMoeda`, `loopForTotais` ou `somarItens` **quebra um teste**.

### 60 dias — reduzir o acoplamento

`T-P1-05` (primeiro o teste, depois a mudança) · `T-P1-06` → `T-P1-07` · `T-P1-12` · `T-P1-13` ·
`T-P1-14` · `T-P1-08` · cluster de operação de P2 (`BE-OPS-011` + runbook de publicação do
frontend **com a exclusão dos artefatos do backend** — a pasta na VPS é compartilhada).

*Critério de saída:* um erro de validação do backend chega legível ao operador; a tela de pedido
instancia 2 formulários, não 16.

### 90 dias — coesão

`T-P1-15` · cluster de coesão do God Component · bloco de acessibilidade · fechar a lacuna de
runtime com o roteiro de 10 passos da fonte 3 · registrar **ADR-2** (Docker/Firebase/Apache),
**ADR-3** (systemd) e **ADR-4** (flags do zone.js).

*Critério de saída:* `formulario.component.ts` abaixo de ~400 linhas, sem `document.querySelector`
para estado, e as decisões pendentes registradas.

### Depois de 90 dias — só com gatilho

Backlog P3 inteiro (§6), em ordem obrigatória `FE-FORM-002` → `FE-OPS-006`.

### ADRs necessários

| # | Decisão | Quando | Tarefa |
|:-:|---|---|---|
| ADR-1 | Exposição da API e TLS | 48h | `T-P0-04` |
| ADR-2 | Firebase × Docker × Apache: qual é o caminho oficial | 90d | P3 |
| ADR-3 | Qual das duas configurações systemd é a oficial | 60d | P2 |
| ADR-4 | Flags do zone.js | 90d | P2 |
| ADR-5 | Remoção de `ngModel`+`formControlName` | antes de executar | P3 |
| ADR-6 | Spring Profiles por ambiente | com gatilho | P3 |

---

## 8. Primeira tarefa recomendada

**`T-P0-01` — verificar `pedido_contador_diario` e o Gate F na VPS.**

Por que ela e não outra:

1. **É a única cujo desconhecimento pode estar causando dano agora.** As demais descrevem risco
   futuro; esta pergunta se o único fluxo de escrita do negócio está a um restart de parar de
   funcionar, com 500 sem mensagem útil (`BE-API-002` ainda não corrigido).
2. **Custo praticamente zero e risco zero:** as queries de conferência já existem dentro do próprio
   script de migração e são `SELECT`.
3. **Não depende de nada** — nem de decisão do dono, nem de código, nem da suíte de testes.
4. **Muda o plano conforme a resposta:** se a tabela não existir, `T-P1-13`/`T-P1-14` sobem para a
   janela de 7 dias e o próximo deploy fica bloqueado até o script rodar.

**Primeira tarefa de código:** `T-P0-05` (`@TestPropertySource`) — uma anotação, bloqueia toda a
onda P1 do backend e é a única correção que torna o comando de validação documentado não-destrutivo.

---

## 9. Prompts de execução

**Preâmbulo obrigatório para todos** (colar no início de cada prompt):

> Leia `PROJECT_RULES.md` e `AGENTS.md` do repositório antes de tocar em qualquer arquivo. Aplique
> a **menor mudança suficiente**. Não migre stack, não troque bibliotecas, não atualize
> dependências, não crie abstração nova. Não altere `environment*.ts`, `application.properties`,
> `firebase.json`, `angular.json`, `proxy.conf.js` nem `.claude/**` sem autorização explícita. Não
> execute deploy, `push`, `reset`, `clean`, `rm` ou `sudo`. **Nunca** execute `./mvnw test` sem
> seletor de classe. Ao terminar, relate: arquivos alterados, decisões, validações executadas,
> validações não executadas, riscos e próximos passos.

### Onda P0

**`T-P0-01`** · `/revisar-banco-mysql`
> Estou verificando o achado `BE-DB-003`. Localize, em `tools/migracao-numeracao-diaria/sql/01_schema_numeracao_diaria.sql`, as queries de conferência (somente `SELECT`) que confirmam: (a) existência da tabela `pedido_contador_diario`; (b) linha do dia corrente; (c) existência da constraint `uq_pedido_data_seq` em `pedidos`. Apresente as queries para eu executar. **Não execute nada contra banco algum** e não altere arquivos.

**`T-P0-02`** · sem command
> Preciso responder ao achado `BE-OPS-013`: existe backup agendado do MySQL de produção? Liste o que devo verificar na VPS (crontab, unit systemd, destino fora da VPS) e o que registrar por escrito. Não acesse a VPS; apenas produza o roteiro.

**`T-P0-03`** · `/revisar-seguranca`
> Achado `BE-SEC-005`: o fat-jar `out/artifacts/spring_lavanderia_jar/spring-lavanderia.jar` está rastreado no Git. Explique como eu verifico, **fora do repositório**, se ele contém `BOOT-INF/classes/application.properties` com credencial, e o que fazer com cada resultado. Não abra o jar, não leia `application*.properties`, não altere nada.

**`T-P0-04`** · `/architecture-decision` (backend)
> Redija a ADR de exposição da API e TLS (`SYS-003`). Contexto: SPA e API na mesma VPS, Apache servindo a SPA em HTTP, API em 8080 sem autenticação e com CORS liberando `PUT/POST/DELETE`. Decisão a registrar: fechar 8080, expor a API por `mod_proxy` no Apache, TLS via Let's Encrypt, restrição por IP/VPN ou Basic auth no proxy. Registre explicitamente as alternativas rejeitadas (Spring Security, OAuth, WAF) e que a troca de esquema em `environment.prod.ts` é o **último** passo. Só escreva a ADR — nenhuma mudança de código ou de infraestrutura.

**`T-P0-05`** · `/create-code` (backend)
> Achado `BE-TEST-001`. Adicione `@TestPropertySource(locations = "classpath:test-h2.properties")` a `src/test/java/com/marina/springlavanderia/SpringLavanderiaApplicationTests.java`. Apenas essa anotação. Depois execute `./mvnw test -Dtest=SpringLavanderiaApplicationTests` (com seletor) e confirme no log que o datasource é `jdbc:h2:mem`. Não crie profiles, não toque em `application.properties`, não altere outras classes de teste.

**`T-P0-06`** · `/create-code` (frontend)
> Achados `FE-TEST-001`/`FE-TEST-003`. Adicione a `package.json` o script `test:ci` com `ng test --watch=false --browsers=ChromeHeadless` e ajuste `karma.conf.js` (hoje `autoWatch: true`, `browsers: ['Chrome']`, `singleRun: false`) para que o modo CI termine sozinho **sem** quebrar o `npm test` interativo. Não corrija as specs que falham nesta tarefa. Rode `npm run test:ci` e relate o total, mesmo com falhas.

**`T-P0-07`** · `/create-code` (frontend)
> Achado `FE-TEST-004`. Remova apenas o `it('should render title')` de `src/app/app.component.spec.ts:29-34` — ele afirma um template (`.content span` com "lavanderia app is running!") que não existe em `app.component.html`. Mantenha os outros dois testes. Rode `npm run test:ci` antes e depois e compare a contagem.

**`T-P0-08`** · `/create-code` (frontend)
> Achado `SYS-001`/`FE-STATE-001`. Em `formulario.component.ts` (`submit()`, `:591-617`) e `formulario.component.html:536`, adicione uma flag `salvando` e `[disabled]` no botão Salvar, liberando a flag por `finalize`/`complete` — **não** apenas em `next`/`error`, senão o botão trava. Não crie `UNIQUE` no banco, não adicione `retry`, não adicione controle `id` ao FormGroup. Aceite: com throttling de rede, dois cliques produzem um `POST`; após erro, o botão volta a funcionar.

**`T-P0-09`** · `/create-code` (frontend)
> Achados `UX-2.2-27`/`UX-2.4-46`. Adicione confirmação explícita antes de excluir em `pesquisa.component.ts` (`onRemove`) e `editar.component.ts`. Use `confirm()` nativo, nomeando o registro (número do pedido / nome do cliente). **Não** use `MatDialog`, não implemente soft delete, não redesenhe os botões. Aceite: cancelar não dispara `DELETE`.

**`T-P0-10`** · `/create-code` (frontend)
> Achado `UX-2.1-01`/`FE-STATE-005`. Em `formulario.component.ts:249-256`, `consultarCliente` faz `this.pedidosClientes = match`, substituindo o pedido inteiro por um registro de cliente (apaga itens e totais e troca o `id`). Troque por `patchValue` **apenas** dos campos de endereço e telefone, **sem** `id`. Não mexa em `searchClientes`, não adicione debounce. Aceite: preencher itens, voltar ao campo Cliente, corrigir o nome e sair → os itens permanecem, e o Salvar seguinte não vira `PUT` com id de cliente.

**`T-P0-11`** · `/debug-app` → `/create-code` (frontend)
> Achado `UX-2.1-03`. Em `formulario.component.ts`, `ds` filtra por `!== null` (`:428` e `:500`, aceita string vazia) enquanto `loopForTotais` (`:265`) filtra por `!= null`; com `removerItem` gravando `descricao=''` e `total=null` (`:365-367`), os arrays desalinham e `totais[i].toFixed(2)` estoura sobre `undefined`, antes de abrir impressão/WhatsApp. Unifique o critério de "slot preenchido" e proteja o laço, aplicando **nos dois blocos** (`:427-451` e `:499-520`). **Não** extraia `montarResumoPedido()` agora e não mude o texto do recibo.

**`T-P0-12`** · `/create-code` (frontend)
> Achado `FE-FORM-003`. Adicione `type="button"` ao Cancelar em `formulario.component.html:537` e em `form-cliente.component.html:73` (atenção: o caminho real é `src/app/form-cliente/`, não `src/app/shared/form-cliente/`). Não toque em `busca-cep` — já foi validado que lá não se aplica.

**`T-P0-13`** · `/create-code` (frontend)
> Achado `FE-SEC-003`. Remova os 15 `console.log` de `formulario.component.ts` (11), `form-cliente.component.ts` (3) e `input-client.component.ts` (1) — imprimem nome, telefone, endereço e o recibo completo, e o bundle de produção não faz drop de console. **Mantenha** os 2 `console.error` (`form-cadastro:77`, `busca-cep:85`). Não crie serviço de log nem toque em `angular.json`. Aceite: `grep -rn 'console\.log' src/app/` retorna zero e `npm run build` continua exit 0.

**`T-P0-14`** · `/revisar-integracao-api` (frontend)
> Achado `FE-API-002`. Em `editar.component.ts:41`, troque `listClient()` por `searchClientes(query)` — já existe em `data-crud.service.ts:90` e o backend já expõe `GET /api/clientes/search` (`ClientController:42`). Siga o padrão de guarda usado em `searchPedido()` (`formulario.component.ts:157-171`) e defina explicitamente o comportamento para query vazia. Não crie endpoint novo, não adicione paginação.

**`T-P0-15`** · `/create-code` (frontend)
> Achado `UX-2.8-67`. Em `src/index.html:2`, troque `<html lang="en">` por `<html lang="pt-BR">`. Só isso — `<title>` por rota e `<h1>` por tela são P2.

**`T-P0-16`** · `/revisar-integracao-api` (frontend) — **só após `T-P0-04` validada**
> Autorizo, nesta tarefa, alterar `src/environments/environment.prod.ts`. Troque **apenas** o esquema `http` por `https` na linha 5. Não altere host, porta, `environment.ts` nem `proxy.conf.js`. Antes de aplicar, confirme comigo que o TLS já está ativo e validado no Apache — fazer isso antes derruba a aplicação inteira. Rode `npm run build` e relate.

### Onda P1

**`T-P1-01`** · `/revisar-api-spring` → `/create-code` (backend)
> Achado `BE-SEC-002`. `ClientController.java:60` recebe a entidade crua (`@RequestBody Client`) e `:65` chama `save()`, o que faz *merge* quando vem `id` — um POST sobrescreve outro cliente respondendo 201. Crie `ClientRequestDTO` **sem `id`**, espelhando `PedidosRequestDTO`, e use-o em `create`. Mantenha exatamente os mesmos nomes de campo JSON e confira campo a campo contra `Client.java` para não perder nada. Não toque em `update`, não crie service, não adicione Bean Validation. Adicione teste: POST com `id` cria registro novo.

**`T-P1-02`** · `/create-code` (backend)
> Achados `BE-TEST-003`/`004`/`006`. Adicione testes para as três regras centrais do dinheiro, hoje sem nenhuma cobertura: (1) `somarItens`/`criar()` com itens populados — soma simples, item com `total=null`, arredondamento de escala; (2) `adicionarItemSePreenchido` com `quantidade=""` e `descricao=""` (bug já ocorrido em produção, commit `fdb21bc`); (3) `PedidosResponseDTO.from()` com itens esparsos (só slots 2 e 4). Não refatore `PedidosService`. Rode com seletor de classe. Antes de commitar, verifique que alterar `somarItens` de propósito quebra um teste.

**`T-P1-03`** · `/create-code` (frontend)
> Achado `FE-TEST-002`. Crie specs **sem TestBed** para `formatarMoeda` (`:294`), `loopForTotais` (`:262`), `onChange` (`:281`), `onBeforeSave` (`:573`) e `cepValidator` (`form-validations.ts`), cobrindo vírgula×ponto, `null`, string vazia e arredondamento de 2 casas. Documente o comportamento **atual**, mesmo onde pareça errado — a correção é `T-P1-05`. Não altere código de produção e não tente consertar as specs que falham por `NullInjectorError`.

**`T-P1-04`** · `/revisar-api-spring` (backend)
> Achado `BE-TEST-015`. Em `PedidosClientsControllerTest.java`, as asserções (linhas 64, 82, 93, 104) só verificam status. Adicione 2-3 `jsonPath` ancorando `numberPedido` e `valorFinal` nos testes já existentes. Não crie classe de teste nova, não altere DTOs. Aceite: renomear `valorFinal` no DTO quebra o teste.

**`T-P1-05`** · `/implementation-plan` → `/create-code` (frontend) — **exige `T-P1-03` pronta**
> Achado `FE-FORM-001`. Hoje o `POST` sai numérico por efeito colateral: `(change)` → `loopForTotais` muta o modelo → `updateModel` síncrono do Angular grava no FormControl. Normalize `total*`/`valorFinal` no ponto de salvamento, sem depender do evento de UI. **Campo financeiro:** só prossiga com os testes de `T-P1-03` verdes. Não remova `ngModel`+`formControlName` (é P3, exige ADR) e não mude quem calcula `valorFinal` — o servidor continua autoritativo. Confirme o corpo real do `POST` em DevTools → Network.

**`T-P1-06`** · `/revisar-api-spring` (backend)
> Achado `SYS-004`/`BE-API-002`. O backend devolve `{"erro": "<motivo>"}` em `PedidosClientsController:118` e `ClientController:115`, mas todo o resto usa o formato padrão do Spring. Padronize o corpo de erro **preservando** `{"erro": ...}` como formato oficial e ancore o nome do campo num teste. Não introduza `@ControllerAdvice` com hierarquia de exceções, RFC 7807 nem Bean Validation.

**`T-P1-07`** · `/revisar-integracao-api` (frontend) — **depois de `T-P1-06`**
> Achado `SYS-004`/`FE-API-001`. Há 8 handlers `error: () =>` que descartam o `HttpErrorResponse` e mostram frase fixa. Passe a receber o erro e exibir `err.error?.erro` quando existir, com fallback genérico, distinguindo status 0 (rede) de erro do servidor. Não crie `HttpInterceptor` global, não adicione `retry` (o `POST` não é idempotente — criaria o pedido duplicado de `SYS-001`) e nunca exiba stack ao operador.

**`T-P1-08`** · `/refactor-code` (frontend)
> Achado `FE-ARCH-001`. `ErrorMsgComponent` (`error-msg.component.ts:17`) estende `FormularioComponent` só para usar um método, fazendo a tela instanciar 16 formulários de 40 controles. Remova a herança e passe o necessário por `@Input`/função utilitária. **Não** toque em `PesquisaComponent` nem em `PedidosComponent` (herdam de propósito) e não quebre o God Component nesta tarefa. Aceite: as 14 mensagens de erro idênticas e 2 formulários instanciados.

**`T-P1-09`** · `/create-code` (frontend) — **exige `T-P1-03`**
> Achado `UX-2.1-06`. Em `formulario.component.ts:307-330`, `pesarRetirada` lê `e.target.checked` apenas para o próprio checkbox e depois faz `setValue(0)` no total **incondicionalmente** — desmarcar apaga o valor digitado. Zere só quando `checked === true` e preserve o valor ao desmarcar. Confira os 6 slots. Não refatore o `switch`.

**`T-P1-10`** · `/create-code` (frontend)
> Achado `UX-2.1-07`. As cadeias `if/else if` de `:454-462` e `:523-531` não têm `else`, então `status` fica `undefined` e é concatenado no recibo (`:538`) e no WhatsApp (`:464`). Adicione o `else` com rótulo neutro **nos dois blocos**. Não deduplique os blocos agora.

**`T-P1-11`** · `/create-code` (frontend)
> Achado `UX-2.5-53`. Em `busca-cep.component.ts:72-88`, `consultarRua()` faz `push` em `arrCep`/`arrCidade`/`arrBairro`/`arrComp` sem limpar; os arrays só são limpos em `resetar()` (`:57-60`, botão Cancelar), então buscas consecutivas misturam ruas. Limpe no `next`, não antes do `subscribe` (para não esvaziar a tela em caso de erro). Não redesenhe a tela.

**`T-P1-12`** · `/revisar-banco-mysql` (backend)
> Achado `BE-DB-005`. `src/test/resources/schema.sql` recria `pedido_contador_diario` e `uq_pedido_data_seq`, mas não `UNIQUE(pedido_id, ordem)` — que existe só no SQL de produção (`tools/migracao-itens/sql/01_schema_pedido_itens.sql:28`). Adicione a constraint ao schema **de teste**, no mesmo padrão do arquivo, e um teste de regressão do cenário `"Duplicate entry 'X-0'"`. **Não** declare a constraint em JPA (decisão deliberada documentada no próprio arquivo) e não toque em banco de produção. Aceite: remover o `saveAndFlush` de `PedidosService.atualizar` passa a quebrar o teste.

**`T-P1-13`** · `/revisar-banco-mysql` (backend)
> Achado `BE-DB-006`. Torne a query de conferência de `uq_pedido_data_seq` — que já existe no script de migração — um item **obrigatório** do checklist pós-deploy no runbook do Gate F. Apenas documentação: não crie health check, não declare a constraint em JPA.

**`T-P1-14`** · `/revisar-banco-mysql` (backend)
> Achado `BE-DB-008`. Documente no runbook (e como nota ao final da ADR 0007) que qualquer rollback da numeração diária **precisa restaurar o contador ao ponto correto** antes de reabrir o cadastro — zerar `pedido_contador_diario` reemite um `numberPedido` já impresso, cenário observado em sessão real. **Não** crie `UNIQUE(numberPedido)`: a ADR 0007 já rejeitou por causa de um número relevante de duplicatas do legado.

**`T-P1-15`** · `/refactor-code` (frontend)
> Achado `FE-ARCH-004`. O modo criar × editar é decidido por `window.location.hash.slice(2)` em `formulario.component.ts:135` e `:574`, e por `location.href` em `pedidos.component.ts:29`. Troque por `@Input() modo` explícito nos dois usos e remova o parsing de URL. **Mantenha o roteamento hash** — trocar para path exige ADR. Teste os dois caminhos conferindo o verbo HTTP em Network: registrar cria (`POST`), editar atualiza (`PUT`).

---

## 10. Verificação deste plano

| # | Critério | Situação |
|:-:|---|:--:|
| 1 | Todo achado P0/P1/CRÍTICO/ALTO das 4 fontes aparece como tarefa **ou** na §2 com justificativa | ✅ |
| 2 | Todo card de P0/P1 tem os **19** campos preenchidos | ✅ 31 cards |
| 3 | Nenhum card mistura repositórios | ✅ — `SYS-003` e `SYS-004` foram divididos em tarefas por repo (`T-P0-04`/`T-P0-16`, `T-P1-06`/`T-P1-07`) |
| 4 | Toda tarefa que toca banco tem backup/verificação/rollback | ✅ — nenhuma tarefa deste plano altera schema de produção; `T-P1-12` toca só o schema de teste |
| 5 | Toda mudança de API declara compatibilidade na transição | ✅ — `T-P1-01` (nomes de campo preservados), `T-P1-06` (formato já existente) |
| 6 | O grafo de dependências não tem ciclo e a ordem o respeita | ✅ — ordem 1→31 |
| 7 | Commands e skills citados existem nos repos | ✅ — conferidos em `.claude/commands/` e `.claude/skills/` dos dois |
| 8 | Nenhum dado real de cliente, credencial ou URL de produção reproduzido | ✅ |
| 9 | Nenhuma tarefa de upgrade de stack em onda | ✅ — todas em P3 com gatilho |
| 10 | Achados não confirmáveis estaticamente permanecem marcados | ✅ — 9 itens na §1.4 |

*Plano produzido em modo somente-leitura sobre `frontend@ef9b264` e `backend@dcfcadf`. Nenhuma
correção foi implementada. Cada tarefa deve seguir, na execução,
`.claude/rules/raciocinio-e-arquitetura.md` do repositório correspondente.*
