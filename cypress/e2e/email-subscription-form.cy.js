/// <reference types="Cypress" />

describe('Email subscription form', () => {
  
  beforeEach(() => {
    cy.visit('https://magento2demo.firebearstudio.com/')
  });

  

  const uniqueEmail = `testmail-${generateRandomString(10)}@domain.com`             //generate unique email
  
  const userName64Characters = `testmail-${generateRandomString(55)}@domain.com`    //generate unique email where username part have 64 characters (should pass)
  const userName65Characters = `testmail-${generateRandomString(56)}@domain.com`    //generate unique email where username part have 65 characters (should fail)
  const domain63Characters = `testmail@${generateRandomString(63)}.com`             //generate unique email where domain part have 63 characters (should pass)
  const domain64Characters = `testmail@${generateRandomString(64)}.com`             //generate unique email where domain part have 64 characters (should fail)
  

  function generateRandomString(length) {
    let result = ''
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10)
    }
    return result;
  }
  
  it('TC-001_EmailSubscription_InvalidEmail_Error', () => {
    cy.get("input[id='newsletter']").type('testmail.com')
    cy.get("button[title='Subscribe']").click({ force: true })
    cy.get("div[data-bind='html: $parent.prepareMessageForHtml(message.text)'], div[id='newsletter-error']")    // shows different error elements at different places
      .should('exist')
      .should('be.visible')
      .invoke('text')
      .should('match', /please enter a valid email address|invalid form key/i)    // shows different error messages
    
    
  })

  it('TC-002_EmailSubscription_ValidEmail_Success', () => {
    cy.get("input[id='newsletter']").type(uniqueEmail)
    cy.get("button[title='Subscribe']").click({ force: true })
    cy.get("div[data-bind='html: $parent.prepareMessageForHtml(message.text)']")
      .should('be.visible')
      .should('contain.text', 'Thank you for your subscription')
    
  })

  it('TC-003_EmailSubscription_EmptyField_Error', () => {
    cy.get("button[title='Subscribe']").click({ force: true })
    cy.get("div[data-bind='html: $parent.prepareMessageForHtml(message.text)'], div[id='newsletter-error']", { timeout: 5000 })   // shows different error elements at different places
      .should('exist')
      .should('be.visible')
      .invoke('text')
      .should('match', /this is a required field|invalid form key/i)    // shows different error messages

  })

  it('TC-004_EmailSubscription_AlreadySubscribed_Error', () => {
    cy.get("input[id='newsletter']").type('testmail2@domain.com')
    cy.get("button[title='Subscribe']").click({ force: true })

    cy.get("input[id='newsletter']").type('testmail2@domain.com')
    cy.get("button[title='Subscribe']").click({ force: true })
    cy.get("div[data-bind='html: $parent.prepareMessageForHtml(message.text)']")
      .should('be.visible')
      .should('contain.text', 'This email address is already subscribed')

  })

  it('TC-005_EmailSubscription_UserNameMaxCharacters_Success', () => {
    cy.get("input[id='newsletter']").type(userName64Characters)
    cy.get("button[title='Subscribe']").click({ force: true })
    cy.get("div[data-bind='html: $parent.prepareMessageForHtml(message.text)']")
      .should('be.visible')
      .should('contain.text', 'Thank you for your subscription')
  
  })

  it('TC-006_EmailSubscription_UserNameExceedMaxCharacters_Error', () => {
    cy.get("input[id='newsletter']").type(userName65Characters)
    cy.get("button[title='Subscribe']").click({ force: true })
    cy.get("div[data-bind='html: $parent.prepareMessageForHtml(message.text)']")
      .should('be.visible')
      .invoke('text')
      .should('match', /please enter a valid email address|invalid form key/i)    // shows different error messages
 
  })

  it('TC-007_EmailSubscription_UserNameNonAsciCharacters_Error', () => {
    cy.get("input[id='newsletter']").type('testmail-šýčšíúä@domain.com')
    cy.get("button[title='Subscribe']").click({ force: true })
    cy.get("div[data-bind='html: $parent.prepareMessageForHtml(message.text)'], div[id='newsletter-error']")    // shows different error elements at different places
      .should('exist')
      .should('be.visible')
      .invoke('text')
      .should('match', /please enter a valid email address|invalid form key/i)    // shows different error messages
 
  })

  it('TC-008_EmailSubscription_DomainExceedMaxCharacters_Error', () => {
    cy.get("input[id='newsletter']").type(domain64Characters)
    cy.get("button[title='Subscribe']").click({ force: true })
    cy.get("div[data-bind='html: $parent.prepareMessageForHtml(message.text)'], div[id='newsletter-error']")    // shows different error elements at different places
      .should('exist')
      .should('be.visible')
      .invoke('text')
      .should('match', /please enter a valid email address|invalid form key/i)    // shows different error messages
  
  })

  it('TC-009_EmailSubscription_DomainMaxCharacters_Success', () => {
    cy.get("input[id='newsletter']").type(domain63Characters)
    cy.get("button[title='Subscribe']").click({ force: true })
    cy.get("div[data-bind='html: $parent.prepareMessageForHtml(message.text)']")
      .should('be.visible')
      .should('contain.text', 'Thank you for your subscription')
     
  })

})