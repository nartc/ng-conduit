import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Article } from '../../../shared/data-access/api';
import { HomeStatus } from '../../home.store';
import { ArticlePreview } from '../article-preview/article-preview.component';

@Component({
  selector: 'app-articles[status]',
  template: `
    <ng-container *ngIf="status !== 'loading'; else loading">
      <ng-container *ngIf="articles.length > 0; else noArticles">
        <app-article-preview
          *ngFor="let article of articles"
          [article]="article"
          (toggleFavorite)="toggleFavorite.emit($event)"
        ></app-article-preview>
      </ng-container>
      <ng-template #noArticles>
        <p>No articles</p>
      </ng-template>
    </ng-container>

    <ng-template #loading>
      <ng-content></ng-content>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ArticlePreview, CommonModule],
})
export class Articles {
  @Input() status!: HomeStatus;
  @Input() articles: Article[] = [];

  @Output() toggleFavorite = new EventEmitter<Article>();
}
