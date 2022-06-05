import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  template: `
    <footer>
      <div class="container">
        <a routerLink="/" class="logo-font">conduit</a>
        <span class="attribution">
          An interactive learning project from
          <a href="https://thinkster.io" target="_blank">Thinkster</a>
          . Code &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterModule],
})
export class Footer {}
