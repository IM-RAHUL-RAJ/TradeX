describe('Preferences Page', () => {
  beforeEach(() => {
    // Simulate authentication by setting sessionStorage
    cy.visit('/');
    cy.window().then((win) => {
      win.sessionStorage.setItem('loggedIn', 'true');
      win.sessionStorage.setItem('clientId', 'existing@example.com');
    });
    cy.visit('/preferences');
  });

//   it('should show validation errors for empty fields', () => {
//     cy.get('button[type="submit"]').click({ force: true });
//     cy.contains('Please fill in all required fields').should('exist');
//   });

  it('should save preferences', () => {
    cy.get('select[formcontrolname="purpose"]').select('Retirement');
    cy.get('select[formcontrolname="risk"]').select('Average');
    cy.get('select[formcontrolname="income"]').select('80001-100000');
    cy.get('select[formcontrolname="length"]').select('7-10 years');
    cy.get('input[type="checkbox"][formcontrolname="roboAdvisor"]').check();
    cy.get('button[type="submit"]').click();
    // cy.contains('Preferences saved successfully').should('exist');
  });
});