---
name: angular-maintenance
description: Método de manutenção da SPA Angular 14 legada (NgModule, Reactive Forms, Bootstrap 5 + Material 14, roteamento hash). Use para manter/estender componentes, serviços e rotas com segurança.
---

# angular-maintenance

Metodologia para manutenção segura da SPA Angular legada.

## Contexto real
- Angular 14.1, TypeScript 4.7, Angular CLI. App em `NgModule` (`AppModule`), roteamento hash.
- UI: Bootstrap 5.2 + Material 14 (tema `indigo-pink`), SCSS. Formulários com Reactive Forms.
- Serviços `providedIn: 'root'`: `DataCrudService` (API), `ConsultaCepService` (ViaCEP). Impressão via `print-js`. Firebase via `@angular/fire`.

## Método
1. Localizar o ponto exato (componente/serviço/rota/módulo) — não abrir o app inteiro.
2. Preservar padrões: declarar componentes no `AppModule`, seletor com prefixo `app`, Reactive Forms + validators de `shared/form-validations.ts`, RxJS `take(1)`/`first()`.
3. Para chamadas HTTP, reutilizar `DataCrudService` em vez de criar acesso paralelo à API.
4. Não migrar para standalone/signals, não trocar Bootstrap/Material/RxJS, não mexer em `environment*.ts`/deploy sem autorização.
5. Validar com `npm run build`; `npm test` se houver spec relacionado.

## Cuidados
- Mudou campo de modelo (`clientes.ts`/`pedidos-clientes.ts`)? Verifique casamento com o backend.
- Conflitos de estilo Bootstrap × Material: preferir a lib já usada no componente.
- Roteamento é hash (`useHash: true`) — links e navegação devem respeitar isso.
