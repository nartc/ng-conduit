import { FormLayout } from './form-layout.component';

describe(FormLayout.name, () => {
    it('mount', () => {
        cy.mount(FormLayout);
    });

    it('render top level container page', () => {
        cy.mount(FormLayout);
        cy.get('.container.page').should('exist');
    });

    it('render the projected content', () => {
        cy.mount(`<app-form-layout><div>dummy</div></app-form-layout>`, {
            imports: [FormLayout],
        });
        cy.findByText(/dummy/).should('exist');
    });
});
