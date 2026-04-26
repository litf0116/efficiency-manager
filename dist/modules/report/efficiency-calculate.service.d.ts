import { Decimal } from '@prisma/client/runtime/library';
export declare class EfficiencyCalculateService {
    calculate(details: Array<{
        module: string;
        operation: string;
        quantity: number;
        unit?: string;
    }>, totalHeadcount: number, stdEfficiencies: Array<{
        operation: string;
        stdRate: Decimal | number;
    }>): {
        totalOutput: number;
        stdOutput: number;
        efficiency: number;
    };
    calculateModuleEfficiency(details: Array<{
        module: string;
        operation?: string;
        quantity: number;
    }>, module: string, headcount: number, stdRates: Map<string, number>): number;
}
