import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of} from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstagramService {
  
  // Initialize 
  constructor(private http: HttpClient) { }

  // Instagram Array
  public getInstagramData() {
    return this.http.get(`https://api.instagram.com/v1/users/self/media/recent/?access_token=${environment.instagramAccessToken}&count=15`);
  }
}