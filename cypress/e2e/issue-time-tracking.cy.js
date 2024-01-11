import IssueModal from "../pages/IssueModal";
import { faker } from "@faker-js/faker";

describe("Issue time tracking test cases", () => {
  //data set with which we are creating issue, saved as variable
  const issueDetails = {
    title: "TEST_TITLE",
    type: "Bug",
    description: "TEST_DESCRIPTION",
    assignee: "Lord Gaben",
  };
  const EXPECTED_AMOUNT_OF_ISSUES = "5";

  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        //open isse creation modal
        cy.visit(url + "/board?modal-issue-create=true");
      });

    IssueModal.createIssue(issueDetails);
    IssueModal.ensureIssueIsCreated(EXPECTED_AMOUNT_OF_ISSUES, issueDetails);
    cy.contains(issueDetails.title).click();
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const getOriginalEstimateHoursInputField = () =>
    cy.get('input[placeholder="Number"]');
  const FIRST_ADDED_TIME_ESTIMATION = "10";

  it("Should successfully add, edit and remove time estimation", () => {
    cy.contains("No time logged").should("be.visible");
    getOriginalEstimateHoursInputField()
      .click()
      .type(FIRST_ADDED_TIME_ESTIMATION);
    cy.contains("Original Estimate (hours)").click();
    cy.contains(FIRST_ADDED_TIME_ESTIMATION + "h estimated").should(
      "be.visible"
    );
  });
});
