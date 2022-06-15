import { EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { getMockedArticle } from '../../../testing.spec';
import { Article } from '../../data-access/api';
import { ApiStatus } from '../../data-access/models';
import { ArticlePreview } from '../article-preview/article-preview.component';
import { ArticlesList } from './articles-list.component';

describe(ArticlesList.name, () => {
  let mockedToggleFavorite: jasmine.SpyObj<EventEmitter<Article>>;

  async function setupRender(status: ApiStatus, articles: Article[] = []) {
    mockedToggleFavorite = jasmine.createSpyObj('mocked toggle favorite', [
      'emit',
    ]);

    return await render(ArticlesList, {
      componentProperties: {
        articles,
        status,
        toggleFavorite: mockedToggleFavorite,
      },
    });
  }

  describe('Given status is loading', () => {
    it('Then render article-preview with loading text', async () => {
      const { debugElement } = await setupRender('loading');
      const articlePreview = debugElement.query(By.directive(ArticlePreview));
      expect(articlePreview.nativeElement).toHaveTextContent(
        /Loading articles/
      );
    });
  });

  describe('Given status is not loading', () => {
    describe('Given no articles', () => {
      it('Then render article-preview with No articles text', async () => {
        const { debugElement } = await setupRender('success');
        const articlePreview = debugElement.query(By.directive(ArticlePreview));
        expect(articlePreview.nativeElement).toHaveTextContent(
          /No articles are here/
        );
      });
    });

    describe('Given articles', () => {
      const mockedArticles = [
        getMockedArticle({
          profile: { username: 'username one' },
          article: { favorited: true },
        }),
        getMockedArticle({ profile: { username: 'username two' } }),
      ];

      it('Then render correct number of article-preview', async () => {
        const { debugElement } = await setupRender('success', mockedArticles);
        const articlePreviews = debugElement.queryAll(
          By.directive(ArticlePreview)
        );

        expect(articlePreviews.length).toEqual(mockedArticles.length);
        mockedArticles.forEach((article, index) => {
          expect(articlePreviews[index].componentInstance.article).toEqual(
            article
          );

          const authorInfo = articlePreviews[index].query(
            By.css('.info > .author')
          );
          expect(authorInfo.nativeElement).toHaveTextContent(
            article.author.username
          );
        });
      });

      it('Then toggleFavorite should emit the correct article', async () => {
        const { debugElement } = await setupRender('success', mockedArticles);
        const articlePreviews = debugElement.queryAll(
          By.directive(ArticlePreview)
        );

        for (let i = 0; i < mockedArticles.length; i++) {
          const article = mockedArticles[i];
          const toggleFavoriteButton = articlePreviews[i].query(
            By.css('.btn.btn-sm')
          );
          await userEvent.click(toggleFavoriteButton.nativeElement);
          expect(mockedToggleFavorite.emit).toHaveBeenCalledWith(article);
        }

        expect(mockedToggleFavorite.emit).toHaveBeenCalledTimes(2);
      });
    });
  });
});
