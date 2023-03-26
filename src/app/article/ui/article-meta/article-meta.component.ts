import { DatePipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article, Profile } from '../../../shared/data-access/api';

@Component({
    selector: 'app-article-meta[article]',
    template: `
        <div class="article-meta">
            <a [routerLink]="['/profile', article.author.username]">
                <img [src]="article.author.image" alt="Avatar of article author" />
            </a>
            <div class="info">
                <a [routerLink]="['/profile', article.author.username]" class="author">
                    {{ article.author.username }}
                </a>
                <span class="date">{{ article.updatedAt | date : 'mediumDate' }}</span>
            </div>

            <ng-container *ngIf="isOwner; else nonOwner">
                <a class="btn btn-outline-secondary btn-sm" [routerLink]="['/editor', article.slug]">
                    <i class="ion-edit"></i>
                    Edit Article
                </a>
                <button style="margin-left: 0.5rem;" class="btn btn-outline-danger btn-sm" (click)="delete.emit()">
                    <i class="ion-trash-a"></i>
                    Delete Article
                </button>
            </ng-container>
            <ng-template #nonOwner>
                <button
                    class="btn btn-sm btn-outline-secondary"
                    (click)="followAuthor.emit(article.author)"
                    id="followAuthor"
                >
                    <i class="ion-plus-round"></i>
                    &nbsp; {{ article.author.following ? 'Unfollow' : 'Follow' }}
                    {{ article.author.username }}
                </button>
                &nbsp;
                <button
                    class="btn btn-sm"
                    [class.btn-outline-primary]="article.favorited"
                    (click)="toggleFavorite.emit()"
                    id="toggleFavorite"
                >
                    <i class="ion-heart"></i>
                    &nbsp; {{ article.favorited ? 'Unfavorite' : 'Favorite' }} Post
                    <span class="counter">({{ article.favoritesCount }})</span>
                </button>
            </ng-template>
        </div>
    `,
    standalone: true,
    imports: [RouterLink, NgIf, DatePipe],
})
export class ArticleMeta {
    @Input() article!: Article;
    @Input() isOwner = false;

    @Output() delete = new EventEmitter();
    @Output() followAuthor = new EventEmitter<Profile>();
    @Output() toggleFavorite = new EventEmitter();
}
