import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { ReplaySubject } from 'rxjs';
import { Article } from '../../shared/data-access/api';
import {
  ArticleForm,
  ArticleFormData,
} from '../../shared/ui/article-form/article-form.component';
import { EditorLayout } from '../../shared/ui/editor-layout/editor-layout.component';
import { getMockedArticle } from '../../testing.spec';
import { EditArticle } from './edit-article.component';
import { EditArticleStore } from './edit-article.store';

describe(EditArticle.name, () => {
  let mockedStore: jasmine.SpyObj<EditArticleStore>;
  let mockedArticle$: ReplaySubject<Article>;

  const mockedArticle = getMockedArticle();

  async function setup(withArticle: boolean = false) {
    mockedArticle$ = new ReplaySubject<Article>(1);

    if (withArticle) {
      mockedArticle$.next(mockedArticle);
    }

    mockedStore = jasmine.createSpyObj<EditArticleStore>(
      EditArticleStore.name,
      ['updateArticle'],
      {
        article$: mockedArticle$.asObservable(),
      }
    );

    return await render(EditArticle, {
      componentProviders: [
        { provide: EditArticleStore, useValue: mockedStore },
      ],
    });
  }

  describe('When init', () => {
    it('Then create component', async () => {
      const { fixture } = await setup();
      expect(fixture.componentInstance).toBeTruthy();
    });
  });

  describe('Given no article', () => {
    describe('When render', () => {
      it('Then show editor layout', async () => {
        const { debugElement } = await setup();
        const editorLayout = debugElement.query(By.directive(EditorLayout));
        expect(editorLayout).toBeTruthy();
      });

      it('Then do not show the form', async () => {
        const { debugElement } = await setup();
        const articleForm = debugElement.query(By.directive(ArticleForm));
        expect(articleForm).toBeFalsy();
      });
    });
  });

  describe('Given article', () => {
    it('Then show the form', async () => {
      const { debugElement } = await setup(true);
      const articleForm = debugElement.query(By.directive(ArticleForm));
      expect(articleForm).toBeTruthy();
      expect(articleForm.componentInstance.form.getRawValue()).toEqual({
        title: mockedArticle.title,
        description: mockedArticle.description,
        body: mockedArticle.body,
        tagList: mockedArticle.tagList,
      });
    });

    describe('When submit the form', () => {
      it('Then call store.updateArticle', async () => {
        const { debugElement } = await setup(true);
        const articleForm = debugElement.query(By.directive(ArticleForm));

        const articleFormData: ArticleFormData = {
          title: 'new title',
          body: 'new body',
          description: 'new description',
          tagList: [],
        };
        articleForm.componentInstance.articleSubmit.emit(articleFormData);
        expect(mockedStore.updateArticle).toHaveBeenCalledWith(articleFormData);
      });
    });
  });
});
