import { DatePipe } from '@angular/common';
import { EventEmitter, LOCALE_ID } from '@angular/core';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { getMockedArticle } from '../../../testing.spec';
import { Article } from '../../data-access/api';
import { ArticlePreview } from './article-preview.component';

describe(ArticlePreview.name, () => {
    let mockedToggleFavorite: jasmine.SpyObj<EventEmitter<Article>>;

    async function setup(article?: Article) {
        mockedToggleFavorite = jasmine.createSpyObj('mocked toggle favorite', ['emit']);

        return await render(ArticlePreview, {
            componentProperties: {
                article,
                toggleFavorite: mockedToggleFavorite,
            },
        });
    }

    describe('Given no article', () => {
        it('Then do not render article-meta', async () => {
            const { debugElement } = await setup();
            const articleMeta = debugElement.query(By.css('.article-meta'));
            expect(articleMeta).toBeFalsy();
        });
    });

    describe('Given article', () => {
        const mockedArticle = getMockedArticle();

        it('Then render article-meta', async () => {
            const { debugElement } = await setup(mockedArticle);
            const articleMeta = debugElement.query(By.css('.article-meta'));
            expect(articleMeta).toBeTruthy();
        });

        it('Then render article author avatar with link', async () => {
            const { debugElement, getByAltText } = await setup(mockedArticle);
            const avatarLink = debugElement.query(By.css('.article-meta > a'));

            expect(avatarLink).toBeTruthy();
            expect(avatarLink.nativeElement).toHaveAttribute('href', `/profile/${mockedArticle.author.username}`);

            const avatarImg = getByAltText(/Avatar of article author/) as HTMLImageElement;

            expect(avatarImg).toBeTruthy();
            expect(avatarImg).toHaveAttribute('src', mockedArticle.author.image);
        });

        it('Then render article meta info', async () => {
            const { debugElement } = await setup(mockedArticle);
            const authorLink = debugElement.query(By.css('.info > .author'));

            expect(authorLink.nativeElement).toHaveAttribute('href', `/profile/${mockedArticle.author.username}`);
            expect(authorLink.nativeElement).toHaveTextContent(mockedArticle.author.username);

            const dateSpan = debugElement.query(By.css('.info > .date'));
            const locale = debugElement.injector.get(LOCALE_ID);
            expect(dateSpan.nativeElement).toHaveTextContent(
                new DatePipe(locale).transform(mockedArticle.updatedAt, 'mediumDate') as string
            );
        });

        it('Then render toggle favorite button', async () => {
            const { debugElement } = await setup(mockedArticle);

            const toggleFavoriteButton = debugElement.query(By.css('.btn.btn-sm'));

            expect(toggleFavoriteButton.nativeElement).toHaveTextContent(mockedArticle.favoritesCount.toString());
            expect(toggleFavoriteButton.nativeElement).toHaveClassName('btn-outline-primary');
        });

        it('Then render article preview link', async () => {
            const { debugElement } = await setup(mockedArticle);

            const previewLink = debugElement.query(By.css('.preview-link'));
            const previewTitle = previewLink.query(By.css('h1'));
            const previewParagraph = previewLink.query(By.css('p'));

            const previewTags = previewLink.query(By.css('ul.tag-list'));
            const previewTagItems = previewTags.queryAll(By.css('.tag-pill'));

            expect(previewLink.nativeElement).toHaveAttribute('href', `/article/${mockedArticle.slug}`);
            expect(previewTitle.nativeElement).toHaveTextContent(mockedArticle.title);
            expect(previewParagraph.nativeElement).toHaveTextContent(mockedArticle.description);
            expect(previewTagItems.length).toEqual(mockedArticle.tagList.length);
            mockedArticle.tagList.forEach((tag, index) => {
                expect(previewTagItems[index].nativeElement).toHaveTextContent(tag);
            });
        });

        describe('When toggle favorite', () => {
            it('Then toggleFavorite should emit article with', async () => {
                const { debugElement } = await setup(mockedArticle);

                const toggleFavoriteButton = debugElement.query(By.css('.btn.btn-sm'));

                await userEvent.click(toggleFavoriteButton.nativeElement);

                expect(mockedToggleFavorite.emit).toHaveBeenCalledWith(mockedArticle);
            });
        });
    });

    describe('Given favorited article', () => {
        const mockedArticle = getMockedArticle({ article: { favorited: true } });

        it('Then render btn-primary for toggle favorite button', async () => {
            const { debugElement } = await setup(mockedArticle);

            const toggleFavoriteButton = debugElement.query(By.css('.btn.btn-sm'));

            expect(toggleFavoriteButton.nativeElement).toHaveClassName('btn-primary');
        });
    });
});
