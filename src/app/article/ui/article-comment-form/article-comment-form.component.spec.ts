import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleCommentForm } from './article-comment-form.component';

describe(ArticleCommentForm.name, () => {
  let fixture: ComponentFixture<ArticleCommentForm>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleCommentForm);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
