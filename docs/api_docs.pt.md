# Documentação da API

Este documento fornece informações detalhadas sobre a API Solo Live Coding, abrangendo as interfaces REST e GraphQL.

## Visão Geral

A API é construída com NestJS e oferece duas formas principais de interagir com os dados:

1. **API REST**: Endpoints HTTP padrão para gestão de recursos.
2. **API GraphQL**: Uma linguagem de consulta flexível para leitura e mutação de dados.

Ambas as interfaces partilham a mesma lógica de negócio e mecanismos de autenticação subjacentes.

---

## Autenticação

A autenticação é gerida via **JWT (JSON Web Tokens)**.

### Fluxo de Autenticação

1. **Login/Registo**: O utilizador fornece credenciais e recebe um `accessToken` (curta duração) e um `refreshToken` (longa duração).
2. **Acesso a Recursos Protegidos**: Envie o `accessToken` no cabeçalho `Authorization`:
   ```http
   Authorization: Bearer <seu_access_token>
   ```
3. **Refresh Token**: Quando o `accessToken` expira (401 Unauthorized), use o `refreshToken` para obter um novo par de tokens.

---

## API REST

URL Base: `http://localhost:3000` (local) ou URL do servidor configurado.

### Documentação (Scalar)

A documentação interativa da API está disponível em:

- **URL**: `http://localhost:3000/docs`
- **Funcionalidades**: Experimentar (Try-it-out), exploração de esquema, trechos de código.

### Padrões Comuns

#### Paginação

A API REST utiliza uma estratégia de paginação baseada em página para grandes coleções (ex: Tarefas).

- **Parâmetros de Consulta**:
  - `page`: Número da página (inicia em 1, padrão: 1)
  - `limit`: Itens por página (máx 20, padrão: 10)
- **Estrutura da Resposta**:
  A API retorna a lista crua de itens para a página solicitada. Metadados (contagem total, próxima página) são atualmente geridos via cabeçalhos ou simplificados para esta implementação específica.

#### Melhores Práticas Implementadas

- **IDs na URL**: IDs de recursos são passados no caminho da URL (ex: `/todos/:id`) para atualizações/remoções.
- **Payloads de Corpo**: Payloads de atualização NÃO requerem o ID no corpo.
- **Validação**: Pipes de validação estrita garantem a integridade dos dados.

### Endpoints

#### Autenticação

- `POST /auth/signup`: Registar um novo utilizador.
- `POST /auth/login`: Login com email/password.
- `POST /auth/refresh`: Atualizar tokens de acesso.
- `POST /auth/logout`: Logout do utilizador.
- `GET /auth/me`: Obter perfil do utilizador atual.

#### Utilizadores

- `GET /users`: Listar utilizadores (paginado).
- `GET /users/:id`: Obter detalhes do utilizador.
- `POST /users`: Criar utilizador (admin/interno).

#### Tarefas (Todos)

- `GET /todos`: Listar tarefas (paginado).
  - params: `?page=1&limit=10`
- `GET /todos/:id`: Obter tarefa específica.
- `POST /todos`: Criar uma tarefa.
- `PATCH /todos/:id`: Atualizar uma tarefa.
- `DELETE /todos/:id`: Apagar uma tarefa.

---

## API GraphQL

Endpoint: `http://localhost:3000/graphql`

### Playground

O GraphQL Playground interativo está disponível na mesma URL: `http://localhost:3000/graphql`.
O esquema inclui descrições detalhadas para todos os tipos, queries e mutations.

### Visão Geral do Esquema

#### Tipos

- **User**: Representa um utilizador registado.
- **Todo**: Representa um item de tarefa.
- **AuthResponse**: Contém tokens e informações do utilizador.
- **PaginatedTodo / PaginatedUser**: Tipos wrapper para resultados de paginação.

### Operações

#### Queries

- `me`: Obter utilizador autenticado atual.
- `users(skip: Int, take: Int)`: Obter utilizadores com paginação baseada em deslocamento (offset).
- `todos(skip: Int, take: Int)`: Obter tarefas com paginação baseada em deslocamento (offset).
- `todo(id: String)`: Obter uma tarefa específica.

#### Mutations

- `signup(signupInput: ...)`: Registar.
- `login(loginInput: ...)`: Login.
- `createTodo(createTodoInput: ...)`: Criar tarefa.
- `updateTodo(updateTodoInput: ...)`: Atualizar tarefa.
- `removeTodo(id: String)`: Apagar tarefa.

### Diferença na Paginação

Note que o GraphQL usa **Paginação Baseada em Deslocamento** (`skip`/`take`) diretamente nos argumentos, enquanto a API REST abstrai isso em parâmetros de consulta `page`/`limit` para conveniência do cliente.

---

## Tratamento de Erros

- **401 Unauthorized**: Token inválido ou expirado.
- **400 Bad Request**: Falha na validação (verifique a mensagem de resposta).
- **404 Not Found**: Recurso não existe.
- **403 Forbidden**: Permissões insuficientes (ex: aceder à tarefa de outro utilizador).
