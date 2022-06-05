import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditArticle } from './edit-article.component';

describe(EditArticle.name, () => {
  let fixture: ComponentFixture<EditArticle>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditArticle);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
