import IssueModal from "../pages/IssueModal";
import { faker } from "@faker-js/faker";

describe("Issue comments creating, editing and deleting", () => {
  const issueTitle = "This is an issue of type: Task.";
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(issueTitle).click();
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  it("Should create a comment successfully", () => {
    const comment = "TEST_COMMENT";

    getIssueDetailsModal().within(() => {
      cy.contains("Add a comment...").click();

      cy.get('textarea[placeholder="Add a comment..."]').type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.contains("Add a comment...").should("exist");
      cy.get('[data-testid="issue-comment"]').should("contain", comment);
    });
  });

  it("Should edit a comment successfully", () => {
    const previousComment = "An old silent pond...";
    const comment = "TEST_COMMENT_EDITED";

    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="issue-comment"]')
        .first()
        .contains("Edit")
        .click()
        .should("not.exist");

      cy.get('textarea[placeholder="Add a comment..."]')
        .should("contain", previousComment)
        .clear()
        .type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('[data-testid="issue-comment"]')
        .should("contain", "Edit")
        .and("contain", comment);
    });
  });

  it("Should delete a comment successfully", () => {
    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .contains("Delete")
      .click();

    cy.get('[data-testid="modal:confirm"]')
      .contains("button", "Delete comment")
      .click()
      .should("not.exist");

    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .should("not.exist");
  });

  it("Should successfully add, edit and delete a comment", () => {
    const firstComment = faker.lorem.sentence();
    const secondComment = faker.lorem.sentence();
    const numberOfCommentsBeforeSaving = 1;
    const numberOfCommentsAfterSaving = 2;

    //validate that issue has one comment before test actions
    IssueModal.getIssueComments().should(
      "have.length",
      numberOfCommentsBeforeSaving
    );

    //add comment
    addIssueCommentSuccessfully(firstComment);

    //confirm that added comment is visible and issue has two comments
    IssueModal.getIssueDetailModal().within(() => {
      IssueModal.getIssueComments()
        .should("contain", firstComment)
        .should("have.length", numberOfCommentsAfterSaving);
    });

    //edit previously added comment
    editIssueCommentSuccessfully(firstComment, secondComment);

    //confirm that there are two comments, "edit" button is visible and comment contents have been updated
    IssueModal.getIssueComments()
      .should("have.length", numberOfCommentsAfterSaving)
      .should("contain", "Edit")
      .and("contain", secondComment);

    //delete comment
    IssueModal.getIssueComments().contains("Delete").click();
    //confirm deletion
    IssueModal.confirmIssueCommentDeletion();
    //confirm that only one comment remains and comment doesn't exist
    IssueModal.getIssueComments()
      .should("have.length", numberOfCommentsBeforeSaving)
      .should("not.contain", secondComment);
  });
});

function addIssueCommentSuccessfully(commentToAdd) {
  cy.contains("Add a comment...").click();
  IssueModal.writeCommentToIssue(commentToAdd);
  IssueModal.clickSaveButtonAndValidateItDoesNotExistAfterUse();
  cy.contains("Add a comment...").should("exist");
}

function editIssueCommentSuccessfully(comment1, comment2) {
  IssueModal.getIssueDetailModal().within(() => {
    IssueModal.getIssueComments()
      .first()
      .contains("Edit")
      .click()
      .should("not.exist");

    IssueModal.getCommentArea()
      .should("contain", comment1)
      .clear()
      .type(comment2);

    IssueModal.clickSaveButtonAndValidateItDoesNotExistAfterUse();
  });
}
