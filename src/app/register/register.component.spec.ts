import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Register } from './register.component';

describe(Register.name, () => {
  let fixture: ComponentFixture<Register>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    }).createComponent(Register);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
