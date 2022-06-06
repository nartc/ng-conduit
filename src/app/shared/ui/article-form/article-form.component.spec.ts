import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleForm } from './article-form.component';

describe(ArticleForm.name, () => {
  let fixture: ComponentFixture<ArticleForm>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleForm);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
