describe('End to end tests', function() {
  before(function () {
    cy.signUp();
  });

  after(function () {
    cy.logOut();
  });

  it('Fill user profile test', function() {
    cy.log('Fill user profile test');
    // after signup the page redirected to edit profile
    cy.location('pathname', {timeout: 10000}).should('include', '/edit-profile');
    cy.get("input[data-vv-name=\"name\"]").type("Cypress User");
    cy.get("div[data-vv-name=\"organisation\"]").as('orgInput');
    cy.get("@orgInput").type("XYZXYZ");
    cy.wait(1000);  // it is necessary here to wait until the possibilities appear
    cy.get("@orgInput").type("{enter}");
    cy.get("div[data-vv-name=\"country\"]").click().type("{downarrow}{enter}");
    cy.get("input[data-vv-name=\"phone\"]").type("1234567");
    cy.get("input[data-vv-name=\"title\"]").type("Cypress");
    cy.get("input[data-vv-name=\"linkedin\"]").type("http://linkedin.com/123456/");
    cy.contains("Save settings").click();
    cy.location('pathname', {timeout: 10000}).should('include', '/dashboard');
  })
});
