import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { render } from '@testing-library/angular';
import { lastValueFrom } from 'rxjs';
import { AuthInterceptor, provideAuthInterceptor } from './auth.interceptor';
import { LocalStorageService } from './local-storage.service';

describe(AuthInterceptor.name, () => {
  let http: HttpClient;
  let httpController: HttpTestingController;

  let mockedLocalStorageService: jasmine.SpyObj<LocalStorageService>;

  async function setup(mockLocalStorage = false) {
    mockedLocalStorageService = jasmine.createSpyObj<LocalStorageService>(
      LocalStorageService.name,
      ['getItem']
    );

    if (mockLocalStorage) {
      mockedLocalStorageService.getItem
        .withArgs('ng-conduit-token')
        .and.returnValue('token');
    }

    const { debugElement } = await render('', {
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: LocalStorageService, useValue: mockedLocalStorageService },
        provideAuthInterceptor(),
      ],
    });

    http = debugElement.injector.get(HttpClient);
    httpController = debugElement.injector.get(HttpTestingController);
  }

  afterEach(() => {
    httpController.verify();
  });

  describe('Given there is no token', () => {
    it('Then a request is made without the auth header', async () => {
      await setup();
      lastValueFrom(http.get('/api/user'));
      const request = httpController.expectOne('/api/user');
      expect(request.request.headers.get('Authorization')).toBeFalsy();
    });
  });

  describe('Given there is a token', () => {
    it('Then a request is made with the auth header', async () => {
      await setup(true);
      lastValueFrom(http.get('/api/user'));

      const request = httpController.expectOne('/api/user');
      expect(request.request.headers.get('Authorization')).toEqual(
        'Token token'
      );
    });
  });
});
