import { User } from '../user.model';

export interface AuthState {
  user: User;
  error: string;
  isAuthenticating: boolean;
}

export const initialState: AuthState = {
  user: null,
  error: '',
  isAuthenticating: false,
};
