import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleMeta } from './article-meta.component';

describe(ArticleMeta.name, () => {
  let fixture: ComponentFixture<ArticleMeta>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleMeta);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
