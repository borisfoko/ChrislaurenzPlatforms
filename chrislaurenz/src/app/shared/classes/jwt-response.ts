export class JwtResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    email: string;
    firstname: string;
    authorities: string[];
    gender: string;
}