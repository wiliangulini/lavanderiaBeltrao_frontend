# PROJECT_RULES.md — Fonte de verdade (Frontend Lavanderia Beltrão)

> Fonte de verdade operacional deste repositório. Claude Code, Codex e qualquer outro
> agente devem priorizar estas regras quando houver conflito com documentos auxiliares.
> O que não estiver confirmado no código real deve ser declarado como `não confirmado no projeto`.

## 1. Identidade do projeto

- Nome: Lavanderia Beltrão — frontend web.
- Tipo: SPA interna de gestão da lavanderia (registrar/pesquisar pedidos, cadastrar/editar clientes, buscar CEP).
- Repositório: `lavanderiaBeltrao_frontend` (separado do backend `lavanderiaBeltrao_backend`).
- Usuário principal: operação de balcão. Não há login/rota administrativa (ver §5).
- Estágio: produção/legado em manutenção.

## 2. Stack oficial (confirmada no código)

- Framework: Angular 14.1 (Angular CLI 14.1), TypeScript 4.7.
- Reatividade: RxJS 7.5. HTTP via `@angular/common/http`.
- UI: Bootstrap 5.2 + Angular Material 14 (+ CDK), tema Material `indigo-pink`, estilos SCSS.
- Formulários: Reactive Forms (`@angular/forms`).
- Impressão: `print-js` (recibos/pedidos).
- Firebase: `@angular/fire` 7.5 (deploy Firebase Hosting — `firebase.json`, `.firebaserc`).
- Testes: Karma + Jasmine (`ng test`).

Não migre para standalone components, signals, versão major do Angular, nem troque Bootstrap/Material/RxJS sem autorização explícita.

## 3. Comandos canônicos (confirmados no `package.json`)

```bash
# Dev server (porta 4200, com proxy)
npm start           # ng serve --proxy-config proxy.conf.js --host 0.0.0.0 --port 4200

# Instalação limpa (usada no rodar-projeto.sh)
npm ci

# Build de produção
npm run build       # ng build --configuration production

# Build incremental (dev)
npm run watch

# Testes (Karma/Jasmine)
npm test            # ng test

# Lint dedicado
# não confirmado no projeto (não há script de lint)
```

## 4. Arquitetura real (confirmada)

- App baseada em `NgModule` (`AppModule`), roteamento **hash** (`useHash: true`).
- Rotas (`app-routing.module.ts`):
  - `''` → `registrar-pedido`
  - `registrar-pedido` → `PedidosComponent`
  - `pesquisar-pedido` → `PesquisaComponent`
  - `cadastrar-clientes` → `CadastroComponent`
  - `buscar-cep` → `BuscaCepComponent`
  - `editar-clientes` → `EditarComponent`
- Componentes em `src/app/*`: busca-cep, cadastro, editar, form-cadastro, form-cliente, formulario, input-client, navbar, pedidos, pesquisa; `shared/error-msg`.
- Serviços em `src/app/shared/services/`:
  - `DataCrudService` — CRUD de pedidos/clientes contra a API.
  - `ConsultaCepService` — ViaCEP (cidade Francisco Beltrão/PR).
- Modelos: `shared/clientes.ts`, `shared/pedidos-clientes.ts`; validações em `shared/form-validations.ts`.

## 5. Escopo de agentes

Podem: ler o projeto; propor plano; implementar mudanças pequenas e coesas quando autorizados; revisar diff; sugerir/rodar testes Karma; refatorar de forma incremental sem alterar comportamento.

Não devem: reescrever o app; trocar/atualizar Angular ou libs de UI; alterar `environment*.ts` com credenciais/URLs sem autorização; executar deploy (Firebase/Docker); commitar/pushar sem pedido; editar fora do escopo; **inventar** rotas, componentes, endpoints, campos ou login que não existem no código.

## 6. Áreas sensíveis (frontend)

| Área | Onde | Regra |
|---|---|---|
| Integração com a API | `shared/services/data-crud.service.ts`, `environment*.ts` | Contrato deve casar com o backend (`/api/clientes`, `/api/pedidos`). Ver `.claude/rules/integracao-api-proxy.md`. |
| Environments | `src/environments/environment.ts` / `.prod.ts` | URLs e config Firebase. Não expor/alterar sem autorização. |
| Deploy | `firebase.json`, `.firebaserc`, `Dockerfile`, `docker-compose.yml` | Não executar deploy. |
| Valores financeiros | formulário de pedido (`total*`, `valorFinal`) | Cálculos/máscaras sensíveis; validar antes de mudar. |
| Proxy | `proxy.conf.js` | `/api → lavanderiabeltrao.com.br:8080`. Ver §7. |

## 7. Integração com o backend

- Backend: `lavanderiaBeltrao_backend` (Spring Boot). Endpoints `/api/clientes` e `/api/pedidos`.
- `DataCrudService` monta URL **absoluta** a partir de `environment.backend.baseUrl` + `environment.API` (`api/`):
  - dev: `http://localhost:8080/api/...`
  - prod: `http://lavanderiabeltrao.com.br:8080/api/...`
- Existe `proxy.conf.js` (`/api` → `http://lavanderiabeltrao.com.br:8080/`), mas como o service usa baseUrl **absoluta**, o proxy praticamente não é exercido hoje. Não assumir que chamadas passam pelo proxy sem verificar.
- Nomes de campos JSON devem casar com as entidades do backend (`numberPedido`, `valorFinal`, `entrega_estimada`, etc.). Mudar nome quebra a integração.

## 8. Menor mudança suficiente

1. Entenda o objetivo. 2. Localize módulo/componente/serviço mínimo. 3. Explique o plano. 4. Altere só o necessário. 5. Preserve padrões (Reactive Forms, RxJS `take/first`, Material + Bootstrap, SCSS). 6. Valide (`npm run build` e/ou `npm test`). 7. Relate alterado/testado/não testado.

## 9. Git

- Branch de trabalho: `dev`.
- Verificar branch/status antes de editar.
- Não commitar nem pushar sem pedido explícito.
- Proibido sem autorização: `git reset --hard`, `git clean -fd`, `git rebase`, `git push --force`.

## 10. Segurança no frontend (resumo — detalhe em rule)

- Não versionar/expor secrets. Config Firebase de web (`apiKey` etc.) é pública por design, mas não alterar sem autorização.
- Não confiar apenas em validação client-side para dados críticos.
- Não introduzir dependências novas sem justificar. Ver `.claude/rules/seguranca-frontend.md`.

## 11. Validação

Após alterar: `npm run build` (compila/produção) e/ou `npm test` (Karma/Jasmine, pode exigir Chrome). Não há script de lint. Não rodar deploy.

## 12. Economia de tokens

Não repita este arquivo nos demais. Não cole `package-lock.json`/`node_modules` nem arquivos inteiros sem necessidade. Leia rules por domínio sob demanda.

## 13. Relatório final obrigatório

Ao concluir: objetivo; arquivos alterados; decisões; validações executadas; validações não executadas; riscos; próximos passos.

Use sempre um destes rótulos para cada item (não misturar): **feito** (implementado e validado),
**não feito** (fora do escopo desta tarefa ou pendente), **não testado** (implementado, validação
não executada — declare o motivo), **não confirmado no projeto** (não há evidência no código para
afirmar ou negar).

## 14. Precedência documental

1. `PROJECT_RULES.md` → 2. `AGENTS.md` → 3. `CLAUDE.md`/`CODEX.md` → 4. `.claude/rules/` e `.codex/instructions.md` → 5. commands/skills → 6. `docs/`. Em conflito, seguir o de maior prioridade e registrar o conflito.
