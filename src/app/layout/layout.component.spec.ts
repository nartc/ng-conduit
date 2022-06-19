import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { of } from 'rxjs';
import { AuthStore } from '../shared/data-access/auth.store';
import { getMockedProfile, getMockedUser } from '../testing.spec';
import { Layout } from './layout.component';
import { Footer } from './ui/footer/footer.component';
import { Header } from './ui/header/header.component';

describe(Layout.name, () => {
  let mockedAuthStore: jasmine.SpyObj<AuthStore>;

  async function setup() {
    mockedAuthStore = jasmine.createSpyObj<AuthStore>(AuthStore.name, [], {
      auth$: of({
        isAuthenticated: true,
        user: getMockedUser(),
        profile: getMockedProfile(),
      }),
    });

    return await render(Layout, {
      providers: [{ provide: AuthStore, useValue: mockedAuthStore }],
    });
  }

  it('Then create component', async () => {
    const { fixture } = await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('When render', () => {
    it('Then show Header', async () => {
      const { debugElement } = await setup();

      const header = debugElement.query(By.directive(Header));

      expect(header).toBeTruthy();
      expect(header.componentInstance).toBeInstanceOf(Header);
    });

    it('Then show Footer', async () => {
      const { debugElement } = await setup();

      const footer = debugElement.query(By.directive(Footer));

      expect(footer).toBeTruthy();
      expect(footer.componentInstance).toBeInstanceOf(Footer);
    });

    it('Then show router-outlet', async () => {
      const { debugElement } = await setup();

      const routerOutletElement = debugElement.query(By.css('router-outlet'));
      expect(routerOutletElement).toBeTruthy();
    });
  });
});
