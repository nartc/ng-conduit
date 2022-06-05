import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-favorites',
  template: `
    favorites
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class Favorites {}
