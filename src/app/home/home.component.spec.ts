import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home.component';

describe(Home.name, () => {
  let fixture: ComponentFixture<Home>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Home);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
