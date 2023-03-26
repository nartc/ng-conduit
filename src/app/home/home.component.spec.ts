import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { ReplaySubject } from 'rxjs';
import { ArticlesList } from '../shared/ui/articles-list/articles-list.component';
import { getMockedArticle } from '../testing.spec';
import { Home } from './home.component';
import { HomeStore, HomeVm } from './home.store';
import { Banner } from './ui/banner/banner.component';
import { FeedToggle } from './ui/feed-toggle/feed-toggle.component';
import { Tags } from './ui/tags/tags.component';

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

describe(Home.name, () => {
    let mockedStore: jasmine.SpyObj<HomeStore>;

    let mockedVm$: ReplaySubject<HomeVm>;

    async function setup(vmArranger?: (vm$: ReplaySubject<HomeVm>) => void) {
        mockedVm$ = new ReplaySubject<HomeVm>();

        if (vmArranger) {
            vmArranger(mockedVm$);
        } else {
            mockedVm$.next(getVm());
        }

        mockedStore = jasmine.createSpyObj<HomeStore>(
            HomeStore.name,
            ['getArticlesByTag', 'getFeedArticles', 'getArticles', 'toggleFavorite'],
            {
                vm$: mockedVm$.asObservable(),
            }
        );

        return await render(Home, {
            componentProviders: [{ provide: HomeStore, useValue: mockedStore }],
        });
    }

    it('Then create component', async () => {
        const { fixture } = await setup();
        expect(fixture.componentInstance).toBeTruthy();
    });

    describe('When render', () => {
        it('Then show Banner', async () => {
            const { debugElement } = await setup();

            const banner = debugElement.query(By.directive(Banner));

            expect(banner).toBeTruthy();
            expect(banner.componentInstance).toBeInstanceOf(Banner);
        });

        it('Then show feed toggle', async () => {
            const { debugElement } = await setup();

            const feedToggle = debugElement.query(By.directive(FeedToggle));

            expect(feedToggle).toBeTruthy();
            expect(feedToggle.componentInstance).toBeInstanceOf(FeedToggle);
        });

        describe('When selectFeed emit', () => {
            it('Then call store.getFeedArticles', async () => {
                const { debugElement } = await setup();

                const feedToggle = debugElement.query(By.directive(FeedToggle));

                feedToggle.componentInstance.selectFeed.emit();

                expect(mockedStore.getFeedArticles).toHaveBeenCalled();
            });
        });

        describe('When selectGlobal emit', () => {
            it('Then call store.getArticles', async () => {
                const { debugElement } = await setup();

                const feedToggle = debugElement.query(By.directive(FeedToggle));

                feedToggle.componentInstance.selectGlobal.emit();

                expect(mockedStore.getArticles).toHaveBeenCalled();
            });
        });

        it('Then show Article List', async () => {
            const { debugElement } = await setup();

            const articleList = debugElement.query(By.directive(ArticlesList));

            expect(articleList).toBeTruthy();
            expect(articleList.componentInstance).toBeInstanceOf(ArticlesList);
        });

        describe('When toggleFavorite emit', () => {
            it('Then call store.toggleFavorite', async () => {
                const mockedArticle = getMockedArticle();
                const { debugElement } = await setup();

                const articleList = debugElement.query(By.directive(ArticlesList));
                articleList.componentInstance.toggleFavorite.emit(mockedArticle);

                expect(mockedStore.toggleFavorite).toHaveBeenCalledWith(mockedArticle);
            });
        });

        it('Then show Tags', async () => {
            const { debugElement } = await setup();

            const tags = debugElement.query(By.directive(Tags));

            expect(tags).toBeTruthy();
            expect(tags.componentInstance).toBeInstanceOf(Tags);
        });

        describe('When selectTag emit', () => {
            it('Then calls store.getArticlesByTag with selected tag', async () => {
                const { debugElement } = await setup();

                const tags = debugElement.query(By.directive(Tags));
                tags.componentInstance.selectTag.emit('tag');

                expect(mockedStore.getArticlesByTag).toHaveBeenCalledWith('tag');
            });
        });
    });
});
