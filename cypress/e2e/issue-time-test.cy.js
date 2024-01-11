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

  const getOriginalEstimateHoursInputField = () =>
    cy.get('input[placeholder="Number"]');
  const FIRST_ADDED_TIME_ESTIMATION = "10";
  it("Should successfully add, edit and remove time estimation", () => {
    getOriginalEstimateHoursInputField()
      .clear()
      .click()
      .type(FIRST_ADDED_TIME_ESTIMATION);
    //cy.contains("Original Estimate (hours)").click();
   // cy.wait(100)
    cy.contains(FIRST_ADDED_TIME_ESTIMATION+ "h estimated").should("be.visible");
  });
});
