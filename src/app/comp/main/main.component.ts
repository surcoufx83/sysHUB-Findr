import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  missingScope: boolean;

  constructor() {
    this.missingScope = (environment.api.syshub.basic?.enabled || false) === true ? false : (environment.api.syshub.oauth?.scope !== 'private+public' && environment.api.syshub.oauth?.scope !== 'public+private');
  }

}
