import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { Newsletter } from '../classes/newsletter';
import { VerificationInfo } from '../classes/verification-info';

@Injectable()
export class NewsletterService {
 
  private newsletterUrl = `${environment.serverUrl}/newsletter`;
  private disableNewsletterUrl = `${environment.serverUrl}/newsletter/disable`;
 
  constructor(private httpClient: HttpClient) { }
 
  public getNewsletters(): Observable<Newsletter[]> {
    return this.httpClient.get<Newsletter[]>(this.newsletterUrl).map((res:any) => res);
  }

  public getNewsletterById(id: number): Observable<Newsletter> {
    return this.httpClient.get<Newsletter>(`${this.newsletterUrl}/${id}`).map((res:any) => res);
  }

  public sendNewsletter(newsletter: Newsletter): Observable<string> {
    return this.httpClient.post<string>(this.newsletterUrl, newsletter).map((res:any) => res);
  }

  public disableNewletter(verificationInfo: VerificationInfo): Observable<string> {
    return this.httpClient.post<string>(this.disableNewsletterUrl, verificationInfo).map((res:any) => res);
  }
}