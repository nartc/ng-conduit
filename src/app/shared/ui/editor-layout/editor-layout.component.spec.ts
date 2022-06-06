import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorLayout } from './editor-layout.component';

describe(EditorLayout.name, () => {
  let fixture: ComponentFixture<EditorLayout>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorLayout);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
