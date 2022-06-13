import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { App } from './app.component';
import { AuthStore } from './shared/data-access/auth.store';

describe(App.name, () => {
  let mockedAuthStore: jasmine.SpyObj<AuthStore>;

  async function setupAppRender() {
    return await render(App, {
      providers: [{ provide: AuthStore, useValue: mockedAuthStore }],
    });
  }

  beforeEach(() => {
    mockedAuthStore = jasmine.createSpyObj(AuthStore.name, ['init']);
  });

  it('Then create component', async () => {
    const rendered = await setupAppRender();

    const component = rendered.fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  describe('When component init', () => {
    it('Then call authStore.init', async () => {
      const rendered = await setupAppRender();
      expect(mockedAuthStore.init).toHaveBeenCalled();
    });
  });

  describe('When render', () => {
    it('Then render router-outlet', async () => {
      const rendered = await setupAppRender();
      const routerOutletElement = rendered.debugElement.query(
        By.css('router-outlet')
      );
      expect(routerOutletElement).toBeTruthy();
    });
  });
});
