import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { Address } from '../classes/address';
import { isNullOrUndefined } from 'util';

@Injectable()
export class AddressService {
 
  private addressUrl = `${environment.serverUrl}/address`;

  constructor(private http: HttpClient) { }
 
  getAddressById(id: number): Observable<any> {
    return this.http.get(`${this.addressUrl}/${id}`);
  }

  postAddress(address: Address, customerId?: number): Observable<any> {
    if (!isNullOrUndefined(customerId)){
      return this.http.post(`${this.addressUrl}/${customerId}`, address);
    }
    else {
      return this.http.post(`${this.addressUrl}`, address);
    }
  }

  updateUser(address: Address): Observable<string> {
    return this.http.put<string>(`${this.addressUrl}/${address.id}`, address);
  }

  deleteUser(id: number): Observable<string> {
    return this.http.delete<string>(`${this.addressUrl}/${id}`);
  }
}