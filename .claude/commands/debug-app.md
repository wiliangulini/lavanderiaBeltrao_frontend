---
description: Depuração estruturada de erro ou comportamento inesperado (frontend)
---

# debug-app

Use para investigar antes de editar.

## Passos
1. Entenda o sintoma: erro no console, falha de request (Network), tela quebrada, rota, ou stack do build.
2. Localize os arquivos prováveis (componente → serviço → módulo → environment/proxy).
3. Formule hipóteses ordenadas (ex.: URL de API errada, campo JSON divergente do backend, subscription não resolvida, import faltando no módulo, CORS).
4. Valide por leitura e comandos seguros (`npm run build`, `npm test`).
5. Corrija a menor causa confirmada.
6. Declare o que foi confirmado e o que não foi.

## Limites
- Não executar deploy para "reproduzir".
- Para erro de integração, confirmar o contrato no backend antes de mudar o frontend.

## Saída esperada
Causa provável, correção mínima e validação; hipóteses descartadas.
