import { Component, OnInit } from '@angular/core';
import { Product, ProductCategory, ProductCollection } from '../../shared/classes/product';
import { ProductsService } from '../../shared/services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  public products: Product[] = [];
  public productCategories: ProductCategory[] = [];
  public productCollections: ProductCollection[] = [];

  constructor(private productsService: ProductsService) {}
  
  ngOnInit() {
    this.productsService.getProducts().subscribe(data => { this.products = data; }, error => { console.log(error); });
    this.productsService.getProductCollections().subscribe(data => { this.productCollections = data; }, error => { console.log(error); });
  }
}
