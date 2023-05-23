describe("Ask question", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("When signed in and ask a valid question, the question should successfully save", () => {
    cy.contains("Q & A");
    cy.contains("Unanswered Questions");
    cy.contains("Sign In").click();
    //cy.url().should('include', 'auth0');
    cy.origin("https://dev-qw1ss4-u.us.auth0.com", () => {
      cy.url().should("include", "auth0");
      cy.get("input[name=email]")
        .type("engrekuremaro@gmail.com")
        .should("have.value", "engrekuremaro@gmail.com");

      cy.get("input[name=password]")
        .type("Godzilla@31")
        .should("have.value", "Godzilla@31");

        cy.get("form").submit();
    });



    cy.contains("Unanswered Questions");

    cy.contains("Ask a question").click();
    cy.contains("Ask a question");

    var title = "title test";
    var content = "Lots and lots and lots and lots and lots of content test";
    cy.get("input[name=title]").type(title).should("have.value", title);
    cy.get("textarea[name=content]").type(content).should("have.value", content);

    cy.contains("Submit Your Question").click();
    cy.contains("Your question was successfully submitted");

    cy.contains("Sign Out").click();
    cy.contains("You successfully signed out!");
  });
});
