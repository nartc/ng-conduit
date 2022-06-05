import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Banner } from './banner.component';

describe(Banner.name, () => {
  let fixture: ComponentFixture<Banner>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Banner);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
