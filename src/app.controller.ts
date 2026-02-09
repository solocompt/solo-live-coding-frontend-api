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
          .container { max-width: 1000px; margin: 50px auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
          .logo { max-width: 200px; margin-bottom: 20px; }
          h1 { color: #2c3e50; margin-bottom: 10px; }
          p { color: #666; font-size: 1.1em; }
          .cards { display: flex; justify-content: center; gap: 30px; margin-top: 40px; flex-wrap: wrap; }
          .card { flex: 1; min-width: 250px; max-width: 300px; padding: 30px; border: 1px solid #eee; border-radius: 8px; transition: transform 0.2s, box-shadow 0.2s; text-decoration: none; color: inherit; display: flex; flex-direction: column; align-items: center; background: #fff; }
          .card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); border-color: #3498db; }
          .card h2 { margin-top: 0; color: #3498db; margin-bottom: 10px; font-size: 1.5em; }
          .icon { font-size: 3em; margin-bottom: 15px; display: block; }
          .desc { font-size: 0.9em; color: #888; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="${baseUrl}/public/solo-logo.png" alt="Solo Logo" class="logo">
          <h1>Solo Live Coding API</h1>
          <p>Select the documentation tool you want to use:</p>
          <div class="cards">
            <a href="${baseUrl}/docs/rest" class="card">
              <span class="icon">📄</span>
              <h2>REST Docs</h2>
              <p>Modern API Reference (Scalar)</p>
              <span class="desc">Interactive REST documentation</span>
            </a>
            <a href="${baseUrl}/docs/graphql" class="card">
              <span class="icon">ℹ️</span>
              <h2>GraphQL Info</h2>
              <p>Usage & Information</p>
              <span class="desc">General guide for GraphQL API</span>
            </a>
            <a href="${baseUrl}/graphql" class="card">
              <span class="icon">🎮</span>
              <h2>Playground</h2>
              <p>GraphQL Playground</p>
              <span class="desc">Interactive GraphQL IDE</span>
            </a>
          </div>
        </div>
      </body>
      </html>
    `);
  }

  @Get('docs/graphql')
  graphqlDocs(@Req() req: Request, @Res() res: Response) {
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GraphQL API Documentation</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f9; color: #333; line-height: 1.6; }
          .container { max-width: 800px; margin: 50px auto; padding: 40px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
          .logo { max-width: 150px; margin-bottom: 20px; }
          h1 { color: #2c3e50; margin: 0; }
          h2 { color: #3498db; margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
          code { background: #f0f0f0; padding: 2px 5px; border-radius: 4px; font-family: monospace; color: #e74c3c; }
          pre { background: #2c3e50; color: #fff; padding: 15px; border-radius: 8px; overflow-x: auto; }
          .btn { display: inline-block; background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; transition: background 0.3s; }
          .btn:hover { background: #2980b9; }
          ul { padding-left: 20px; }
          li { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${baseUrl}/public/solo-logo.png" alt="Solo Logo" class="logo">
            <h1>GraphQL API Documentation</h1>
          </div>
          
          <p>Welcome to the Solo Live Coding GraphQL API. This API provides a flexible interface to query and mutate data.</p>
          
          <h2>🚀 Getting Started</h2>
          <p>The GraphQL endpoint is available at:</p>
          <pre>${baseUrl}/graphql</pre>
          
          <p>You can use the <strong>GraphQL Playground</strong> to explore the schema, run queries, and test mutations interactively.</p>
          <a href="${baseUrl}/graphql" class="btn">Open Playground</a>

          <h2>📚 Key Concepts</h2>
          <ul>
            <li><strong>Queries:</strong> Use queries to fetch data (e.g., getting user profile, listing todos).</li>
            <li><strong>Mutations:</strong> Use mutations to modify data (e.g., signup, login, create todo).</li>
            <li><strong>Authentication:</strong> Most operations require a Bearer token. Authenticate via <code>login</code> or <code>signup</code> mutations first.</li>
          </ul>

          <h2>🔐 Authentication</h2>
          <p>To access protected resources:</p>
          <ol>
            <li>Run <code>signup</code> or <code>login</code> mutation to get an <code>accessToken</code>.</li>
            <li>Include the token in the HTTP Authorization header:</li>
          </ol>
          <pre>Authorization: Bearer &lt;your-access-token&gt;</pre>

          <h2>📝 Example Query</h2>
          <pre>
query {
  currentUser {
    id
    email
    name
  }
}</pre>

          <div style="text-align: center; margin-top: 50px; color: #888;">
            <a href="${baseUrl}/" style="color: #3498db; text-decoration: none;">&larr; Back to Hub</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }
}
