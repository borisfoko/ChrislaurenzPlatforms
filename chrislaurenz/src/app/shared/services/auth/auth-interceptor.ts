import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
 
import { TokenStorageService } from './token-storage.service';
import { filter, take, switchMap, catchError } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { JwtResponse } from '../../classes/jwt-response';

const TOKEN_HEADER_KEY = 'x-access-token';
 
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
 
    isRefreshingToken: boolean = false;
    tokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    
    constructor(private tokenStorage: TokenStorageService, private authService: AuthService) { }
 
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any> | any> {

        const token = this.tokenStorage.getToken();
        
        if (token && req.url.includes('api.chrislaurenz.de')){
            req = this.addTokenToRequest(req, token);
        }

        return next.handle(req)
        .pipe(
            catchError((error: HttpErrorResponse): any => {
                    if (error.error instanceof ErrorEvent) {
                        switch ((<HttpErrorResponse>error).status) {
                            case 411:
                                return this.handle411Error(req, next);
                            case 412:
                                return this.handle412Error(error);
                        }
                    } else {
                        return throwError(error);
                    } 
                }
            )
        );
    }
      
    private handle411Error(req: HttpRequest<any>, next: HttpHandler){
        // If isRefreshingToken is false (which it is by default) we will 
        // enter the code section that calls authService.refreshToken
        if (!this.isRefreshingToken) { 
            // Immediately set isRefreshingToken to true so no more calls 
            // come in and call refreshToken again – which we don’t want of course
            this.isRefreshingToken = true; 
            // Reset here so that the following requests wait until the token
            // comes back from the refreshToken call.
            this.tokenSubject.next(null);
            const refreshToken = this.tokenStorage.getRefreshToken();
            // Call authService.refreshToken (this is an Observable that will be returned)
            return this.authService.refreshToken(refreshToken).pipe(
                switchMap((jwtResponse: JwtResponse) => {
                    if (jwtResponse) {
                        this.tokenStorage.saveExpiresAt(jwtResponse.expiresIn);
                        this.tokenStorage.saveToken(jwtResponse.accessToken);
                        // When successful, call tokenSubject.next on the new token, 
                        // this will notify the API calls that came in after the refreshToken 
                        // call that the new token is available and that they can now use it
                        this.isRefreshingToken = false;
                        this.tokenSubject.next(jwtResponse.accessToken);
                        // Return next.handle using the new token
                        req = this.addTokenToRequest(req, jwtResponse.accessToken)
                        return next.handle(req);
                    }
                    // If we don't get a new token, we are in trouble so logout.
                    this.logout();
                    return throwError("Wrong response");
                })
            );       
        }
        // If isRefreshingToken is true, we will wait until tokenSubject has a non-null value 
        // – which means the new token is ready 
        else {
            return this.tokenSubject.pipe(
                filter(token => token != null),
                // Only take 1 here to avoid returning two – which will cancel the request
                take(1),
                switchMap(token => {
                    // When the token is available, return the next.handle of the new request
                    return next.handle(this.addTokenToRequest(req, token));
                })
            );
        }
    }

    private handle412Error(error: any){
        if (error && error.status === 412 || error.error && error.error.message === 'invalid_refresh_token') {
            // If we get a 412 and the error message is 'invalid_refresh_token', the token is no longer valid so logout.
            console.log('inside the conditional');
            this.logout();
            return throwError(error);
        }

        return throwError(error);
    }

    private addTokenToRequest(req: HttpRequest<any>, token: string) : HttpRequest<any> {
        req = req.clone({headers: req.headers.set('Content-Type', 'application/json')});
        req = req.clone({headers: req.headers.set('Access-Control-Allow-Origin', '*')});
        req = req.clone({headers: req.headers.set(TOKEN_HEADER_KEY, token)});

        return req;
    }
      
    logout() {
        this.tokenStorage.signOut();
        window.location.reload();
    }
}