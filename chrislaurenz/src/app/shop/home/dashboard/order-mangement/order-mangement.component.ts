import { Component, OnInit, Input } from '@angular/core';
import { CustomerOrder, Customer } from 'src/app/shared/classes/customer';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-order-mangement',
  templateUrl: './order-mangement.component.html',
  styleUrls: ['./order-mangement.component.css']
})
export class OrderMangementComponent implements OnInit {

  @Input() customer: Customer;

  constructor(public productsService: ProductsService) { }

  ngOnInit(): void {
  }

  gotoAddress() {
    window.location.href = "/dashboard#address";
    window.location.reload();
  }
}
