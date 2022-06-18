import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { ArticleBodyMarkdown } from './article-body-markdown.pipe';

@Component({
  selector: 'test-dummy',
  template: `
    <div class="content" [innerHTML]="content | markdown"></div>
  `,
  imports: [ArticleBodyMarkdown],
  standalone: true,
})
class TestDummy {
  @Input() content = '';
}

describe(ArticleBodyMarkdown.name, () => {
  async function setup(content: string) {
    return await render(TestDummy, {
      componentProperties: { content },
    });
  }

  describe('Given empty content', () => {
    it('Then render empty innerHTML', async () => {
      const { debugElement } = await setup('');
      const contentDiv = debugElement.query(By.css('.content'));
      expect(contentDiv.nativeElement).toHaveTextContent('');
    });
  });

  describe('Given valid markdown content', () => {
    it('Then render valid html', async () => {
      const { debugElement } = await setup(`**bold** and _italic_`);
      const contentDiv = debugElement.query(By.css('.content'));

      const transformedParagraph = contentDiv.query(By.css('p'));
      expect(transformedParagraph).toBeTruthy();

      const boldElement = transformedParagraph.query(By.css('strong'));
      const italicElement = transformedParagraph.query(By.css('em'));

      expect(boldElement.nativeElement).toHaveTextContent('bold');
      expect(italicElement.nativeElement).toHaveTextContent('italic');
    });
  });

  describe('Given malicious content', () => {
    it('Then render with sanitized content', async () => {
      const { debugElement } = await setup(
        `**this is malicious** <script>alert("malicious")</script>`
      );

      const contentDiv = debugElement.query(By.css('.content'));

      const transformedParagraph = contentDiv.query(By.css('p'));
      expect(transformedParagraph).toBeTruthy();

      const boldElement = transformedParagraph.query(By.css('strong'));
      expect(boldElement.nativeElement).toHaveTextContent('this is malicious');

      const scriptElement = transformedParagraph.query(By.css('script'));
      expect(scriptElement).toBeFalsy();
    });
  });
});
