import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Settings } from './settings.component';

describe(Settings.name, () => {
  let fixture: ComponentFixture<Settings>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Settings);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
