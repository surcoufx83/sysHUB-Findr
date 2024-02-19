import { Component } from "@angular/core";

@Component({
    selector: 'app-main',
    template: '<div>Mock MainComponent</div>',
})
export class MockMainComponent { }

@Component({
    selector: 'app-toasts',
    template: '<div>Mock ToastsComponent</div>',
})
export class MockToastsComponent { }

@Component({
    selector: 'router-outlet',
    template: '<div>Mock RouterOutlet</div>',
})
export class MockRouterOutlet { }