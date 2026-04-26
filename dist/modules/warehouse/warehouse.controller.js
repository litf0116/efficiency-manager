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
exports.WarehouseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const warehouse_service_1 = require("./warehouse.service");
const warehouse_dto_1 = require("./dto/warehouse.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const client_1 = require("@prisma/client");
let WarehouseController = class WarehouseController {
    constructor(warehouseService) {
        this.warehouseService = warehouseService;
    }
    findAll() {
        return this.warehouseService.findAll();
    }
    findOne(id) {
        return this.warehouseService.findOne(id);
    }
    create(dto) {
        return this.warehouseService.create(dto);
    }
    update(id, dto) {
        return this.warehouseService.update(id, dto);
    }
    remove(id) {
        return this.warehouseService.remove(id);
    }
};
exports.WarehouseController = WarehouseController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: '获取仓库列表' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '获取仓库详情' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '创建仓库' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [warehouse_dto_1.CreateWarehouseDto]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '更新仓库' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, warehouse_dto_1.UpdateWarehouseDto]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: '删除仓库' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "remove", null);
exports.WarehouseController = WarehouseController = __decorate([
    (0, swagger_1.ApiTags)('仓库管理'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('warehouses'),
    __metadata("design:paramtypes", [warehouse_service_1.WarehouseService])
], WarehouseController);
//# sourceMappingURL=warehouse.controller.js.map