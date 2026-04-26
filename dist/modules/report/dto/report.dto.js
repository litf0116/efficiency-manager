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
exports.AuditReportDto = exports.UpdateReportDto = exports.SubmitReportDto = exports.ReportDetailDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ReportDetailDto {
}
exports.ReportDetailDto = ReportDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'inbound' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportDetailDto.prototype, "module", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '新品入库' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportDetailDto.prototype, "operation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '件' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportDetailDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8903 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ReportDetailDto.prototype, "quantity", void 0);
class SubmitReportDto {
}
exports.SubmitReportDto = SubmitReportDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SubmitReportDto.prototype, "teamId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2025 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubmitReportDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubmitReportDto.prototype, "week", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-06-16' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SubmitReportDto.prototype, "reportDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 24 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubmitReportDto.prototype, "totalHeadcount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 15 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SubmitReportDto.prototype, "formalWorkers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 9 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SubmitReportDto.prototype, "contractWorkers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ReportDetailDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReportDetailDto),
    __metadata("design:type", Array)
], SubmitReportDto.prototype, "details", void 0);
class UpdateReportDto {
}
exports.UpdateReportDto = UpdateReportDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2025 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateReportDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 26 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateReportDto.prototype, "week", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-06-23' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateReportDto.prototype, "reportDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 26 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateReportDto.prototype, "totalHeadcount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 16 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateReportDto.prototype, "formalWorkers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateReportDto.prototype, "contractWorkers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [ReportDetailDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReportDetailDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateReportDto.prototype, "details", void 0);
class AuditReportDto {
}
exports.AuditReportDto = AuditReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['APPROVED', 'REJECTED'] }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AuditReportDto.prototype, "status", void 0);
//# sourceMappingURL=report.dto.js.map