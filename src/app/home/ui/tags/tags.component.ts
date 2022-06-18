import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ApiStatus } from '../../../shared/data-access/models';

@Component({
  selector: 'app-tags[status]',
  template: `
    <div class="sidebar">
      <p>Popular Tags</p>

      <div class="tag-list">
        <ng-container *ngIf="status !== 'loading'; else loading">
          <ng-container *ngIf="tags.length; else noTags">
            <a
              class="tag-pill tag-default"
              *ngFor="let tag of tags"
              (click)="selectTag.emit(tag)"
            >
              {{ tag }}
            </a>
          </ng-container>
          <ng-template #noTags>No tags</ng-template>
        </ng-container>
      </div>

      <ng-template #loading>
        <ng-content></ng-content>
      </ng-template>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class Tags {
  @Input() status!: ApiStatus;
  @Input() tags: string[] = [];

  @Output() selectTag = new EventEmitter<string>();
}
