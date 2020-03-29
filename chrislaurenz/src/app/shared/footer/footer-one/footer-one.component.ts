import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../classes/product';
import { ProductsService } from '../../services/products.service';
import { NewsletterService } from '../../services/newsletter.service';
import { TokenStorageService } from '../../services/auth/token-storage.service';
import { Newsletter } from '../../classes/newsletter';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer-one',
  templateUrl: './footer-one.component.html',
  styleUrls: ['./footer-one.component.scss']
})
export class FooterOneComponent implements OnInit {
  
  form: any = {};
  private newsletterInfo: Newsletter;
  private newsletterSuccess : string = '';
  private newsletterError: string = '';
  public productCategories: ProductCategory[] = [];

  constructor(
    private newsletterService: NewsletterService, 
    private tokenStorageService: TokenStorageService, 
    private toastrService: ToastrService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.productCategories = [
      {id: 1, name: "en:Women/de:Damen/fr:Femme"},
      {id: 2, name: "en:Men/de:Herren/fr:Homme"},
      {id: 3, name: "en:Girl/de:Mädchen/fr:Fille"},
      {id: 4, name: "en:Boy/de:Junge/fr:Garçon"},
      {id: 5, name: "en:Kids/de:Kinder/fr:Enfants"},
      {id: 6, name: "en:All/de:Alle/fr:All"}
    ]
    this.translate.get('newsletter-success').subscribe((res: string) => { this.newsletterSuccess = res; });
    this.translate.get('newsletter-error').subscribe((res: string) => { this.newsletterError = res; });
  }

  onSubmit() {
    this.newsletterInfo = new Newsletter();
    this.newsletterInfo.email = this.form.email;
    const gender = this.tokenStorageService.getGender();
    if (!gender) {
      this.newsletterInfo.gender = 'U';
    }
    else {
      this.newsletterInfo.gender = gender;
    }
    this.newsletterInfo.creationTimestamp = new Date();

    this.newsletterService.sendNewsletter(this.newsletterInfo).subscribe(
      data => {
        this.toastrService.success(this.newsletterSuccess);
      },
      error => {
        this.toastrService.error(this.newsletterError);
      }
    )
  }
}
