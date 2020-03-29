import { Component, OnInit } from '@angular/core';
import { NewsletterService } from 'src/app/shared/services/newsletter.service';
import { TokenStorageService } from 'src/app/shared/services/auth/token-storage.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Newsletter } from 'src/app/shared/classes/newsletter';
declare var $: any;

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {

  form: any = {};
  private newsletterInfo: Newsletter;
  private newsletterSuccess : string = '';
  private newsletterError: string = '';
  
  constructor(private newsletterService: NewsletterService, 
    private tokenStorageService: TokenStorageService, 
    private toastrService: ToastrService,
    private translate: TranslateService) { }

  ngOnInit() {
  	if(this.tokenStorageService.getEntryState() != 'newsletter'){
  		$('.newsletterm').modal('show');
  		this.tokenStorageService.saveEntryState('newsletter');
    }
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
