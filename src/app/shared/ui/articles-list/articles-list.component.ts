import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Article } from '../../data-access/api';
import { ApiStatus } from '../../data-access/models';
import { ArticlePreview } from '../article-preview/article-preview.component';

@Component({
  selector: 'app-articles-list[status]',
  template: `
    <ng-container *ngIf="status !== 'loading'; else loading">
      <ng-container *ngIf="articles.length > 0; else noArticles">
        <app-article-preview
          *ngFor="let article of articles"
          [article]="article"
          (toggleFavorite)="toggleFavorite.emit($event)"
        />
      </ng-container>
      <ng-template #noArticles>
        <app-article-preview>No articles are here...yet</app-article-preview>
      </ng-template>
    </ng-container>

    <ng-template #loading>
      <app-article-preview>Loading articles...</app-article-preview>
    </ng-template>
  `,
  standalone: true,
  imports: [ArticlePreview, NgIf, NgFor],
})
export class ArticlesList {
  @Input() status!: ApiStatus;
  @Input() articles: Article[] = [];

  @Output() toggleFavorite = new EventEmitter<Article>();
}
