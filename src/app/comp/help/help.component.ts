import { Component } from '@angular/core';
import { L10nService } from 'src/app/svc/i10n.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent {

  currentLocale: string;
  showGithubLink = environment.app?.promotionLink != undefined;
  showWebclientLink = environment.app?.webclientLink != undefined;

  constructor(
    l10nService: L10nService,
  ) {
    this.currentLocale = l10nService.lang.length > 2 ? l10nService.lang.substring(0, 2) : l10nService.lang;
  }

}
