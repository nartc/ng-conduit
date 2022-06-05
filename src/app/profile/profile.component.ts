import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  template: `
    profile
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class Profile {}
