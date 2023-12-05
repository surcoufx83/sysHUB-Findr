import { Component, OnDestroy, OnInit } from '@angular/core';
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
  subs: Subscription[] = [];

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
      console.log(v);
      if (v)
        this.router.navigate(['/']);
    }));
  }

}
