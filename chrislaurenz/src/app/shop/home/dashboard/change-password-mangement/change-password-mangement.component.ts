import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { User } from 'src/app/shared/classes/user';
import { ChangePasswordInfo } from 'src/app/shared/classes/change-password-info';
import { UserService } from 'src/app/shared/services/user.service';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-change-password-mangement',
  templateUrl: './change-password-mangement.component.html',
  styleUrls: ['./change-password-mangement.component.css']
})
export class ChangePasswordMangementComponent implements OnInit {

  @Input() user: User;
  changePasswordInfo: ChangePasswordInfo = new ChangePasswordInfo();
  form: any = {};
  @ViewChild('confirmPassword', {static: false})
  confirmPassword: NgModel;
  isNewPasswordSaved = false;
  errorMessage = '';
  
  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log("Form");
    console.log(this.form);
    this.changePasswordInfo.id = this.user.id;
    this.changePasswordInfo.oldPassword = this.form.oldPassword;
    this.changePasswordInfo.newPassword = this.form.password;

    this.userService.updateUserPassword(this.changePasswordInfo).subscribe(
      data => {
        console.log(data);
        this.isNewPasswordSaved = true;
      },
      error => {
        console.log(error);
        this.isNewPasswordSaved = false;
      }
    )

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
