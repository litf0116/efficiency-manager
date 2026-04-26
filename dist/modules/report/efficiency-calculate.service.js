"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EfficiencyCalculateService = void 0;
const common_1 = require("@nestjs/common");
let EfficiencyCalculateService = class EfficiencyCalculateService {
    calculate(details, totalHeadcount, stdEfficiencies) {
        if (!details || details.length === 0) {
            return { totalOutput: 0, stdOutput: 0, efficiency: 0 };
        }
        let totalOutput = 0;
        let stdOutput = 0;
        for (const detail of details) {
            const stdEff = stdEfficiencies.find((s) => s.operation === detail.operation);
            const quantity = Number(detail.quantity) || 0;
            totalOutput += quantity;
            if (stdEff) {
                const rate = Number(stdEff.stdRate) || 0;
                stdOutput += rate * totalHeadcount;
            }
        }
        const efficiency = stdOutput > 0 ? totalOutput / stdOutput : 0;
        return {
            totalOutput,
            stdOutput,
            efficiency: Math.round(efficiency * 10000) / 10000,
        };
    }
    calculateModuleEfficiency(details, module, headcount, stdRates) {
        const moduleDetails = details.filter((d) => d.module === module);
        if (moduleDetails.length === 0)
            return 0;
        let totalOutput = 0;
        let stdOutput = 0;
        for (const detail of moduleDetails) {
            totalOutput += Number(detail.quantity) || 0;
            if (detail.operation) {
                const rate = stdRates.get(detail.operation) || 0;
                stdOutput += rate * headcount;
            }
        }
        return stdOutput > 0 ? Math.round((totalOutput / stdOutput) * 10000) / 10000 : 0;
    }
};
exports.EfficiencyCalculateService = EfficiencyCalculateService;
exports.EfficiencyCalculateService = EfficiencyCalculateService = __decorate([
    (0, common_1.Injectable)()
], EfficiencyCalculateService);
//# sourceMappingURL=efficiency-calculate.service.js.map