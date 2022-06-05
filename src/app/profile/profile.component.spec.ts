import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Profile } from './profile.component';

describe(Profile.name, () => {
  let fixture: ComponentFixture<Profile>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Profile);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
