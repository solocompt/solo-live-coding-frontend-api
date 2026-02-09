import { Controller, Get, Res, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  @Get()
  root(@Req() req: Request, @Res() res: Response) {
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API Documentation</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f9; color: #333; }
          .container { max-width: 900px; margin: 50px auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
          .logo { max-width: 200px; margin-bottom: 20px; }
          h1 { color: #2c3e50; margin-bottom: 10px; }
          p { color: #666; font-size: 1.1em; }
          .cards { display: flex; justify-content: center; gap: 30px; margin-top: 40px; flex-wrap: wrap; }
          .card { flex: 1; min-width: 280px; max-width: 350px; padding: 30px; border: 1px solid #eee; border-radius: 8px; transition: transform 0.2s, box-shadow 0.2s; text-decoration: none; color: inherit; display: flex; flex-direction: column; align-items: center; background: #fff; }
          .card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); border-color: #3498db; }
          .card h2 { margin-top: 0; color: #3498db; margin-bottom: 10px; }
          .icon { font-size: 3em; margin-bottom: 15px; display: block; }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="${baseUrl}/public/solo-logo.png" alt="Solo Logo" class="logo">
          <h1>Solo Live Coding API</h1>
          <p>Select the documentation tool you want to use:</p>
          <div class="cards">
            <a href="${baseUrl}/docs/rest" class="card">
              <span class="icon">🔌</span>
              <h2>REST API</h2>
              <p>Swagger / OpenAPI Documentation</p>
            </a>
            <a href="${baseUrl}/graphql" class="card">
              <span class="icon">⚛️</span>
              <h2>GraphQL API</h2>
              <p>Interactive Playground & Documentation</p>
            </a>
          </div>
        </div>
      </body>
      </html>
    `);
  }
}
