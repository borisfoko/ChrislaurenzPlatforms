import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Product, ProductCollection, ProductCategory, ProductGroup, ProductType, ProductSize } from '../classes/product';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { environment } from '../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

// Get product from Localstorage
let productList = JSON.parse(localStorage.getItem("compareItem")) || [];

@Injectable()

export class ProductsService {

  public currency : string = 'EUR';
  public catalogMode : boolean = false;
  private compareMax : string = '';
  
  public compareProducts : BehaviorSubject<Product[]> = new BehaviorSubject([]);
  public observer   :  Subscriber<{}>;
  // Initialize 
  constructor(private toastrService: ToastrService, private translate: TranslateService, private httpClient: HttpClient) { 
     this.compareProducts.subscribe(productList => productList = productList);
     this.translate.get('compare-max').subscribe((res: string) => { this.compareMax = res; });
  }

  // Get Products from Server
  private loadProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${environment.serverUrl}/product`).map((res:any) => res);
  }

  // Get Product Collections from Server
  public getProductCollections(): Observable<ProductCollection[]> {
    return this.httpClient.get<ProductCollection[]>(`${environment.serverUrl}/product_collection`).map((res:any) => res);
  }

  // Get Product Categories from Server
  public getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<ProductCategory[]>(`${environment.serverUrl}/product_category`).map((res:any) => res);
  }

  // Get Product Groups from Server
  public getProductGroups(): Observable<ProductGroup[]> {
    return this.httpClient.get<ProductGroup[]>(`${environment.serverUrl}/product_group`).map((res:any) => res);
  }

  // Get Product Types from Server
  public getProductTypes(): Observable<ProductType[]> {
    return this.httpClient.get<ProductType[]>(`${environment.serverUrl}/product_group`).map((res:any) => res);
  }

  // Get Product Sizes from Server
  public getProductSizes(): Observable<ProductSize[]> {
    return this.httpClient.get<ProductType[]>(`${environment.serverUrl}/product_group`).map((res:any) => res);
  }

  // Get Products
  public getProducts(): Observable<Product[]> {
    return this.loadProducts();
  }

  // Get Products By Id
  public getProduct(id: number): Observable<Product> {
    return this.loadProducts().pipe(map(items => { return items.find((item: Product) => { return item.id === id; }); }));
  }

   // Get Products By category
  public getProductByCategory(category: string): Observable<Product[]> {
    return this.loadProducts().pipe(map(items => 
      items.filter((item: Product) => 
      {
        if(category == 'all'){
          return item;
        } else {
          let categoryEn = `en:${category}`, categoryDe = `de:${category}`, categoryFr = `fr:${category}`;
          return item.category.name.toLowerCase().includes(categoryEn.toLowerCase()) 
          || item.category.name.toLowerCase().includes(categoryDe.toLowerCase()) 
          || item.category.name.toLowerCase().includes(categoryFr.toLowerCase());
        }
      })
    ));
  }
  
   /*
      ---------------------------------------------
      ----------  Compare Product  ----------------
      ---------------------------------------------
   */

  // Get Compare Products
  public getComapreProducts(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(productList);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  }

  // If item is aleready added In compare
  public hasProduct(product: Product): boolean {
    const item = productList.find(item => item.id === product.id);
    return item !== undefined;
  }

  // Add to compare
  public addToCompare(product: Product): Product | boolean {
    var item: Product | boolean = false;
    if (this.hasProduct(product)) {
      item = productList.filter(item => item.id === product.id)[0];
      const index = productList.indexOf(item);
    } else {
      if(productList.length < 4)
        productList.push(product);
      else 
        this.toastrService.warning(this.compareMax); // toasr services
    }
      localStorage.setItem("compareItem", JSON.stringify(productList));
      return item;
  }

  // Removed Product
  public removeFromCompare(product: Product) {
    if (product === undefined) { return; }
    const index = productList.indexOf(product);
    productList.splice(index, 1);
    localStorage.setItem("compareItem", JSON.stringify(productList));
  }
   
  // Get current language translation
  public getCurrentTranslation(param: string){
    var valueTranslation = param;
    if (param !== undefined) {
      var userLanguage = navigator.language;
      var paramParts = param.split('/');

      if (userLanguage.includes('en')){
        valueTranslation = paramParts[0].split(':')[1];
      }
      else if (userLanguage.includes('de')) {
        valueTranslation = paramParts[1].split(':')[1];
      }
      else if (userLanguage.includes('fr')) {
        valueTranslation = paramParts[2].split(':')[1];
      }
      else {
        valueTranslation = paramParts[0].split(':')[1];
      }
    }

    return valueTranslation;
  }
}