# Rule — UI/UX (Bootstrap 5 + Angular Material 14)

Use para telas, componentes visuais, responsividade e acessibilidade.

## Fatos
- Bootstrap 5.2 (CSS + JS bundle) e Angular Material 14 (tema `indigo-pink`) coexistem; estilos em SCSS (`styles.scss`).
- Formulários com Reactive Forms; erros exibidos via componente `shared/error-msg`.
- Impressão de pedidos/recibos via `print-js`.

## Regras
- Preservar o padrão visual existente; não trocar tema/lib de UI sem autorização.
- Evitar conflito Bootstrap × Material no mesmo elemento; preferir a lib já usada no componente.
- Manter responsividade (não quebrar mobile) e acessibilidade básica: labels, foco, contraste, semântica.
- Estilos em SCSS; respeitar budgets do `angular.json` (warning 2kb / erro 4kb por estilo de componente).
- Não introduzir mudanças estéticas fora do escopo pedido.
- Ajustes em impressão devem preservar o layout do recibo (`print-js`).
