import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthLayout } from './auth-layout.component';

describe(AuthLayout.name, () => {
  let fixture: ComponentFixture<AuthLayout>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthLayout);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
