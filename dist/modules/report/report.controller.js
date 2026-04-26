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
exports.ReportController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const report_service_1 = require("./report.service");
const report_dto_1 = require("./dto/report.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const client_1 = require("@prisma/client");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let ReportController = class ReportController {
    constructor(reportService) {
        this.reportService = reportService;
    }
    submit(dto, req) {
        return this.reportService.submit(dto, req.user);
    }
    getByTeam(teamId) {
        return this.reportService.getByTeam(teamId);
    }
    getMine(teamId, req) {
        return this.reportService.getMine(req.user, teamId);
    }
    getByWeek(year, week, req) {
        return this.reportService.getByWeek(year, week, req.user);
    }
    update(id, dto, req) {
        return this.reportService.update(id, dto, req.user);
    }
    getAll(year, month, teamId, warehouseId) {
        return this.reportService.getAll({ year, month, teamId, warehouseId });
    }
    audit(id, dto) {
        return this.reportService.audit(id, dto);
    }
    getMonthly(year, month, teamId) {
        return this.reportService.getMonthly(+year, +month, teamId);
    }
};
exports.ReportController = ReportController;
__decorate([
    (0, common_1.Post)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: '提交周报' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_dto_1.SubmitReportDto, Object]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)('week'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: '获取某小组周报' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "getByTeam", null);
__decorate([
    (0, common_1.Get)('mine'),
    (0, swagger_1.ApiOperation)({ summary: '我的上报记录' }),
    __param(0, (0, common_1.Query)('teamId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "getMine", null);
__decorate([
    (0, common_1.Get)('week/:year/:week'),
    (0, swagger_1.ApiOperation)({ summary: '获取某周我的数据' }),
    __param(0, (0, common_1.Param)('year')),
    __param(1, (0, common_1.Param)('week')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "getByWeek", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '修改我的上报' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, report_dto_1.UpdateReportDto, Object]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.ADMIN, client_1.Role.FINANCE),
    (0, swagger_1.ApiOperation)({ summary: '所有人效数据(管理)' }),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('teamId')),
    __param(3, (0, common_1.Query)('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "getAll", null);
__decorate([
    (0, common_1.Put)(':id/audit'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.Role.ADMIN, client_1.Role.FINANCE),
    (0, swagger_1.ApiOperation)({ summary: '审核数据' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, report_dto_1.AuditReportDto]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "audit", null);
__decorate([
    (0, common_1.Get)('monthly'),
    (0, swagger_1.ApiOperation)({ summary: '月度汇总' }),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], ReportController.prototype, "getMonthly", null);
exports.ReportController = ReportController = __decorate([
    (0, swagger_1.ApiTags)('周报管理'),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [report_service_1.ReportService])
], ReportController);
//# sourceMappingURL=report.controller.js.map