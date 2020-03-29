import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { TokenStorageService } from '../../../shared/services/auth/token-storage.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { VerificationInfo } from '../../../shared/classes/verification-info';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {

  info: VerificationInfo;
  isUserVerified = false;
  errorMessage = '';

  constructor(private route: ActivatedRoute,  private tokenStorage: TokenStorageService, private authService: AuthService, private router: Router) { 
    this.route.queryParams.subscribe(params => {
      this.info = new VerificationInfo(params['email'], params['token']);
    });
  }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.router.navigate(['/']);
    }
    else {
      this.verifyIdentty();
    }
  }

  verifyIdentty(){
    this.authService.verifyIdentityByToken(this.info).subscribe(
      data => {
        console.log(data);
        this.isUserVerified = true;
      },
      error => {
        console.log(error);
        this.errorMessage = error.error;
        this.isUserVerified = false;
      }
    );
  }

  gotoSignIn(){
    this.router.navigate(['/login']);
  }
}
