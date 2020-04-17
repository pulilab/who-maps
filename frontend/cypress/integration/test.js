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

  it('Test Project DHI scenario', function() {
    cy.log('Test Project DHI scenario');

    cy.log(Cypress.env('testUser'));

    cy.contains('New Project').click();
    cy.location('pathname', {timeout: 5000}).should('include', '/projects/create');

    const typeOptions = {delay: 0};
    const DHICategory11 = "1.1 Targeted client communication";
    const DHICategory12 = "1.2 Untargeted client communication";
    const DHIElement111 = "1.1.1";
    const DHIElement112 = "1.1.2";
    const DHIElement121 = "1.2.1";
    const DHIElement122 = "1.2.2";

    cy.get("input[data-vv-name=\"name\"]").type("Test Project DHI", typeOptions);

    // select a software
    cy.get("div[data-vv-name=\"id\"]").type("{downarrow}{enter}{esc}");

    // add digital health intervention for the software
    cy.contains("Add Digital Health Interventions").click();
    //open first category and select first element
    cy.selectDHI(DHICategory11, DHIElement111);

    //add another software
    cy.get("button[class=\"el-button AddButton IconLeft el-button--text\"]").first().click();

    //  select the first one
    cy.get("div[data-vv-name=\"id\"]").last().type("{downarrow}{enter}{esc}");

    // add digital health intervention for the software
    cy.get("div[class=\"DigitalHealthInterventionsSelector\"]").last().click();
    // open second category and select first element
    cy.selectDHI(DHICategory12, DHIElement121);

    cy.checkSelectedSoftwareDHICount();
    cy.checkSelectedDHIs(DHIElement111, DHIElement121);

    //  save draft
    cy.get("button").contains('Save draft').click({force: true})
    cy.location('pathname', {timeout: 5000}).should('include', '/edit');
    cy.contains("Close").click();

    // go to the dashboard
    cy.contains("Dashboard").click();
    cy.location('pathname', {timeout: 5000}).should('include', '/dashboard');

    // go to my projects
    cy.contains("My Projects").click();
    cy.location('pathname', {timeout: 5000}).should('include', '/projects');

    // visit edit project
    cy.contains("Edit Draft").click();

    cy.checkSelectedSoftwareDHICount();
    cy.checkSelectedDHIs(DHIElement111, DHIElement121);

    cy.log("Select new DHIs for both software");

    // select another DHI element for software 1
    cy.get("div[class=\"DigitalHealthInterventionsSelector\"]").as("DHISelector");
    cy.get("@DHISelector").first().contains("Edit selection").click();
    cy.contains(DHIElement111).click();
    cy.contains(DHIElement112).click();
    cy.contains("Confirm").click();

    // select another DHI element for software 2
    cy.get("@DHISelector").last().contains("Edit selection").click();
    cy.contains(DHIElement121).click();
    cy.contains(DHIElement122).click();
    cy.contains("Confirm").click();

    cy.checkSelectedSoftwareDHICount();
    cy.checkSelectedDHIs(DHIElement112, DHIElement122);

    //  save draft
    cy.get("button").contains('Save draft').click({force: true})
    cy.location('pathname', {timeout: 5000}).should('include', '/edit');
    // there is a page refresh after this draft save, so here we don't need to click on the Close button in the popup
    // because the popup disappears

    // some wait is necessary here until the page fully reloads
    cy.wait(5000);

    cy.checkSelectedSoftwareDHICount();
    cy.checkSelectedDHIs(DHIElement112, DHIElement122);

  })
});
