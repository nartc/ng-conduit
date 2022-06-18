import { Router } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { render } from '@testing-library/angular';
import { of } from 'rxjs';
import {
  ApiClient,
  Article,
  SingleArticleResponse,
} from '../shared/data-access/api';
import { AuthStore } from '../shared/data-access/auth.store';
import {
  getMockedArticle,
  getMockedProfile,
  getMockedUser,
} from '../testing.spec';
import { NewArticleStore } from './new-article.store';

describe(NewArticleStore.name, () => {
  let store: NewArticleStore;

  let mockedApiClient: jasmine.SpyObj<ApiClient>;
  let mockedRouter: jasmine.SpyObj<Router>;
  let mockedAuthStore: jasmine.SpyObj<AuthStore>;

  const mockedUser = getMockedUser();

  async function setup() {
    mockedApiClient = jasmine.createSpyObj<ApiClient>(ApiClient.name, [
      'createArticle',
    ]);
    mockedRouter = jasmine.createSpyObj<Router>(Router.name, ['navigate']);
    mockedAuthStore = jasmine.createSpyObj<AuthStore>(AuthStore.name, [], {
      auth$: of({
        user: mockedUser,
        profile: getMockedProfile(),
        isAuthenticated: true,
      }),
    });

    const { debugElement } = await render('', {
      providers: [
        { provide: ApiClient, useValue: mockedApiClient },
        { provide: Router, useValue: mockedRouter },
        { provide: AuthStore, useValue: mockedAuthStore },
        provideComponentStore(NewArticleStore),
      ],
    });

    store = debugElement.injector.get(NewArticleStore);
  }

  describe('When init', () => {
    it('Then create store', async () => {
      await setup();
      expect(store).toBeTruthy();
    });
  });

  describe('Given create article success', () => {
    describe('When createArticle', () => {
      function arrangeCreateArticle(article?: Article) {
        if (article) {
          mockedApiClient.createArticle.and.returnValue(of({ article }));
        } else {
          mockedApiClient.createArticle.and.returnValue(
            of(null as unknown as SingleArticleResponse)
          );
        }
      }
      describe('Given api.createArticle returns the article', () => {
        it('Then navigate to article page', async () => {
          await setup();
          const mockedArticle = getMockedArticle();
          arrangeCreateArticle(mockedArticle);

          const newArticle = {
            title: 'title',
            body: 'body',
            tagList: [],
            description: 'description',
          };
          store.createArticle(newArticle);

          expect(mockedApiClient.createArticle).toHaveBeenCalledWith({
            article: newArticle,
          });
          expect(mockedRouter.navigate).toHaveBeenCalledWith([
            '/article',
            mockedArticle.slug,
          ]);
        });
      });

      describe('Given api.createArticle does not return the article', () => {
        it('Then navigate to user page', async () => {
          await setup();
          arrangeCreateArticle();

          const newArticle = {
            title: 'title',
            body: 'body',
            tagList: [],
            description: 'description',
          };
          store.createArticle(newArticle);

          expect(mockedApiClient.createArticle).toHaveBeenCalledWith({
            article: newArticle,
          });
          expect(mockedRouter.navigate).toHaveBeenCalledWith([
            '/profile',
            mockedUser.username,
          ]);
        });
      });
    });
  });
});
