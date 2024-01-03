import request from "supertest"

import app from "../../src/app"
import { apiStore } from "../../src/db"

const credentials = { email: "abc-test@localhost.com", password: "n9wb@DTJ.MLZ3" }

describe("Auth route", () => {
  test("/api/auth/sign-up (failed low password)", async () => {
    apiStore.prepare("DELETE FROM Users WHERE email = ?").run(credentials.email)

    const res = await request(app)
      .post("/api/auth/sign-up")
      .send({ email: credentials.email, password: "low" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(403)

    console.log(res.body)

    const authorization = res.header.authorization

    expect(authorization.split(" ")[0]).toEqual("")
    expect(authorization.slice(7, authorization.length).split(".").length).toEqual(1)

    expect(res.body).toEqual({ success: false, errors: ["Mot de passe non sécurisé, trop faible"] })
  })
  test("/api/auth/sign-up", async () => {
    const res = await request(app).post("/api/auth/sign-up").send(credentials).set("Accept", "application/json").expect("Content-Type", /json/).expect(200)

    console.log(res.body)

    const authorization = res.header.authorization

    expect(authorization.split(" ")[0]).toEqual("Bearer")
    expect(authorization.slice(7, authorization.length).split(".").length).toEqual(3)

    expect(res.body).toEqual({ success: true })
  })
  test("/api/auth/sign-up (failed email exists)", async () => {
    const res = await request(app).post("/api/auth/sign-up").send(credentials).set("Accept", "application/json").expect("Content-Type", /json/).expect(403)

    console.log(res.body)

    const authorization = res.header.authorization

    expect(authorization.split(" ")[0]).toEqual("")
    expect(authorization.slice(7, authorization.length).split(".").length).toEqual(1)

    expect(res.body).toEqual({ success: false, errors: ["Cet email est utilisé"] })

    apiStore.prepare("DELETE FROM Users WHERE email = ?").run(credentials.email)
  })
})
