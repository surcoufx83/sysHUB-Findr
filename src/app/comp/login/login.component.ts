import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { L10nService } from 'src/app/svc/i10n.service';
import { L10nLocale } from 'src/app/svc/i10n/l10n-locale';
import { ToastsService } from 'src/app/svc/toasts.service';
import { RestService } from 'syshub-rest-module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  title: string = 'sysHUB Findr';
  isLoggedIn?: boolean;
  loginBusy: boolean = false;
  subs: Subscription[] = [];

  inputs = new FormGroup({
    username: new FormControl(null, { validators: [Validators.required] }),
    password: new FormControl(null, { validators: [Validators.required] }),
  });

  constructor(
    private restapi: RestService,
    private toastService: ToastsService,
    private router: Router,
    private l10nService: L10nService,
  ) { }

  get l10nphrase(): L10nLocale {
    return this.l10nService.locale;
  }

  l10n(phrase: string, params: any[] = []) {
    return this.l10nService.ln(phrase, params);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subs.push(this.restapi.isLoggedIn.subscribe((v) => {
      if (v)
        this.router.navigate(['/']);
    }));
  }

  onSubmitForm(): void {
    if (this.loginBusy)
      return;
    if (!this.inputs.valid) {
      this.toastService.addDangerToast({
        message: this.l10nphrase.login.inputInvalidToast
      });
    }
    this.loginBusy = true;
    this.restapi.login(this.inputs.controls.username.value!, this.inputs.controls.password.value!).subscribe((reply) => {
      if (reply === true || reply === null)
        return;
      if (reply instanceof HttpErrorResponse) {
        switch (reply.status) {
          case 0:
            this.toastService.addDangerToast({
              message: this.l10nphrase.login.inputServerNotAvailableToast
            });
            break;
          case HttpStatusCode.Forbidden:
          default:
            this.toastService.addDangerToast({
              message: this.l10nphrase.login.inputCredentialsToast
            });
            break;
        }
      }
      this.loginBusy = false;
    });
  }

}
