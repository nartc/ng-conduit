import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { lastValueFrom } from 'rxjs';
import { AuthInterceptor, provideAuthInterceptor } from './auth.interceptor';
import { LocalStorageService } from './local-storage.service';

describe(AuthInterceptor.name, () => {
  let http: HttpClient;
  let httpController: HttpTestingController;

  let mockedLocalStorageService: jasmine.SpyObj<LocalStorageService>;

  beforeEach(() => {
    mockedLocalStorageService = jasmine.createSpyObj<LocalStorageService>(
      LocalStorageService.name,
      ['getItem']
    );

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: LocalStorageService, useValue: mockedLocalStorageService },
        provideAuthInterceptor(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('Given there is no token', () => {
    it('Then a request is made without the auth header', () => {
      lastValueFrom(http.get('/api/user'));

      const request = httpController.expectOne('/api/user');
      expect(request.request.headers.get('Authorization')).toBeFalsy();
    });
  });

  describe('Given there is a token', () => {
    it('Then a request is made with the auth header', () => {
      mockedLocalStorageService.getItem
        .withArgs('ng-conduit-token')
        .and.returnValue('token');

      lastValueFrom(http.get('/api/user'));

      const request = httpController.expectOne('/api/user');
      expect(request.request.headers.get('Authorization')).toEqual(
        'Token token'
      );
    });
  });
});
