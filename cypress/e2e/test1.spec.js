describe('Test Suite #1', () => {
  it('C2320: Verify that google page has input field', () => {
    cy.visit('https://www.google.com/');
    cy.get('input').should('be.visible');
  });

  it('C2321: Verify that google page has input field', () => {
    //cy.visit('https://www.google.com/');
    //cy.get('input').should('be.visible');
    //cy.get('input').should('be.visible');
  });

  
});
