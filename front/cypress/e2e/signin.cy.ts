describe("Header", () => {
  const credentials = { email: "abc-test@localhost.com", password: "n9wb@DTJ.MLZ3" }

  it("visits the app root url", () => {
    cy.visit("/sign-in").viewport(1920, 1080)

    cy.contains("h1", "Connexion")

    cy.get("input[type=email]").type(credentials.email, { force: true })
    cy.get("input[type=password]").type(credentials.password, { force: true })

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

    cy.intercept("POST", "/api/auth/sign-in", {
      statusCode: 200,
      body: { data: { success: true } },
    })

    cy.get("form").submit()
  })
})
