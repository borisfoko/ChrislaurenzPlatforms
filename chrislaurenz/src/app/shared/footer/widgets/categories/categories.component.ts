import { Component, OnInit, Input } from '@angular/core';
import { ProductCategory } from 'src/app/shared/classes/product';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  @Input() productCategories: ProductCategory[];
  
  constructor(private productsService: ProductsService) { }

  ngOnInit() {
  }

}
