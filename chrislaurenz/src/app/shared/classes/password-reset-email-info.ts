export class PasswordResetEmailInfo {
    email: string;
    lang?: string;
 
    constructor(email: string, lang?: string) {
        this.email = email;
        this.lang = lang;
    }
}