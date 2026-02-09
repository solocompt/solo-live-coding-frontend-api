# API Documentation

This document provides detailed information about the Solo Live Coding API, covering both REST and GraphQL interfaces.

## Overview

The API is built with NestJS and provides two primary ways to interact with the data:

1. **REST API**: Standard HTTP endpoints for resource management.
2. **GraphQL API**: A flexible query language for reading and mutating data.

Both interfaces share the same underlying business logic and authentication mechanisms.

---

## Authentication

Authentication is handled via **JWT (JSON Web Tokens)**.

### Auth Flow

1. **Login/Signup**: User provides credentials and receives an `accessToken` (short-lived) and a `refreshToken` (long-lived).
2. **Access Protected Resources**: Send the `accessToken` in the `Authorization` header:
   ```http
   Authorization: Bearer <your_access_token>
   ```
3. **Refresh Token**: When the `accessToken` expires (401 Unauthorized), use the `refreshToken` to obtain a new pair of tokens.

---

## REST API

Base URL: `http://localhost:3000` (local) or configured server URL.

### Documentation (Scalar)

Interactive API documentation is available at:

- **URL**: `http://localhost:3000/docs`
- **Features**: Try-it-out, schema exploration, code snippets.

### Common Patterns

#### Pagination

The REST API uses a page-based pagination strategy for large collections (e.g., Todos).

- **Query Parameters**:
  - `page`: Page number (starts at 1, default: 1)
  - `limit`: Items per page (max 20, default: 10)
- **Response Structure**:
  The API returns the raw list of items for the requested page. Metadata (total count, next page) is currently handled via headers or simplified for this specific implementation.

#### Best Practices implemented

- **URL IDs**: Resource IDs are passed in the URL path (e.g., `/todos/:id`) for updates/deletes.
- **Body payloads**: Update payloads do NOT require the ID in the body.
- **Validation**: Strict validation pipes ensure data integrity.

### Endpoints

#### Authentication

- `POST /auth/signup`: Register a new user.
- `POST /auth/login`: Login with email/password.
- `POST /auth/refresh`: Refresh access tokens.
- `POST /auth/logout`: Logout user.
- `GET /auth/me`: Get current user profile.

#### Users

- `GET /users`: List users (paginated).
- `GET /users/:id`: Get user details.
- `POST /users`: Create user (admin/internal).

#### Todos

- `GET /todos`: List todos (paginated).
  - params: `?page=1&limit=10`
- `GET /todos/:id`: Get specific todo.
- `POST /todos`: Create a todo.
- `PATCH /todos/:id`: Update a todo.
- `DELETE /todos/:id`: Delete a todo.

---

## GraphQL API

Endpoint: `http://localhost:3000/graphql`

### Playground

Interactive GraphQL Playground is available at the same URL: `http://localhost:3000/graphql`.
The schema includes detailed descriptions for all types, queries, and mutations.

### Schema Overview

#### Types

- **User**: Represents a registered user.
- **Todo**: Represents a task item.
- **AuthResponse**: Contains tokens and user info.
- **PaginatedTodo / PaginatedUser**: Wrapper types for pagination results.

### Operations

#### Queries

- `me`: Get current authenticated user.
- `users(skip: Int, take: Int)`: Get users with offset-based pagination.
- `todos(skip: Int, take: Int)`: Get todos with offset-based pagination.
- `todo(id: String)`: Get a specific todo.

#### Mutations

- `signup(signupInput: ...)`: Register.
- `login(loginInput: ...)`: Login.
- `createTodo(createTodoInput: ...)`: Create task.
- `updateTodo(updateTodoInput: ...)`: Update task.
- `removeTodo(id: String)`: Delete task.

### Pagination Difference

Note that GraphQL uses **Offset-based Pagination** (`skip`/`take`) directly in the arguments, whereas the REST API abstracts this into `page`/`limit` query parameters for client convenience.

---

## Error Handling

- **401 Unauthorized**: Invalid or expired token.
- **400 Bad Request**: Validation failed (check response message).
- **404 Not Found**: Resource does not exist.
- **403 Forbidden**: insufficient permissions (e.g. accessing another user's todo).
