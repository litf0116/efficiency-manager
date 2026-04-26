import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/user.dto';
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        username: string;
        role: import("@prisma/client").$Enums.Role;
        realName: string;
        phone: string;
        teamId: number;
        status: number;
        createdAt: Date;
        team: {
            id: number;
            name: string;
            warehouse: {
                id: number;
                name: string;
            };
        };
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: number;
        username: string;
        role: import("@prisma/client").$Enums.Role;
        realName: string;
        phone: string;
        teamId: number;
        status: number;
        createdAt: Date;
        team: {
            id: number;
            name: string;
            warehouse: {
                id: number;
                name: string;
            };
        };
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, dto: UpdateUserDto): Promise<{
        id: number;
        username: string;
        role: import("@prisma/client").$Enums.Role;
        realName: string;
        phone: string;
        teamId: number;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
