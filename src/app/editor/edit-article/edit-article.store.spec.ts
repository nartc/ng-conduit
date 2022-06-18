import { ActivatedRoute, Params, Router } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { render } from '@testing-library/angular';
import { EMPTY, of, ReplaySubject, take } from 'rxjs';
import { ApiClient } from '../../shared/data-access/api';
import { getMockedArticle, getMockedProfile } from '../../testing.spec';
import { EditArticleStore } from './edit-article.store';

describe(EditArticleStore.name, () => {
  let store: EditArticleStore;

  let mockedParams: ReplaySubject<Params>;

  let mockedApiClient: jasmine.SpyObj<ApiClient>;
  let mockedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockedRouter: jasmine.SpyObj<Router>;

  const mockedProfile = getMockedProfile();
  const mockedArticle = getMockedArticle({ profile: mockedProfile });
  const mockedSlug = mockedArticle.slug;

  async function setup(getArticleState: 'success' | 'idle' = 'idle') {
    mockedParams = new ReplaySubject<Params>();
    mockedParams.next({ slug: mockedSlug });

    mockedApiClient = jasmine.createSpyObj<ApiClient>(ApiClient.name, [
      'getArticle',
      'updateArticle',
    ]);

    if (getArticleState === 'success') {
      mockedApiClient.getArticle
        .withArgs(mockedSlug)
        .and.returnValue(of({ article: mockedArticle }));
    } else {
      mockedApiClient.getArticle.withArgs(mockedSlug).and.returnValue(EMPTY);
    }

    mockedRoute = jasmine.createSpyObj<ActivatedRoute>(
      ActivatedRoute.name,
      [],
      { params: mockedParams.asObservable() }
    );
    mockedRouter = jasmine.createSpyObj<Router>(Router.name, ['navigate']);

    const { debugElement } = await render(`dummy`, {
      providers: [
        { provide: Router, useValue: mockedRouter },
        { provide: ApiClient, useValue: mockedApiClient },
        { provide: ActivatedRoute, useValue: mockedRoute },
        provideComponentStore(EditArticleStore),
      ],
    });

    store = debugElement.injector.get(EditArticleStore);
  }

  describe('When init', () => {
    it('Then create store', async () => {
      await setup();
      expect(store).toBeTruthy();
    });

    it('Then store should have initial state', async () => {
      await setup();
      store.article$.pipe(take(1)).subscribe((article) => {
        expect(article).toEqual(null);
      });
    });

    it('Then call apiClient.getArticle', async () => {
      await setup();
      expect(mockedApiClient.getArticle).toHaveBeenCalledWith(mockedSlug);
    });

    describe('When get article success', () => {
      it('Then store should have the article', async () => {
        await setup('success');

        store.article$.pipe(take(1)).subscribe((article) => {
          expect(article).toEqual(mockedArticle);
        });
      });
    });
  });

  describe('When update article', () => {
    function arrangeUpdateArticle() {
      mockedApiClient.updateArticle.and.returnValue(
        of({ article: getMockedArticle({ article: { slug: 'updated-slug' } }) })
      );
    }

    it('Then navigate to the article page', async () => {
      await setup('success');
      arrangeUpdateArticle();

      store.updateArticle({});

      expect(mockedRouter.navigate).toHaveBeenCalledWith([
        '/article',
        'updated-slug',
      ]);
    });
  });
});
