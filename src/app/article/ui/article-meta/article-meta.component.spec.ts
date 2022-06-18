import { DatePipe } from '@angular/common';
import { EventEmitter, LOCALE_ID } from '@angular/core';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { Article, Profile } from '../../../shared/data-access/api';
import { getMockedArticle } from '../../../testing.spec';
import { ArticleMeta } from './article-meta.component';

describe(ArticleMeta.name, () => {
  let mockedDelete: jasmine.SpyObj<EventEmitter<void>>;
  let mockedFollowAuthor: jasmine.SpyObj<EventEmitter<Profile>>;
  let mockedToggleFavorite: jasmine.SpyObj<EventEmitter<void>>;

  let mockedArticle: Article;

  async function setup(
    isOwner = false,
    article: Parameters<typeof getMockedArticle>[0] = {}
  ) {
    mockedDelete = jasmine.createSpyObj('mocked delete', ['emit']);
    mockedFollowAuthor = jasmine.createSpyObj('mocked follow author', ['emit']);
    mockedToggleFavorite = jasmine.createSpyObj('mocked toggle favorite', [
      'emit',
    ]);

    mockedArticle = getMockedArticle(article);

    return await render(ArticleMeta, {
      componentProperties: {
        article: mockedArticle,
        isOwner,
        delete: mockedDelete,
        followAuthor: mockedFollowAuthor,
        toggleFavorite: mockedToggleFavorite,
      },
    });
  }

  it('Then render avatar of article author', async () => {
    const { debugElement, getByAltText } = await setup();

    const avatarLink = debugElement.query(By.css('.article-meta > a'));

    expect(avatarLink.nativeElement).toHaveAttribute(
      'href',
      `/profile/${mockedArticle.author.username}`
    );

    const avatarImg = getByAltText(/Avatar of article author/);
    expect(avatarImg).toHaveAttribute('src', mockedArticle.author.image);
  });

  it('Then render article info', async () => {
    const { debugElement } = await setup();

    const authorLink = debugElement.query(By.css('.author'));

    expect(authorLink.nativeElement).toHaveAttribute(
      'href',
      `/profile/${mockedArticle.author.username}`
    );
    expect(authorLink.nativeElement).toHaveTextContent(
      mockedArticle.author.username
    );

    const dateSpan = debugElement.query(By.css('.date'));
    const locale = debugElement.injector.get(LOCALE_ID);
    expect(dateSpan.nativeElement).toHaveTextContent(
      new DatePipe(locale).transform(mockedArticle.updatedAt) as string
    );
  });

  describe('Given is article owner', () => {
    it('Then render edit article link', async () => {
      const { debugElement } = await setup(true);

      const editArticleLink = debugElement.query(
        By.css('.btn.btn-outline-secondary')
      );

      expect(editArticleLink.nativeElement).toHaveAttribute(
        'href',
        `/editor/${mockedArticle.slug}`
      );
      expect(editArticleLink.nativeElement).toHaveTextContent('Edit Article');
    });

    it('Then render delete article button', async () => {
      const { debugElement } = await setup(true);

      const deleteArticleButton = debugElement.query(
        By.css('.btn.btn-outline-danger')
      );

      expect(deleteArticleButton.nativeElement).toHaveTextContent(
        'Delete Article'
      );
    });

    describe('When click delete', () => {
      it('Then delete output emits', async () => {
        const { debugElement } = await setup(true);

        const deleteArticleButton = debugElement.query(
          By.css('.btn.btn-outline-danger')
        );

        await userEvent.click(deleteArticleButton.nativeElement);

        expect(mockedDelete.emit).toHaveBeenCalled();
      });
    });
  });

  describe('Given is not article owner', () => {
    it('Then render follow author button', async () => {
      const { debugElement } = await setup(false);

      const followAuthorButton = debugElement.query(By.css('#followAuthor'));
      expect(followAuthorButton.nativeElement).toHaveTextContent(
        new RegExp(mockedArticle.author.username)
      );
    });

    describe('When click follow/unfollow', () => {
      it('Then followAuthor output emits with the article author', async () => {
        const { debugElement } = await setup(false);
        const followAuthorButton = debugElement.query(By.css('#followAuthor'));

        await userEvent.click(followAuthorButton.nativeElement);

        expect(mockedFollowAuthor.emit).toHaveBeenCalledWith(
          mockedArticle.author
        );
      });
    });

    it('Then render toggle favorite button', async () => {
      const { debugElement } = await setup(false);

      const toggleFavoriteButton = debugElement.query(
        By.css('#toggleFavorite')
      );
      const favoriteCountSpan = toggleFavoriteButton.query(By.css('span'));

      expect(favoriteCountSpan.nativeElement).toHaveTextContent(
        `(${mockedArticle.favoritesCount})`
      );
    });

    describe('When click toggleFavorite', () => {
      it('Then toggleFavorite output emits', async () => {
        const { debugElement } = await setup(false);

        const toggleFavoriteButton = debugElement.query(
          By.css('#toggleFavorite')
        );

        await userEvent.click(toggleFavoriteButton.nativeElement);

        expect(mockedToggleFavorite.emit).toHaveBeenCalled();
      });
    });

    describe('Given author that has already been followed', () => {
      it('Then render Unfollow button', async () => {
        const { debugElement } = await setup(false, {
          profile: { following: true },
        });

        const followAuthorButton = debugElement.query(By.css('#followAuthor'));
        expect(followAuthorButton.nativeElement).toHaveTextContent(
          `Unfollow ${mockedArticle.author.username}`
        );
      });
    });
    describe('Given author that has not been followed', () => {
      it('Then render Follow button', async () => {
        const { debugElement } = await setup(false, {
          profile: { following: false },
        });
        const followAuthorButton = debugElement.query(By.css('#followAuthor'));
        expect(followAuthorButton.nativeElement).toHaveTextContent(
          `Follow ${mockedArticle.author.username}`
        );
      });
    });
    describe('Given article that has already been favorited', () => {
      it('Then render Unfavorite button', async () => {
        const { debugElement } = await setup(false, {
          article: { favorited: true },
        });

        const toggleFavoriteButton = debugElement.query(
          By.css('#toggleFavorite')
        );

        expect(toggleFavoriteButton.nativeElement).toHaveTextContent(
          /Unfavorite Post/
        );
      });
    });
    describe('Given article that has not been favorited', () => {
      it('Then render Favorite button', async () => {
        const { debugElement } = await setup(false, {
          article: { favorited: false },
        });

        const toggleFavoriteButton = debugElement.query(
          By.css('#toggleFavorite')
        );

        expect(toggleFavoriteButton.nativeElement).toHaveTextContent(
          /Favorite Post/
        );
      });
    });
  });
});
