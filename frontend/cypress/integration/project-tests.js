describe('Create new project', function() {
  beforeEach(function () {
    cy.logIn();
  })

  it('Create Project with max field lengths', function() {
    cy.log('Create Project with max field lengths');

    cy.contains('New Project').click();
    cy.location('pathname', {timeout: 5000}).should('include', '/projects/create');

    let date = new Date();
    date.setDate(date.getDate() + 30);
    let implementationDateString = date.toISOString().slice(0, 10);

    const typeOptions = {delay: 0};

    const fields = [
      // General overview
      {htmlType: 'input', data: "name", maxLength: 10},  //128
      {htmlType: 'textarea', data: "geographic_scope", maxLength: 5},  //1024
      {htmlType: 'textarea', data: "implementation_overview", maxLength: 10},  //1024
      {htmlType: 'input', data: "contact_name", maxLength: 10},  //256
      {htmlType: 'input', data: "contact_email", maxLength: 10, specificValue: 'test@example.com'},  //256
      //Implementation overview
      {htmlType: 'input', data: "implementing_partners_0", maxLength: 10},  //256
      // Technology overview
      {specificSelector: "input[id=\"implementationDate\"]", specificValue: implementationDateString},
      {htmlType: 'input', data: "repository",  specificValue: "http://sme_doc.example.com"},
      {htmlType: 'input', data: "mobile_application",  specificValue: "http://demo_app.example.com"},
      {htmlType: 'input', data: "wiki",  specificValue: "http://software_wiki.example.com"},
    ];

    fields.forEach(function (field) {
      let sel = ""
      if ('specificSelector' in field){
        sel = field.specificSelector;
      } else {
        sel = field.htmlType + "[data-vv-name='" + field.data + "']";
      }
      if ('specificValue' in field){
        cy.get(sel).type(field.specificValue, typeOptions);
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


    // new team mebers
    cy.get("div[data-vv-name=\"viewers\"]").type(Cypress.env('testData').test_user).type("{downarrow}{enter}{esc}");

    // Implementation overview selects - select the first options
    const selectors = ["health_focus_areas", "hsc_challenges", "id", "his_bucket", "donors"];
    selectors.forEach(
      (item) => {
        let selector = "div[data-vv-name=\"" + item + "\"]";
        cy.get(selector).type("{downarrow}{enter}{esc}");
      }
    )

    //government contribution - check the first radio button
    cy.get("div[data-vv-name=\"government_investor\"]").children().first().click();

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

    // cy.contains('Save draft').click();

  })
});
