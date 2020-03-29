import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../shared/classes/product';
import { ProductsService } from '../../../../shared/services/products.service';

@Component({
  selector: 'app-related-products',
  templateUrl: './related-products.component.html',
  styleUrls: ['./related-products.component.scss']
})
export class RelatedProductsComponent implements OnInit {

  public products: Product[] = [];
  
  constructor(private productsService: ProductsService) { }

  ngOnInit() {
  	this.productsService.getProducts().subscribe(data => { this.products = data; }, error => { console.log(error); });
  }

}