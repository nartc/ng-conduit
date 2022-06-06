import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesArticles } from './favorites-articles.component';

describe(FavoritesArticles.name, () => {
  let fixture: ComponentFixture<FavoritesArticles>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesArticles);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
