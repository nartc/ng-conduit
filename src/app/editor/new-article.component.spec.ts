import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewArticle } from './new-article.component';

describe(NewArticle.name, () => {
  let fixture: ComponentFixture<NewArticle>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewArticle);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
