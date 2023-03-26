import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { ArticleForm, ArticleFormData } from '../shared/ui/article-form/article-form.component';
import { EditorLayout } from '../shared/ui/editor-layout/editor-layout.component';
import { NewArticle } from './new-article.component';
import { NewArticleStore } from './new-article.store';

describe(NewArticle.name, () => {
    let mockedStore: jasmine.SpyObj<NewArticleStore>;

    const articleFormData: ArticleFormData = {
        title: 'new title',
        body: 'new body',
        tagList: [],
        description: 'new description',
    };

    async function setup() {
        mockedStore = jasmine.createSpyObj<NewArticleStore>(NewArticleStore.name, ['createArticle']);

        return await render(NewArticle, {
            componentProviders: [{ provide: NewArticleStore, useValue: mockedStore }],
        });
    }

    describe('When init', () => {
        it('Then create component', async () => {
            const { fixture } = await setup();
            expect(fixture.componentInstance).toBeTruthy();
        });
    });

    describe('When render', () => {
        it('Then render editor layout', async () => {
            const { debugElement } = await setup();
            const editorLayout = debugElement.query(By.directive(EditorLayout));
            expect(editorLayout).toBeTruthy();
            expect(editorLayout.componentInstance).toBeInstanceOf(EditorLayout);
        });

        it('Then render article form', async () => {
            const { debugElement } = await setup();
            const articleForm = debugElement.query(By.directive(ArticleForm));
            expect(articleForm).toBeTruthy();
            expect(articleForm.componentInstance).toBeInstanceOf(ArticleForm);
        });
    });

    describe('When submit article form', () => {
        it('Then call store.createArticle', async () => {
            const { debugElement } = await setup();
            const articleForm = debugElement.query(By.directive(ArticleForm));

            articleForm.componentInstance.articleSubmit.emit(articleFormData);

            expect(mockedStore.createArticle).toHaveBeenCalledWith(articleFormData);
        });
    });
});
