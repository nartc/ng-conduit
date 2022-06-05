import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedToggle } from './feed-toggle.component';

describe(FeedToggle.name, () => {
  let fixture: ComponentFixture<FeedToggle>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedToggle);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
