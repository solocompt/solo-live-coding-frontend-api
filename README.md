![Solo Logo](./solo-logo.png)

# Solo Live Coding API

Este repositório contém a API Backend utilizada como base para o desafio técnico de Frontend da Solo. O objetivo deste projeto é fornecer uma infraestrutura robusta e completa para que os candidatos possam demonstrar as suas competências na construção de interfaces modernas, integração com APIs GraphQL e gestão de estado.

## Contexto

Esta aplicação é uma API desenvolvida em **NestJS** que simula um sistema de gestão de tarefas (To-Do List) com funcionalidades avançadas. O candidato deverá desenvolver uma aplicação Frontend que consuma esta API, implementando fluxos de autenticação, gestão de utilizadores e manipulação de tarefas.

## Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias modernas e padrões de mercado:

- **Framework**: NestJS
- **Linguagem**: TypeScript
- **API**: GraphQL (Code First)
- **Base de Dados**: SQLite (para facilidade de configuração local)
- **ORM**: TypeORM
- **Autenticação**: JWT (JSON Web Tokens) com Access e Refresh Tokens
- **Testes**: Jest (Unitários e Integração)

## Funcionalidades da API

A API expõe as seguintes funcionalidades através de um endpoint GraphQL:

### Autenticação

- **Registo (Signup)**: Criação de nova conta.
- **Login**: Autenticação com email e password.
- **Refresh Token**: Renovação de sessão sem necessidade de novo login.
- **Logout**: Terminar a sessão.

### Utilizadores

- **CRUD Completo**: Criar, Ler, Atualizar e Remover utilizadores.
- **Paginação**: Listagem otimizada de utilizadores.
- **Validação**: Verificação de email único e complexidade de password.

### Tarefas (Todos)

- **Gestão de Tarefas**: Criar, editar, listar e apagar tarefas.
- **Atribuição**: Possibilidade de criar tarefas para si próprio ou atribuir a outros utilizadores.
- **Data de Expiração**: Definição de prazos para as tarefas.
- **Paginação**: Listagem paginada para grandes volumes de dados.
- **Segurança**: Apenas o dono da tarefa (ou quem a criou) pode vê-la ou editá-la.

## Configuração e Instalação

Siga os passos abaixo para colocar a API a correr, seja num ambiente local para avaliação ou num servidor de testes/staging.

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório e entre na pasta do projeto:

   ```bash
   cd solo-live-coding-frontend-api
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

### Configuração da Base de Dados

O projeto utiliza SQLite, pelo que não é necessário instalar um servidor de base de dados externo. No entanto, é necessário correr as migrações para criar as tabelas:

```bash
npm run migration:run
```

### Executar a Aplicação

**Modo Desenvolvimento (Local):**
Para iniciar o servidor com hot-reload para testes rápidos:

```bash
npm run start:dev
```

**Modo Produção (Servidor):**
Para executar num servidor de testes ou ambiente estável:

```bash
npm run build
npm run start:prod
```

A aplicação ficará disponível em `http://localhost:3000`.

## Documentação da API (GraphQL Playground)

Uma vez que a aplicação esteja a correr, pode aceder ao **GraphQL Playground** para explorar a documentação interativa (Schema) e testar queries/mutations diretamente:

- **URL**: [http://localhost:3000/graphql](http://localhost:3000/graphql)

Esta é a principal fonte de verdade para os tipos de dados, argumentos necessários e estruturas de retorno.

## Testes

Para garantir a integridade da API, pode executar os testes automatizados incluídos:

```bash
# Testes unitários e de integração
npm test
```

## O Desafio Frontend

O candidato deve utilizar esta API para construir uma aplicação web que cubra os seguintes requisitos (detalhes completos no enunciado do desafio):

1. **Autenticação**: Ecrãs de login e registo.
2. **Dashboard**: Listagem das tarefas do utilizador.
3. **Gestão**: Criar novas tarefas, marcar como concluídas e apagar.
4. **Funcionalidades Extra**: Paginação e atribuição de tarefas a outros utilizadores.

Boa sorte!
