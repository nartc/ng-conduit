import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { ArticleForm, ArticleFormData } from '../shared/ui/article-form/article-form.component';
import { FormLayout } from '../shared/ui/form-layout/form-layout.component';
import { NewArticleStore } from './new-article.store';

@Component({
    template: `
        <app-form-layout class="editor-page" innerClass="col-md-10 offset-md-1 col-xs-12">
            <app-article-form (articleSubmit)="articleSubmit($event)" />
        </app-form-layout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FormLayout, ArticleForm],
    providers: [provideComponentStore(NewArticleStore)],
})
export default class NewArticle {
    private readonly store = inject(NewArticleStore);

    articleSubmit({ title, tagList, description, body }: ArticleFormData) {
        this.store.createArticle({ title, body, description, tagList });
    }
}
