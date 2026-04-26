import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { SubmitReportDto, UpdateReportDto, AuditReportDto } from './dto/report.dto';
import { EfficiencyCalculateService } from './efficiency-calculate.service';
export declare class ReportService {
    private readonly prisma;
    private readonly calcService;
    constructor(prisma: PrismaService, calcService: EfficiencyCalculateService);
    submit(dto: SubmitReportDto, user: any): Promise<{
        team: {
            warehouse: {
                id: number;
                status: number;
                createdAt: Date;
                name: string;
                location: string | null;
            };
        } & {
            function: string | null;
            id: number;
            status: number;
            createdAt: Date;
            name: string;
            warehouseId: number;
            floor: string | null;
        };
        details: {
            id: number;
            module: string;
            operation: string;
            unit: string;
            stdRate: Prisma.Decimal | null;
            quantity: Prisma.Decimal;
            reportId: number;
        }[];
    } & {
        id: number;
        teamId: number;
        status: import("@prisma/client").$Enums.ReportStatus;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        week: number;
        reportDate: Date;
        totalHeadcount: number;
        formalWorkers: number;
        contractWorkers: number;
        totalOutput: Prisma.Decimal | null;
        stdOutput: Prisma.Decimal | null;
        efficiency: Prisma.Decimal | null;
        submitterId: number | null;
    }>;
    getMine(user: any, teamId?: number): Promise<({
        team: {
            function: string | null;
            id: number;
            status: number;
            createdAt: Date;
            name: string;
            warehouseId: number;
            floor: string | null;
        };
        details: {
            id: number;
            module: string;
            operation: string;
            unit: string;
            stdRate: Prisma.Decimal | null;
            quantity: Prisma.Decimal;
            reportId: number;
        }[];
    } & {
        id: number;
        teamId: number;
        status: import("@prisma/client").$Enums.ReportStatus;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        week: number;
        reportDate: Date;
        totalHeadcount: number;
        formalWorkers: number;
        contractWorkers: number;
        totalOutput: Prisma.Decimal | null;
        stdOutput: Prisma.Decimal | null;
        efficiency: Prisma.Decimal | null;
        submitterId: number | null;
    })[]>;
    getByWeek(year: number, week: number, user: any): Promise<{
        team: {
            warehouse: {
                id: number;
                status: number;
                createdAt: Date;
                name: string;
                location: string | null;
            };
        } & {
            function: string | null;
            id: number;
            status: number;
            createdAt: Date;
            name: string;
            warehouseId: number;
            floor: string | null;
        };
        details: {
            id: number;
            module: string;
            operation: string;
            unit: string;
            stdRate: Prisma.Decimal | null;
            quantity: Prisma.Decimal;
            reportId: number;
        }[];
    } & {
        id: number;
        teamId: number;
        status: import("@prisma/client").$Enums.ReportStatus;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        week: number;
        reportDate: Date;
        totalHeadcount: number;
        formalWorkers: number;
        contractWorkers: number;
        totalOutput: Prisma.Decimal | null;
        stdOutput: Prisma.Decimal | null;
        efficiency: Prisma.Decimal | null;
        submitterId: number | null;
    }>;
    getByTeam(teamId: number): Promise<({
        team: {
            function: string | null;
            id: number;
            status: number;
            createdAt: Date;
            name: string;
            warehouseId: number;
            floor: string | null;
        };
        details: {
            id: number;
            module: string;
            operation: string;
            unit: string;
            stdRate: Prisma.Decimal | null;
            quantity: Prisma.Decimal;
            reportId: number;
        }[];
    } & {
        id: number;
        teamId: number;
        status: import("@prisma/client").$Enums.ReportStatus;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        week: number;
        reportDate: Date;
        totalHeadcount: number;
        formalWorkers: number;
        contractWorkers: number;
        totalOutput: Prisma.Decimal | null;
        stdOutput: Prisma.Decimal | null;
        efficiency: Prisma.Decimal | null;
        submitterId: number | null;
    })[]>;
    update(id: number, dto: UpdateReportDto, user: any): Promise<{
        team: {
            warehouse: {
                id: number;
                status: number;
                createdAt: Date;
                name: string;
                location: string | null;
            };
        } & {
            function: string | null;
            id: number;
            status: number;
            createdAt: Date;
            name: string;
            warehouseId: number;
            floor: string | null;
        };
        details: {
            id: number;
            module: string;
            operation: string;
            unit: string;
            stdRate: Prisma.Decimal | null;
            quantity: Prisma.Decimal;
            reportId: number;
        }[];
    } & {
        id: number;
        teamId: number;
        status: import("@prisma/client").$Enums.ReportStatus;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        week: number;
        reportDate: Date;
        totalHeadcount: number;
        formalWorkers: number;
        contractWorkers: number;
        totalOutput: Prisma.Decimal | null;
        stdOutput: Prisma.Decimal | null;
        efficiency: Prisma.Decimal | null;
        submitterId: number | null;
    }>;
    getAll(filters: {
        year?: number;
        month?: number;
        teamId?: number;
        warehouseId?: number;
    }): Promise<({
        team: {
            warehouse: {
                id: number;
                status: number;
                createdAt: Date;
                name: string;
                location: string | null;
            };
        } & {
            function: string | null;
            id: number;
            status: number;
            createdAt: Date;
            name: string;
            warehouseId: number;
            floor: string | null;
        };
        details: {
            id: number;
            module: string;
            operation: string;
            unit: string;
            stdRate: Prisma.Decimal | null;
            quantity: Prisma.Decimal;
            reportId: number;
        }[];
    } & {
        id: number;
        teamId: number;
        status: import("@prisma/client").$Enums.ReportStatus;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        week: number;
        reportDate: Date;
        totalHeadcount: number;
        formalWorkers: number;
        contractWorkers: number;
        totalOutput: Prisma.Decimal | null;
        stdOutput: Prisma.Decimal | null;
        efficiency: Prisma.Decimal | null;
        submitterId: number | null;
    })[]>;
    audit(id: number, dto: AuditReportDto): Promise<{
        id: number;
        teamId: number;
        status: import("@prisma/client").$Enums.ReportStatus;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        week: number;
        reportDate: Date;
        totalHeadcount: number;
        formalWorkers: number;
        contractWorkers: number;
        totalOutput: Prisma.Decimal | null;
        stdOutput: Prisma.Decimal | null;
        efficiency: Prisma.Decimal | null;
        submitterId: number | null;
    }>;
    getMonthly(year: number, month: number, teamId?: number): Promise<any[]>;
}
