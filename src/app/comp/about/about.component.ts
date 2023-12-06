import { Component } from '@angular/core';
import { L10nService } from 'src/app/svc/i10n.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  currentLocale: string;

  constructor(
    l10nService: L10nService,
  ) {
    this.currentLocale = l10nService.lang.length > 2 ? l10nService.lang.substring(0, 2) : l10nService.lang;
  }

}
