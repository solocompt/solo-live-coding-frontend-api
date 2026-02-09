import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('docs')
export class DocsController {
  @Get()
  root(@Res() res: Response) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API Documentation</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f9; color: #333; }
          .container { max-width: 800px; margin: 50px auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
          h1 { color: #2c3e50; }
          p { color: #666; font-size: 1.1em; }
          .cards { display: flex; justify-content: center; gap: 20px; margin-top: 40px; }
          .card { flex: 1; padding: 30px; border: 1px solid #eee; border-radius: 8px; transition: transform 0.2s, box-shadow 0.2s; text-decoration: none; color: inherit; display: block; }
          .card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); border-color: #3498db; }
          .card h2 { margin-top: 0; color: #3498db; }
          .icon { font-size: 3em; margin-bottom: 15px; display: block; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Solo Live Coding API</h1>
          <p>Select the documentation type you want to view:</p>
          <div class="cards">
            <a href="/docs/rest" class="card">
              <span class="icon">🔌</span>
              <h2>REST API</h2>
              <p>Swagger / OpenAPI Documentation</p>
            </a>
            <a href="/docs/graphql" class="card">
              <span class="icon">⚛️</span>
              <h2>GraphQL API</h2>
              <p>Interactive Playground</p>
            </a>
          </div>
        </div>
      </body>
      </html>
    `);
  }

  @Get('graphql')
  graphql(@Res() res: Response) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GraphQL API Documentation</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f9; color: #333; }
          .container { max-width: 800px; margin: 50px auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h1 { color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px; }
          p { line-height: 1.6; }
          .code-block { background: #282c34; color: #abb2bf; padding: 15px; border-radius: 5px; overflow-x: auto; font-family: 'Consolas', 'Monaco', monospace; margin: 20px 0; }
          .endpoint { font-size: 1.2em; font-weight: bold; color: #e83e8c; }
          .btn { display: inline-block; padding: 10px 20px; background-color: #e83e8c; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px; }
          .btn:hover { background-color: #d63384; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>GraphQL API Documentation</h1>
          <p>The GraphQL API provides a flexible interface to query and manipulate your data.</p>
          
          <h2>Endpoint</h2>
          <p>The GraphQL API is available at:</p>
          <div class="code-block">
            https://joel.solo-test.site/graphql
          </div>

          <h2>Interactive Playground</h2>
          <p>You can use the built-in GraphQL Playground to explore the schema, run queries, and test mutations interactively.</p>
          <a href="/graphql" class="btn" target="_blank">Open GraphQL Playground</a>

          <h2>Authentication</h2>
          <p>To access protected resources, you must include the <code>Authorization</code> header with your Bearer token:</p>
          <div class="code-block">
            {
              "Authorization": "Bearer YOUR_ACCESS_TOKEN"
            }
          </div>

          <h2>Example Query</h2>
          <div class="code-block">
            <pre>
query {
  findAllTodos {
    items {
      id
      content
      isCompleted
    }
  }
}
            </pre>
          </div>
        </div>
      </body>
      </html>
    `);
  }
}
