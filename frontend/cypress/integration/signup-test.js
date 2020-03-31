describe('Signup test', function() {
  beforeEach(function () {
    cy.initData();
  })

  it('Signup test', function() {
    cy.log('Signup test');
    cy.visit(Cypress.env('testData').url);
    cy.contains('Signup').click();
    cy.location('pathname', {timeout: 5000}).should('include', '/signup');
    cy.wait(1000);  // this is necessary here because of some rendering
    cy.get('input[id="email"]').type(Cypress.env('testData').signup_username);
    cy.get('input[id="password"]').type('puli1234');
    cy.get('input[id="passwordAgain"]').type('puli1234');
    cy.contains('Sign up now').click();
    cy.location('pathname', {timeout: 5000}).should('include', '/edit-profile');
  })
});
