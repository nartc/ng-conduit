import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticlesToggle } from './articles-toggle.component';

describe(ArticlesToggle.name, () => {
  let fixture: ComponentFixture<ArticlesToggle>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesToggle);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
