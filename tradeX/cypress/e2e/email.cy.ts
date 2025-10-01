describe('Email Verification Page', () => {

  beforeEach(() => {

    cy.visit('/email-verification'); // Visit the page before each test

  });
 
  it('should display the form with header, title, input, button, and footer', () => {

    cy.get('app-header').should('exist');

    cy.contains('h2', 'Email Verification').should('be.visible');

    cy.get('label[for="email"]').should('contain.text', 'Enter your Email');

    cy.get('#email').should('exist').and('have.attr', 'type', 'email');

    cy.contains('button', 'Verify').should('exist').and('be.disabled');

    cy.get('app-footer').should('exist');

  });
 
  it('should enable Verify button only when email is entered', () => {

    cy.get('#email').clear();

    cy.contains('button', 'Verify').should('be.disabled');
 
    cy.get('#email').type('user@example.com');

    cy.contains('button', 'Verify').should('not.be.disabled');

  });
 
  it('should show SweetAlert error for invalid email', () => {

    cy.get('#email').type('invalid-email');

    cy.contains('button', 'Verify').click({ force: true });
 
    cy.get('.swal2-popup').should('be.visible');

    cy.get('.swal2-title').should('contain', 'Invalid Email');

    cy.contains('Please enter a valid email address.').should('be.visible');
 
    cy.get('.swal2-confirm').click(); // Close the alert

  });
 
  it('should show SweetAlert info if email already exists', () => {

    cy.get('#email').type('existing@example.com');

    cy.contains('button', 'Verify').click({ force: true });
 
    // Directly check the popup (no cy.wait needed)

    cy.get('.swal2-popup').should('be.visible');

    cy.get('.swal2-title').should('contain', 'Account Exists');

    cy.contains('already registered').should('be.visible');
 
    cy.get('.swal2-confirm').click(); // Close the alert

  });
 
 
  beforeEach(() => {

    // Intercept the email check API

    cy.intercept('GET', '**/client/check-email*', (req) => {

      const url = new URL(req.url);

      const email = url.searchParams.get('email');
 
      if (email === 'existing@example.com') {

        req.reply({ body: true }); // email exists

      } else {

        req.reply({ body: false }); // new email

      }

    }).as('checkEmail');
 
    cy.visit('/email-verification');

  });
 
  it('should show SweetAlert success for valid new email and navigate', () => {

    cy.get('#email').type('newuser@example.com');

    cy.contains('button', 'Verify').click({ force: true });
 
    // Wait for the intercepted request to finish

    cy.wait('@checkEmail');
 
    // Now the success popup should be visible

    cy.get('.swal2-popup').should('be.visible');

    cy.get('.swal2-title').should('contain', 'Verification Successful');

    cy.contains('is valid and available').should('be.visible');
 
    // Click Register

    cy.get('.swal2-confirm').click();
 
    // Verify navigation

    cy.location('pathname').should('eq', '/registration');

    cy.window().its('history.state.email').should('eq', 'newuser@example.com');

  });
 
 
});

 