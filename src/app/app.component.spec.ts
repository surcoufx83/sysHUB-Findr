import { ComponentFixture, TestBed, async, fakeAsync, flush, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppInitService } from './svc/app-init.service';
import { RestService } from 'syshub-rest-module';
import { L10nService } from './svc/i10n.service';
import { MockL10n } from './svc/i10n/l10n-mock';
import { HttpStatusCode } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { PagepropsService } from './svc/pageprops.service';
import { NavigationEnd, Router } from '@angular/router';
import { ToastsService } from './svc/toasts.service';
import { MockMainComponent, MockToastsComponent } from 'src/testing/mock';

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;

    let mockLoggedIn = new BehaviorSubject<boolean>(true);
    let mockPageTitle = new BehaviorSubject<string>('foo');
    let mockRouterEvents = new BehaviorSubject<any>({});

    let mockEnvironment = {
        appInitializationFailure: {
            configStatusCode: HttpStatusCode.Ok,
        },
    }

    let mockAppInitService = {
        environment: mockEnvironment,
    };

    let mockL10nService = {
        ln: jasmine.createSpy('ln').and.returnValue('foo'),
        locale: MockL10n,
    };

    let mockPagepropsService = {
        pagetitle: mockPageTitle.asObservable(),
    };

    let mockRestService = {
        isLoggedIn: mockLoggedIn.asObservable(),
    };

    let mockRouter = {
        events: mockRouterEvents.asObservable(),
        navigate: jasmine.createSpy('navigate'),
    };

    let mockToastsService = {
        addDangerToast: jasmine.createSpy('addDangerToast'),
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            declarations: [
                AppComponent,
                MockMainComponent,
                MockToastsComponent,
            ],
            providers: [
                { provide: AppInitService, useValue: mockAppInitService },
                { provide: L10nService, useValue: mockL10nService },
                { provide: PagepropsService, useValue: mockPagepropsService },
                { provide: RestService, useValue: mockRestService },
                { provide: Router, useValue: mockRouter },
                { provide: ToastsService, useValue: mockToastsService },
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.debugElement.componentInstance;
    }));

    afterEach(() => {
        mockAppInitService.environment = mockEnvironment;
        mockLoggedIn.next(true);
        mockPageTitle.next('foo');
        mockRouterEvents.next({});
        mockRouter.navigate = jasmine.createSpy('navigate');
        mockToastsService.addDangerToast = jasmine.createSpy('addDangerToast');
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('should contain correct components if logged in', () => {
        fixture.detectChanges();
        let compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('router-outlet')).withContext('Router outlet').toBeFalsy();
        expect(compiled.querySelector('app-main')).withContext('Main component').toBeTruthy();
        expect(compiled.querySelector('app-toasts')).withContext('Toasts component').toBeTruthy();
    });

    it('should contain correct components if logged out', () => {
        mockLoggedIn.next(false);
        fixture.detectChanges();
        let compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('router-outlet')).withContext('Router outlet').toBeTruthy();
        expect(compiled.querySelector('app-main')).withContext('Main component').toBeFalsy();
        expect(compiled.querySelector('app-toasts')).withContext('Toasts component').toBeTruthy();
    });

    it('should forward logged out user to /login', () => {
        mockLoggedIn.next(false);
        fixture.detectChanges();
        mockRouter.navigate = jasmine.createSpy('navigate');
        mockRouterEvents.next(new NavigationEnd(1, '/', '/'));
        expect(mockRouter.navigate).withContext('Navigate to /login').toHaveBeenCalledWith(['/login']);
        mockRouter.navigate = jasmine.createSpy('navigate');
        mockRouterEvents.next(new NavigationEnd(1, '/foo', '/foo'));
        expect(mockRouter.navigate).withContext('Navigate to /login').toHaveBeenCalledWith(['/login']);
    });

    it('should forward logged in user to /', () => {
        mockLoggedIn.next(true);
        fixture.detectChanges();
        mockRouter.navigate = jasmine.createSpy('navigate');
        mockRouterEvents.next(new NavigationEnd(1, '/', '/'));
        expect(mockRouter.navigate).withContext('Do not navigate').not.toHaveBeenCalled();
        mockRouter.navigate = jasmine.createSpy('navigate');
        mockRouterEvents.next(new NavigationEnd(1, '/foo', '/foo'));
        expect(mockRouter.navigate).withContext('Do not navigate').not.toHaveBeenCalled();
        mockRouter.navigate = jasmine.createSpy('navigate');
        mockRouterEvents.next(new NavigationEnd(1, '/login', '/login'));
        expect(mockRouter.navigate).withContext('Navigate to /').toHaveBeenCalledWith(['/']);
    });

    it('should navigate to login page after loading', () => {
        mockLoggedIn.next(false);
        fixture.detectChanges();
        expect(mockRouter.navigate).withContext('Navigate to /login after logout').toHaveBeenCalledWith(['/login']);
    });

    it('should navigate to start page after logging in', () => {
        mockLoggedIn.next(false);
        fixture.detectChanges();
        mockLoggedIn.next(true);
        fixture.detectChanges();
        expect(mockRouter.navigate).withContext('Navigate to / after login').toHaveBeenCalledWith(['/']);
    });

    it('implements l10n and l10nphrase method correct', () => {
        let value = component.l10n('test');
        expect(mockL10nService.ln).withContext('Call ln method of L10nService').toHaveBeenCalledWith('test', []);
        expect(value).withContext('Return correct value').toEqual('foo');
        expect(component.l10nphrase).withContext('l10nphrase').toEqual(MockL10n);
    });

});
