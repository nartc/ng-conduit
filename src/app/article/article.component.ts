import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { Article as ApiArticle, Profile } from '../shared/data-access/api';
import { ArticleStore, CommentWithOwner } from './article.store';
import { ArticleBodyMarkdown } from './ui/article-body-markdown/article-body-markdown.pipe';
import { ArticleCommentForm } from './ui/article-comment-form/article-comment-form.component';
import { ArticleComment } from './ui/article-comment/article-comment.component';
import { ArticleMeta } from './ui/article-meta/article-meta.component';

@Component({
  selector: 'app-article',
  template: `
    <div class="article-page" *ngIf="vm$ | async as vm">
      <ng-container *ngIf="vm.status !== 'loading'; else loading">
        <ng-container *ngIf="vm.article">
          <div class="banner">
            <div class="container">
              <h1>{{ vm.article.title }}</h1>

              <app-article-meta
                [article]="vm.article"
                [isOwner]="vm.isOwner"
                (toggleFavorite)="toggleFavorite(vm.article)"
                (delete)="deleteArticle(vm.article)"
                (followAuthor)="toggleFollowAuthor($event)"
              ></app-article-meta>
            </div>
          </div>

          <div class="container page">
            <div class="row article-content">
              <div class="col-md-12">
                <div [innerHTML]="vm.article.body | markdown"></div>
                <ul *ngIf="vm.article.tagList.length > 0" class="tag-list">
                  <li
                    class="tag-default tag-pill tag-outline ng-binding ng-scope"
                    *ngFor="let tag of vm.article.tagList"
                  >
                    {{ tag }}
                  </li>
                </ul>
              </div>
            </div>

            <hr />

            <div class="article-actions">
              <app-article-meta
                [article]="vm.article"
                [isOwner]="vm.isOwner"
                (toggleFavorite)="toggleFavorite(vm.article)"
                (delete)="deleteArticle(vm.article)"
                (followAuthor)="toggleFollowAuthor($event)"
              ></app-article-meta>
            </div>

            <div class="row">
              <div class="col-xs-12 col-md-8 offset-md-2">
                <app-article-comment-form
                  [currentUser]="vm.currentUser"
                  (comment)="createComment($event)"
                ></app-article-comment-form>

                <app-article-comment
                  *ngFor="let comment of vm.comments"
                  [comment]="comment"
                  (delete)="deleteComment(comment)"
                ></app-article-comment>
              </div>
            </div>
          </div>
        </ng-container>
      </ng-container>
      <ng-template #loading>
        <p>Loading article...</p>
      </ng-template>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ArticleMeta,
    ArticleComment,
    ArticleCommentForm,
    ArticleBodyMarkdown,
    CommonModule,
  ],
  providers: [provideComponentStore(ArticleStore)],
})
export class Article {
  constructor(private store: ArticleStore) {}

  readonly vm$ = this.store.vm$;

  toggleFavorite(article: ApiArticle) {
    this.store.toggleFavorite(article);
  }

  deleteArticle(article: ApiArticle) {
    this.store.deleteArticle(article);
  }

  toggleFollowAuthor(profile: Profile) {
    this.store.toggleFollowAuthor(profile);
  }

  createComment(comment: string) {
    this.store.createComment(comment);
  }

  deleteComment(comment: CommentWithOwner) {
    this.store.deleteComment(comment);
  }
}
