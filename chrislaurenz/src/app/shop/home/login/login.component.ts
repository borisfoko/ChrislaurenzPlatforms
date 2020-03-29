import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

import { AuthService } from '../../../shared/services/auth/auth.service';
import { TokenStorageService } from '../../../shared/services/auth/token-storage.service';
import { AuthLoginInfo } from '../../../shared/classes/login-info';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: any = {};
  isLoginFailed = false;
  errorMessage = '';
  private loginInfo: AuthLoginInfo;
 
  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) { }
 
  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.router.navigate(['/']);
    }
  }
 
  onSubmit() {
    // console.log(this.form);
    this.loginInfo = new AuthLoginInfo(this.form.email, this.form.password);
 
    this.authService.attemptAuth(this.loginInfo).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveRefreshToken(data.refreshToken);
        this.tokenStorage.saveExpiresAt(data.expiresIn);
        this.tokenStorage.saveUsername(data.email);
        this.tokenStorage.saveFirstname(data.firstname);
        this.tokenStorage.saveGender(data.gender);
        this.tokenStorage.saveAuthorities(data.authorities);
 
        this.isLoginFailed = false;
        this.reloadPage();
      },
      error => {
        console.log(error);
        this.errorMessage = error.error;
        this.isLoginFailed = true;
      }
    );
  }
 
  reloadPage() {
    window.location.reload();
  }

  gotoSignUp(){
    this.router.navigate(['/signup']);
  }
}