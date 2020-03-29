import { Component, OnInit, Input } from '@angular/core';
import { CustomerPaymentMethod } from 'src/app/shared/classes/customer';

@Component({
  selector: 'app-payment-method-mangement',
  templateUrl: './payment-method-mangement.component.html',
  styleUrls: ['./payment-method-mangement.component.css']
})
export class PaymentMethodMangementComponent implements OnInit {

  @Input() paymentMethods: CustomerPaymentMethod[];
  
  constructor() { }

  ngOnInit(): void {
  }

}
