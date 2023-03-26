import { render } from '@testing-library/angular';
import { Banner } from './banner.component';

describe(Banner.name, () => {
    async function setup() {
        return await render(Banner);
    }

    describe('When render', () => {
        it('Then render banner title', async () => {
            const { getByText } = await setup();
            expect(getByText(/conduit/)).toBeTruthy();
        });

        it('Then render banner description', async () => {
            const { getByText } = await setup();
            expect(getByText(/A place to share your knowledge/)).toBeTruthy();
        });
    });
});
