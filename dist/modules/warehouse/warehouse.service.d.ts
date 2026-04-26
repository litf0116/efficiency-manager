import { PrismaService } from '../../prisma/prisma.service';
import { CreateWarehouseDto, UpdateWarehouseDto } from './dto/warehouse.dto';
export declare class WarehouseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        _count: {
            teams: number;
        };
    } & {
        id: number;
        status: number;
        createdAt: Date;
        name: string;
        location: string | null;
    })[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__WarehouseClient<{
        teams: {
            function: string | null;
            id: number;
            status: number;
            createdAt: Date;
            name: string;
            warehouseId: number;
            floor: string | null;
        }[];
    } & {
        id: number;
        status: number;
        createdAt: Date;
        name: string;
        location: string | null;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    create(dto: CreateWarehouseDto): import("@prisma/client").Prisma.Prisma__WarehouseClient<{
        id: number;
        status: number;
        createdAt: Date;
        name: string;
        location: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, dto: UpdateWarehouseDto): import("@prisma/client").Prisma.Prisma__WarehouseClient<{
        id: number;
        status: number;
        createdAt: Date;
        name: string;
        location: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
