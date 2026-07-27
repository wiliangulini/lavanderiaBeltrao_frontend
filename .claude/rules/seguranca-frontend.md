# Rule — Segurança no frontend

Use sempre que a tarefa tocar environments, deploy, dados de clientes ou dependências.

## Fatos
- URLs de API ficam em `environment.ts` / `environment.prod.ts` (substituídos no build de produção). Não há config Firebase nesses arquivos.
- Firebase real é só de Hosting/deploy (`firebase.json`, `.firebaserc`, projeto `lavanderia-e5a18`). `@angular/fire` está no `package.json` mas hoje não há `AngularFireModule`/`firebaseConfig`/`initializeApp` em nenhum módulo do app — dependência instalada e não usada.
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
