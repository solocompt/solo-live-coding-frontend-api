import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('docs')
export class DocsController {
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
