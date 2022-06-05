import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Favorites } from './favorites.component';

describe(Favorites.name, () => {
  let fixture: ComponentFixture<Favorites>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Favorites);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
