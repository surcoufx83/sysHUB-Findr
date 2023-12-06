import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RestService } from 'syshub-rest-module';
import { PagepropsService } from './svc/pageprops.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title: string = 'sysHUB Findr';
  isLoggedIn?: boolean;

  constructor(
    private restapi: RestService,
    private pageprops: PagepropsService,
    router: Router,
  ) {
    this.restapi.isLoggedIn.subscribe((v) => { console.log(v); this.isLoggedIn = v });
    this.pageprops.pagetitle.subscribe((title) => this.title = title);
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log(event, event.url)
        if (this.isLoggedIn === true) {
          if (event.url === '/login')
            router.navigate(['/']);
        }
        else if (this.isLoggedIn === false) {
          if (event.url !== '/login')
            router.navigate(['/login']);
        }
      }
    });
  }

  ngOnInit(): void {
  }

}
