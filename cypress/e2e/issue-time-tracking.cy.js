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
  const getInputNumberField = () => cy.get('input[placeholder="Number"]');
  const getTimeTrackingModal = () => cy.get('[data-testid="modal:tracking"]');
  const getTimeLog = () => cy.contains("Time Tracking").next();

  function closeIssueDetails() {
    cy.get('[data-testid="icon:close"]').first().click();
  }

  function openIssueDuringTest() {
    cy.contains(issueTitle).click();
  }

  it("Should successfully add, edit and remove time estimation", () => {
    const FIRST_ADDED_TIME_ESTIMATION = "10";
    const SECOND_ADDED_TIME_ESTIMATION = "20";
    getIssueDetailsModal().within(() => {
      getInputNumberField()
        .click()
        .clear()
        .type(FIRST_ADDED_TIME_ESTIMATION)
        .should("have.value", FIRST_ADDED_TIME_ESTIMATION);
      getTimeLog().should(
        "contain",
        FIRST_ADDED_TIME_ESTIMATION + "h estimated"
      );
      closeIssueDetails();
    });

    openIssueDuringTest();

    getInputNumberField().should("have.value", FIRST_ADDED_TIME_ESTIMATION);

    getIssueDetailsModal().within(() => {
      getInputNumberField()
        .click()
        .clear()
        .type(SECOND_ADDED_TIME_ESTIMATION)
        .should("have.value", SECOND_ADDED_TIME_ESTIMATION);
      getTimeLog().should(
        "contain",
        SECOND_ADDED_TIME_ESTIMATION + "h estimated"
      );
      closeIssueDetails();
    });

    openIssueDuringTest();

    getIssueDetailsModal().within(() => {
      getInputNumberField()
        .should("have.value", SECOND_ADDED_TIME_ESTIMATION)
        .clear()
        .should("have.value", "");
      closeIssueDetails();
    });
    openIssueDuringTest();
    getInputNumberField().should("have.attr", "placeholder", "Number");
  });

  it("Should successfully add, edit and remove time spent on issue", () => {
    const NUMBER_TWO = "2";
    const NUMBER_FIVE = "5";
    getIssueDetailsModal().within(() => {
      getTimeLog().should("contain", "8h estimated");
      cy.get('[data-testid="icon:stopwatch"]').click();
    });
    getTimeTrackingModal()
      .should("be.visible")
      .within(() => {
        getInputNumberField().first().click().clear().type(NUMBER_TWO);
        getInputNumberField().last().click().clear().type(NUMBER_FIVE);
        cy.contains("Done").click();
      });
    getTimeTrackingModal().should("not.exist");
    getTimeLog()
      .should("contain", NUMBER_FIVE + "h remaining")
      .and("not.contain", "No time logged");

    closeIssueDetails();
    openIssueDuringTest();

    getIssueDetailsModal().within(() => {
      getTimeLog().should("contain", NUMBER_FIVE + "h remaining");
      cy.get('[data-testid="icon:stopwatch"]').click();
    });

    getTimeTrackingModal()
      .should("be.visible")
      .within(() => {
        getInputNumberField().first().click().clear();
        getInputNumberField().last().click().clear();
        cy.contains("Done").click();
      });

    getTimeTrackingModal().should("not.exist");

    getTimeLog()
      .should("contain", "No time logged")
      .and("contain", "8h estimated");
  });
});
