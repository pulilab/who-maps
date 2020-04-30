describe('End to end tests', function() {

    // Cypress automatically clears localstorage between tests, we need to prevent this
  Cypress.LocalStorage.clear = function(){};

  before(function () {
    cy.signUp();
  });

  beforeEach(function () {
    // we need to preserve these cookies to stay logged in between tests
    Cypress.Cookies.preserveOnce('jwt_token', 'profile_id');
  });

  after(function () {
    cy.logOut();
  });

  it('Fill user profile test', function() {
    cy.log('Fill user profile test');
    // after signup the page redirected to edit profile
    cy.location('pathname', {timeout: 5000}).should('include', '/edit-profile');
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
    cy.location('pathname', {timeout: 5000}).should('include', '/dashboard');
  });

  it('Test project publish required fields', function() {
    cy.log('Test project publish required fields');
    cy.contains('New Project').click();
    cy.location('pathname', {timeout: 5000}).should('include', '/projects/create');

    const typeOptions = {delay: 0};
    cy.get("input[data-vv-name=\"name\"]").type("Test Project Publish Required Fields", typeOptions);

    //  save draft
    cy.get("button").contains('Save draft').click({force: true})
    cy.location('pathname', {timeout: 5000}).should('include', '/edit');
    cy.contains("Close").click();

    // try to publish - it will fail because of the missing fields
    cy.get("button[data-vv-name=\"Publish\"]").click({force: true});

    // check required fields error messages
    cy.get("div[data-vv-name=\"organisation\"]").siblings().first()
      .should('contain', 'The organisation field is required');
    cy.get("div[data-vv-name=\"implementation_overview\"]").siblings().last()
      .should('contain', 'The Implementation Overview field is required');
    cy.get("div[data-vv-name=\"contact_name\"]").siblings().first()
      .should('contain', 'The Contact name field is required');
    cy.get("div[data-vv-name=\"contact_email\"]").siblings().first()
      .should('contain', 'The Contact email field must be a valid email');
    cy.get("div[data-vv-name=\"health_focus_areas\"]").siblings().first()
      .should('contain', 'The Health focus areas field is required');
    cy.get("div[data-vv-name=\"hsc_challenges\"]").siblings().first()
      .should('contain', 'The Health system challenges field is required');
    cy.get("div[data-vv-as=\"Software\"]").parent().siblings().last()
      .should('contain', 'The Software field is required');
    cy.get("div[data-vv-name=\"donors\"]").siblings().first()
      .should('contain', 'The Investors field is required');

  });

});
