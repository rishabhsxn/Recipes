import { Component, OnInit, isDevMode } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (isDevMode()) console.log('DEVELOPMENT MODE!');
    else console.log('PRODUCTION MODE!');

    this.authService.autoLogin();
  }
}
