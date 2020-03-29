import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/shared/classes/product';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'product-details-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public productCategories: ProductCategory[] = [];
  
  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.productsService.getProductCategories().subscribe(data => { this.productCategories = data; }, error => { console.log(error); });
  }

}
