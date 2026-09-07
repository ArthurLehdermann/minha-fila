# Minha Fila - Backend (Laravel)

API REST + broadcast em tempo real do Minha Fila. Não é uma instalação Laravel genérica.

A documentação do projeto está na raiz do repositório, em [`../docs/`](../docs/):

- [BACKEND](../docs/BACKEND.md) - estrutura, modelo de dados e testes
- [API](../docs/API.md) - endpoints
- [BILLING](../docs/BILLING.md) - Mercado Pago
- [ENVIRONMENT](../docs/ENVIRONMENT.md) - variáveis de ambiente
- [ARCHITECTURE](../docs/ARCHITECTURE.md) - visão técnica

## Rodar os testes

```sh
php artisan test
```

Usa SQLite em memória (ver `phpunit.xml`). Requer a extensão `bcmath` ou `gmp` (Sqids) para os testes de id de empresa.
