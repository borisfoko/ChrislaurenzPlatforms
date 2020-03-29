import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { User } from '../classes/user';
import { ChangePasswordInfo } from '../classes/change-password-info';

@Injectable()
export class UserService {
 
  private userUrl = `${environment.serverUrl}/board/user`;
  private pmUrl = `${environment.serverUrl}/board/pm`;
  private adminUrl = `${environment.serverUrl}/board/admin`;
  private userUpdateUrl = `${environment.serverUrl}/user`;
  private userPasswordChangeUrl = `${environment.serverUrl}/user_password`;
 
  constructor(private http: HttpClient) { }
 
  getUserBoard(): Observable<any> {
    return this.http.get(this.userUrl);
  }
 
  getPMBoard(): Observable<any> {
    return this.http.get(this.pmUrl);
  }
 
  getAdminBoard(): Observable<any> {
    return this.http.get(this.adminUrl);
  }

  updateUser(user: User): Observable<string> {
    return this.http.put<string>(`${this.userUpdateUrl}/${user.id}`, user);
  }

  updateUserPassword(changePasswordInfo: ChangePasswordInfo): Observable<string> {
    return this.http.put<string>(`${this.userPasswordChangeUrl}/${changePasswordInfo.id}`, changePasswordInfo);
  }
}