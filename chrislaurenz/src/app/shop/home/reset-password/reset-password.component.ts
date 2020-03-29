import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { TokenStorageService } from '../../../shared/services/auth/token-storage.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { PasswordResetInfo } from '../../../shared/classes/password-reset-info';
import { PasswordResetEmailInfo } from '../../../shared/classes/password-reset-email-info';
import { isNullOrUndefined } from 'util';
import { from } from 'rxjs';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  form: any = {};
  @ViewChild('confirmPassword', {static: false})
  confirmPassword: NgModel;
  info: PasswordResetInfo;
  infoEmail: PasswordResetEmailInfo;
  errorMessage = '';
  isResetMailSent = false;
  isPasswordReseted = false;
  requestType = 0;

  constructor(private route: ActivatedRoute,  private tokenStorage: TokenStorageService, private authService: AuthService, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if(!isNullOrUndefined(params)){
        if(!isNullOrUndefined(params['email']) && !isNullOrUndefined(params['token'])){
          this.info = new PasswordResetInfo(params['email'], params['token']);
          this.requestType = 1;
        }
      }
    });
  }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.router.navigate(['/']);
    }
    else if(this.requestType == 1){
      this.verifyIdentity();
    }
  }

  verifyIdentity(){
    this.authService.verifyIdentityResetByToken(this.info).subscribe(
      data => {
        this.requestType = 2;
        console.log(data);
      },
      error => {
        this.requestType = 1;
        this.errorMessage = error.error;
        console.log(error);
      }
    );
  }

  onSubmitEmail(){
    console.log(this.form);
    this.infoEmail = new PasswordResetEmailInfo(this.form.email, navigator.language);

    this.authService.sendResetPasswordToken(this.infoEmail).subscribe(
      data => {
        console.log(data);
        this.isResetMailSent = true;
      },
      error => {
        console.log(error);
        this.isResetMailSent = true;
        this.errorMessage = error.error;
      }
    );
  }

  onSubmitPassword(){
    this.info.newPassword = this.form.password;
    console.log(this.info);

    this.authService.resetPassword(this.info).subscribe(
      data => {
        console.log(data);
        this.isPasswordReseted = true;
      },
      error => {
        console.log(error);
        this.isPasswordReseted = false;
        this.errorMessage = error.error;
      }
    );
  }

  checkPasswords(){
    if (this.form.confirmPassword !== this.form.password) {
      // console.log('passwords do not match: (1) - ' + this.form.password + ', (2) - ' + this.form.confirmPassword);
      // setErrors() must be called after change detection runs
      setTimeout(() => this.confirmPassword.control.setErrors({'nomatch': true}) );
    } else {
      // to clear the error, we don't have to wait
      this.confirmPassword.control.setErrors(null);
    }
  }
}
