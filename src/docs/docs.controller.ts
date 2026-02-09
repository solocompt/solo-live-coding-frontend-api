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
      <html>
      <head>
        <title>GraphQL Playground</title>
        <link href="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/static/css/index.css" rel="stylesheet" />
        <link rel="shortcut icon" href="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/favicon.png" />
        <script src="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/static/js/middleware.js"></script>
      </head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('load', function (event) {
            GraphQLPlayground.init(document.getElementById('root'), {
              endpoint: '/graphql',
              settings: {
                'request.credentials': 'include',
              }
            })
          })
        </script>
      </body>
      </html>
    `);
  }
}
