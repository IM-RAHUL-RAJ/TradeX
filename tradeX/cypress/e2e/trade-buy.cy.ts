describe('Trade Buy Page', () => {
  beforeEach(() => {
    cy.login('existing@example.com', 'correctpassword');
    cy.visit('/trade');
  });

  it('should display available instruments', () => {
    cy.get('.instrument-list').should('exist');
  });

  it('should allow buying an instrument', () => {
    cy.get('.instrument-list .instrument-row').first().click();
    cy.get('input[formcontrolname="quantity"]').type('10');
    cy.get('button.buy-btn').click();
    cy.contains('Trade successful').should('exist');
  });
});