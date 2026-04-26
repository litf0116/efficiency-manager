import { PrismaService } from '../../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validate(payload: {
        sub: number;
        username: string;
        role: string;
    }): Promise<{
        id: number;
        username: string;
        role: import("@prisma/client").$Enums.Role;
        teamId: number;
    }>;
}
export {};
