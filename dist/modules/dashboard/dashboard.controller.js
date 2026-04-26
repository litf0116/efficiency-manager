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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dashboard_service_1 = require("./dashboard.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const common_2 = require("@nestjs/common");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getSummary() {
        return this.dashboardService.getSummary();
    }
    getRanking(year, month) {
        return this.dashboardService.getRanking(year, month);
    }
    getTrend(teamId, months) {
        return this.dashboardService.getTrend(teamId, months ? months * 4 : 12);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('summary'),
    (0, public_decorator_1.Public)(),
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: '汇总数据' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('ranking'),
    (0, public_decorator_1.Public)(),
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: '排名数据' }),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getRanking", null);
__decorate([
    (0, common_1.Get)('trend'),
    (0, public_decorator_1.Public)(),
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: '趋势数据' }),
    __param(0, (0, common_1.Query)('teamId')),
    __param(1, (0, common_1.Query)('months')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getTrend", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('数据看板'),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map