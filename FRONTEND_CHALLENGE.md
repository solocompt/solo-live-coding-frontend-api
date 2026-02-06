# Desafio Tecnico Frontend - Solo

Bem-vindo ao desafio tecnico para candidatos a desenvolvedor Frontend na Solo.

## Objetivo

Desenvolver uma aplicacao web para gestao de tarefas (To-Do List) que consuma a nossa API GraphQL. A aplicacao deve cobrir os fluxos de autenticacao e gestao de tarefas conforme documentado.

- **Endpoint da API:** `https://frontend-live-code.solo-test.site/graphql`
- **Tempo Limite:** 90 minutos (desde o inicio do teste ate a entrega).

## Requisitos Funcionais

A aplicacao deve implementar as interfaces e logica para interagir com os seguintes recursos da API (ver `API_DOCS.md` para detalhes tecnicos):

1.  **Autenticacao**
    - **Login:** Interface para autenticacao com email e password.
    - **Registo:** Interface para criacao de nova conta.
    - **Sessao:** Gestao do token JWT e proteccao de rotas privadas.

2.  **Gestao de Tarefas (Todos)**
    - **Listagem:** Exibir as tarefas do utilizador.
    - **Criacao:** Adicionar novas tarefas (com conteudo e data de expiracao opcional).
    - **Edicao:** Marcar como concluida/pendente e editar conteudo.
    - **Remocao:** Apagar tarefas.
    - **Atribuicao (Bonus):** Possibilidade de atribuir tarefas a outros utilizadores (usando a lista de utilizadores da API).

## Stack Tecnologica

- **Recomendado:** React ou Next.js.
- **Outras solucoes:** O uso de outras frameworks (Vue, Angular, Svelte, etc.) esta sujeito a aprovacao previa do avaliador. Por favor, questiona antes de iniciar se pretenderes usar outra tecnologia.
- **Estilos:** Livre escolha.

## Entrega e Fluxo de Trabalho

1.  **Repositorio:** Todo o desenvolvimento e commits devem ser feitos diretamente neste repositorio. Cria uma pasta `frontend` na raiz deste projeto para o teu código.
2.  **Commits:** Faz commits frequentes e com mensagens descritivas para demonstrar a evolucao do teu trabalho.
3.  **Finalizacao:** No final dos 90 minutos, garante que todo o teu codigo esta commitado e enviado (push) para a branch de trabalho.

Boa sorte!
