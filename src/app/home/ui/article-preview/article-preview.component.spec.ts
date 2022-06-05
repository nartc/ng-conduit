import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ArticlePreview } from './article-preview.component';

describe(ArticlePreview.name, () => {
  let fixture: ComponentFixture<ArticlePreview>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    }).createComponent(ArticlePreview);
  });

  it('should create component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
