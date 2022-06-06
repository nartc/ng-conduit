import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleComment } from './article-comment.component';

describe(ArticleComment.name, () => {
  let fixture: ComponentFixture<ArticleComment>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleComment);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
