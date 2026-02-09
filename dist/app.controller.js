"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let AppController = class AppController {
    root(req, res) {
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
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "root", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiExcludeController)(),
    (0, common_1.Controller)()
], AppController);
//# sourceMappingURL=app.controller.js.map