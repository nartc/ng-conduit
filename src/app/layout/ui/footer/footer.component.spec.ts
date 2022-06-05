import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Footer } from './footer.component';

describe(Footer.name, () => {
  let fixture: ComponentFixture<Footer>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    }).createComponent(Footer);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
