describe("Header", () => {
  it("visits the app root url", () => {
    cy.visit("/todos").viewport(1920, 1080)
  })
})
