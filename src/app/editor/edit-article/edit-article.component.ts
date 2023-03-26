import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { FormLayout } from 'src/app/shared/ui/form-layout/form-layout.component';
import { ArticleForm, ArticleFormData } from '../../shared/ui/article-form/article-form.component';
import { EditArticleStore } from './edit-article.store';

@Component({
    template: `
        <app-form-layout class="editor-page" innerClass="col-md-10 offset-md-1 col-xs-12">
            <app-article-form
                *ngIf="article$ | async as article"
                [article]="article"
                (articleSubmit)="articleSubmit($event)"
            />
        </app-form-layout>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FormLayout, ArticleForm, NgIf, AsyncPipe],
    providers: [provideComponentStore(EditArticleStore)],
})
export default class EditArticle {
    private readonly store = inject(EditArticleStore);

    readonly article$ = this.store.article$;

    articleSubmit(article: ArticleFormData) {
        this.store.updateArticle(article);
    }
}
