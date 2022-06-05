import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-article',
  template: `
    article
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class Article {}
