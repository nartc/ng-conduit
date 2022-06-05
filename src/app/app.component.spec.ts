import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { App } from './app.component';

describe(App.name, () => {
  let fixture: ComponentFixture<App>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).createComponent(App);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
