Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
})

const SEED = Cypress.env('seed')

context('coin flip example', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('test flow', () => {

    cy.get('button#sign-in-button').should('be.visible');
    cy.contains('button', 'Sign in with NEAR Wallet').click();
    cy.contains('div', 'MyNearWallet').click();
    cy.contains('button', 'Import Existing Account').click();
    cy.contains('button', 'Recover Account').click();
    cy.get('input').type(SEED);
    cy.contains('button', 'Find My Account').click();
    cy.contains('button', 'Next').click();
    cy.contains('button', 'Connect').click();
    cy.contains('button', 'Sign out').should('be.visible');
    cy.wait(5000);
    cy.get('.points').then($points => {
      let currentPoints = Number($points.text());
      for (let i = 0; i < 5; i ++) {
        cy.get('.points').then($points => {
          cy.wait(5000);
          const p = Number($points.text());
          if (p !== currentPoints) {
            throw new Error(`(1) expected points: ${currentPoints} actual: ${p}`);
          }
          cy.contains('button', 'Tails').click();
          cy.get('.status').should('contain.text', 'Status: Asking the contract to flip a coin');
          cy.get('.status').should('not.contain.text', 'Status: Asking the contract to flip a coin');
          cy.wait(5000);
          cy.get('.points').then($points => {
            const p = Number($points.text());
            if (p !== currentPoints + 1 && p !== currentPoints - 1) {
              throw new Error(`(2) expected points: ${currentPoints}+-1 actual: ${p}`);
            }
            currentPoints = p;
            cy.contains('button', 'Heads').click();
            cy.get('.status').should('contain.text', 'Status: Asking the contract to flip a coin');
            cy.get('.status').should('not.contain.text', 'Status: Asking the contract to flip a coin');
            cy.wait(5000);
            cy.get('.points').then($points => {
              const p = Number($points.text());
              if (p !== currentPoints + 1 && p !== currentPoints - 1) {
                throw new Error(`(3) expected points: ${currentPoints}+-1 actual: ${p}`);
              }
              currentPoints = p;
            })
          })
        })
      }
    })
  })
})
