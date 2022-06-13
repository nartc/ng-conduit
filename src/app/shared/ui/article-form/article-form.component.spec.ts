import { render } from '@testing-library/angular';
import { ArticleForm } from './article-form.component';

describe(ArticleForm.name, () => {
  describe('Given article is provided', () => {
    it('Then render component', async () => {
      await render(ArticleForm);
    });
  });
});
