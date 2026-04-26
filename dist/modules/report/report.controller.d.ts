import { ReportService } from './report.service';
import { SubmitReportDto, UpdateReportDto, AuditReportDto } from './dto/report.dto';
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    submit(dto: SubmitReportDto, req: any): Promise<{
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
            stdRate: import("@prisma/client/runtime/library").Decimal | null;
            quantity: import("@prisma/client/runtime/library").Decimal;
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
        totalOutput: import("@prisma/client/runtime/library").Decimal | null;
        stdOutput: import("@prisma/client/runtime/library").Decimal | null;
        efficiency: import("@prisma/client/runtime/library").Decimal | null;
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
            stdRate: import("@prisma/client/runtime/library").Decimal | null;
            quantity: import("@prisma/client/runtime/library").Decimal;
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
        totalOutput: import("@prisma/client/runtime/library").Decimal | null;
        stdOutput: import("@prisma/client/runtime/library").Decimal | null;
        efficiency: import("@prisma/client/runtime/library").Decimal | null;
        submitterId: number | null;
    })[]>;
    getMine(teamId: number, req: any): Promise<({
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
            stdRate: import("@prisma/client/runtime/library").Decimal | null;
            quantity: import("@prisma/client/runtime/library").Decimal;
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
        totalOutput: import("@prisma/client/runtime/library").Decimal | null;
        stdOutput: import("@prisma/client/runtime/library").Decimal | null;
        efficiency: import("@prisma/client/runtime/library").Decimal | null;
        submitterId: number | null;
    })[]>;
    getByWeek(year: number, week: number, req: any): Promise<{
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
            stdRate: import("@prisma/client/runtime/library").Decimal | null;
            quantity: import("@prisma/client/runtime/library").Decimal;
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
        totalOutput: import("@prisma/client/runtime/library").Decimal | null;
        stdOutput: import("@prisma/client/runtime/library").Decimal | null;
        efficiency: import("@prisma/client/runtime/library").Decimal | null;
        submitterId: number | null;
    }>;
    update(id: number, dto: UpdateReportDto, req: any): Promise<{
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
            stdRate: import("@prisma/client/runtime/library").Decimal | null;
            quantity: import("@prisma/client/runtime/library").Decimal;
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
        totalOutput: import("@prisma/client/runtime/library").Decimal | null;
        stdOutput: import("@prisma/client/runtime/library").Decimal | null;
        efficiency: import("@prisma/client/runtime/library").Decimal | null;
        submitterId: number | null;
    }>;
    getAll(year?: number, month?: number, teamId?: number, warehouseId?: number): Promise<({
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
            stdRate: import("@prisma/client/runtime/library").Decimal | null;
            quantity: import("@prisma/client/runtime/library").Decimal;
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
        totalOutput: import("@prisma/client/runtime/library").Decimal | null;
        stdOutput: import("@prisma/client/runtime/library").Decimal | null;
        efficiency: import("@prisma/client/runtime/library").Decimal | null;
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
        totalOutput: import("@prisma/client/runtime/library").Decimal | null;
        stdOutput: import("@prisma/client/runtime/library").Decimal | null;
        efficiency: import("@prisma/client/runtime/library").Decimal | null;
        submitterId: number | null;
    }>;
    getMonthly(year: number, month: number, teamId?: number): Promise<any[]>;
}
