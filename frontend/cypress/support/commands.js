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


Cypress.Commands.add('signUp', () => {
  cy.visit("http://localhost:3000");
  cy.randomAlphaNumeric(10).then((response) => {
    Cypress.env('testUser', "cypress_test_user_" + response + "@example.com");  // save user to env
    cy.get('input[id="email"]').type(Cypress.env('testUser'));
    cy.get('input[id="password"]').type('puli1234');
    cy.get('input[id="passwordAgain"]').type('puli1234');
    cy.contains('Sign up now').click();
    cy.location('pathname', {timeout: 5000}).should('include', '/edit-profile');
  });
});

Cypress.Commands.add('logOut', () => {
  cy.get("svg[data-icon=\"user-circle\"]").first().click({force: true});
  cy.contains("Logout").click({force: true});
});

Cypress.Commands.add('randomAlphaNumeric', (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  return Array.from({length: length}, () => {
    return characters.charAt(Math.floor(Math.random() * charactersLength));
  }).join('');
});

Cypress.Commands.add('selectDHI', (mainCategory, subCategory) => {
  cy.contains(mainCategory).click();
  cy.contains(subCategory).click();
  cy.contains("Confirm").click();
});

Cypress.Commands.add('checkSelectedSoftwareDHICount', () => {
  // check if both software has one selected DHI
  cy.get("ul[class=\"SelectedDigitalHealthInterventions\"]").as('ulElementsOfSelectedDHIs');
  cy.get("@ulElementsOfSelectedDHIs").first().find('li').should('have.length', 1);
  cy.get("@ulElementsOfSelectedDHIs").last().find('li').should('have.length', 1);
});

Cypress.Commands.add('checkSelectedDHIs', (firstDHI, secondDHI) => {
  cy.get("ul[class=\"SelectedDigitalHealthInterventions\"]").as('ulElementsOfSelectedDHIs');
  cy.get("@ulElementsOfSelectedDHIs").first().find('li').first().find('span')
    .should("contain", firstDHI);
  cy.get("@ulElementsOfSelectedDHIs").last().find('li').first().find('span')
    .should("contain", secondDHI);
});
