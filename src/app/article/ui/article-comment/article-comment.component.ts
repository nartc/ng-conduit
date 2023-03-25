import { DatePipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommentWithOwner } from '../../../shared/data-access/models';

@Component({
  selector: 'app-article-comment[comment]',
  template: `
    <div class="card">
      <div class="card-block">
        <p class="card-text">
          {{ comment.body }}
        </p>
      </div>
      <div class="card-footer">
        <a
          [routerLink]="['/profile', comment.author.username]"
          class="comment-author"
          id="authorAvatar"
        >
          <img
            [src]="comment.author.image"
            class="comment-author-img"
            alt="Avatar of comment author"
          />
        </a>
        &nbsp;
        <a
          [routerLink]="['/profile', comment.author.username]"
          class="comment-author"
          id="authorUsername"
        >
          {{ comment.author.username }}
        </a>
        <span class="date-posted">
          {{ comment.updatedAt | date : 'mediumDate' }}
        </span>
        <span class="mod-options" *ngIf="comment.isOwner">
          <i class="ion-trash-a" (click)="delete.emit()"></i>
        </span>
      </div>
    </div>
  `,
  standalone: true,
  imports: [RouterLink, NgIf, DatePipe],
})
export class ArticleComment {
  @Input() comment!: CommentWithOwner;
  @Output() delete = new EventEmitter();
}
