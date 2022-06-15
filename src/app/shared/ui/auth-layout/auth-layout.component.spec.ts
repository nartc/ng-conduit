import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { AuthLayout } from './auth-layout.component';

describe(AuthLayout.name, () => {
  describe('When render', () => {
    it('Then render top level auth-page', async () => {
      const { debugElement } = await render(AuthLayout);
      const authPage = debugElement.query(By.css('.auth-page'));
      expect(authPage).toBeTruthy();
    });

    it('Then render the projected content', async () => {
      const { getByText } = await render(
        `
<app-auth-layout>
  <div>dummy</div>        
</app-auth-layout>
`,
        { imports: [AuthLayout] }
      );

      expect(getByText(/dummy/)).toBeTruthy();
    });
  });
});
