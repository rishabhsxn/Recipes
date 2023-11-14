import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../store/state';
import * as AuthActions from './store/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenExpirationTimer: any;

  constructor(private store: Store<AppState>) {}

  autoLogoutInit(expirationDurationInMs: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      console.log('dispatching logout: ', expirationDurationInMs);
      this.store.dispatch(AuthActions.Logout());
    }, expirationDurationInMs);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearInterval(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}
