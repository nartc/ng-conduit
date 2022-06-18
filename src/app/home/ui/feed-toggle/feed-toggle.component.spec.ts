import { EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { FeedToggle } from './feed-toggle.component';

describe(FeedToggle.name, () => {
  let mockedSelectGlobal: jasmine.SpyObj<EventEmitter<void>>;
  let mockedSelectFeed: jasmine.SpyObj<EventEmitter<void>>;

  async function setup(inputs: Partial<FeedToggle> = {}) {
    mockedSelectGlobal = jasmine.createSpyObj('mocked select global', ['emit']);
    mockedSelectFeed = jasmine.createSpyObj('mocked select feed', ['emit']);

    const componentProperties = {
      feedType: 'global',
      isFeedDisabled: true,
      selectedTag: '',
    };

    if (inputs.feedType) {
      componentProperties.feedType = inputs.feedType;
    }

    if (inputs.isFeedDisabled != null) {
      componentProperties.isFeedDisabled = inputs.isFeedDisabled;
    }

    if (inputs.selectedTag) {
      componentProperties.selectedTag = inputs.selectedTag;
    }

    return await render(FeedToggle, {
      componentProperties: {
        feedType: componentProperties.feedType as FeedToggle['feedType'],
        isFeedDisabled: componentProperties.isFeedDisabled,
        selectedTag: componentProperties.selectedTag,
        selectGlobal: mockedSelectGlobal,
        selectFeed: mockedSelectFeed,
      },
    });
  }

  describe('When render', () => {
    describe('Given selected tag', () => {
      it('Then render 3 nav items', async () => {
        const { debugElement } = await setup({ selectedTag: 'tag' });
        const navItems = debugElement.queryAll(By.css('.nav-item'));
        expect(navItems.length).toEqual(3);
      });

      it('Then render 1 nav item with the selected tag', async () => {
        const { getByText } = await setup({ selectedTag: 'tag' });
        const tagNavItem = getByText(/tag/);
        expect(tagNavItem).toBeTruthy();
      });

      it('Then the nav item with selected tag is active', async () => {
        const { getByText } = await setup({ selectedTag: 'tag' });
        const tagNavItem = getByText(/tag/);
        expect(tagNavItem).toHaveClassName('active');
      });
    });

    it('Then show Your Feed nav item', async () => {
      const { getByText } = await setup();
      const yourFeed = getByText(/Your Feed/);
      expect(yourFeed).toBeTruthy();
    });

    it('Then show Global Feed nav item', async () => {
      const { getByText } = await setup();
      const globalFeed = getByText(/Global Feed/);
      expect(globalFeed).toBeTruthy();
    });

    describe('Given isFeedDisabled is true', () => {
      it('Then Your Feed is disabled', async () => {
        const { getByText } = await setup();
        const yourFeed = getByText(/Your Feed/);

        expect(yourFeed).toHaveClassName('disabled');
      });

      it('Then clicking Your Feed should not emit anything', async () => {
        const { getByText } = await setup();
        const yourFeed = getByText(/Your Feed/);

        await userEvent.click(yourFeed);
        expect(mockedSelectFeed.emit).not.toHaveBeenCalled();
      });
    });

    describe('Given isFeedDisabled is false', () => {
      it('Then Your Feed is enabled', async () => {
        const { getByText } = await setup({ isFeedDisabled: false });
        const yourFeed = getByText(/Your Feed/);

        expect(yourFeed).not.toHaveClassName('disabled');
      });

      it('Then clicking Your Feed should emit selectFeed', async () => {
        const { getByText } = await setup({ isFeedDisabled: false });
        const yourFeed = getByText(/Your Feed/);

        await userEvent.click(yourFeed);
        expect(mockedSelectFeed.emit).toHaveBeenCalled();
      });
    });

    describe('Given feedType is feed', () => {
      it('Then Your Feed is active', async () => {
        const { getByText } = await setup({ feedType: 'feed' });
        const yourFeed = getByText(/Your Feed/);
        expect(yourFeed).toHaveClassName('active');

        const globalFeed = getByText(/Global Feed/);
        expect(globalFeed).not.toHaveClassName('active');
      });
    });

    describe('Given feedType is global', () => {
      it('Then Global Feed is active', async () => {
        const { getByText } = await setup({ feedType: 'global' });

        const globalFeed = getByText(/Global Feed/);
        expect(globalFeed).toHaveClassName('active');

        const yourFeed = getByText(/Your Feed/);
        expect(yourFeed).not.toHaveClassName('active');
      });
    });

    describe('When clicking on Global Feed', () => {
      it('Then selectGlobal should emit', async () => {
        const { getByText } = await setup();
        const globalFeed = getByText(/Global Feed/);

        await userEvent.click(globalFeed);

        expect(mockedSelectGlobal.emit).toHaveBeenCalled();
      });
    });
  });
});
