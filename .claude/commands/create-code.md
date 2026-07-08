---
description: Implementação controlada com menor mudança suficiente (frontend)
---

# create-code

Use para implementar feature, correção ou ajuste pequeno/médio na SPA Angular.
Metodologia: skill `senior-code-agent`.

## Quando usar
Escopo claro em um componente/serviço/rota.

## Leituras obrigatórias
`PROJECT_RULES.md`, `AGENTS.md`, rule do domínio (`angular-components-services`, `integracao-api-proxy`, etc.) e os arquivos reais impactados.

## Limites de escopo
- Não migrar para standalone/signals nem trocar Bootstrap/Material/RxJS sem autorização.
- Não alterar contrato com o backend (nomes de campos, endpoints) sem plano.
- Preservar padrões: NgModule, Reactive Forms, RxJS `take(1)`/`first()`, SCSS, roteamento hash, declarar componente no módulo.

## Passos
1. Confirme escopo e leia os arquivos mínimos.
2. Apresente plano se não for trivial.
3. Edite só o necessário (lembre de declarar novos componentes no `AppModule`).
4. Valide com `npm run build` (e `npm test` se houver spec).
5. Relate arquivos, validações e riscos.

## Saída esperada
Resumo do que mudou, validação de build e o que não foi testado.
