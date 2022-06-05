import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Articles } from './articles.component';

describe(Articles.name, () => {
  let fixture: ComponentFixture<Articles>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Articles);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
