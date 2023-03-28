import { App } from './app.component';
import { AuthStore } from './shared/data-access/auth.store';

describe(App.name, () => {
    let mockedAuthStore: Partial<AuthStore>;

    function setup() {
        mockedAuthStore = { init: cy.stub() };
        return cy.mount(App, {
            providers: [{ provide: AuthStore, useValue: mockedAuthStore }],
        });
    }

    it('then mount', () => {
        setup();
    });

    it('then call authStore.init on mount', () => {
        setup().then((wrapper) => {
            wrapper.fixture.detectChanges();
            expect(mockedAuthStore.init).to.be.called;
        });
    });

    it('then render router-outlet', () => {
        setup();
        cy.get('router-outlet').should('exist');
    });
});
