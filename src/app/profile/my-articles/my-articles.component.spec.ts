import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyArticles } from './my-articles.component';

describe(MyArticles.name, () => {
  let fixture: ComponentFixture<MyArticles>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyArticles);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
