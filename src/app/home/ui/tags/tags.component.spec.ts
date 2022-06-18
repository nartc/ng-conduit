import { EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { Tags } from './tags.component';

describe(Tags.name, () => {
  let mockedSelectTag: jasmine.SpyObj<EventEmitter<string>>;

  async function setup(inputs: Partial<Tags> = {}, content?: string) {
    mockedSelectTag = jasmine.createSpyObj('mocked select tag', ['emit']);

    const componentInputs: Partial<Tags> = { tags: [] };

    if (inputs.status) {
      componentInputs.status = inputs.status;
    }

    if (inputs.tags) {
      componentInputs.tags = inputs.tags;
    }

    if (content) {
      return await render(
        `
<app-tags [status]='status' [tags]='tags' (selectTag)='selectTag.emit($event)'>
  ${content}
</app-tags>
      `,
        {
          imports: [Tags],
          componentProperties: {
            ...componentInputs,
            selectTag: mockedSelectTag,
          },
        }
      );
    }

    return await render(Tags, {
      componentProperties: {
        ...componentInputs,
        selectTag: mockedSelectTag,
      },
    });
  }

  describe('When render', () => {
    it('Then show sidebar', async () => {
      const { debugElement } = await setup({ status: 'idle' });
      const sidebar = debugElement.query(By.css('.sidebar'));
      expect(sidebar).toBeTruthy();
    });

    describe('Given status is loading', () => {
      it('Then show loading text', async () => {
        const { getByText } = await setup(
          { status: 'loading' },
          `<p>Loading tags</p>`
        );
        expect(getByText(/Loading tags/)).toBeTruthy();
      });
    });

    describe('Given status is not loading', () => {
      describe('Given tags is empty', () => {
        it('Then render no tags text', async () => {
          const { getByText } = await setup({ status: 'success' });
          expect(getByText(/No tags/)).toBeTruthy();
        });
      });

      describe('Given tags has items', () => {
        it('Then render tags as pills', async () => {
          const tags = ['tag one', 'tag two'];
          const { debugElement } = await setup({ status: 'success', tags });

          const tagPills = debugElement.queryAll(
            By.css('.tag-pill.tag-default')
          );
          expect(tagPills.length).toEqual(tags.length);
          tagPills.forEach((tag, index) => {
            expect(tag.nativeElement).toHaveTextContent(tags[index]);
          });
        });

        describe('When clicking on a tag', () => {
          it('Then selectTag emits correct tag', async () => {
            const tags = ['tag one', 'tag two'];
            const { debugElement } = await setup({ status: 'success', tags });

            const tagPills = debugElement.queryAll(
              By.css('.tag-pill.tag-default')
            );

            for (let i = 0; i < tagPills.length; i++) {
              const tagPill = tagPills[i];
              await userEvent.click(tagPill.nativeElement);
              expect(mockedSelectTag.emit).toHaveBeenCalledWith(tags[i]);
            }
          });
        });
      });
    });
  });
});
