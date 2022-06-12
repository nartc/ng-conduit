import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticlesList } from './articles-list.component';

describe(ArticlesList.name, () => {
  let fixture: ComponentFixture<ArticlesList>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesList);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
