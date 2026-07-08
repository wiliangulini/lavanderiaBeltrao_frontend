# Rule — Componentes, serviços e módulos Angular

Use ao criar/alterar componentes, serviços, rotas ou o módulo.

## Fatos
- `AppModule` declara todos os componentes; roteamento em `app-routing.module.ts` (hash).
- Componentes: busca-cep, cadastro, editar, form-cadastro, form-cliente, formulario, input-client, navbar, pedidos, pesquisa; `shared/error-msg`.
- Serviços `providedIn: 'root'`: `DataCrudService`, `ConsultaCepService`.
- Modelos: `shared/clientes.ts`, `shared/pedidos-clientes.ts`; validações em `shared/form-validations.ts`.
- Formulários com Reactive Forms; RxJS com `take(1)`/`first()` nas requests.

## Regras
- Declarar todo componente novo no `AppModule`; seletor com prefixo `app`.
- Reutilizar `DataCrudService`/`ConsultaCepService` em vez de criar `HttpClient` paralelo.
- Não deixar subscription sem término em observables de request (usar `take(1)`/`first()` ou `async` pipe).
- Alterar rota exige revisar `app-routing.module.ts` e a navegação/navbar; manter roteamento hash.
- Alterar modelos (`clientes.ts`/`pedidos-clientes.ts`) exige checar casamento com o backend.
- Preservar validações existentes em `form-validations.ts`.
