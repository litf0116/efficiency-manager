export declare class ReportDetailDto {
    module: string;
    operation: string;
    unit: string;
    quantity: number;
}
export declare class SubmitReportDto {
    teamId?: number;
    year: number;
    week: number;
    reportDate: string;
    totalHeadcount: number;
    formalWorkers?: number;
    contractWorkers?: number;
    details: ReportDetailDto[];
}
export declare class UpdateReportDto {
    year?: number;
    week?: number;
    reportDate?: string;
    totalHeadcount?: number;
    formalWorkers?: number;
    contractWorkers?: number;
    details?: ReportDetailDto[];
}
export declare class AuditReportDto {
    status: 'APPROVED' | 'REJECTED';
}
