describe('Deleting issues', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
            cy.visit(url + '/board');
            cy.contains(issueTitle).click();
            getIssueDetailsModal().should('be.visible')
        });
    });

    it('Delete issue', () => {
        //Call out function to press Delete Icon
        pressDeleteIcon();

        //Confirm that deletion confirmation window is opened
        ensureConfirmationWindowIsVisible();

        //Press the Delete issue button
        selectConfirmationMessage(confirmDeletion);

        cy.reload();

        cy.get('[data-testid="board-list:backlog').should('be.visible').within(() => {
            //Assert that backlog has three issues and deleted issue has been deleted.
            cy.get('[data-testid="list-issue"]')
                .should('have.length', '3')
                .should('not.contain', issueTitle);

        });
    });

    it('Issue Deletion Cancellation', () => {
        pressDeleteIcon();
        //Confirm that deletion confirmation window is opened
        ensureConfirmationWindowIsVisible();

        //Press the Cancel button
        selectConfirmationMessage(cancelDeletion);

        //Close the issue
        cy.get('[data-testid="icon:close"]').first().click();

        cy.reload()
        cy.get('[data-testid="board-list:backlog').should('be.visible').within(() => {
            //Assert that backlog has four issues and issue has not been deleted
            cy.get('[data-testid="list-issue"]')
                .should('have.length', '4')
                .should('contain', issueTitle);
        });
    });

});

const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
const issueTitle = 'This is an issue of type: Task.'
const confirmDeletion = 'Delete issue'
const cancelDeletion = 'Cancel'

/** 
* Function to press the Delete icon.
* @summary On issue details view, press the trash icon and click it to delete the issue.
*/
function pressDeleteIcon() {
    cy.get('[data-testid="icon:trash"]')
        .trigger('mouseover')
        .trigger('click');
}

/** 
* Ensure that deletion confirmation window is visible.
* @summary Ensure that user can see the deletion confirmation message and options.
*/
function ensureConfirmationWindowIsVisible() {
    cy.get('[data-testid="modal:confirm"]').should('exist');
    cy.contains('Are you sure you want to delete this issue?').should('be.visible');
}

/** 
* Select the appropriate confirmation message.
* @summary Ensure that user can choose the confirmation message. After pressing the button, the confirmation modal is closed.
* @param {ParamDataTypeHere} message - has to options: Delete issue -> to delete issue and Cancel -> to cancel deletion.
*/
function selectConfirmationMessage(message) {
    cy.contains('button', message).click();
    cy.get('[data-testid="modal:confirm"]').should('not.exist');
}