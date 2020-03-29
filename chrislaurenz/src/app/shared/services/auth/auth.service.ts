import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
 
import { JwtResponse } from '../../classes/jwt-response';
import { AuthLoginInfo } from '../../classes/login-info';
import { SignUpInfo } from '../../classes/signup-info';
import { VerificationInfo } from '../../classes/verification-info';
import { PasswordResetInfo } from '../../classes/password-reset-info';
import { PasswordResetEmailInfo } from '../../classes/password-reset-email-info'
import { environment } from '../../environments/environment';

 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  private loginUrl = `${environment.serverUrl}/auth/signin`;
  private signupUrl = `${environment.serverUrl}/auth/signup`;
  private refreshTokenUrl = `${environment.serverUrl}/auth/refresh_token`;
  private verificationUrl = `${environment.serverUrl}/auth/verification`;
  private resetVerificationUrl = `${environment.serverUrl}/auth/reset_verification`;
  private resetPasswordEmailUrl = `${environment.serverUrl}/auth/reset_email`;
  private resetPasswordUrl = `${environment.serverUrl}/auth/reset_password`;
 
  constructor(private http: HttpClient) {
  }
 
  attemptAuth(credentials: AuthLoginInfo): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.loginUrl, credentials);
  }
 
  signUp(info: SignUpInfo): Observable<string> {
    return this.http.post<string>(this.signupUrl, info);
  }

  verifyIdentityByToken(info: VerificationInfo): Observable<string> {
    return this.http.post<string>(this.verificationUrl, info)
  }

  verifyIdentityResetByToken(info: VerificationInfo): Observable<string> {
    return this.http.post<string>(this.resetVerificationUrl, info);
  }

  sendResetPasswordToken(info: PasswordResetEmailInfo): Observable<string> {
    return this.http.post<string>(this.resetPasswordEmailUrl, info)
  }

  resetPassword(info: PasswordResetInfo): Observable<string> {
    return this.http.post<string>(this.resetPasswordUrl, info)
  }

  refreshToken(refreshToken?: string): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.refreshTokenUrl, { 'refreshToken': refreshToken });
  }
}