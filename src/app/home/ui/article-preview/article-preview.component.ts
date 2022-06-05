import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Article } from '../../../shared/data-access/api';

@Component({
  selector: 'app-article-preview[article]',
  template: `
    <div class="article-preview">
      <div class="article-meta">
        <a [routerLink]="['/profile', article.author.username]">
          <img [src]="article.author.image" alt="Avatar of article author" />
        </a>
        <div class="info">
          <a
            [routerLink]="['/profile', article.author.username]"
            class="author"
          >
            {{ article.author.username }}
          </a>
          <span class="date">{{ article.updatedAt | date: 'mediumDate' }}</span>
        </div>
        <button
          class="btn btn-sm pull-xs-right"
          [class]="[article.favorited ? 'btn-primary' : 'btn-outline-primary']"
          (click)="toggleFavorite.emit(article)"
        >
          <i class="ion-heart"></i>
          {{ article.favoritesCount }}
        </button>
      </div>
      <a [routerLink]="['/article', article.slug]" class="preview-link">
        <h1>{{ article.title }}</h1>
        <p>{{ article.description }}</p>
        <span>Read more...</span>
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ArticlePreview {
  @Input() article!: Article;

  @Output() toggleFavorite = new EventEmitter<Article>();
}
