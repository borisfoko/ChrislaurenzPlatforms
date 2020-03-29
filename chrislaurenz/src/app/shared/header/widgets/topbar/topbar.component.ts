import { Component, OnInit } from '@angular/core';
import { Product } from '../../../classes/product';
import { WishlistService } from '../../../services/wishlist.service';
import { ProductsService } from '../../../services/products.service';
import { Observable, of } from 'rxjs';
import { TokenStorageService } from '../../../services/auth/token-storage.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  private isLoggedIn = false;
  private firstname: string;

  constructor(public productsService: ProductsService, private tokenStorage: TokenStorageService) { }

  ngOnInit() { 
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.firstname = this.tokenStorage.getFirstname();
    }
  }

  
  logout() {
    this.tokenStorage.signOut();
    window.location.reload();
  }
}
