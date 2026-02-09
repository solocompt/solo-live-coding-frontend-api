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
exports.TodosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const todo_entity_1 = require("./entities/todo.entity");
const users_service_1 = require("../users/users.service");
let TodosService = class TodosService {
    todosRepository;
    usersService;
    constructor(todosRepository, usersService) {
        this.todosRepository = todosRepository;
        this.usersService = usersService;
    }
    async create(createTodoInput, currentUser) {
        let targetUser = currentUser;
        if (createTodoInput.userId) {
            targetUser = await this.usersService.findOne(createTodoInput.userId);
        }
        const todo = this.todosRepository.create({
            ...createTodoInput,
            user: targetUser,
            userId: targetUser.id,
        });
        return this.todosRepository.save(todo);
    }
    async findAll(user) {
        return this.todosRepository.find({
            where: { userId: user.id },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, user) {
        const todo = await this.todosRepository.findOne({ where: { id } });
        if (!todo) {
            throw new common_1.NotFoundException(`Todo with ID ${id} not found`);
        }
        if (todo.userId !== user.id) {
            throw new common_1.ForbiddenException('You do not have permission to access this todo');
        }
        return todo;
    }
    async update(id, updateTodoInput, user) {
        const todo = await this.findOne(id, user);
        const { id: _, ...updateData } = updateTodoInput;
        Object.assign(todo, updateData);
        return this.todosRepository.save(todo);
    }
    async remove(id, user) {
        const todo = await this.findOne(id, user);
        await this.todosRepository.remove(todo);
        return true;
    }
};
exports.TodosService = TodosService;
exports.TodosService = TodosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(todo_entity_1.Todo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], TodosService);
//# sourceMappingURL=todos.service.js.map