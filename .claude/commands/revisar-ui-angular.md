---
description: Revisão de UI/UX e componentes Angular (frontend)
---

# revisar-ui-angular

Use para revisar telas e componentes sem alterar por padrão. Rules base: `ui-ux-bootstrap-material`, `angular-components-services`.

## Contexto real
- Bootstrap 5.2 + Angular Material 14 (tema `indigo-pink`), SCSS, roteamento hash.
- Telas: registrar-pedido, pesquisar-pedido, cadastrar-clientes, editar-clientes, buscar-cep; navbar; `shared/error-msg`.
- Formulários com Reactive Forms e validações em `shared/form-validations.ts`.

## Verificar
- Consistência visual entre Bootstrap e Material (evitar conflito de estilos).
- Responsividade e acessibilidade básica (labels, foco, contraste, semântica).
- Uso correto de Reactive Forms (validators, estados de erro via `error-msg`).
- Impressão (`print-js`) quando aplicável.
- Componentes novos declarados no `AppModule`; seletores com prefixo `app`.

## Saída esperada
Achados de UI/UX e componentização classificados (crítico→melhoria), com recomendação. Não editar sem pedido.
