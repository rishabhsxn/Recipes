import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { environment } from 'src/environment/environment';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import * as AuthActions from '../store/auth.actions';
import * as AppActions from '../../store/app.actions';

export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  signup = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.Signup),
      switchMap((signupAction) => {
        return this.http
          .post<AuthResponse>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
              environment.apiKey,
            {
              email: signupAction.payload.email,
              password: signupAction.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap((authResponse) => {
              this.authService.autoLogoutInit(+authResponse.expiresIn * 1000);
            }),
            map((authResponse) => {
              return this.handleAuthentication(
                authResponse.localId,
                authResponse.email,
                authResponse.idToken,
                +authResponse.expiresIn
              );
            }),
            catchError((errResponse) => {
              return this.handleError(errResponse);
            })
          );
      })
    )
  );

  login = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.Login),
      switchMap((loginAction) => {
        return this.http
          .post<AuthResponse>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
              environment.apiKey,
            {
              email: loginAction.payload.email,
              password: loginAction.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap((authResponse) => {
              this.authService.autoLogoutInit(+authResponse.expiresIn * 1000);
            }),
            map((authResponse) => {
              return this.handleAuthentication(
                authResponse.localId,
                authResponse.email,
                authResponse.idToken,
                +authResponse.expiresIn
              );
            }),
            catchError((errResponse) => {
              return this.handleError(errResponse);
            })
          );
      })
    )
  );

  redirectOnAuthSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.AuthSuccess),
        tap((authSuccessAction) => {
          if (authSuccessAction.payload.isRedirect) this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  logout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.Logout),
        tap(() => {
          this.router.navigate(['/auth']);
          localStorage.removeItem('userData');
          this.authService.clearLogoutTimer();
        })
      ),
    { dispatch: false }
  );

  autoLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.AutoLogin),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) return AppActions.NoopAction();

        const loadedUser = new User(
          userData.id,
          userData.email,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
          this.authService.autoLogoutInit(
            new Date(userData._tokenExpirationDate).getTime() -
              new Date().getTime()
          );
          return AuthActions.AuthSuccess({
            payload: {
              id: userData.id,
              email: userData.email,
              token: userData._token,
              tokenExpirationDate: new Date(userData._tokenExpirationDate),
              isRedirect: false,
            },
          });
        }
        return AppActions.NoopAction();
      })
    )
  );

  private handleAuthentication(
    userId: string,
    email: string,
    token: string,
    tokenExpiresInSec: number
  ) {
    const tokenExpirationDate: Date = new Date(
      new Date().getTime() + tokenExpiresInSec * 1000
    );
    const loggedUser: User = new User(
      userId,
      email,
      token,
      tokenExpirationDate
    );

    localStorage.setItem('userData', JSON.stringify(loggedUser));

    return AuthActions.AuthSuccess({
      payload: {
        id: userId,
        email,
        token,
        tokenExpirationDate,
        isRedirect: true,
      },
    });
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    console.log('Error from auth:', err);

    if (err.error && err.error.error && err.error.error.message) {
      switch (err.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'User already exists!';
          break;

        case 'INVALID_LOGIN_CREDENTIALS':
        case 'EMAIL_NOT_FOUND':
        case 'INVALID_PASSWORD':
          errorMessage = 'Invalid email or password!';
          break;
      }
    }

    return of(
      AuthActions.AuthFailed({
        payload: {
          error: errorMessage,
        },
      })
    );
  }
}
