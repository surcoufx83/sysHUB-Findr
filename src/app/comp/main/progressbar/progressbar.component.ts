import { Component } from '@angular/core';
import { SearchService } from 'src/app/svc/search.service';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss']
})
export class ProgressbarComponent {

  progressCurrent: number = 0;
  progressRel: string = '0%';
  searchBusy: boolean = false;

  constructor(searchService: SearchService) {
    searchService.searchBusy.subscribe((busy) => this.searchBusy = busy);
    searchService.searchProgress.subscribe((val) => {
      this.progressCurrent = val;
      this.progressRel = `${val}%`;
    });
  }

}
