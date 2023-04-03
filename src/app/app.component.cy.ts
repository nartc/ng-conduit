import { App } from './app.component';
import { AUTH_INIT } from './shared/data-access/auth/auth.di';

describe(App.name, () => {
    const initAuthStub = cy.stub();

    function setup() {
        return cy.mount(App, {
            providers: [{ provide: AUTH_INIT, useValue: initAuthStub }],
        });
    }

    it('then mount', () => {
        setup();
    });

    it('then call authStore.init on mount', () => {
        setup().then((wrapper) => {
            wrapper.fixture.detectChanges();
            expect(initAuthStub).to.be.called;
        });
    });

    it('then render router-outlet', () => {
        setup();
        cy.get('router-outlet').should('exist');
    });
});
