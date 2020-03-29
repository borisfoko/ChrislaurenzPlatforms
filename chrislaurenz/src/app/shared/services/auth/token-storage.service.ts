import { Injectable } from '@angular/core';
import * as moment from 'moment';

const TOKEN_KEY = 'AuthToken';
const REFRESH_TOKEN_KEY = 'RefreshToken';
const EXPIRES_AT = 'ExpiresAt';
const USERNAME_KEY = 'AuthUsername';
const FIRSTNAME_KEY = 'AuthFirstname';
const GENDER_KEY = 'AuthGender';
const AUTHORITIES_KEY = 'AuthAuthorities';
const ENTRY_STATE = 'EntryState';
 
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private roles: Array<string> = [];
  constructor() { }
 
  signOut() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(EXPIRES_AT);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(FIRSTNAME_KEY);
    localStorage.removeItem(AUTHORITIES_KEY);
  }
 
  public saveToken(token: string) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }
 
  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }
 
  public saveRefreshToken(token: string) {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
 
  public getRefreshToken(): string {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  public saveExpiresAt(expiresIn: number){
    const expiresAt = moment().add(expiresIn, 'second');
    localStorage.removeItem(EXPIRES_AT);
    localStorage.setItem(EXPIRES_AT, JSON.stringify(expiresAt.valueOf()));
  }

  public getExpiresAt(){
    return moment(JSON.parse(localStorage.getItem(EXPIRES_AT)));
  }

  public saveUsername(username: string) {
    localStorage.removeItem(USERNAME_KEY);
    localStorage.setItem(USERNAME_KEY, username);
  }
 
  public getUsername(): string {
    return localStorage.getItem(USERNAME_KEY);
  }

  public saveFirstname(firstname: string) {
    localStorage.removeItem(FIRSTNAME_KEY);
    localStorage.setItem(FIRSTNAME_KEY, firstname);
  }
 
  public getFirstname(): string {
    return localStorage.getItem(FIRSTNAME_KEY);
  }

  public saveGender(gender: string) {
    localStorage.removeItem(GENDER_KEY);
    localStorage.setItem(GENDER_KEY, gender);
  }
 
  public getGender(): string {
    return localStorage.getItem(GENDER_KEY);
  }
 
  public saveAuthorities(authorities: string[]) {
    localStorage.removeItem(AUTHORITIES_KEY);
    localStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }
 
  public getAuthorities(): string[] {
    this.roles = [];
 
    if (localStorage.getItem(TOKEN_KEY)) {
      JSON.parse(localStorage.getItem(AUTHORITIES_KEY)).forEach(authority => {
        this.roles.push(authority.authority);
      });
    }
 
    return this.roles;
  }

  public saveEntryState(entryState: string) {
    localStorage.removeItem(ENTRY_STATE);
    localStorage.setItem(ENTRY_STATE, entryState);
  }

  public getEntryState(): string {
    return localStorage.getItem(ENTRY_STATE);
  }
}