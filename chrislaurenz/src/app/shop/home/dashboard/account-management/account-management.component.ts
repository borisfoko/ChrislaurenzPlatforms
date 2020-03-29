import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/shared/classes/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AccountManagementComponent implements OnInit {

  @Input() user: User;
  form: any = {};
  isAccountDataSaved = false;
  errorMessage = '';

  constructor(private userService: UserService) { }

  ngOnInit() { 
    if (this.user) {
      this.form = {
        firstname: this.user.first_name,
        middlename: this.user.middle_name,
        lastname: this.user.last_name,
        birthday: this.user.birthday,
        gender: this.user.gender,
        phoneNumber: this.user.customers[0].phone_number,
        email: this.user.email,
      }
    }
  }

  onSubmit() {
    this.user.first_name = this.form.firstname;
    this.user.middle_name = this.form.middlename;
    this.user.last_name = this.form.lastname;
    this.user.birthday = this.form.birthday;
    this.user.gender = this.form.gender;
    this.user.email = this.form.email;
    this.user.customers[0].phone_number = this.form.phoneNumber;
    this.user.customers[0].email = this.form.email;

    this.userService.updateUser(this.user).subscribe(
      data => {
        this.isAccountDataSaved = true;
      },
      error => {
        this.errorMessage = error.error;
        this.isAccountDataSaved = false;
      }
    );
  }

}
