import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { TokenStorageService } from './shared/services/auth/token-storage.service';
import { AppUpdateService } from './shared/services/app-update.service';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
   public url : any; 
   public userLanguage: string;
   public authority: string;
   private info: any;

   constructor(translate: TranslateService, private router: Router, private tokenStorage: TokenStorageService, appUpdateService: AppUpdateService) {
      this.userLanguage = navigator.language;
      if (this.userLanguage.includes('en')){
        this.userLanguage = 'en';
      }
      else if (this.userLanguage.includes('de')) {
        this.userLanguage = 'de';
      }
      else if (this.userLanguage.includes('fr')) {
        this.userLanguage = 'fr';
      }
      else {
        this.userLanguage = 'en';
      }

      translate.addLangs(['en', 'fr', 'de']);
      translate.setDefaultLang(this.userLanguage);
      translate.use(this.userLanguage);
      this.router.events.subscribe((event) => {
         if (event instanceof NavigationEnd) {
           this.url = event.url;
         }
      });
   }

   ngOnInit() { 

    this.authority = 'visitor';
    this.info = {
        token: this.tokenStorage.getToken(),
        roles: this.tokenStorage.getAuthorities()
    };
    if (this.info.token){
      this.info.roles.every(role => {
        if (role === 'ROLE_ADMIN') {
          this.authority = 'admin';
          return false;
        } else if (role === 'ROLE_PM') {
          this.authority = 'pm';
          return false;
        }
        this.authority = 'user';
        return true;
      });
    }
    $.getScript('assets/js/script.js');
   }
}