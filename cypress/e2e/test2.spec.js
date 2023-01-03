describe('Test Suite #2', () => {
  it('C4: Verify that google page has input field', () => {
    cy.visit('https://www.google.com/');
    cy.get('input').should('be.visible');
  });

  it('C5, C6: Verify that google page doesn\'t have input field ', () => {
    cy.visit('https://www.google.com/');
    cy.get('input').should('not.be.visible');
  });
});
