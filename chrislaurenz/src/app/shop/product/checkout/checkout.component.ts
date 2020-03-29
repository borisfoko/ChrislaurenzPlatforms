import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
// import {  IPayPalConfig,  ICreateOrderRequest } from 'ngx-paypal';
import { CartItem } from '../../../shared/classes/cart-item';
import { ProductsService } from '../../../shared/services/products.service';
import { CartService } from '../../../shared/services/cart.service';
import { OrderService } from '../../../shared/services/order.service';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/shared/classes/user';
import { TokenStorageService } from 'src/app/shared/services/auth/token-storage.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  
  // form group
  public checkoutForm   :  FormGroup;
  public cartItems      :  Observable<CartItem[]> = of([]);
  public checkOutItems  :  CartItem[] = [];
  public orderDetails   :  any[] = [];
  public amount         :  number;
  public payPalConfig ? :  PayPalConfig;
  // User object
  public user           :  User = new User();
  public isLoggedIn = false;
  private errorMessage = '';
  // Form Validator
  constructor(private fb: FormBuilder, private cartService: CartService, 
    public productsService: ProductsService, private orderService: OrderService, private userService: UserService, private tokenStorage: TokenStorageService) {
    this.checkoutForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      middlename: ['', [Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      birthday: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.maxLength(50)]],
      country: ['', Validators.required],
      town: ['', Validators.required],
      state: ['', Validators.required],
      postalcode: ['', Validators.required]
    })    
  }

  ngOnInit() {
    this.cartItems = this.cartService.getItems();
    this.cartItems.subscribe(products => this.checkOutItems = products);
    this.getTotal().subscribe(amount => this.amount = amount);
    this.initConfig();
    if (this.tokenStorage.getToken()) {
      this.userService.getUserBoard().subscribe( 
        data => { 
          this.user = data; 
          this.checkoutForm.controls['firstname'].setValue(this.user.first_name);
          this.checkoutForm.controls['middlename'].setValue(this.user.middle_name);
          this.checkoutForm.controls['lastname'].setValue(this.user.last_name);
          this.checkoutForm.controls['birthday'].setValue(this.user.birthday);
          this.checkoutForm.controls['phone'].setValue(this.user.customers[0].phone_number);
          this.checkoutForm.controls['email'].setValue(this.user.email);
          this.checkoutForm.controls['address'].setValue(this.user.customers[0].invoice_address.street_name);
          this.checkoutForm.controls['country'].setValue(this.user.customers[0].invoice_address.country.toLowerCase());
          this.checkoutForm.controls['town'].setValue(this.user.customers[0].invoice_address.city);
          this.checkoutForm.controls['state'].setValue(this.user.customers[0].invoice_address.state);
          this.checkoutForm.controls['postalcode'].setValue(this.user.customers[0].invoice_address.post_code);
          this.isLoggedIn = true;
      }, 
      error => { 
        this.errorMessage = error.error;
        console.log(this.errorMessage);
      });
    }
  }
  
  
  // Get sub Total
  public getTotal(): Observable<number> {
    return this.cartService.getTotalAmount();
  }
 
  // stripe payment gateway
  stripeCheckout() {
      var handler = (<any>window).StripeCheckout.configure({
        key: 'PUBLISHBLE_KEY', // publishble key
        locale: 'auto',
        token: (token: any) => {
          // You can access the token ID with `token.id`.
          // Get the token ID to your server-side code for use.
          this.orderService.createOrder(this.checkOutItems, this.checkoutForm.value, token.id, this.amount);
        }
      });
      handler.open({
        name: 'ChrisLaurenz',
        description: 'Online Fashion Store',
        amount: this.amount * 100
      }) 
  }

  // Paypal payment gateway
  private initConfig(): void {
      this.payPalConfig = new PayPalConfig(PayPalIntegrationType.ClientSideREST, PayPalEnvironment.Sandbox, {
        commit: true,
        client: {
          sandbox: 'Adu7PtHNDGufLBZ6pq0nBeQ-ubNvfptRLWqBBngNNDkqTs1fNx2pn8aE0PqxH48CVBq-LR1BhX3-d7_h', // client Id
        },
        button: {
          label: 'paypal',
          size:  'small',    // small | medium | large | responsive
          shape: 'rect',     // pill | rect
          // color: 'blue'   // gold | blue | silver | black
          //tagline: false  
        },
        onPaymentComplete: (data, actions) => {
          this.orderService.createOrder(this.checkOutItems, this.checkoutForm.value, data.orderID, this.amount);
        },
        onCancel: (data, actions) => {
          console.log('OnCancel');
        },
        onError: (err) => {
          console.log('OnError');
        },
        transactions: [{
          amount: {
            currency: this.productsService.currency,
            total: this.amount
          }
        }]
      });
  }

  
}
