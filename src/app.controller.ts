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
        <title>Solo API Portal</title>
        <style>
          :root {
            --primary: #0f172a;
            --secondary: #64748b;
            --accent: #3b82f6;
            --bg: #f8fafc;
            --card-bg: #ffffff;
            --border: #e2e8f0;
            --hover-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          }
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--bg);
            color: var(--primary);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .container {
            width: 100%;
            max-width: 900px;
            padding: 2rem;
            text-align: center;
          }
          .logo {
            height: 60px;
            width: auto;
            margin-bottom: 2rem;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
          }
          h1 {
            font-size: 2.5rem;
            font-weight: 800;
            margin: 0 0 1rem 0;
            letter-spacing: -0.025em;
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .subtitle {
            color: var(--secondary);
            font-size: 1.125rem;
            margin-bottom: 3.5rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.6;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            width: 100%;
            padding: 0 1rem;
          }
          .card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 2.5rem;
            text-decoration: none;
            color: inherit;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            overflow: hidden;
          }
          .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, var(--accent), #60a5fa);
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .card:hover {
            transform: translateY(-5px);
            box-shadow: var(--hover-shadow);
            border-color: transparent;
          }
          .card:hover::before {
            opacity: 1;
          }
          .icon {
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
            background: #eff6ff;
            width: 72px;
            height: 72px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 20px;
            color: var(--accent);
            transition: transform 0.3s ease;
          }
          .card:hover .icon {
            transform: scale(1.1) rotate(5deg);
          }
          .card h2 {
            font-size: 1.25rem;
            font-weight: 700;
            margin: 0 0 0.75rem 0;
            color: #1e293b;
          }
          .card p {
            color: var(--secondary);
            font-size: 0.95rem;
            margin: 0;
            line-height: 1.5;
          }
          .badge {
            position: absolute;
            top: 1.25rem;
            right: 1.25rem;
            background: #ecfdf5;
            color: #059669;
            font-size: 0.75rem;
            padding: 0.35rem 0.75rem;
            border-radius: 9999px;
            font-weight: 600;
            letter-spacing: 0.025em;
          }
          footer {
            margin-top: 5rem;
            font-size: 0.875rem;
            color: #94a3b8;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="${baseUrl}/public/solo-logo.png" alt="Solo Logo" class="logo">
          <h1>Developer Portal</h1>
          <p class="subtitle">Welcome to the Solo Live Coding API ecosystem. Select a tool below to start exploring and integrating with our services.</p>
          
          <div class="grid">
            <a href="${baseUrl}/docs/rest" class="card">
              <div class="icon">📄</div>
              <h2>REST Documentation</h2>
              <p>Comprehensive API reference powered by Scalar. Complete with request examples and schema definitions.</p>
            </a>
            
            <a href="${baseUrl}/graphql" class="card">
              <span class="badge">Interactive</span>
              <div class="icon">⚡</div>
              <h2>GraphQL Playground</h2>
              <p>Real-time GraphiQL IDE. Explore the schema, run queries, and test mutations instantly.</p>
            </a>
          </div>

          <footer>
            &copy; ${new Date().getFullYear()} Solo Live Coding. All rights reserved.
          </footer>
        </div>
      </body>
      </html>
    `);
  }
}
