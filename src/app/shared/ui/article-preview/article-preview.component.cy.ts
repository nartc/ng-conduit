import { DatePipe } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createOutputSpy } from 'cypress/angular';
import { getMockedArticle } from '../../../testing.spec';
import { Article } from '../../data-access/api';
import { ArticlePreview } from './article-preview.component';

describe(ArticlePreview.name, () => {
    function setup({ content = '', article = undefined }: { article?: Article; content?: string }) {
        const imports: any[] = [RouterTestingModule];

        if (content) {
            imports.push(ArticlePreview);
        }

        cy.mount(content ? `<app-article-preview>${content}</app-article-preview>` : ArticlePreview, {
            componentProperties: {
                article,
                toggleFavorite: createOutputSpy<Article>('toggleFavoriteSpy'),
            },
            imports,
        }).then(() => {
            cy.wrap(new DatePipe(TestBed.inject(LOCALE_ID))).as('datePipe');
        });
    }

    describe('given no article', () => {
        it('then project content', () => {
            setup({ content: 'No article' });
            cy.findByText(/No article/).should('exist');
        });
    });

    describe('given article', () => {
        const mockedArticle = getMockedArticle();

        it('then render link with avatar author', () => {
            setup({ article: mockedArticle });
            cy.get('.article-meta')
                .findAllByRole('link')
                .first()
                .should('have.attr', 'href', `/profile/${mockedArticle.author.username}`);
            cy.get('.article-meta')
                .findByAltText(/Avatar of article author/)
                .should('exist')
                .and('have.attr', 'src', mockedArticle.author.image);
        });

        it('then render article info', () => {
            setup({ article: mockedArticle });
            cy.get('.info')
                .findByRole('link')
                .should('have.attr', 'href', `/profile/${mockedArticle.author.username}`)
                .and('contain.text', mockedArticle.author.username);
            cy.get<DatePipe>('@datePipe').then((datePipe) => {
                cy.get('.info')
                    .find('span.date')
                    .should('contain.text', datePipe.transform(mockedArticle.updatedAt, 'mediumDate'));
            });
        });

        it('then render toggle favorite button', () => {
            setup({ article: mockedArticle });
            cy.get('.article-meta')
                .findByRole('button')
                .should('have.class', 'btn-outline-primary')
                .and('contain.text', mockedArticle.favoritesCount);
        });

        it('then render preview link', () => {
            setup({ article: mockedArticle });
            cy.get('.preview-link')
                .should('have.attr', 'href', `/article/${mockedArticle.slug}`)
                .findByRole('heading', { level: 1 })
                .should('have.text', mockedArticle.title)
                .parent()
                .should('contain.text', mockedArticle.description)
                .find('span')
                .should('have.text', 'Read more...')
                .parent()
                .find('ul.tag-list')
                .should('exist')
                .children('li')
                .should('have.length', mockedArticle.tagList.length)
                .each(($el, index) => {
                    cy.wrap($el).should('contain.text', mockedArticle.tagList[index]);
                });
        });

        describe('when toggle favorite', () => {
            it('then toggleFavorite emit article', () => {
                setup({ article: mockedArticle });
                cy.get('.article-meta').findByRole('button').click();
                cy.get('@toggleFavoriteSpy').should('have.been.calledWith', mockedArticle);
            });
        });

        describe('given favorited article', () => {
            const mockedFavoritedArticle = getMockedArticle({ article: { favorited: true } });
            it('then render primary button for toggle favorite button', () => {
                setup({ article: mockedFavoritedArticle });
                cy.get('.article-meta')
                    .findByRole('button')
                    .should('have.class', 'btn-primary')
                    .and('contain.text', mockedArticle.favoritesCount);
            });
        });
    });
});
