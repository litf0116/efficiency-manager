import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): Promise<{
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
