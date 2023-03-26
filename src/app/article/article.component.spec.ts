import { By } from '@angular/platform-browser';
import { render, RenderResult } from '@testing-library/angular';
import { ReplaySubject } from 'rxjs';
import { getMockedArticle, getMockedCommentWithOwner, getMockedProfile } from '../testing.spec';
import { Article } from './article.component';
import { ArticleStore, ArticleVm } from './article.store';
import { ArticleCommentForm } from './ui/article-comment-form/article-comment-form.component';
import { ArticleComment } from './ui/article-comment/article-comment.component';
import { ArticleMeta } from './ui/article-meta/article-meta.component';

function getVm(vm: Partial<ArticleVm> = {}): ArticleVm {
    return {
        article: getMockedArticle(),
        status: 'success',
        isOwner: false,
        comments: [getMockedCommentWithOwner()],
        currentUser: getMockedProfile(),
        ...vm,
    };
}

describe(Article.name, () => {
    let mockedStore: jasmine.SpyObj<ArticleStore>;
    let mockedVm$: ReplaySubject<ArticleVm>;

    async function setup(vmArranger: () => void = () => {}) {
        mockedVm$ = new ReplaySubject<ArticleVm>();

        vmArranger();

        mockedStore = jasmine.createSpyObj<ArticleStore>(
            ArticleStore.name,
            ['toggleFavorite', 'deleteArticle', 'toggleFollowAuthor', 'createComment', 'deleteComment'],
            {
                vm$: mockedVm$.asObservable(),
            }
        );

        return await render(Article, {
            componentProviders: [{ provide: ArticleStore, useValue: mockedStore }],
        });
    }

    it('Then create component', async () => {
        const { fixture } = await setup();
        expect(fixture.componentInstance).toBeTruthy();
    });

    describe('Given status is loading', () => {
        function arrangeVm() {
            mockedVm$.next(getVm({ status: 'loading' }));
        }

        it('Then render loading text', async () => {
            const { getByText } = await setup(arrangeVm);
            const loadingParagraph = getByText(/Loading article/);
            expect(loadingParagraph).toBeTruthy();
        });
    });

    describe('Given no article', () => {
        function arrangeVm() {
            mockedVm$.next(getVm({ article: null }));
        }

        it('Then render nothing', async () => {
            const { debugElement, queryByText } = await setup(arrangeVm);

            const loadingParagraph = queryByText(/Loading article/);
            const bannerDiv = debugElement.query(By.css('.banner'));
            const containerDiv = debugElement.query(By.css('.container.page'));

            expect(loadingParagraph).toBeFalsy();
            expect(bannerDiv).toBeFalsy();
            expect(containerDiv).toBeFalsy();
        });
    });

    describe('Given article', () => {
        let vm: ArticleVm;
        let renderResult: RenderResult<Article>;

        beforeEach(async () => {
            vm = getVm();
            renderResult = await setup(() => mockedVm$.next(vm));
        });

        describe('When render', () => {
            it('Then show banner', () => {
                const { debugElement } = renderResult;

                const bannerContainerDiv = debugElement.query(By.css('.banner .container'));
                const title = bannerContainerDiv.query(By.css('h1'));
                const articleMeta = bannerContainerDiv.query(By.directive(ArticleMeta));

                expect(title.nativeElement).toHaveTextContent(vm.article?.title!);

                // we can do more integration testing here if needed
                expect(articleMeta).toBeTruthy();
                expect(articleMeta.componentInstance.article).toEqual(vm.article);
                expect(articleMeta.componentInstance.isOwner).toEqual(vm.isOwner);
            });

            it('Then show article body', () => {
                const { debugElement } = renderResult;

                const bodyDiv = debugElement.query(By.css('.body'));
                const markdownParagraph = bodyDiv.query(By.css('p'));

                expect(markdownParagraph.nativeElement).toHaveTextContent(vm.article?.body!);
            });

            it('Then show tags', () => {
                const { debugElement } = renderResult;

                const tagList = debugElement.query(By.css('.tag-list'));
                const tagItems = tagList.queryAll(By.css('.tag-pill'));

                expect(tagItems.length).toEqual(vm.article?.tagList.length!);
                tagItems.forEach((tagItem, index) => {
                    expect(tagItem.nativeElement).toHaveTextContent(vm.article!.tagList[index]);
                });
            });

            it('Then show comment form', () => {
                const { debugElement } = renderResult;

                const commentForm = debugElement.query(By.directive(ArticleCommentForm));

                expect(commentForm).toBeTruthy();
                expect(commentForm.componentInstance.currentUser).toEqual(vm.currentUser);
            });

            it('Then show comments', () => {
                const { debugElement } = renderResult;

                const comments = debugElement.queryAll(By.directive(ArticleComment));

                expect(comments.length).toEqual(vm.comments.length);

                comments.forEach((comment, index) => {
                    expect(comment.componentInstance.comment).toEqual(vm.comments[index]);
                });
            });
        });

        describe('When try to delete comment', () => {
            it('Then store.deleteComment is called with the comment', () => {
                const { debugElement } = renderResult;

                const comments = debugElement.queryAll(By.directive(ArticleComment));

                comments.forEach((comment, index) => {
                    comment.componentInstance.delete.emit(vm.comments[index]);
                    expect(mockedStore.deleteComment).toHaveBeenCalledWith(vm.comments[index]);
                });
            });
        });

        describe('When try to create comment', () => {
            it('Then store.createComment is called with comment body', () => {
                const { debugElement } = renderResult;

                const commentForm = debugElement.query(By.directive(ArticleCommentForm));

                commentForm.componentInstance.comment.emit('new comment');
                expect(mockedStore.createComment).toHaveBeenCalledWith('new comment');
            });
        });

        describe('When try to toggle favorite', () => {
            it('Then store.toggleFavorite is called with article', () => {
                const { debugElement } = renderResult;

                const bannerContainerDiv = debugElement.query(By.css('.banner .container'));
                const articleMeta = bannerContainerDiv.query(By.directive(ArticleMeta));

                articleMeta.componentInstance.toggleFavorite.emit(vm.article);
                expect(mockedStore.toggleFavorite).toHaveBeenCalledWith(vm.article!);
            });
        });

        describe('When try to delete article', () => {
            it('Then store.deleteArticle is called with article', () => {
                const { debugElement } = renderResult;

                const bannerContainerDiv = debugElement.query(By.css('.banner .container'));
                const articleMeta = bannerContainerDiv.query(By.directive(ArticleMeta));

                articleMeta.componentInstance.delete.emit(vm.article);
                expect(mockedStore.deleteArticle).toHaveBeenCalledWith(vm.article!);
            });
        });

        describe('When try to toggle follow author', () => {
            it('Then store.toggleFollowAuthor is called with article', () => {
                const { debugElement } = renderResult;

                const bannerContainerDiv = debugElement.query(By.css('.banner .container'));
                const articleMeta = bannerContainerDiv.query(By.directive(ArticleMeta));

                articleMeta.componentInstance.followAuthor.emit(vm.article?.author);
                expect(mockedStore.toggleFollowAuthor).toHaveBeenCalledWith(vm.article!.author);
            });
        });
    });
});
