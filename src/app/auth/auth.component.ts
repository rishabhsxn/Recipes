import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponse, AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: [],
})
export class AuthComponent implements OnDestroy {
  isLoginMode: boolean = false;
  isLoading: boolean = false;
  error: string;
  closeAlertSubscription: Subscription;

  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnDestroy(): void {
    if (this.closeAlertSubscription) this.closeAlertSubscription.unsubscribe();
  }

  toggleAuthMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm): void {
    console.log(authForm);
    if (!authForm.valid) return;

    const email = authForm.value.email;
    const password = authForm.value.password;
    this.isLoading = true;

    let authObservable: Observable<AuthResponse>;

    // sign in
    if (this.isLoginMode)
      authObservable = this.authService.signin(email, password);
    // sign up
    else authObservable = this.authService.signUp(email, password);

    authObservable.subscribe({
      next: (res) => {
        console.log('response from auth:', res);
        this.error = '';
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: (err) => {
        this.error = err;
        this.showAlert(err);
        this.isLoading = false;
      },
    });

    authForm.reset();
  }

  onCloseAlert(): void {
    this.error = null;
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
