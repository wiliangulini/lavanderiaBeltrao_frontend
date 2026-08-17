# Lavanderia Beltrão

Sistema administrativo para cadastro e gerenciamento de clientes e pedidos de uma lavanderia real, em uso na operação do cliente.

## Funcionalidades

- Cadastro e edição de clientes, com busca automática de endereço por CEP
- Gestão de pedidos vinculados a clientes
- Pesquisa e consulta de cadastros e pedidos
- Formulários com validação

## Stack

Angular 14 · Angular Material · Bootstrap 5 · RxJS

## Arquitetura

```
src/app/
  cadastro/          cadastro de clientes
  form-cliente/       formulário de cliente
  form-cadastro/      formulário de cadastro
  pedidos/             gestão de pedidos
  pesquisa/             busca e consulta
  busca-cep/            integração com API de CEP
  editar/                edição de registros
```

O backend (Java/Spring Boot) deste sistema é mantido em repositório privado, por conter dados operacionais do cliente.

## Instalação

```bash
git clone https://github.com/wiliangulini/lavanderiaBeltrao_frontend.git
cd lavanderiaBeltrao_frontend
npm install
ng serve
```

## Comandos

```bash
ng serve      # ambiente de desenvolvimento
ng build       # build de produção
ng test         # testes unitários (Karma/Jasmine)
```

## Contexto

Projeto profissional para cliente real, em manutenção e evolução contínua conforme demanda. Integra com um backend em Java/Spring Boot e MySQL, hospedado em VPS própria.
