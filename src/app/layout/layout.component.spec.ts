import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Layout } from './layout.component';

describe(Layout.name, () => {
  let fixture: ComponentFixture<Layout>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).createComponent(Layout);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
