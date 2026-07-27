---
paths:
  - "src/**/*.ts"
---

# Rule — Raciocínio sênior e decisão arquitetural

Use antes de tocar em código sempre que a tarefa não for um ajuste trivial e óbvio: ao avaliar
se algo é bug pontual ou pede refatoração, se vale introduzir um design pattern, ou se uma
mudança merece ADR. Base para `architecture-decision`/`architecture-review` e para qualquer
correção que tenda a "crescer" além do pedido.

## Bug pequeno vs refatoração
- Sintoma isolado, causa raiz em 1 componente/serviço, correção não muda contrato/API pública →
  corrija no lugar (ver `debug-app`/`create-code`). Não abra refatoração junto.
- Só amplie o escopo para refatoração se o bug for **sintoma de duplicação/estrutura ruim já
  repetida em ≥3 lugares** — e mesmo assim, proponha plano separado antes de misturar com a correção.

## Pattern necessário vs complexidade artificial
Pergunte, nesta ordem, antes de introduzir um pattern (interceptor, factory, strategy, módulo
compartilhado, abstração de serviço, etc.):
1. **Existe repetição real hoje** (não hipotética) que o pattern eliminaria? Se não, não aplique.
2. **O projeto já resolve isso de outro jeito** (ex.: `DataCrudService` já centraliza HTTP)?
   Reutilize em vez de criar uma camada nova.
3. O ganho compensa o custo de leitura para um mantenedor único, sem squad, num app pequeno?
4. A stack legada (NgModule, Reactive Forms, sem lazy loading) comporta o pattern sem forçar
   migração (standalone/signals) pela porta dos fundos?

Se qualquer resposta for "não" → **não aplique o pattern**; resolva com o padrão já existente no
código, mesmo que menos "elegante". Overengineering aqui parece: introduzir abstração para 1 caso
de uso, criar camada de serviço genérica sem 2º consumidor real, ou generalizar "para o futuro".

## Decisão reversível vs irreversível → quando abrir ADR
- **Reversível** (baixo custo de desfazer: nome de variável, extrair função privada, mover CSS) →
  decida e implemente; não precisa ADR.
- **Irreversível ou cara de desfazer** (contrato de serviço público, nome de campo JSON trocado
  com o backend, estrutura de rota, dependência nova, mudança de roteamento hash→path, padrão que
  vira convenção do projeto) → **não decida sozinho**: use `architecture-decision`
  (skill `architecture-review`), registre em `docs/adr/` **se autorizado**, e peça confirmação.

## Sinais de alerta (parar e reconsiderar)
- Está criando uma interface/abstração com um único implementador.
- Está adicionando configuração/flag para um cenário que não existe no projeto hoje.
- Está tocando em mais arquivos do que os estritamente necessários para o pedido.
- Está generalizando um `if` em pattern antes de o código repetir 3+ vezes.

## Saída
Ao aplicar esta rule, declare em 1–2 frases: por que o pattern foi ou não foi aplicado, e se a
mudança é reversível ou exigiu ADR/autorização.
