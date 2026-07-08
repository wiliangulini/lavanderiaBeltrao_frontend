# Rule — Segurança no frontend

Use sempre que a tarefa tocar environments, deploy, dados de clientes ou dependências.

## Fatos
- Config Firebase e URLs ficam em `environment.ts` / `environment.prod.ts` (substituídos no build de produção).
- Deploy via Firebase Hosting (`firebase.json`, `.firebaserc`) e artefatos Docker (`Dockerfile`, `docker-compose.yml`).
- Não há login/autenticação: a SPA é de uso interno.
- Trafega dados reais de clientes (nome, telefone, endereço) e pedidos.

## Regras
- Não confiar apenas em validação client-side para dados críticos (o backend deve validar).
- API keys de Firebase web são públicas por design, mas não alterar `environment*.ts` sem autorização.
- Não versionar `.env`/secrets; se surgirem, ignorar via `.gitignore`.
- Não logar/expor dados reais de clientes em console em produção.
- Não executar deploy (Firebase/Docker) sem autorização explícita.
- Não introduzir dependência nova sem avaliar risco/necessidade.
