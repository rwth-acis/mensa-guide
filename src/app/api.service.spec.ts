import {TestBed} from '@angular/core/testing';

import {ApiService} from './api.service';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG}), HttpClientTestingModule],
    providers: [{provide: APP_BASE_HREF, useValue: '/'}],
  }));

  it('should be created', () => {
    const service: ApiService = TestBed.get(ApiService);
    expect(service).toBeTruthy();
  });
});
