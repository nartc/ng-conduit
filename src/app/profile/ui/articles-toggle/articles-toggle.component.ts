import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-articles-toggle',
  template: `
    <div class="articles-toggle">
      <ul class="nav nav-pills outline-active">
        <li class="nav-item">
          <a
            class="nav-link"
            [class.active]="articlesType === 'profile'"
            (click)="selectProfileArticles.emit()"
          >
            My Articles
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            [class.active]="articlesType === 'favorited'"
            (click)="selectFavoritedArticles.emit()"
          >
            Favorited Articles
          </a>
        </li>
      </ul>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ArticlesToggle {
  @Input() articlesType: 'profile' | 'favorited' = 'profile';
  @Output() selectProfileArticles = new EventEmitter();
  @Output() selectFavoritedArticles = new EventEmitter();
}
