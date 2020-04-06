describe('Project tests', function() {
  beforeEach(function () {
    cy.logIn();
  });

  afterEach(function () {
    cy.logOut();
  });

  it('Create Project with max field lengths', function() {
    cy.log('Create Project with max field lengths');

    cy.contains('New Project').click();
    cy.location('pathname', {timeout: 5000}).should('include', '/projects/create');

    let date = new Date();
    date.setDate(date.getDate() + 30);
    let implementationDateString = date.toISOString().slice(0, 10);

    const typeOptions = {delay: 0};

    const simpleInputFields = [
      // General overview
      {htmlType: 'input', data: "name", maxLength: 128, specificValue: "Test Project", extendSpecValue: true},
      {htmlType: 'textarea', data: "geographic_scope", maxLength: 1024, specificValue: "Geographic scope", extendSpecValue: true},
      {htmlType: 'textarea', data: "implementation_overview", maxLength: 1024, specificValue: "Overview", extendSpecValue: true},
      {htmlType: 'input', data: "contact_name", maxLength: 256, specificValue: "Contact name", extendSpecValue: true},
      {htmlType: 'input', data: "contact_email", maxLength: 256, specificValue: 'test@example.com'},
      //Implementation overview
      {htmlType: 'input', data: "implementing_partners_0", maxLength: 256, specificValue: "Partner", extendSpecValue: true},
      // Technology overview
      {htmlType: 'div', data: "implementation_dates",  specificValue: implementationDateString},
      {htmlType: 'input', data: "repository",  specificValue: "http://sme_doc.example.com"},
      {htmlType: 'input', data: "mobile_application",  specificValue: "http://demo_app.example.com"},
      {htmlType: 'input', data: "wiki",  specificValue: "http://software_wiki.example.com"},
    ];

    simpleInputFields.forEach(function (field) {
      let sel = field.htmlType + "[data-vv-name='" + field.data + "']";
      if ('specificValue' in field){
        if ("extendSpecValue" in field && field.extendSpecValue === true){
          cy.randomString(field.maxLength - field.specificValue.length).then((response) => {
            cy.get(sel).type(field.specificValue + response, typeOptions);
          })
        } else {
          cy.get(sel).type(field.specificValue, typeOptions);
        }
      } else {
        cy.randomString(field.maxLength).then((response) => {
          cy.get(sel).type(response, typeOptions);
        })
      }
    });

    // fill org
    cy.get("div[class=\"el-select OrganisationSelector\"]").as('orgInput');
    cy.get('@orgInput').type(Cypress.env('testData').org);
    cy.wait(500);  // it is necessary here to wait until the possibilities appear
    cy.get('@orgInput').type("{enter}");


    // new team members
    cy.get("div[data-vv-name=\"viewers\"]").type(Cypress.env('testData').test_user + "{downarrow}{enter}{esc}");

    // Implementation overview selects - select the first options
    const selectors = ["health_focus_areas", "hsc_challenges", "id", "his_bucket", "donors"];
    selectors.forEach(
      (item) => {
        let selector = "div[data-vv-name=\"" + item + "\"]";
        cy.get(selector).type("{downarrow}{enter}{esc}");
      }
    )

    // choose Sub-national
    cy.contains('Sub-national').click();

    // select region
    cy.get("div[data-vv-name=\"district\"]").click().type("{downarrow}{enter}{esc}");

    // health workers
    cy.get("input[data-vv-name=\"health_workers\"]").type("2000000000");

    // facilities
    cy.get("input[data-vv-name=\"facilities\"]").type("2000000000");

    // clients
    cy.get("input[data-vv-name=\"clients\"]").type("2000000000");

    //government contribution - check the first radio button
    cy.get("div[data-vv-name=\"government_investor\"]").children().first().click();


    // technology overview: check all checkboxes
    cy.get("div[id=\"technology\"]").as('techContainer');
    cy.get('@techContainer').find("[type=\"checkbox\"]").check({force: true});

    // interoperability section: check all checkboxes and input links
    cy.get("div[id=\"interoperability\"]").as('interopContainer');
    cy.get('@interopContainer').find("[type=\"checkbox\"]").check({force: true});
    cy.get('@interopContainer').find("input[type=\"text\"]").each(
      ($el, index, $list) => {
        cy.wrap($el).type('http://test_link.example.com', typeOptions);
      }
    )

    cy.get("button").contains('Save draft').click({force: true})
    cy.location('pathname', {timeout: 5000}).should('include', '/edit');

    // close popup after saving draft
    cy.get("button").contains('Close').click({force: true})

  });

  it('Test Project DHI scenario', function() {
    cy.log('Test Project DHI scenario');

    cy.contains('New Project').click();
    cy.location('pathname', {timeout: 5000}).should('include', '/projects/create');

    const typeOptions = {delay: 0};

    cy.get("input[data-vv-name=\"name\"]").type("Test Project DHI", typeOptions);

    // select a software
    cy.get("div[data-vv-name=\"id\"]").type("{downarrow}{enter}{esc}");

    // add digital health intervention for the software
    cy.contains("Add Digital Health Interventions").click();
    //open first category and select first element
    cy.selectDHI("1.1 Targeted client communication", "1.1.1 Transmit health event alerts to specific population group(s)");

    //add another software
    cy.get("button[class=\"el-button AddButton IconLeft el-button--text\"]").first().click();

    //  select the first one
    cy.get("div[data-vv-name=\"id\"]").last().type("{downarrow}{enter}{esc}");

    // add digital health intervention for the software
    cy.get("div[class=\"DigitalHealthInterventionsSelector\"]").last().click();
    // open second category and select first element
    cy.selectDHI("1.2 Untargeted client communication", "1.2.1 Transmit untargeted health information to an undefined population");

    cy.checkSelectedSoftwareDHICount();
    cy.checkSelectedDHIs("1.1.1 Transmit health event alerts to specific population group(s)",
      "1.2.1 Transmit untargeted health information to an undefined population");

    //  save draft
    cy.get("button").contains('Save draft').click({force: true})
    cy.location('pathname', {timeout: 5000}).should('include', '/edit');

    let projectEditURL = null;
    cy.url().then(url => {
      projectEditURL = url;

      // refresh the page
      cy.reload();

      // go to the dashboard
      cy.contains("Dashboard").click();
      cy.location('pathname', {timeout: 5000}).should('include', '/dashboard');

      // go to my projects
      cy.contains("My Projects").click();
      cy.location('pathname', {timeout: 5000}).should('include', '/projects');

      // visit edit project
      cy.visit(projectEditURL);

      cy.checkSelectedSoftwareDHICount();
      cy.checkSelectedDHIs("1.1.1 Transmit health event alerts to specific population group(s)",
        "1.2.1 Transmit untargeted health information to an undefined population");

    });

  })

});
