import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { ArticleForm, ArticleFormData } from '../shared/ui/article-form/article-form.component';
import { EditorLayout } from '../shared/ui/editor-layout/editor-layout.component';
import { NewArticleStore } from './new-article.store';

@Component({
    template: `
        <app-editor-layout>
            <app-article-form (articleSubmit)="articleSubmit($event)" />
        </app-editor-layout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [EditorLayout, ArticleForm],
    providers: [provideComponentStore(NewArticleStore)],
})
export default class NewArticle {
    private readonly store = inject(NewArticleStore);

    articleSubmit({ title, tagList, description, body }: ArticleFormData) {
        this.store.createArticle({ title, body, description, tagList });
    }
}
