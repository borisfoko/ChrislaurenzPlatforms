import { Injectable, ApplicationRef } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { constructor } from 'moment';
import { first } from 'rxjs/operators';
import { interval, concat } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {

    constructor(private appRef: ApplicationRef, private readonly updates: SwUpdate) {
        if (this.updates.isEnabled) {
            const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
            const everySixHours$ = interval(2 * 60 * 60 * 1000);
            const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
            everySixHoursOnceAppIsStable$.subscribe(() => this.updates.checkForUpdate());
            this.updates.available.subscribe(event => {
                this.doAppUpdate();
            });
        }
            
    } 

    doAppUpdate() {
        this.updates.activateUpdate().then(() => document.location.reload());
    }
}