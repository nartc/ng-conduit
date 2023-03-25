import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from '../../data-access/api';

@Component({
  selector: 'app-article-preview',
  template: `
    <div class="article-preview">
      <ng-container *ngIf="article; else noArticle">
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
            <span class="date">
              {{ article.updatedAt | date : 'mediumDate' }}
            </span>
          </div>
          <button
            class="btn btn-sm pull-xs-right"
            [class]="[
              article.favorited ? 'btn-primary' : 'btn-outline-primary'
            ]"
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
          <ul *ngIf="article.tagList.length > 0" class="tag-list">
            <li
              *ngFor="let tag of article.tagList"
              class="tag-default tag-pill tag-outline"
            >
              {{ tag }}
            </li>
          </ul>
        </a>
      </ng-container>
      <ng-template #noArticle>
        <ng-content />
      </ng-template>
    </div>
  `,
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, RouterLink],
})
export class ArticlePreview {
  @Input() article?: Article;

  @Output() toggleFavorite = new EventEmitter<Article>();
}
