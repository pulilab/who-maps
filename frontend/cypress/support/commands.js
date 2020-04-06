// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


Cypress.Commands.add('initData', () => {
  cy.request('http://localhost/api/cypress-test-data/')  .then((response) => {
    expect(response.status).to.eq(200);
    Cypress.env('testData', response.body);
  })
});


Cypress.Commands.add('logIn', () => {
  const timeOut = 5000;

  cy.initData().then(() => {
    cy.visit(Cypress.env('testData').url);
    cy.contains('Login').click();
    cy.location('pathname', {timeout: timeOut}).should('include', '/login');
    cy.get('input[id="userName"]').type(Cypress.env('testData').test_user);
    cy.get('input[type="password"]').type('puli1234');
    cy.get('button[id="logIn"]').click();
    cy.location('pathname', {timeout: timeOut}).should('include', '/dashboard');
  })
});

Cypress.Commands.add('logOut', () => {
  cy.get("svg[data-icon=\"user-circle\"]").click({force: true});
  cy.contains("Logout").click();
});

Cypress.Commands.add('randomString', (length) => {
  return Array.from({length: length}, () => {
    return unescape(String.fromCharCode(Math.floor(Math.random() * (16384))))
  }).join('');
});

Cypress.Commands.add('checkSelectedSoftwareDHICount', () => {
  // check if both software has one selected DHI
  cy.get("ul[class=\"SelectedDigitalHealthInterventions\"]").as('ulElementsOfSelectedDHIs');
  cy.get("@ulElementsOfSelectedDHIs").first().find('li').should('have.length', 1);
  cy.get("@ulElementsOfSelectedDHIs").last().find('li').should('have.length', 1);
});

Cypress.Commands.add('selectDHI', (mainCategory, subCategory) => {
  cy.contains(mainCategory).click();
  cy.contains(subCategory).click();
  cy.contains("Confirm").click();
});

Cypress.Commands.add('checkSelectedDHIs', (firstDHI, secondDHI) => {
  cy.get("@ulElementsOfSelectedDHIs").first().find('li').first().find('span')
    .should("contain", firstDHI);
  cy.get("@ulElementsOfSelectedDHIs").last().find('li').first().find('span')
    .should("contain", secondDHI);
});
