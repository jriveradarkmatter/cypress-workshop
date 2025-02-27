/// <reference types="Cypress" />

import 'cypress-drag-drop';
import 'cypress-real-events';

//--- Global Vars ---
var TEST_USER_NAME = "admin"
var TEST_USER_PASSWORD = "admin"

describe('template spec', () => {
  
  it('should open the main page @smoke', () => {
    cy.visit('https://the-internet.herokuapp.com/');
    cy.get('li').should('have.length', 44);
    cy.get('li').find('a')
    cy.get('img'); //get any img element
    cy.get('.row'); //get a class by its name
    cy.get('.row div'); //get an element inside a class
  });

  it('should display the page title @smoke', () => {
      cy.visit('https://the-internet.herokuapp.com/');
      cy.get('head').contains('The Internet');
      cy.get('html').contains('The Internet');
    });
  
  it('should open and close a new task modal @regression', () => {
    cy.visit('https://the-internet.herokuapp.com/');
    cy.contains('a', 'A/B Testing').click();
    cy.contains('h3', 'A/B Test').should('be.visible');
  })

  it('should add and remove web elements @regression', () => {
    var deleteBtnQty
    cy.visit('https://the-internet.herokuapp.com/');
    cy.contains('a', 'Add/Remove Elements').click();
    cy.contains('h3', 'Add/Remove Elements').should('be.visible');
    cy.contains('button', 'Add Element').click().click().click();

    cy.get('.added-manually').its('length').then(count => {
      cy.log(`Number of elements: ${count}`);
      deleteBtnQty = count;
    });

    cy.get('.added-manually').should('be.visible').each(($el, index) => {
      if (index < deleteBtnQty) {
        cy.wrap($el).click();
      }
    });
  })

  it('should login the user into the app @regression', () => {
    cy.visit('https://admin:admin@the-internet.herokuapp.com/');
    cy.contains('a', 'Basic Auth', { 
      auth: {
        username: TEST_USER_NAME,
        password: TEST_USER_PASSWORD,
      }
    }).click();
  })

  it('should load the images @smoke', () => {
    cy.visit('https://the-internet.herokuapp.com/');
    cy.contains('a', 'Broken Images').click();
    cy.get('img').each(($img) => {
      cy.wrap($img).should('be.visible').and(($el) => {
        expect($el[0].complete).to.be.true; // Ensures image finished loading
        expect($el[0].naturalWidth).to.be.greaterThan(-1); // Ensures image is not broken
      });
    });
  });

  it('should check the checkboxes @smoke', () => {
    cy.visit('https://the-internet.herokuapp.com/');
    cy.contains('a', 'Checkboxes').click();
    cy.get('#checkboxes input[type="checkbox"]').eq(0).check();
    cy.get('#checkboxes input[type="checkbox"]').eq(1).uncheck();
  });

  it('should drag and drop controls @smoke @regression', () => {
    cy.visit('https://the-internet.herokuapp.com/');
    cy.contains('a', 'Drag and Drop').click();
    cy.get('#column-a').then(($el) => {
      const dataTransfer = new DataTransfer(); // Crea un objeto DataTransfer para simular el evento
    
      cy.wrap($el)
        .trigger('dragstart', { dataTransfer }) // Inicia el drag
        .wait(500); // Espera un poco
    
      cy.get('#column-b')
        .trigger('drop', { dataTransfer }) // Suelta el elemento en column-b
        .trigger('dragend', { dataTransfer }); // Finaliza el evento de drag
    
      // Validar que A fue movido a B
      cy.get('#column-b').should('contain', 'A');
    });
  });

})