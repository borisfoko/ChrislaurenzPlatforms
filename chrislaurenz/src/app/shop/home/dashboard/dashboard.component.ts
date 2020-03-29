import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TokenStorageService } from '../../../shared/services/auth/token-storage.service';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/classes/user';
import { Order } from 'src/app/shared/classes/order';
import { CustomerPaymentMethod, Customer } from 'src/app/shared/classes/customer';
import { Address } from 'src/app/shared/classes/address';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public user: User = new User();
  public role: string;
  public addresses: Address[] = [];
  public customer: Customer = new Customer();
  public paymentMethods: CustomerPaymentMethod[] = [];
  public errorMessage = '';
  sections: any = {
    'dashboard': true,
    'account': false,
    'change-password': false,
    'address': false,
    'orders': false,
    'payment-methods': false
  };

  constructor(private translate: TranslateService, private userService: UserService, private tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit() { 
    if (this.tokenStorage.getToken()) {
      this.userService.getUserBoard().subscribe( 
        data => { 
          this.user = data; 
          this.role = 'visitor';
          if(this.user.customers.length > 0) {
            if (!isNullOrUndefined(this.user.customers[0].invoice_address)) {
              this.customer = this.user.customers[0];
              this.user.customers[0].invoice_address.type = 'address-billing';
              this.addresses.push(this.user.customers[0].invoice_address);
            }
            if (!isNullOrUndefined(this.user.customers[0].delivery_address)) {
              this.user.customers[0].delivery_address.type = 'address-shipping';
              this.addresses.push(this.user.customers[0].delivery_address);
            }
          }

          if (this.router.url.includes('#')) {
            this.selectSectionFromAnchor(this.router.url.split('#')[1]);
          }
          this.tokenStorage.getAuthorities().every(authority => {
            if (authority === 'ROLE_ADMIN') {
              this.role = 'admin';
              return false;
            } else if (authority === 'ROLE_PM') {
              this.role = 'pm';
              return false;
            }
            this.role = 'user';
            return true;
          });
      }, 
      error => { 
        this.errorMessage = error.error; 
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  selectSection(section: string){
    this.sections = {
      'dashboard': false,
      'account': false,
      'change-password': false,
      'address': false,
      'orders': false,
      'payment-methods': false
    };
    this.sections[section] = true;
  }

  selectSectionFromAnchor(anchor: string){
    switch(anchor) {
      case 'account': 
        this.selectSection(anchor);
        break;
      case 'change-password': 
        this.selectSection(anchor);
        break;
      case 'address':
        this.selectSection(anchor);
        break;
      case 'orders':
        this.selectSection(anchor);
        break;
      case 'payment-methods':
        this.selectSection(anchor);
        break;
      default:
        this.selectSection('dashboard');
        break;
    }
  }

  logout() {
    this.tokenStorage.signOut();
    window.location.reload();
  }
}
