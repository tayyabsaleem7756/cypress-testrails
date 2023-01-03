describe('Test Suite #1', () => {
  it('C1, C2: Verify that google page has input field', () => {
    cy.visit('https://www.google.com/');
    cy.get('input').should('be.visible');
  });

  it('C3: Verify that google page doesn\'t have input field ', () => {
    cy.visit('https://www.google.com/');
    cy.get('input').should('not.be.visible');
  });
});
