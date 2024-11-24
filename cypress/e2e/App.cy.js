/* globals cy */

describe('Test App', () => {

  it('launches', () => {
    cy.visit('/');
  });

  it('has StudyBuddy title', () => {
    cy.visit('/');
    cy.get('[data-cy=title]').should('contain', 'StudyBuddy');
  });
});