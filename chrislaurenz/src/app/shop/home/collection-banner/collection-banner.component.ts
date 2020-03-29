import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/shared/services/products.service';
import { ProductCategory } from 'src/app/shared/classes/product';

@Component({
  selector: 'app-collection-banner',
  templateUrl: './collection-banner.component.html',
  styleUrls: ['./collection-banner.component.scss']
})
export class CollectionBannerComponent implements OnInit {

  public productsCategoryies: ProductCategory[] = [];

  constructor(private productsService: ProductsService) { }

  ngOnInit() { 
    this.productsService.getProductCategories().subscribe(data => { this.productsCategoryies = data; }, error => { console.log(error); });
  }
}
