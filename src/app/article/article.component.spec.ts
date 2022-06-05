import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Article } from './article.component';

describe(Article.name, () => {
  let fixture: ComponentFixture<Article>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Article);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
