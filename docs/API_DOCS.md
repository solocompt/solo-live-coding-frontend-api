# Documentacao da API GraphQL

Este documento detalha os recursos disponiveis na API GraphQL da Solo Todo App. A API utiliza uma abordagem Code-First e fornece operacoes de leitura (Queries) e escrita (Mutations).

## Endpoint

*   **URL Base:** `https://<seu-dominio>/graphql` (ou `http://localhost:3000/graphql` localmente)
*   **Playground:** Disponivel no mesmo URL para exploracao interativa.

## Autenticacao

A maioria das operacoes requer autenticacao via **Bearer Token**.
Apos o login ou registo, o token JWT (accessToken) deve ser enviado no header da requisicao.

**Header:**
`Authorization: Bearer <seu_access_token>`

## Tipos Comuns

### Paginacao
Muitas listas utilizam um sistema de paginacao padrao baseada em offset.

**Argumentos de Paginacao (PaginationArgs):**
*   `skip` (Int, opcional): Numero de itens a pular (default: 0).
*   `take` (Int, opcional): Numero de itens a retornar (default: 10, max: 100).

**Resposta Paginada (PaginatedResult):**
*   `items`: Lista dos objectos solicitados.
*   `total` (Int): Numero total de itens disponiveis na base de dados.
*   `hasNextPage` (Boolean): Indica se existem mais paginas para carregar.

---

## Modulo: Autenticacao (Auth)

Responsavel pela gestao de acesso e sessoes.

### Mutations

#### 1. Signup (Registo)
Cria uma nova conta de utilizador.

*   **Nome:** `signup`
*   **Argumentos (SignupInput):**
    *   `name` (String, obrigatorio): Nome completo.
    *   `email` (String, obrigatorio): Email valido (unico).
    *   `password` (String, obrigatorio): Palavra-passe forte (min 8 caracteres, letras, numeros e simbolos).
*   **Retorno (AuthResponse):**
    *   `user`: Objecto do utilizador criado.
    *   `accessToken`: Token JWT para acesso imediato.
    *   `refreshToken`: Token para renovacao de sessao.

#### 2. Login
Autentica um utilizador existente.

*   **Nome:** `login`
*   **Argumentos (LoginInput):**
    *   `email` (String, obrigatorio).
    *   `password` (String, obrigatorio).
*   **Retorno (AuthResponse):** `user`, `accessToken`, `refreshToken`.

#### 3. Refresh Token
Renova o access token expirado usando um refresh token valido.

*   **Nome:** `refreshTokens`
*   **Argumentos:**
    *   `refreshToken` (String, obrigatorio): O token de refresh recebido no login/signup. (Nota: Deve ser enviado no header Authorization como Bearer tambem).
*   **Retorno (AuthResponse):** Novos `accessToken` e `refreshToken`.

#### 4. Logout
Invalida a sessao atual.

*   **Nome:** `logout`
*   **Retorno:** Boolean (true se sucesso).

---

## Modulo: Utilizadores (Users)

Gestao de perfis de utilizador.

### Queries

#### 1. Listar Utilizadores (users)
Retorna uma lista paginada de utilizadores. Util para funcionalidade de atribuicao de tarefas.

*   **Nome:** `users`
*   **Argumentos:** `paginationArgs` (skip, take).
*   **Retorno:** `PaginatedUser` (items: [User], total, hasNextPage).

#### 2. Obter Utilizador (user)
Retorna detalhes de um utilizador especifico.

*   **Nome:** `user`
*   **Argumentos:** `id` (String, UUID).
*   **Retorno:** Objecto `User`.

### Mutations

#### 1. Atualizar Utilizador (updateUser)
Atualiza os dados do utilizador autenticado ou de outro (se tiver permissoes).

*   **Nome:** `updateUser`
*   **Argumentos (UpdateUserInput):**
    *   `id` (String, obrigatorio).
    *   `name` (String, opcional).
    *   `email` (String, opcional).
*   **Retorno:** Objecto `User` atualizado.

#### 2. Remover Utilizador (removeUser)
Remove um utilizador do sistema.

*   **Nome:** `removeUser`
*   **Argumentos:** `id` (String).
*   **Retorno:** Objecto `User` removido.

---

## Modulo: Tarefas (Todos)

O nucleo da aplicacao. Permite gerir tarefas pessoais e atribuidas.

### Objecto Todo (Campos)
*   `id` (ID): Identificador unico UUID.
*   `content` (String): O texto/conteudo da tarefa.
*   `isCompleted` (Boolean): Estado da tarefa.
*   `expiresAt` (Date): Data de validade da tarefa (opcional).
*   `userId` (String): ID do dono da tarefa.
*   `user` (User): Objecto do utilizador dono (relacao).
*   `createdAt` (Date): Data de criacao.
*   `updatedAt` (Date): Data de atualizacao.

### Queries

#### 1. Listar Tarefas (todos)
Retorna as tarefas do utilizador autenticado.

*   **Nome:** `todos`
*   **Argumentos:** `paginationArgs` (skip, take).
*   **Retorno:** `PaginatedTodo` (items: [Todo], total, hasNextPage).

### Mutations

#### 1. Criar Tarefa (createTodo)
Cria uma nova tarefa. Pode ser para o proprio ou para outro utilizador.

*   **Nome:** `createTodo`
*   **Argumentos (CreateTodoInput):**
    *   `content` (String, obrigatorio): Descricao da tarefa.
    *   `expiresAt` (Date, opcional): Data limite (ISO 8601).
    *   `userId` (String, opcional): ID do utilizador a quem atribuir a tarefa. Se omitido, atribui ao proprio criador.
*   **Retorno:** Objecto `Todo` criado.

#### 2. Atualizar Tarefa (updateTodo)
Modifica uma tarefa existente.

*   **Nome:** `updateTodo`
*   **Argumentos (UpdateTodoInput):**
    *   `id` (String, obrigatorio).
    *   `content` (String, opcional).
    *   `isCompleted` (Boolean, opcional).
    *   `expiresAt` (Date, opcional).
    *   `userId` (String, opcional): Reatribuir a tarefa.
*   **Retorno:** Objecto `Todo` atualizado.

#### 3. Remover Tarefa (removeTodo)
Apaga uma tarefa definitivamente.

*   **Nome:** `removeTodo`
*   **Argumentos:** `id` (String).
*   **Retorno:** Objecto `Todo` removido.
