describe('Login Page', () => {

  beforeEach(() => {

    cy.visit('/login'); 

  });

  it('should display the login page with logo and welcome text', () => {

    cy.get('.login-page-container').should('exist');

    cy.contains('Welcome to TradeX app!').should('be.visible');

    cy.get('img[alt="Logo"]').should('be.visible');

  });

  it('should show validation errors when fields are empty', () => {

  // Focus and blur each input to trigger touched state

  cy.get('#email').focus().blur();

  cy.get('#password').focus().blur();

  // Wait a short moment for Angular to update DOM

  cy.wait(100);

  // Check validation messages

  cy.contains('Email is required.').should('be.visible');


  // Button should remain disabled

  cy.get('button[type="submit"]').should('be.disabled');

});


it('should show error for invalid email and password', () => {

  // Type invalid data

  cy.get('#email').clear().type('invalid-email');

  cy.get('#password').clear().type('jscnk');

  // Trigger touched state

  cy.get('#email').focus().blur();

  cy.get('#password').focus().blur();

  // Validation messages appear

  cy.contains('Please enter a valid email address.').should('be.visible');


  // Button remains disabled

  cy.get('button[type="submit"]').should('be.disabled');

});


  it('should enable login button with valid email and password', () => {

    cy.get('#email').clear().type('existing@example.com');

    cy.get('#password').clear().type('Ss@byan123!');

    cy.get('button[type="submit"]').should('not.be.disabled');

  });

  it('should navigate to Register page when clicking register link', () => {

    cy.get('.register-link').click();

    cy.url().should('include', '/email-verification');

  });

  it('should login successfully with valid credentials', () => {
    // Stub POST request with expected response structure
    cy.intercept('POST', '**/client/login', {
      statusCode: 200,
      body: {
        clientId: 'mock-client-id-123',
        token: 'mock-token-abc'
      }
    }).as('loginRequest');

    cy.get('#email').clear().type('aishwaryarai@gmail.com');

    cy.get('#password').clear().type('wertr@12A!');

    cy.get('button[type="submit"]').should('not.be.disabled').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    cy.url().should('include', '/portfolio');

    cy.window().its('sessionStorage.clientId').should('eq', 'mock-client-id-123');

  });

  it('should show error for invalid credentials', () => {
    cy.intercept('POST', '**/client/login', {
      statusCode: 403,
      body: { error: 'Invalid credentials' }
    }).as('loginRequest');

    cy.get('#email').clear().type('wronguser@gmail.com');

    cy.get('#password').clear().type('wrongpass');

    cy.get('button[type="submit"]').should('not.be.disabled').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 403);

    // Optionally, check for SweetAlert / Angular error popup

    cy.get('.swal2-popup').should('be.visible');

    cy.get('.swal2-title').should('contain', 'Login Failed');

  });


});