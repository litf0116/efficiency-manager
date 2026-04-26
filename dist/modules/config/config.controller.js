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
exports.ConfigController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_service_1 = require("./config.service");
const config_dto_1 = require("./dto/config.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const client_1 = require("@prisma/client");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let ConfigController = class ConfigController {
    constructor(configService) {
        this.configService = configService;
    }
    getCurrentWeek() {
        return this.configService.getCurrentWeek();
    }
    getThresholds() {
        return this.configService.getThresholds();
    }
    updateThresholds(dto) {
        return this.configService.updateThresholds(dto);
    }
    getStdEfficiency() {
        return this.configService.getStdEfficiency();
    }
    updateStdEfficiency(dto) {
        return this.configService.updateStdEfficiency(dto);
    }
};
exports.ConfigController = ConfigController;
__decorate([
    (0, common_1.Get)('current-week'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: '获取当前周' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigController.prototype, "getCurrentWeek", null);
__decorate([
    (0, common_1.Get)('thresholds'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: '获取阈值配置' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigController.prototype, "getThresholds", null);
__decorate([
    (0, common_1.Put)('thresholds'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '更新阈值配置' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [config_dto_1.UpdateConfigDto]),
    __metadata("design:returntype", void 0)
], ConfigController.prototype, "updateThresholds", null);
__decorate([
    (0, common_1.Get)('std-efficiency'),
    (0, swagger_1.ApiOperation)({ summary: '获取标准人效配置' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigController.prototype, "getStdEfficiency", null);
__decorate([
    (0, common_1.Put)('std-efficiency/:id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '更新标准人效' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConfigController.prototype, "updateStdEfficiency", null);
exports.ConfigController = ConfigController = __decorate([
    (0, swagger_1.ApiTags)('系统配置'),
    (0, common_1.Controller)('config'),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], ConfigController);
//# sourceMappingURL=config.controller.js.map