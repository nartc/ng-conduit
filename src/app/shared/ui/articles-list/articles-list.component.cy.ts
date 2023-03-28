import { RouterTestingModule } from '@angular/router/testing';
import { createOutputSpy } from 'cypress/angular';
import { getMockedArticle } from '../../../testing.spec';
import { Article } from '../../data-access/api';
import { ApiStatus } from '../../data-access/models';
import { ArticlesList } from './articles-list.component';

describe(ArticlesList.name, () => {
    function setup(status: ApiStatus, articles: Article[] = []) {
        cy.mount(ArticlesList, {
            componentProperties: {
                articles,
                status,
                toggleFavorite: createOutputSpy<Article>('toggleFavoriteSpy'),
            },
            imports: [RouterTestingModule],
        });
    }

    describe('given status is loading', () => {
        it('then render article-preview with loading text', () => {
            setup('loading');
            cy.get('app-article-preview')
                .should('exist')
                .findByText(/Loading articles/);
        });
    });

    describe('given status is not loading', () => {
        describe('given no articles', () => {
            it('then render article-preview with no articles text', () => {
                setup('success');
                cy.get('app-article-preview')
                    .should('exist')
                    .findByText(/No articles are here/);
            });
        });

        describe('given articles', () => {
            const mockedArticles = [
                getMockedArticle({
                    profile: { username: 'username one' },
                    article: { favorited: true },
                }),
                getMockedArticle({ profile: { username: 'username two' } }),
            ];

            it('then render correct number of articles', () => {
                setup('success', mockedArticles);
                cy.get('app-article-preview')
                    .should('have.length', mockedArticles.length)
                    .each(($el, index) => {
                        cy.wrap($el)
                            .should('contain.text', mockedArticles[index].author.username)
                            .findByRole('button')
                            .should(
                                'have.class',
                                mockedArticles[index].favorited ? 'btn-primary' : 'btn-outline-primary'
                            );
                    });
            });

            it('then toggleFavorite emit the correct article', () => {
                setup('success', mockedArticles);
                cy.get('app-article-preview').each(($el, index) => {
                    cy.wrap($el).findByRole('button').click();
                    cy.get('@toggleFavoriteSpy').should('have.been.calledWith', mockedArticles[index]);
                });
            });
        });
    });
});
