import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  template: `
    settings
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class Settings {}
