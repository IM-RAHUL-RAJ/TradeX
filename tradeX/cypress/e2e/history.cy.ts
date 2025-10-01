describe('History Page Tests', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.intercept('POST', '**/client/login', {
      statusCode: 200,
      body: { clientId: 'TEST123', success: true }
    }).as('loginRequest');
    cy.get('#email').clear().type('demo4@gmail.com');
    cy.get('#password').clear().type('Leap@2025');
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/portfolio'); // Wait for redirect to portfolio
    cy.intercept('GET', '**/trades/TEST123', {
      statusCode: 200,
      body: {
        trades: [
          { tradeId: 'T001', date: '2025-09-25T10:15:00Z', direction: 'BUY', instrumentId: 'AAPL', quantity: 100, executionPrice: 150.50 },
          { tradeId: 'T002', date: '2025-09-24T14:30:00Z', direction: 'SELL', instrumentId: 'GOOGL', quantity: 50, executionPrice: 2800.00 }
        ]
      }
    }).as('getTradeHistory');
    cy.visit('/trade-history');
    cy.url().should('include', '/trade-history'); // Confirm navigation to trade-history
  });

  it('should load history page successfully', () => {
    cy.get('body').should('exist').and('be.visible');
    cy.url().should('include', '/trade-history');
  });

  it('should display correct grid column headers', () => {
    const expectedHeaders = [
      'Trade ID', 'Direction', 'Instrument', 'Quantity', 'Execution Price', 'Cash Value'
    ];
    expectedHeaders.forEach(header => {
      cy.get('.ag-header-cell').contains(header);
    });
  });

  it('should display formatted trade directions', () => {
    cy.get('.ag-cell').contains('Buy');
    cy.get('.ag-cell').contains('Sell');
  });

  it('should display currency values with $ and two decimals', () => {
    cy.get('.ag-cell').contains('$15050.00');
    cy.get('.ag-cell').contains('$140000.00');
  });

  it('should display trade data rows', () => {
    cy.get('.ag-row').should('have.length.at.least', 1);
    cy.get('.ag-cell').contains('AAPL');
    cy.get('.ag-cell').contains('GOOGL');
  });

  it('should be responsive on different screen sizes', () => {
    cy.viewport(375, 667);
    cy.get('body').should('be.visible');
    cy.viewport(768, 1024);
    cy.get('body').should('be.visible');
    cy.viewport(1280, 720);
    cy.get('body').should('be.visible');
  });

  it('should have navigation elements', () => {
    cy.get('app-navbar').should('exist');
    cy.get('app-sidebar').should('exist');
  });


});