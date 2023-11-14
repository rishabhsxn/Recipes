import { createAction } from '@ngrx/store';

export enum AppActionTypes {
  NOOP = '[App] Noop',
}

export const NoopAction = createAction(AppActionTypes.NOOP);
