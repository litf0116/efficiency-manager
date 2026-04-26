import { TeamService } from './team.service';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';
export declare class TeamController {
    private readonly teamService;
    constructor(teamService: TeamService);
    findAll(warehouseId?: number): import("@prisma/client").Prisma.PrismaPromise<({
        _count: {
            users: number;
            weeklyReports: number;
        };
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
    })[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__TeamClient<{
        warehouse: {
            id: number;
            status: number;
            createdAt: Date;
            name: string;
            location: string | null;
        };
        users: {
            id: number;
            role: import("@prisma/client").$Enums.Role;
            realName: string;
        }[];
    } & {
        function: string | null;
        id: number;
        status: number;
        createdAt: Date;
        name: string;
        warehouseId: number;
        floor: string | null;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    create(dto: CreateTeamDto): import("@prisma/client").Prisma.Prisma__TeamClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, dto: UpdateTeamDto): import("@prisma/client").Prisma.Prisma__TeamClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
