describe('Signup test', function() {
  afterEach(function () {
    cy.logOut();
  });

  it('Signup test', function() {
    cy.log('Signup test');
    cy.visit("http://localhost:3000");
    cy.randomAlphaNumeric(10).then((response) => {
      Cypress.env('testUser', "cypress_test_user_" + response + "@example.com");  // save user to env
      cy.get('input[id="email"]').type(Cypress.env('testUser'));
      cy.get('input[id="password"]').type('puli1234');
      cy.get('input[id="passwordAgain"]').type('puli1234');
      cy.contains('Sign up now').click();
      cy.location('pathname', {timeout: 5000}).should('include', '/edit-profile');
    });
  })
});
