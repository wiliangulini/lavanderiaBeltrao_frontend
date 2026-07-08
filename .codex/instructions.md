# .codex/instructions.md — Protocolo do Codex (Frontend)

## Prioridade
1. `PROJECT_RULES.md`
2. `AGENTS.md`
3. `CODEX.md`
4. Este arquivo
5. Arquivos impactados

Não sobreponha as regras definidas para o Claude Code; elas valem para todos os agentes.

## Matriz de impacto (frontend)

| Tipo de alteração | Risco | Conduta |
|---|---:|---|
| UI simples (estilo/texto em 1 componente) | Baixo | Edição direta se escopo claro. |
| Componente com estado / Reactive Forms | Médio | Ler uso e validações antes de editar. |
| Serviço/integração (`DataCrudService`, URLs) | Alto | Confirmar contrato no backend; plano. |
| `environment*.ts` / `proxy.conf.js` | Alto | Autorização; não expor/alterar sem plano. |
| Valores financeiros / máscaras de pedido | Alto | Validar; plano. |
| Deploy (Firebase/Docker) | Crítico | Não executar; apenas orientar. |
| Migração de stack (standalone/signals/major) | Crítico | Não fazer sem autorização. |

## Antes de editar
- Escolha técnica relevante (pattern, abstração, refatoração ampla)? Use o mesmo critério do
  Claude Code: `.claude/rules/raciocinio-e-arquitetura.md` (pattern vs simplicidade, reversível vs
  irreversível → ADR).
- Não inventar rotas, componentes, serviços, endpoints ou campos JSON.
- Declarar novos componentes no `AppModule`; manter roteamento hash.
- Reutilizar serviços existentes; não criar `HttpClient` paralelo.
- Confirmar comandos antes de executar (`npm run build`, `npm test`; não rodar deploy).
- Menor mudança suficiente; não misturar refatoração ampla com correção pontual.

## Finalização
Informe: alterações; arquivos; validações; pendências; riscos.
