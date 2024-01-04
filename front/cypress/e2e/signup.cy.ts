describe("Header", () => {
  const credentials = { identifier: "abc-test@localhost.com", password: "n9wb@DTJ.MLZ3" }

  it("Create account", () => {
    cy.visit("/sign-up").viewport(1920, 1080)

    cy.contains("h1", "Nouvelle liste")
    cy.get("label").eq(0).contains("Choisissez un identifiant")
    cy.get("input").eq(0).type(credentials.identifier)
    cy.get("label").eq(1).contains("Mot de passe")
    cy.get("input").eq(1).type(credentials.password)
    cy.get("form").eq(0).submit()

    // cy.intercept("http://localhost:3000/api/auth/sign-in", (req) => {
    //   req.on("response", (res) => {
    //     res.send({
    //       statusCode: 500,
    //       headers: {
    //         "content-type": "application/problem+json",
    //         "access-control-allow-origin": "*",
    //       },
    //       body: JSON.stringify({
    //         status: 500,
    //         title: "Internal Server Error",
    //       }),
    //     })
    //   })
    // })

    cy.intercept("POST", "/api/auth/sign-up", {
      statusCode: 201,
      body: { data: { success: true } },
    })
  })
})
