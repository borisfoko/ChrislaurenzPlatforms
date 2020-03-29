import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ShopModule } from "./shop/shop.module";
import { BlogModule } from './blog/blog.module';
import { SharedModule } from "./shared/shared.module";
import { ToastrModule } from 'ngx-toastr';
import { rootRouterConfig } from './app.routes';
// import ngx-translate and the http loader
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
// components
import { AppComponent } from './app.component';
// import { MainComponent } from './main/main.component';
import * as $ from 'jquery';
// Providers
import { ProductsService } from './shared/services/products.service';
import { CartService } from './shared/services/cart.service';
import { WishlistService } from './shared/services/wishlist.service';
import { UserService } from './shared/services/user.service';
import { environment } from '../environments/environment';
import { AppUpdateService } from './shared/services/app-update.service';
import { NewsletterService } from './shared/services/newsletter.service';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
   return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ShopModule,
    SharedModule,
    BlogModule,
    HttpClientModule,
    NgbModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    ToastrModule.forRoot({
      timeOut: 1000,
      progressBar: false,
      enableHtml: true,
    }),
    RouterModule.forRoot(rootRouterConfig, { useHash: true, anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [ 
    ProductsService,
    CartService, 
    WishlistService, 
    UserService,
    AppUpdateService,
    NewsletterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

