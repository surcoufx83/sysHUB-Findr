import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { L10nService } from 'src/app/svc/i10n.service';
import { PagepropsService } from 'src/app/svc/pageprops.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnDestroy, OnInit {

  currentLocale: string;
  theme: 'light' | 'dark' | 'auto' | null = null;
  themeSub?: Subscription;

  constructor(
    l10nService: L10nService,
    private propsService: PagepropsService,
  ) {
    this.currentLocale = l10nService.lang.length > 2 ? l10nService.lang.substring(0, 2) : l10nService.lang;
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.themeSub = this.propsService.AppTheme.subscribe((t) => this.theme = t);
  }

}
