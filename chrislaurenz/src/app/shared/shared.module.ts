import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { BarRatingModule } from "ngx-bar-rating";
import { TranslateModule } from '@ngx-translate/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Services
import { WINDOW_PROVIDERS } from "./services/windows.service";
import { LandingFixService } from '../shared/services/landing-fix.service';
import { InstagramService } from "./services/instagram.service";
import { ProductsService } from "./services/products.service";
import { WishlistService } from "./services/wishlist.service";
import { CartService } from "./services/cart.service";
import { OrderService } from "./services/order.service";
import { UserService } from "./services/user.service";
import { AddressService } from './services/address.service';
import { BlogService } from './services/blog.service';
import { AuthService } from "./services/auth/auth.service";
import { AppUpdateService } from './services/app-update.service';
import { NewsletterService } from './services/newsletter.service';
import { TokenStorageService } from "./services/auth/token-storage.service";
import { PaginationService } from "./classes/paginate";
import { AuthInterceptor } from './services/auth/auth-interceptor';
// Validators
// Pipes
import { OrderByPipe } from './pipes/order-by.pipe';
// components
import { HeaderOneComponent } from './header/header-one/header-one.component';
import { TopbarComponent } from './header/widgets/topbar/topbar.component';
import { NavbarComponent } from './header/widgets/navbar/navbar.component';
import { SettingsComponent } from './header/widgets/settings/settings.component';
import { FooterOneComponent } from './footer/footer-one/footer-one.component';
import { InformationComponent } from './footer/widgets/information/information.component';
import { CategoriesComponent } from './footer/widgets/categories/categories.component';
import { WhyWeChooseComponent } from './footer/widgets/why-we-choose/why-we-choose.component';
import { CopyrightComponent } from './footer/widgets/copyright/copyright.component';
import { SocialComponent } from './footer/widgets/social/social.component';

@NgModule({
  exports: [
    CommonModule,
    TranslateModule,
    HeaderOneComponent,
    FooterOneComponent,
    OrderByPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    BarRatingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    HeaderOneComponent,
    FooterOneComponent,
    OrderByPipe,
    NavbarComponent,
    SettingsComponent,
    TopbarComponent,
    InformationComponent,
    CategoriesComponent,
    WhyWeChooseComponent,
    CopyrightComponent,
    SocialComponent
  ],
  providers: [
    WINDOW_PROVIDERS,
    LandingFixService,
    InstagramService,
    WishlistService,
    CartService,
    OrderService,
    UserService,
    AuthService,
    TokenStorageService,
    PaginationService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ProductsService,
    AddressService,
    BlogService,
    AppUpdateService,
    NewsletterService
  ]
})
export class SharedModule { }