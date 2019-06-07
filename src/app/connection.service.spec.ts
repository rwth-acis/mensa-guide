import { TestBed } from '@angular/core/testing';

import { ConnectionService } from './connection.service';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ConnectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG}), HttpClientTestingModule],
    providers: [{provide: APP_BASE_HREF, useValue: '/'}],
  }));

  it('should be created', () => {
    const service: ConnectionService = TestBed.get(ConnectionService);
    expect(service).toBeTruthy();
  });
});
