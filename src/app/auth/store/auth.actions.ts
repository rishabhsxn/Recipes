import { createAction, props } from '@ngrx/store';

// Action Types
export enum AuthActions {
  LOGIN = '[Auth] Login',
  SIGNUP = '[Auth] Signup',
  AUTH_SUCCESS = '[Auth] Authentication Successful',
  AUTH_FAIL = '[Auth] Authentication Failed',
  LOGOUT = '[Auth] Logout',
}

// Actions Creators
export const Login = createAction(
  AuthActions.LOGIN,
  props<{ payload: { email: string; password: string } }>()
);

export const Signup = createAction(
  AuthActions.SIGNUP,
  props<{ payload: { email: string; password: string } }>()
);

export const AuthSuccess = createAction(
  AuthActions.AUTH_SUCCESS,
  props<{
    payload: {
      id: string;
      email: string;
      token: string;
      tokenExpirationDate: Date;
    };
  }>()
);

export const AuthFailed = createAction(
  AuthActions.AUTH_FAIL,
  props<{ payload: { error: string } }>()
);

export const Logout = createAction(AuthActions.LOGOUT);
