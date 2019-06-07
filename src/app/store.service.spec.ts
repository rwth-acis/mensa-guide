import {TestBed} from '@angular/core/testing';

import {StoreService} from './store.service';
import {APP_BASE_HREF} from '@angular/common';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('StoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG}), HttpClientTestingModule],
    providers: [{provide: APP_BASE_HREF, useValue: '/'}],
  }));

  it('should be created', () => {
    const service: StoreService = TestBed.get(StoreService);
    expect(service).toBeTruthy();
  });
});
