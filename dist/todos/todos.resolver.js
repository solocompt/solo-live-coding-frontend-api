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
exports.TodosResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const todos_service_1 = require("./todos.service");
const todo_entity_1 = require("./entities/todo.entity");
const create_todo_input_1 = require("./dto/create-todo.input");
const update_todo_input_1 = require("./dto/update-todo.input");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const paginated_todo_object_1 = require("./dto/paginated-todo.object");
const pagination_args_1 = require("../common/dto/pagination.args");
let TodosResolver = class TodosResolver {
    todosService;
    constructor(todosService) {
        this.todosService = todosService;
    }
    async findAll(user, paginationArgs) {
        return this.todosService.findAll(user, paginationArgs);
    }
    async findOne(id, user) {
        return this.todosService.findOne(id, user);
    }
    async createTodo(createTodoInput, user) {
        return this.todosService.create(createTodoInput, user);
    }
    async updateTodo(updateTodoInput, user) {
        return this.todosService.update(updateTodoInput.id, updateTodoInput, user);
    }
    async removeTodo(id, user) {
        return this.todosService.remove(id, user);
    }
};
exports.TodosResolver = TodosResolver;
__decorate([
    (0, graphql_1.Query)(() => paginated_todo_object_1.PaginatedTodo, { name: 'todos' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        pagination_args_1.PaginationArgs]),
    __metadata("design:returntype", Promise)
], TodosResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => todo_entity_1.Todo, { name: 'todo' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => String })),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], TodosResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Mutation)(() => todo_entity_1.Todo),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('createTodoInput')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_todo_input_1.CreateTodoInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], TodosResolver.prototype, "createTodo", null);
__decorate([
    (0, graphql_1.Mutation)(() => todo_entity_1.Todo),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('updateTodoInput')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_todo_input_1.UpdateTodoInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], TodosResolver.prototype, "updateTodo", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => String })),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], TodosResolver.prototype, "removeTodo", null);
exports.TodosResolver = TodosResolver = __decorate([
    (0, graphql_1.Resolver)(() => todo_entity_1.Todo),
    __metadata("design:paramtypes", [todos_service_1.TodosService])
], TodosResolver);
//# sourceMappingURL=todos.resolver.js.map