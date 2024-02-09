import { Component } from '@angular/core';
import { AppInitService } from 'src/app/svc/app-init.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  missingScope: boolean;

  constructor(
    appInitService: AppInitService,
  ) {
    this.missingScope = (appInitService.environment.api.syshub.basic?.enabled || false) === true ? false : (appInitService.environment.api.syshub.oauth?.scope !== 'private+public' && appInitService.environment.api.syshub.oauth?.scope !== 'public+private');
  }

}
