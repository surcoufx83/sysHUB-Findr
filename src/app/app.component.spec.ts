import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppInitService } from './svc/app-init.service';
import { MockAppInitService, MockL10nService } from 'src/testing/mock';
import { Settings } from 'syshub-rest-module';
import { APP_BASE_HREF } from '@angular/common';
import { L10nService } from './svc/i10n.service';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
            ],
            declarations: [
                AppComponent
            ],
            providers: [
                { provide: APP_BASE_HREF, useValue: '/' },
                { provide: AppInitService, useClass: MockAppInitService },
                { provide: Settings, multi: false, useFactory: (initService: AppInitService) => initService.environment?.api.syshub, deps: [AppInitService] },
                { provide: L10nService, useClass: MockL10nService }
            ]
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    // Hier können weitere Tests hinzugefügt werden
});
