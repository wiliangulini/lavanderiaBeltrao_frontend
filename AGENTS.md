# AGENTS.md — Roteador operacional (Frontend Lavanderia Beltrão)

Orienta qualquer agente de IA neste repositório. Não substitui `PROJECT_RULES.md`; define como navegar pelas regras.

## 1. Prioridade de leitura

1. `PROJECT_RULES.md` (fonte de verdade).
2. Este `AGENTS.md`.
3. Arquivo da ferramenta: Claude Code → `CLAUDE.md` + `.claude/instructions.md`; Codex → `CODEX.md` + `.codex/instructions.md`.
4. Rule de domínio em `.claude/rules/` **apenas se relevante**.
5. Arquivos reais impactados (módulo/componente/serviço).

Não leia `package-lock.json`, `node_modules` ou relatórios antigos sem necessidade clara.

## 2. Papel dos documentos

| Documento | Função |
|---|---|
| `PROJECT_RULES.md` | Fonte de verdade do frontend. |
| `AGENTS.md` | Roteador comum entre agentes. |
| `CLAUDE.md` | Operação no Claude Code. |
| `CODEX.md` | Operação no Codex (VS Code). |
| `.claude/rules/` | Regras acionáveis por domínio. |
| `.claude/commands/` | Entrypoints de tarefas recorrentes. |
| `.claude/skills/` | Métodos reutilizáveis. |
| `.claude/agents/` | Agentes read-only (Read/Grep/Glob) usados pela auditoria integral — ver `/auditar-ux-ui`. |
| `.codex/instructions.md` | Matriz de risco e protocolo do Codex. |
| `docs/ia-auditorias/` | Continuidade/handoff; não é fonte de verdade. |

## 3. Quando usar cada recurso

- **Command**: iniciar tarefa concreta (implementar, revisar, depurar, refatorar, auditar, decidir arquitetura, revisar UI Angular, revisar integração com a API).
- **Skill**: metodologia (planejar, refatorar com segurança, manutenção Angular, integração com API).
- **Rule**: domínio sensível (stack Angular, componentes/serviços, UI Bootstrap/Material, integração/proxy, segurança, fluxo de pedidos, raciocínio/decisão arquitetural). As rules em `.claude/rules/` valem para Claude Code e Codex — mesmo critério para os dois.

Pares command↔skill (`create-code`↔`senior-code-agent`, `implementation-plan`↔`implementation-planning`, `architecture-decision`↔`architecture-review`): command é a entrada, skill é o método; não repita conteúdo.

### Revisão pontual vs auditoria integral

- **Revisão pontual** (`/revisar-ui-angular`, `/revisar-integracao-api`): achados ad hoc de uma tela/fluxo específico, sem múltiplos agentes; use durante uma tarefa comum, sem pedido explícito extra.
- **Auditoria integral** (`/auditar-ux-ui`): cobertura completa de todas as telas — estática + runtime + 3 agentes paralelos (`.claude/agents/`) + validação independente. Invocação exclusivamente manual, sessão dedicada, mais cara em tempo/tokens — não disparar durante uma tarefa comum, só sob pedido explícito do usuário.

## 4. Antes de qualquer edição

1. Confirme o escopo. 2. Verifique branch (`dev`) e status. 3. Identifique módulo/componente/serviço mínimo. 4. Se tocar integração com a API, environments, deploy ou valores financeiros → leia a rule e apresente plano. 5. Aguarde autorização em área sensível.

## 5. Áreas de cuidado elevado (frontend)

- Integração com `/api/*` (`DataCrudService`, `environment*.ts`, `proxy.conf.js`).
- Deploy (Firebase/Docker).
- Valores financeiros e máscaras do formulário de pedido.
- Compatibilidade de campos JSON com o backend.

## 6. Continuidade Claude ↔ Codex (handoff)

Registrar: objetivo; arquivos lidos/alterados; decisões; validações; pendências; riscos; próximo passo. Use `docs/ia-auditorias/TEMPLATE-agent-report.md`.

## 7. Economia de tokens

Regra central → arquivo da ferramenta → rule do domínio → arquivos impactados → relatório anterior só se necessário.

## 8. Saída ao concluir

Separe sempre: o que foi feito; onde; validações; riscos; próximos passos.
