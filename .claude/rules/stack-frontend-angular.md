# Rule — Stack frontend (Angular 14)

Use quando a tarefa mexer na estrutura do frontend.

## Fatos
- Angular 14.1, TypeScript 4.7, Angular CLI 14.1, RxJS 7.5, zone.js.
- App em `NgModule` (`AppModule`), roteamento **hash** (`useHash: true`).
- UI: Bootstrap 5.2 + Angular Material 14 (+ CDK), SCSS. Firebase via `@angular/fire`. Impressão via `print-js`.
- Scripts: `npm start` (proxy, porta 4200), `npm run build` (produção), `npm run watch`, `npm test` (Karma/Jasmine), `npm ci`.

## Regras
- Não migrar para standalone components, signals, control flow novo ou versão major do Angular sem autorização.
- Não trocar Bootstrap, Material ou RxJS por outras libs.
- Não introduzir dependência nova sem justificar (preferir o que já existe).
- Preservar a organização por componente/serviço/módulo e o roteamento hash.
- Validar com `npm run build`; testes com `npm test`. Não há script de lint.
