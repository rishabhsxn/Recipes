import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import * as AuthActions from './store/auth.actions';
import { AppState } from '../store/state';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: [],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode: boolean = false;
  isLoading: boolean = false;
  error: string;
  closeAlertSubscription: Subscription;
  storeSubscription: Subscription;

  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;

  constructor(
    private store: Store<AppState>,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    this.storeSubscription = this.store
      .select('auth')
      .subscribe((authState) => {
        this.isLoading = authState.isAuthenticating;
        this.error = authState.error;
        if (this.error) this.showAlert(this.error);
      });
  }

  ngOnDestroy(): void {
    if (this.closeAlertSubscription) this.closeAlertSubscription.unsubscribe();
    if (this.storeSubscription) this.storeSubscription.unsubscribe();
  }

  toggleAuthMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm): void {
    console.log(authForm);
    if (!authForm.valid) return;

    const email = authForm.value.email;
    const password = authForm.value.password;

    // sign in
    if (this.isLoginMode)
      this.store.dispatch(AuthActions.Login({ payload: { email, password } }));
    // sign up
    else
      this.store.dispatch(AuthActions.Signup({ payload: { email, password } }));

    authForm.reset();
  }

  onCloseAlert(): void {
    this.store.dispatch(AuthActions.ClearError());
  }

  private showAlert(message: string): void {
    const alertCompFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    const alertHostViewContainerRef = this.alertHost.viewContainerRef;
    alertHostViewContainerRef.clear();

    const componentRef =
      alertHostViewContainerRef.createComponent(alertCompFactory);
    componentRef.instance.message = message;
    this.closeAlertSubscription = componentRef.instance.closeAlert.subscribe(
      () => {
        this.closeAlertSubscription.unsubscribe();
        this.error = null;
        alertHostViewContainerRef.clear();
      }
    );
  }
}
