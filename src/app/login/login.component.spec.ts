import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Login } from './login.component';

describe(Login.name, () => {
  let fixture: ComponentFixture<Login>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).createComponent(Login);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
