import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';
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
  
  // collapse toggle
  ngOnInit() {
    $('.collapse-block-title').on('click', function(e) {
        e.preventDefault;
        var speed = 300;
        var thisItem = $(this).parent(),
          nextLevel = $(this).next('.collection-collapse-block-content');
        if (thisItem.hasClass('open')) {
          thisItem.removeClass('open');
          nextLevel.slideUp(speed);
        } else {
          thisItem.addClass('open');
          nextLevel.slideDown(speed);
        }
    });
  }

  // For mobile view
  public mobileFilterBack() {
     $('.collection-filter').css("left", "-365px");
  }

}
