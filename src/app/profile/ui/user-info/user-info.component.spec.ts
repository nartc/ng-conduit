import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInfo } from './user-info.component';

describe(UserInfo.name, () => {
  let fixture: ComponentFixture<UserInfo>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfo);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
