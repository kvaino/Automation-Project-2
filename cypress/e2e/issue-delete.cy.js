describe('Deleting issues', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
            getIssueDetailsModal().should('be.visible')
        });
    });

    it('Delete issue', () => {
        getIssueDetailsModal().within(() => {
            cy.get('textarea[placeholder="Short summary"]').should('have.text', "This is an issue of type: Task.");
            cy.get('[data-testid="icon:trash"]')
                .trigger('mouseover')
                .trigger('click');
        });

        //Confirm that deletion confirmation window is opened
        cy.get('[data-testid="modal:confirm"]').should('exist');
        cy.contains('Are you sure you want to delete this issue?').should('be.visible');
        
        //Press the Delete issue button
        cy.contains('button', 'Delete issue')
            .click()
            .should('not.exist');

        cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
            //Assert that backlog has three issues and deleted issue has been deleted.
            cy.get('[data-testid="list-issue"]')
                .should('have.length', '3')
                .should('not.contain', 'This is an issue of type: Task.')
            
        });
    });

    it('Issue Deletion Cancellation', () => {
        getIssueDetailsModal().within(() => {
            cy.get('textarea[placeholder="Short summary"]').should('have.text', "This is an issue of type: Task.");
            cy.get('[data-testid="icon:trash"]')
                .trigger('mouseover')
                .trigger('click');
        });

        //Confirm that deletion confirmation window is opened
        cy.get('[data-testid="modal:confirm"]').should('exist');
        cy.contains('Are you sure you want to delete this issue?').should('be.visible');

        //Press the Cancel button
        cy.contains('button', 'Cancel').click()
        //Assert that the confirmation window is not visible
        cy.get('[data-testid="modal:confirm"]').should('not.exist');

        //Close the issue
        getIssueDetailsModal().within(() => {
            //Select the first close icon
            cy.get('[data-testid="icon:close"]').first().click()    
        });

        cy.reload()
        cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
            //Assert that backlog has four issues and issue has not been deleted
            cy.get('[data-testid="list-issue"]')
                .should('have.length', '4')
                .should('contain', 'This is an issue of type: Task.')
        });
    });

});

const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');