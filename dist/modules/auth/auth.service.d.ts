import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: number;
            username: string;
            role: string;
            realName: string;
            teamId: number;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        id: number;
        username: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
    getProfile(userId: number): Promise<{
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
    }>;
}
