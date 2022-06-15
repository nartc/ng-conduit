import { DatePipe } from '@angular/common';
import { EventEmitter, LOCALE_ID } from '@angular/core';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { CommentWithOwner } from '../../../shared/data-access/models';
import { getMockedCommentWithOwner } from '../../../testing.spec';
import { ArticleComment } from './article-comment.component';

describe(ArticleComment.name, () => {
  let mockedDelete: jasmine.SpyObj<EventEmitter<void>>;

  async function setupRender(comment: CommentWithOwner) {
    mockedDelete = jasmine.createSpyObj('mocked delete', ['emit']);

    return await render(ArticleComment, {
      componentProperties: {
        comment,
        delete: mockedDelete,
      },
    });
  }

  describe('Given a comment that is not owned', () => {
    const mockedComment = getMockedCommentWithOwner();

    it('Then render comment body', async () => {
      const { getByText } = await setupRender(mockedComment);
      expect(getByText(mockedComment.body)).toBeTruthy();
    });

    it('Then render comment footer without mod options', async () => {
      const { debugElement } = await setupRender(mockedComment);

      const authorAvatarLink = debugElement.query(
        By.css('.comment-author#authorAvatar')
      );
      expect(authorAvatarLink.nativeElement).toHaveAttribute(
        'href',
        `/profile/${mockedComment.author.username}`
      );

      const authorImage = authorAvatarLink.query(
        By.css('img.comment-author-img')
      );
      expect(authorImage.nativeElement).toHaveAttribute(
        'src',
        mockedComment.author.image
      );

      const authorUsernameLink = debugElement.query(
        By.css('.comment-author#authorUsername')
      );
      expect(authorUsernameLink.nativeElement).toHaveAttribute(
        'href',
        `/profile/${mockedComment.author.username}`
      );
      expect(authorUsernameLink.nativeElement).toHaveTextContent(
        mockedComment.author.username
      );

      const dateSpan = debugElement.query(By.css('.date-posted'));
      const locale = debugElement.injector.get(LOCALE_ID);
      expect(dateSpan.nativeElement).toHaveTextContent(
        new DatePipe(locale).transform(
          mockedComment.updatedAt,
          'mediumDate'
        ) as string
      );

      const modOptionsSpan = debugElement.query(By.css('.mod-options'));
      expect(modOptionsSpan).toBeFalsy();
    });
  });

  describe('Given a comment that is owned', () => {
    const mockedComment = getMockedCommentWithOwner({
      comment: { isOwner: true },
    });

    it('Then render footer with mod options', async () => {
      const { debugElement } = await setupRender(mockedComment);

      const modOptionsSpan = debugElement.query(By.css('.mod-options'));
      expect(modOptionsSpan).toBeTruthy();
    });

    describe('When click delete', () => {
      it('Then emit with delete output', async () => {
        const { debugElement } = await setupRender(mockedComment);

        const modOptionsSpan = debugElement.query(By.css('.mod-options'));
        const deleteIcon = modOptionsSpan.query(By.css('i'));

        await userEvent.click(deleteIcon.nativeElement);

        expect(mockedDelete.emit).toHaveBeenCalled();
      });
    });
  });
});
