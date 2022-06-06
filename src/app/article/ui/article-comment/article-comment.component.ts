import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommentWithOwner } from '../../article.store';

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
        >
          {{ comment.author.username }}
        </a>
        <span class="date-posted">
          {{ comment.updatedAt | date: 'mediumDate' }}
        </span>
        <span class="mod-options" *ngIf="comment.isOwner">
          <i class="ion-trash-a" (click)="delete.emit()"></i>
        </span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class ArticleComment {
  @Input() comment!: CommentWithOwner;
  @Output() delete = new EventEmitter();
}
