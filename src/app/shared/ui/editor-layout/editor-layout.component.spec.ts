import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { EditorLayout } from './editor-layout.component';

describe(EditorLayout.name, () => {
  describe('When render', () => {
    it('Then render top level editor-page', async () => {
      const { debugElement } = await render(EditorLayout);
      const editorPage = debugElement.query(By.css('.editor-page'));
      expect(editorPage).toBeTruthy();
    });

    it('Then render the projected content', async () => {
      const { getByText } = await render(
        `
<app-editor-layout>
  <div>dummy</div>        
</app-editor-layout>
`,
        { imports: [EditorLayout] }
      );

      expect(getByText(/dummy/)).toBeTruthy();
    });
  });
});
