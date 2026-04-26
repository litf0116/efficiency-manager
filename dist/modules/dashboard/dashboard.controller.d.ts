import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getSummary(): Promise<{
        totalTeams: number;
        reportedTeamsThisWeek: number;
        unreportedTeams: number;
        avgEfficiency: number;
        passRate: number;
        compareLastMonth: number;
        target: number;
    }>;
    getRanking(year?: number, month?: number): Promise<any[]>;
    getTrend(teamId?: number, months?: number): Promise<({
        team: {
            function: string | null;
            id: number;
            status: number;
            createdAt: Date;
            name: string;
            warehouseId: number;
            floor: string | null;
        };
    } & {
        id: number;
        teamId: number;
        year: number;
        week: number;
        reportDate: Date;
        totalHeadcount: number;
        formalWorkers: number;
        contractWorkers: number;
        totalOutput: import("@prisma/client/runtime/library").Decimal | null;
        stdOutput: import("@prisma/client/runtime/library").Decimal | null;
        efficiency: import("@prisma/client/runtime/library").Decimal | null;
        status: import("@prisma/client").$Enums.ReportStatus;
        createdAt: Date;
        updatedAt: Date;
        submitterId: number | null;
    })[]>;
}
