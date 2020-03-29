export class PasswordResetInfo {
    email: string;
    token: string;
    newPassword: string;
 
    constructor(email: string, token: string) {
        this.email = email;
        this.token = token;
    }
}