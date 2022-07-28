describe("Top page", () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.seedDatabase();
  });

  it("should return recommendations according to the amount", () => {
    cy.visit("http://localhost:3000/");

    cy.contains("top").click();

    cy.url().should("equal", "http://localhost:3000/top");

    cy.get("article:first-of-type").within(() => {
      cy.get("div:last-of-type").should("have.text", "529");
    });

    cy.get("article:last-of-type").within(() => {
      cy.get("div:last-of-type").should("have.text", "0");
    });
  });
});