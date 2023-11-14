import { Component, OnInit, isDevMode } from '@angular/core';
import { Store } from '@ngrx/store';

import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    if (isDevMode()) console.log('DEVELOPMENT MODE!');
    else console.log('PRODUCTION MODE!');

    this.store.dispatch(AuthActions.AutoLogin());
  }
}
