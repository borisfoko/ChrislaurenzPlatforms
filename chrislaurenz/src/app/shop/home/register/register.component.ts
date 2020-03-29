import { Component, OnInit, ViewChild } from '@angular/core';
import { Router} from '@angular/router';

import { TokenStorageService } from '../../../shared/services/auth/token-storage.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { SignUpInfo } from '../../../shared/classes/signup-info';
import { Customer } from 'src/app/shared/classes/customer';
import { NgModel } from '@angular/forms';
 
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: any = {};
  @ViewChild('confirmPassword', {static: false})
  confirmPassword: NgModel;
  signupInfo: SignUpInfo;
  isSignedUp = false;
  isSignUpFailed = false;
  errorMessage = '';
 
  constructor(private authService: AuthService,  private tokenStorage: TokenStorageService, private router: Router) { }
 
  ngOnInit() { 
    if (this.tokenStorage.getToken()) {
      this.router.navigate(['/']);
    }
  }
 
  onSubmit() {
    console.log(this.form);
    this.signupInfo = new SignUpInfo(
      this.form.email,
      this.form.firstname,
      this.form.lastname,
      this.form.gender,
      this.form.birthday,
      this.form.password,
      this.form.middlename, 
      new Customer(this.form.email, this.form.phoneNumber), 
      navigator.language);
 
    this.authService.signUp(this.signupInfo).subscribe(
      data => {
        console.log(data);
        this.isSignedUp = true;
        this.isSignUpFailed = false;
      },
      error => {
        console.log(error);
        this.errorMessage = error.error;
        this.isSignUpFailed = true;
      }
    );
  }

  gotoSignIn(){
    this.router.navigate(['/login']);
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