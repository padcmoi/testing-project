describe("Header", () => {
  it("visits the app root url", () => {
    cy.visit("/account").viewport(1920, 1080)
  })
})
