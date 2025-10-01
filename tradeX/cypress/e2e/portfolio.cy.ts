describe('Portfolio Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.window().then((win) => {
      win.sessionStorage.setItem('loggedIn', 'true');
      win.sessionStorage.setItem('clientId', 'existing@example.com');
    });
    cy.visit('/portfolio');
  });

  it('should display portfolio summary', () => {
    // cy.contains('Portfolio Summary').should('exist');
    cy.get('.summary-cards').should('exist');
  });

  it('should display portfolio table', () => {
    cy.get('.portfolio-table-section').should('exist');
    cy.get('table').should('exist');
  });
});