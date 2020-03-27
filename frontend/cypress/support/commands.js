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


Cypress.Commands.add('logIn', () => {
  const timeOut = 5000;

  cy.request('http://localhost/api/cypress-test-data/')  .then((response) => {
    Cypress.env('testData', response.body);
    expect(response.status).to.eq(200);
    cy.visit(response.body.url);
    cy.contains('Login').click();
    cy.location('pathname', {timeout: timeOut}).should('include', '/login');
    cy.get('input[id="userName"]').type(response.body.test_user);
    cy.get('input[type="password"]').type('puli1234');
    cy.get('button[id="logIn"]').click();
    cy.location('pathname', {timeout: timeOut}).should('include', '/dashboard');
  })
});
