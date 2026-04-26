import { ConfigService } from './config.service';
import { UpdateConfigDto } from './dto/config.dto';
export declare class ConfigController {
    private readonly configService;
    constructor(configService: ConfigService);
    getCurrentWeek(): {
        year: number;
        weekNumber: number;
        startDate: string;
        endDate: string;
    };
    getThresholds(): Promise<{
        efficiencyTarget: number;
        lowThreshold: number;
        highThreshold: number;
    }>;
    updateThresholds(dto: UpdateConfigDto): Promise<{
        efficiencyTarget: number;
        lowThreshold: number;
        highThreshold: number;
    }>;
    getStdEfficiency(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        status: number;
        createdAt: Date;
        description: string | null;
        module: string;
        operation: string;
        unit: string;
        stdRate: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    updateStdEfficiency(dto: {
        stdRate: number;
    }): Promise<{
        id: number;
        status: number;
        createdAt: Date;
        description: string | null;
        module: string;
        operation: string;
        unit: string;
        stdRate: import("@prisma/client/runtime/library").Decimal;
    }>;
}
