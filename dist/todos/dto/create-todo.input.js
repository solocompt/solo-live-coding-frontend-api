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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTodoInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
let CreateTodoInput = class CreateTodoInput {
    content;
    expiresAt;
    userId;
};
exports.CreateTodoInput = CreateTodoInput;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The content of the todo', example: 'Buy groceries' }),
    (0, graphql_1.Field)(() => String, { description: 'The content of the todo' }),
    (0, class_validator_1.IsString)({ message: 'Content must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Content is required' }),
    __metadata("design:type", String)
], CreateTodoInput.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expiration date of the todo', example: '2024-12-31T23:59:59Z' }),
    (0, graphql_1.Field)(() => Date, { nullable: true, description: 'Expiration date of the todo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)({ message: 'ExpiresAt must be a valid date' }),
    __metadata("design:type", Date)
], CreateTodoInput.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID of the user to assign the todo to' }),
    (0, graphql_1.Field)(() => String, { nullable: true, description: 'ID of the user to assign the todo to' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'UserId must be a valid UUID' }),
    __metadata("design:type", String)
], CreateTodoInput.prototype, "userId", void 0);
exports.CreateTodoInput = CreateTodoInput = __decorate([
    (0, graphql_1.InputType)()
], CreateTodoInput);
//# sourceMappingURL=create-todo.input.js.map