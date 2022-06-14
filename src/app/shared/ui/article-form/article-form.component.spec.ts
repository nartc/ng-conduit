import { EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { getMockedArticle } from '../../../testing.spec';
import { ArticleForm, ArticleFormData } from './article-form.component';

describe(ArticleForm.name, () => {
  let mockedArticleSubmit: jasmine.SpyObj<EventEmitter<ArticleFormData>>;

  describe('Given no article is provided', async () => {
    async function setupRender() {
      mockedArticleSubmit = jasmine.createSpyObj('mocked article submit', [
        'emit',
      ]);

      return await render(ArticleForm, {
        componentProperties: {
          articleSubmit: mockedArticleSubmit,
        },
      });
    }

    it('Then form should be rendered properly', async () => {
      const { getByPlaceholderText, detectChanges, debugElement } =
        await setupRender();

      detectChanges();

      const titleInput = getByPlaceholderText(/Article Title/);
      const descriptionInput = getByPlaceholderText(
        /What's this article about/
      );
      const bodyInput = getByPlaceholderText(/Write your article/);
      const tagsSpans = debugElement.queryAll(By.css('.tag-pill.tag-default'));

      expect(titleInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
      expect(bodyInput).toHaveValue('');
      expect(tagsSpans.length).toEqual(0);
    });

    it('Then form should be editable', async () => {
      const { getByPlaceholderText, detectChanges, fixture } =
        await setupRender();

      detectChanges();

      const titleInput = getByPlaceholderText(/Article Title/);

      await userEvent.clear(titleInput);
      await userEvent.type(titleInput, 'updated article title');

      expect(fixture.componentInstance.form.getRawValue()).toEqual({
        title: 'updated article title',
        description: '',
        body: '',
        tagList: [],
      });
    });

    it('Then articleSubmit should emit current form data on Publish click', async () => {
      const { getByText, getByPlaceholderText, detectChanges, fixture } =
        await setupRender();

      detectChanges();

      const titleInput = getByPlaceholderText(/Article Title/);
      const descriptionInput = getByPlaceholderText(
        /What's this article about/
      );
      const bodyInput = getByPlaceholderText(/Write your article/);
      const tagInput = getByPlaceholderText(/Enter tags/);
      const publishButton = getByText(/Publish Article/);

      await userEvent.type(titleInput, 'title');
      await userEvent.type(descriptionInput, 'description');
      await userEvent.type(bodyInput, 'body');

      await userEvent.type(tagInput, 'tag one');
      await userEvent.keyboard('{Enter}');

      // empty tagInput after adding tag
      expect(tagInput).toHaveValue('');

      await userEvent.click(publishButton);

      expect(mockedArticleSubmit.emit).toHaveBeenCalledWith(
        fixture.componentInstance.form.getRawValue()
      );
    });
  });

  describe('Given article is provided', async () => {
    const mockedArticle = getMockedArticle();

    async function setupRender() {
      mockedArticleSubmit = jasmine.createSpyObj('mocked article submit', [
        'emit',
      ]);

      return await render(ArticleForm, {
        componentProperties: {
          article: mockedArticle,
          articleSubmit: mockedArticleSubmit,
        },
      });
    }

    it('Then form initial value should be the provided article', async () => {
      const { fixture } = await setupRender();

      expect(fixture.componentInstance.form.getRawValue()).toEqual({
        title: mockedArticle.title,
        description: mockedArticle.description,
        body: mockedArticle.body,
        tagList: mockedArticle.tagList,
      });
    });
  });
});
