import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-new-article',
  template: `
    new article
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class NewArticle {}
