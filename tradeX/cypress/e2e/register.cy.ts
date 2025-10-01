describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('/registration');
  });

  it('should display the registration form correctly', () => {
    cy.contains('Register').should('be.visible');
    cy.get('#email').should('exist');
    cy.get('#newPassword').should('exist');
    cy.get('#confirmPassword').should('exist');
    cy.get('#dateOfBirth').should('exist');
    cy.get('#country').should('exist');
    cy.get('#postalCode').should('exist');

    cy.get('button[type="submit"]').should('exist').and('be.disabled');
  });

  it('should show validation errors when fields are touched but empty', () => {
    const fields = [
      '#email',
      '#newPassword',
      '#confirmPassword',
      '#dateOfBirth',
      '#country',
      '#postalCode',
    ];
    fields.forEach(f => cy.get(f).focus().blur());

    cy.contains('Email is required.').should('be.visible');
    cy.contains('Password is required.').should('be.visible');
    cy.contains('Confirm Password is required.').should('be.visible');
    cy.contains('Date of Birth is required.').should('be.visible');
    cy.contains('Country is required.').should('be.visible');
    cy.contains('Postal Code is required.').should('be.visible');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should show invalid email format error', () => {
    cy.get('#email').type('invalid-email').blur();
    cy.contains('Invalid email format.').should('be.visible');
  });

  it('should show password mismatch error', () => {
    cy.get('#newPassword').type('ValidPass1!');
    cy.get('#confirmPassword').type('Mismatch1!').blur();
    cy.contains('Passwords do not match.').should('be.visible');
  });

  it('should enable the Register button only when form is valid', () => {
    cy.get('#email').type('newuser@example.com');
    cy.get('#newPassword').type('ValidPass1!');
    cy.get('#confirmPassword').type('ValidPass1!');
    cy.get('#dateOfBirth').type('1990-01-01');
    cy.get('#country').type('IN');
    cy.get('#postalCode').type('ABCDE1234');
    cy.get('#idType').select('PAN');
    cy.get('#idValue').type('ABCDE1234F');

    cy.get('button[type="submit"]').should('not.be.disabled');
  });

it('should successfully register a new user (mocked backend)', () => {
  // Intercept POST request to backend and mock response
  cy.intercept('POST', '**/client/register', {
    statusCode: 200,
    body: {
      clientId: 'mock-client-id-123',
      token: 'mock-token-abc',
      email: 'newuser@example.com',
      cashBalance: 100000,
      portfolio: []
    }
  }).as('registerRequest');

  // Fill the registration form
  cy.get('#email').type('newuser@example.com');
  cy.get('#newPassword').type('ValidPass1!');
  cy.get('#confirmPassword').type('ValidPass1!');
  cy.get('#dateOfBirth').type('1990-01-01');
  cy.get('#country').type('IN');
  cy.get('#postalCode').type('ABCDE1234');
  cy.get('#idType').select('PAN');
  cy.get('#idValue').type('ABCDE1234F');

  // Submit the form
  cy.get('button[type="submit"]').click();

  // Wait for the request and assert response
  cy.wait('@registerRequest').its('response.statusCode').should('eq', 200);

  // Check SweetAlert success
  cy.get('.swal2-popup').should('be.visible');
  cy.get('.swal2-title').should('contain', 'Registration Successful');
  cy.get('.swal2-popup', { timeout: 5000 }).should('contain.text', 'mock-client-id-123');


  // Confirm SweetAlert
  cy.get('.swal2-confirm').click();

  // Verify session storage and redirect
  cy.window().its('sessionStorage.clientId').should('eq', 'mock-client-id-123');
  cy.url().should('include', '/preferences');
});


});