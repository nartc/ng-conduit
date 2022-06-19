import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { Footer } from './footer.component';

describe(Footer.name, () => {
  async function setup() {
    return await render(Footer);
  }

  it('Then create component', async () => {
    const { fixture } = await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('When render', () => {
    it('Then show link with app title', async () => {
      const { debugElement } = await setup();

      const logoLink = debugElement.query(By.css('.logo-font'));

      expect(logoLink).toBeTruthy();
      expect(logoLink.nativeElement).toHaveAttribute('href', '/');
    });

    it('Then show attribution', async () => {
      const { debugElement } = await setup();

      const attributionSpan = debugElement.query(By.css('.attribution'));

      expect(attributionSpan).toBeTruthy();
      expect(attributionSpan.nativeElement).toHaveTextContent(
        /An interactive learning project/
      );

      const thinksterLink = attributionSpan.query(By.css('a'));

      expect(thinksterLink.nativeElement).toHaveTextContent('Thinkster');
      expect(thinksterLink.nativeElement).toHaveAttribute(
        'href',
        'https://thinkster.io'
      );
    });
  });
});
