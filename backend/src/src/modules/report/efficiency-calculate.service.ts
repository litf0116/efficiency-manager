import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class EfficiencyCalculateService {
  calculate(
    details: Array<{ module: string; operation: string; quantity: number; unit?: string }>,
    totalHeadcount: number,
    stdEfficiencies: Array<{ operation: string; stdRate: Decimal | number }>,
  ) {
    if (!details || details.length === 0) {
      return { totalOutput: 0, stdOutput: 0, efficiency: 0 };
    }

    let totalOutput = 0;
    let stdOutput = 0;

    for (const detail of details) {
      const stdEff = stdEfficiencies.find(
        (s) => s.operation === detail.operation,
      );

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

  calculateModuleEfficiency(
    details: Array<{ module: string; operation?: string; quantity: number }>,
    module: string,
    headcount: number,
    stdRates: Map<string, number>,
  ) {
    const moduleDetails = details.filter((d) => d.module === module);
    if (moduleDetails.length === 0) return 0;

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
}
