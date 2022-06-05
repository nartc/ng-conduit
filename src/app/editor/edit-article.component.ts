import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-edit-article',
  template: `
    edit article
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class EditArticle {}
