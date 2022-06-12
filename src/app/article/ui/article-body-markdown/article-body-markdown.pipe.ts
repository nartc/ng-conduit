import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { marked } from 'marked';

@Pipe({
  standalone: true,
  name: 'markdown',
})
export class ArticleBodyMarkdown implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}

  transform(value: string): string {
    return this.domSanitizer.sanitize(
      SecurityContext.HTML,
      marked(value)
    ) as string;
  }
}
