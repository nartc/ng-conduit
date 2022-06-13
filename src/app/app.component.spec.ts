import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { App } from './app.component';
import { AuthStore } from './shared/data-access/auth.store';

describe(App.name, () => {
  let mockedAuthStore: jasmine.SpyObj<AuthStore>;

  async function setupAppRender() {
    mockedAuthStore = jasmine.createSpyObj(AuthStore.name, ['init']);
    return await render(App, {
      providers: [{ provide: AuthStore, useValue: mockedAuthStore }],
    });
  }

  it('Then create component', async () => {
    const { fixture } = await setupAppRender();
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  describe('When component init', () => {
    it('Then call authStore.init', async () => {
      await setupAppRender();
      expect(mockedAuthStore.init).toHaveBeenCalled();
    });
  });

  describe('When render', () => {
    it('Then render router-outlet', async () => {
      const { fixture } = await setupAppRender();
      const routerOutletElement = fixture.debugElement.query(
        By.css('router-outlet')
      );
      expect(routerOutletElement).toBeTruthy();
    });
  });
});
