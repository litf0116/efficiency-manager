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
exports.TeamController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const team_service_1 = require("./team.service");
const team_dto_1 = require("./dto/team.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const client_1 = require("@prisma/client");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let TeamController = class TeamController {
    constructor(teamService) {
        this.teamService = teamService;
    }
    findAll(warehouseId) {
        return this.teamService.findAll(warehouseId);
    }
    findOne(id) {
        return this.teamService.findOne(id);
    }
    create(dto) {
        return this.teamService.create(dto);
    }
    update(id, dto) {
        return this.teamService.update(id, dto);
    }
    remove(id) {
        return this.teamService.remove(id);
    }
};
exports.TeamController = TeamController;
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: '获取小组列表' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '获取小组详情' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '创建小组' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [team_dto_1.CreateTeamDto]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '更新小组' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, team_dto_1.UpdateTeamDto]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '删除小组' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "remove", null);
exports.TeamController = TeamController = __decorate([
    (0, swagger_1.ApiTags)('小组管理'),
    (0, common_1.Controller)('teams'),
    __metadata("design:paramtypes", [team_service_1.TeamService])
], TeamController);
//# sourceMappingURL=team.controller.js.map