import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tags } from './tags.component';

describe(Tags.name, () => {
  let fixture: ComponentFixture<Tags>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Tags);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
