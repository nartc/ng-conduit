import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
        <ng-content />
      </ng-template>
    </div>
  `,
  standalone: true,
  imports: [NgIf, NgFor],
})
export class Tags {
  @Input() status!: ApiStatus;
  @Input() tags: string[] = [];

  @Output() selectTag = new EventEmitter<string>();
}
