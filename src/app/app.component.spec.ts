import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { App } from './app.component';
import { AuthStore } from './shared/data-access/auth.store';

describe(App.name, () => {
  let fixture: ComponentFixture<App>;
  let mockedAuthStore: jasmine.SpyObj<AuthStore>;

  beforeEach(() => {
    mockedAuthStore = jasmine.createSpyObj(AuthStore.name, ['init']);

    fixture = TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: AuthStore, useValue: mockedAuthStore }],
    }).createComponent(App);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should call authStore.init on component init', () => {
    fixture.detectChanges();
    expect(mockedAuthStore.init).toHaveBeenCalled();
  });

  describe('render', () => {
    it('should render router-outlet', () => {
      fixture.detectChanges();
      const routerOutletElement = fixture.debugElement.query(
        By.css('router-outlet')
      );
      expect(routerOutletElement).toBeTruthy();
    });
  });
});
