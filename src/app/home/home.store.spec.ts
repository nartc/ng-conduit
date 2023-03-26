import { provideComponentStore } from '@ngrx/component-store';
import { render } from '@testing-library/angular';
import { EMPTY, of, ReplaySubject, take, throwError } from 'rxjs';
import { ApiClient } from '../shared/data-access/api';
import { AuthStore } from '../shared/data-access/auth.store';
import { getMockedArticle } from '../testing.spec';
import { HomeStore, HomeVm } from './home.store';

function getVm(vm: Partial<HomeVm> = {}): HomeVm {
    return {
        articles: [],
        tags: [],
        selectedTag: '',
        feedType: 'global',
        articlesStatus: 'loading',
        tagsStatus: 'loading',
        isAuthenticated: true,
        ...vm,
    };
}

describe(HomeStore.name, () => {
    let store: HomeStore;

    let mockedApiClient: jasmine.SpyObj<ApiClient>;
    let mockedAuthStore: jasmine.SpyObj<AuthStore>;

    let mockedIsAuthenticated$: ReplaySubject<boolean>;

    const mockedTags = ['tag one', 'tag two'];

    const mockedArticle = getMockedArticle();
    const mockedFavoritedArticle = getMockedArticle({
        article: { slug: 'article-two', favorited: true },
    });

    const mockedTaggedArticles = [
        getMockedArticle({ article: { tagList: ['tag one'] } }),
        getMockedArticle({
            article: { slug: 'article-two', tagList: ['tag one'] },
        }),
    ];

    const mockedFeedArticles = [
        getMockedArticle({ article: { slug: 'article-one' } }),
        getMockedArticle({ article: { slug: 'article-two' } }),
    ];

    async function setup(
        {
            tagsStatus,
            articlesStatus,
            selectedTag,
        }: {
            tagsStatus?: 'idle' | 'success' | 'failure';
            articlesStatus?: 'idle' | 'success' | 'failure';
            selectedTag?: boolean;
        } = {
            tagsStatus: 'idle',
            articlesStatus: 'idle',
            selectedTag: false,
        }
    ) {
        mockedIsAuthenticated$ = new ReplaySubject<boolean>();
        mockedIsAuthenticated$.next(true);

        mockedAuthStore = jasmine.createSpyObj<AuthStore>(AuthStore.name, [], {
            isAuthenticated$: mockedIsAuthenticated$.asObservable(),
        });

        mockedApiClient = jasmine.createSpyObj<ApiClient>(ApiClient.name, [
            'tags',
            'getArticles',
            'getArticlesFeed',
            'deleteArticleFavorite',
            'createArticleFavorite',
        ]);

        if (tagsStatus === 'success') {
            mockedApiClient.tags.and.returnValue(of({ tags: mockedTags }));
        } else if (tagsStatus === 'failure') {
            mockedApiClient.tags.and.returnValue(throwError(() => 'error getting tags'));
        } else {
            mockedApiClient.tags.and.returnValue(EMPTY);
        }

        if (articlesStatus === 'success' && !selectedTag) {
            mockedApiClient.getArticles.and.returnValue(
                of({
                    articles: [mockedArticle, mockedFavoritedArticle],
                    articlesCount: 2,
                })
            );
        } else if (articlesStatus === 'failure') {
            mockedApiClient.getArticles.and.returnValue(throwError(() => 'error getting articles'));
        } else {
            mockedApiClient.getArticles.and.returnValue(EMPTY);
        }

        const { debugElement } = await render('', {
            providers: [
                { provide: ApiClient, useValue: mockedApiClient },
                { provide: AuthStore, useValue: mockedAuthStore },
                provideComponentStore(HomeStore),
            ],
        });

        store = debugElement.injector.get(HomeStore);
    }

    describe('When init', () => {
        it('Then create store', async () => {
            await setup();
            expect(store).toBeTruthy();
        });

        it('Then calls apiClient.getArticles', async () => {
            await setup();
            expect(mockedApiClient.getArticles).toHaveBeenCalled();
        });

        it('Then calls apiClient.tags', async () => {
            await setup();
            expect(mockedApiClient.tags).toHaveBeenCalled();
        });

        describe('Given get articles and get tags have not returned', () => {
            it('Then vm has initial state with loading statuses', async () => {
                await setup();
                store.vm$.pipe(take(1)).subscribe((vm) => {
                    expect(vm).toEqual(getVm());
                });
            });
        });

        describe('Given get articles returns failure response', () => {
            describe('When getArticles', () => {
                it('Then vm should have error articles status', async () => {
                    await setup({ articlesStatus: 'failure' });
                    store.vm$.pipe(take(1)).subscribe((vm) => {
                        expect(vm).toEqual(getVm({ articlesStatus: 'error' }));
                    });
                });
            });
        });

        describe('Given get articles returns success response', () => {
            describe('When getArticles', () => {
                it('Then vm should have articles', async () => {
                    await setup({ articlesStatus: 'success' });
                    store.vm$.pipe(take(1)).subscribe((vm) => {
                        expect(vm).toEqual(
                            getVm({
                                articles: [mockedArticle, mockedFavoritedArticle],
                                articlesStatus: 'success',
                            })
                        );
                    });
                });
            });
        });

        describe('Given get tags returns failure response', () => {
            describe('When getTags', () => {
                it('Then vm should have error tags status', async () => {
                    await setup({ tagsStatus: 'failure' });
                    store.vm$.pipe(take(1)).subscribe((vm) => {
                        expect(vm).toEqual(getVm({ tagsStatus: 'error' }));
                    });
                });
            });
        });

        describe('Given get tags returns success response', () => {
            describe('When getTags', () => {
                it('Then vm should have tags', async () => {
                    await setup({ tagsStatus: 'success' });
                    store.vm$.pipe(take(1)).subscribe((vm) => {
                        expect(vm).toEqual(
                            getVm({
                                tags: mockedTags,
                                tagsStatus: 'success',
                            })
                        );
                    });
                });
            });
        });
    });

    describe('When get articles by tag', () => {
        it('Then call apiClient.getArticles with selected tag', async () => {
            await setup({ selectedTag: true });

            const selectedTag = 'tag';
            store.getArticlesByTag(selectedTag);

            expect(mockedApiClient.getArticles).toHaveBeenCalledWith(selectedTag);
        });

        it('Then vm should have tagged articles', async () => {
            await setup({ selectedTag: true });

            mockedApiClient.getArticles.withArgs('tag').and.returnValue(
                of({
                    articles: mockedTaggedArticles,
                    articlesCount: mockedTaggedArticles.length,
                })
            );

            const selectedTag = 'tag';
            store.getArticlesByTag(selectedTag);

            store.vm$.pipe(take(1)).subscribe((vm) => {
                expect(vm).toEqual(
                    getVm({
                        articlesStatus: 'success',
                        selectedTag,
                        articles: mockedTaggedArticles,
                    })
                );
            });
        });
    });

    describe('When get feed articles', () => {
        it('Then calls apiClient.getArticlesFeed', async () => {
            await setup();
            mockedApiClient.getArticlesFeed.and.returnValue(
                of({
                    articles: mockedFeedArticles,
                    articlesCount: mockedFeedArticles.length,
                })
            );

            store.getFeedArticles();

            expect(mockedApiClient.getArticlesFeed).toHaveBeenCalled();
        });

        it('Then vm should have feed articles and feedType is "feed"', async () => {
            await setup();
            mockedApiClient.getArticlesFeed.and.returnValue(
                of({
                    articles: mockedFeedArticles,
                    articlesCount: mockedFeedArticles.length,
                })
            );

            store.getFeedArticles();

            store.vm$.pipe(take(1)).subscribe((vm) => {
                expect(vm).toEqual(
                    getVm({
                        articlesStatus: 'success',
                        articles: mockedFeedArticles,
                        feedType: 'feed',
                    })
                );
            });
        });
    });

    describe('When toggle favorite', () => {
        describe('Given the article has already been favorited', () => {
            it('Then article is no longer favorited', async () => {
                await setup({ articlesStatus: 'success' });
                mockedApiClient.deleteArticleFavorite
                    .withArgs(mockedFavoritedArticle.slug)
                    .and.returnValue(of({ article: { ...mockedFavoritedArticle, favorited: false } }));

                store.toggleFavorite(mockedFavoritedArticle);

                expect(mockedApiClient.deleteArticleFavorite).toHaveBeenCalled();
                expect(mockedApiClient.createArticleFavorite).not.toHaveBeenCalled();

                store.vm$.pipe(take(1)).subscribe((vm) => {
                    expect(vm).toEqual(
                        getVm({
                            articlesStatus: 'success',
                            articles: [mockedArticle, { ...mockedFavoritedArticle, favorited: false }],
                        })
                    );
                });
            });
        });
        describe('Given the article has not been favorited', () => {
            it('Then article is favorited', async () => {
                await setup({ articlesStatus: 'success' });
                mockedApiClient.createArticleFavorite
                    .withArgs(mockedArticle.slug)
                    .and.returnValue(of({ article: { ...mockedArticle, favorited: true } }));

                store.toggleFavorite(mockedArticle);

                expect(mockedApiClient.createArticleFavorite).toHaveBeenCalled();
                expect(mockedApiClient.deleteArticleFavorite).not.toHaveBeenCalled();

                store.vm$.pipe(take(1)).subscribe((vm) => {
                    expect(vm).toEqual(
                        getVm({
                            articlesStatus: 'success',
                            articles: [{ ...mockedArticle, favorited: true }, mockedFavoritedArticle],
                        })
                    );
                });
            });
        });
    });
});
