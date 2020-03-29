import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { trigger, transition, style, animate } from "@angular/animations";
import { CartItem } from '../../../../shared/classes/cart-item';
import { CartService } from '../../../../shared/services/cart.service';
import { ProductsService } from '../../../../shared/services/products.service';
import { Observable, of } from 'rxjs';
import { Product } from 'src/app/shared/classes/product';

declare var $: any;

@Component({
  selector: 'app-header-widgets',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [  // angular animation
    trigger('Animation', [
      transition('* => fadeOut', [
        style({ opacity: 0.1 }),
        animate(1000, style({ opacity: 0.1 }))
      ]),
      transition('* => fadeIn', [
         style({ opacity: 0.1 }),
         animate(1000, style({ opacity: 0.1 }))
      ])
    ])
  ]
})
export class SettingsComponent implements OnInit {

  @Input() shoppingCartItems  :   CartItem[] = [];

  public show  :   boolean = false;
  public products          :   Product[] = [];  
  public searchProducts    :   Product[] = [];	
  public animation         :   any;
  public searchTerms       :   any = '';
  public searchStart: boolean = false;

  constructor(private translate: TranslateService, private cartService: CartService,
   public productsService: ProductsService) { }

  ngOnInit() { 
    this.productsService.getProducts().subscribe(data => { this.products = data; }, error => { console.log(error); });
  }

  public updateCurrency(curr) {
    this.productsService.currency = curr;
  }

  public changeLanguage(lang){
    this.translate.use(lang)
  }

  public openSearch() {
    this.show = true;
  }

  public closeSearch() {
    this.show = false;
  }

  public getTotal(): Observable<number> {
    return this.cartService.getTotalAmount();
  }

  public searchTerm(term: string, keys: string = 'name,shortDetails') {
    this.searchStart = true;
    let res = (this.products || []).filter((item) => keys.split(',').some(key => item.hasOwnProperty(key)  &&  new RegExp(term, 'gi').test(item[key])));
    this.searchProducts = res;
  }
  
  public removeItem(item: CartItem) {
    this.cartService.removeFromCart(item);
  }

}
