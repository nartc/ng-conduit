import { EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { Profile } from '../../../shared/data-access/api';
import { getMockedProfile } from '../../../testing.spec';
import { ArticleCommentForm } from './article-comment-form.component';

describe(ArticleCommentForm.name, () => {
  let mockedComment: jasmine.SpyObj<EventEmitter<string>>;
  let mockedCurrentUser: Profile;

  async function setup() {
    mockedCurrentUser = getMockedProfile();
    mockedComment = jasmine.createSpyObj('mocked comment', ['emit']);
    return await render(ArticleCommentForm, {
      componentProperties: {
        currentUser: mockedCurrentUser,
        comment: mockedComment,
      },
    });
  }

  it('Then render form control properly', async () => {
    const { getByPlaceholderText } = await setup();

    expect(getByPlaceholderText(/Write a comment/)).toBeTruthy();
  });

  it('Then render form footer', async () => {
    const { getByAltText, debugElement } = await setup();

    const currentUserImage = getByAltText(/Avatar of current user/);
    expect(currentUserImage).toHaveAttribute('src', mockedCurrentUser.image);

    const submitButton = debugElement.query(By.css('[type=submit]'));
    expect(submitButton.nativeElement).toHaveTextContent('Post Comment');
  });

  describe('When edit', () => {
    it('Then form should have updated value from comment textarea', async () => {
      const { getByPlaceholderText, fixture } = await setup();

      const textareaControl = getByPlaceholderText(/Write a comment/);

      await userEvent.type(textareaControl, 'comment');

      expect(fixture.componentInstance.form.getRawValue().comment).toEqual(
        'comment'
      );
    });
  });

  describe('When submit', () => {
    it('Then comment should emit textarea value', async () => {
      const { getByPlaceholderText, debugElement } = await setup();

      const textareaControl = getByPlaceholderText(/Write a comment/);
      await userEvent.type(textareaControl, 'comment');

      const submitButton = debugElement.query(By.css('[type=submit]'));
      await userEvent.click(submitButton.nativeElement);

      expect(mockedComment.emit).toHaveBeenCalledWith('comment');
    });

    it('Then form should be reset', async () => {
      const { getByPlaceholderText, debugElement, fixture } = await setup();

      const textareaControl = getByPlaceholderText(/Write a comment/);
      await userEvent.type(textareaControl, 'comment');

      expect(fixture.componentInstance.form.getRawValue().comment).toEqual(
        'comment'
      );

      const submitButton = debugElement.query(By.css('[type=submit]'));
      await userEvent.click(submitButton.nativeElement);

      expect(fixture.componentInstance.form.getRawValue().comment).toEqual('');
    });
  });
});
