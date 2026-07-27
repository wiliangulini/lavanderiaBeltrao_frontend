# Contrato do relatório final

## Estrutura obrigatória

1. **Resumo** — objetivo, escopo (todas as telas ou `$ARGUMENTS`), data.
2. **Achados por tela**, agrupados na ordem da `coverage-matrix.md`. Cada achado:
   - Severidade: **crítico** / **importante** / **melhoria**.
   - Descrição objetiva (1–3 frases).
   - Evidência: `arquivo:linha` (achado estático) ou `tela → passo` (achado de runtime).
   - Origem: qual agente/fase gerou o achado.
3. **Achados descartados por falta de evidência** — se `ux-evidence-validator` rejeitar algo,
   registrar o que foi descartado e por quê (transparência, não esconder).
4. **Divergência documentação × código**, se houver (ex.: rule desatualizada) — seção separada,
   não misturar com achados de UI.
5. **Não editar**: a auditoria nunca aplica correção; só relata. Fica explícito no fim do
   relatório.

## Rótulos

Reusar os rótulos de `PROJECT_RULES.md` §13 quando o achado tocar código já implementado:
**não confirmado no projeto** (quando não há evidência suficiente para afirmar).

## Proibido

- Inventar tela, campo, endpoint ou comportamento inexistente no código.
- Apresentar achado sem evidência (arquivo:linha ou tela/passo).
- Misturar achado de UI com sugestão de mudança de contrato de API — isso vai para
  `/revisar-integracao-api`, não para este relatório.
