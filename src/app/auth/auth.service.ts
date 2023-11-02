import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment';

export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          environment.apiKey,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleAuthentication(
            res.localId,
            res.email,
            res.idToken,
            +res.expiresIn
          );
        })
      );
  }

  signin(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          environment.apiKey,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleAuthentication(
            res.localId,
            res.email,
            res.idToken,
            +res.expiresIn
          );
        })
      );
  }

  logout(): void {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) clearInterval(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
  }

  autoLogoutInit(expirationDurationInMs: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDurationInMs);
  }

  autoLogin(): void {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) return;

    const loadedUser = new User(
      userData.id,
      userData.email,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      this.autoLogoutInit(
        new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
      );
    }
  }

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
    this.user.next(loggedUser);
    localStorage.setItem('userData', JSON.stringify(loggedUser));
    this.autoLogoutInit(tokenExpiresInSec * 1000);
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

    return throwError(errorMessage);
  }
}
