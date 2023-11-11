import { createReducer, on } from '@ngrx/store';
import { initialState } from './auth.store';

import * as AuthActions from '../store/auth.actions';
import { User } from '../user.model';

export const AuthReducer = createReducer(
  initialState,

  on(AuthActions.Login, AuthActions.Signup, (state, action) => ({
    ...state,
    isAuthenticating: true,
    error: null,
  })),

  on(AuthActions.AuthSuccess, (state, action) => ({
    ...state,
    error: null,
    isAuthenticating: false,
    user: new User(
      action.payload.id,
      action.payload.email,
      action.payload.token,
      action.payload.tokenExpirationDate
    ),
  })),

  on(AuthActions.AuthFailed, (state, action) => ({
    ...state,
    error: action.payload.error,
    user: null,
    isAuthenticating: false,
  })),

  on(AuthActions.Logout, (state, action) => ({
    ...state,
    user: null,
    error: null,
    isAuthenticating: false,
  }))
);
