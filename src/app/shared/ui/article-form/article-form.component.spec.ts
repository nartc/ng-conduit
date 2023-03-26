import { EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { getMockedArticle } from '../../../testing.spec';
import { ArticleForm, ArticleFormData } from './article-form.component';

describe(ArticleForm.name, () => {
    let mockedArticleSubmit: jasmine.SpyObj<EventEmitter<ArticleFormData>>;

    describe('Given no article is provided', async () => {
        async function setup() {
            mockedArticleSubmit = jasmine.createSpyObj('mocked article submit', ['emit']);

            return await render(ArticleForm, {
                componentProperties: {
                    articleSubmit: mockedArticleSubmit,
                },
            });
        }

        describe('When render', () => {
            it('Then form controls should reflect value properly', async () => {
                const { getByPlaceholderText, debugElement } = await setup();

                const titleInput = getByPlaceholderText(/Article Title/);
                const descriptionInput = getByPlaceholderText(/What's this article about/);
                const bodyInput = getByPlaceholderText(/Write your article/);
                const tagsSpans = debugElement.queryAll(By.css('.tag-pill.tag-default'));

                expect(titleInput).toHaveValue('');
                expect(descriptionInput).toHaveValue('');
                expect(bodyInput).toHaveValue('');
                expect(tagsSpans.length).toEqual(0);
            });

            describe('When edit', () => {
                it('Then form should reflect input controls', async () => {
                    const { getByPlaceholderText, fixture } = await setup();
                    const titleInput = getByPlaceholderText(/Article Title/);

                    await userEvent.clear(titleInput);
                    await userEvent.type(titleInput, 'updated article title');

                    expect(fixture.componentInstance.form.getRawValue()).toEqual({
                        title: 'updated article title',
                        description: '',
                        body: '',
                        tagList: [],
                    });
                });

                it('Then adding tags should update tagList', async () => {
                    const { getByPlaceholderText, fixture } = await setup();
                    const tagInput = getByPlaceholderText(/Enter tags/);

                    await userEvent.type(tagInput, 'tag one');
                    await userEvent.keyboard('{Enter}');
                    await userEvent.type(tagInput, 'tag two');
                    await userEvent.keyboard('{Enter}');

                    expect(fixture.componentInstance.form.getRawValue().tagList).toEqual(['tag one', 'tag two']);
                });

                it('Then removing tags should update tagList', async () => {
                    const { getByPlaceholderText, getByText, fixture, debugElement } = await setup();
                    const tagInput = getByPlaceholderText(/Enter tags/);

                    await userEvent.type(tagInput, 'tag one');
                    await userEvent.keyboard('{Enter}');

                    expect(fixture.componentInstance.form.getRawValue().tagList).toEqual(['tag one']);

                    const tagOneCloseIcon = debugElement.query(By.css('.tag-pill.tag-default > i'));
                    await userEvent.click(tagOneCloseIcon.nativeElement);

                    expect(fixture.componentInstance.form.getRawValue().tagList).toEqual([]);
                });

                it('Then articleSubmit should emit current form data on Publish click', async () => {
                    const { getByText, getByPlaceholderText, fixture } = await setup();

                    const titleInput = getByPlaceholderText(/Article Title/);
                    const descriptionInput = getByPlaceholderText(/What's this article about/);
                    const bodyInput = getByPlaceholderText(/Write your article/);
                    const tagInput = getByPlaceholderText(/Enter tags/);
                    const publishButton = getByText(/Publish Article/);

                    await userEvent.type(titleInput, 'title');
                    await userEvent.type(descriptionInput, 'description');
                    await userEvent.type(bodyInput, 'body');

                    await userEvent.type(tagInput, 'tag one');
                    await userEvent.keyboard('{Enter}');

                    // empty tagInput after adding tag
                    expect(tagInput).toHaveValue('');

                    await userEvent.click(publishButton);

                    expect(mockedArticleSubmit.emit).toHaveBeenCalledWith(fixture.componentInstance.form.getRawValue());
                });
            });
        });
    });

    describe('Given article is provided', async () => {
        const mockedArticle = getMockedArticle();

        async function setup() {
            mockedArticleSubmit = jasmine.createSpyObj('mocked article submit', ['emit']);

            return await render(ArticleForm, {
                componentProperties: {
                    article: mockedArticle,
                    articleSubmit: mockedArticleSubmit,
                },
            });
        }

        it('Then form initial value should be the provided article', async () => {
            const { fixture } = await setup();

            expect(fixture.componentInstance.form.getRawValue()).toEqual({
                title: mockedArticle.title,
                description: mockedArticle.description,
                body: mockedArticle.body,
                tagList: mockedArticle.tagList,
            });
        });
    });
});
