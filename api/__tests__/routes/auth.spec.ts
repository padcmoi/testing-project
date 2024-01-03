import request from "supertest"

import app from "../../src/app"
import { apiStore } from "../../src/db"
import { bcrypt, generateUUID } from "../../src/utils/tools"
import { auth } from "../../src/middlewares/auth.middleware"

const credentials = { email: "abc-test@localhost.com", password: "n9wb@DTJ.MLZ3" }

describe("/api/auth/sign-up ", () => {
  beforeAll(() => {
    apiStore.prepare("DELETE FROM Users WHERE email = ?").run(credentials.email)
  })

  test("failed low password", async () => {
    const res = await request(app)
      .post("/api/auth/sign-up")
      .send({ email: credentials.email, password: "low" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(403)

    const authorization = res.header.authorization

    expect(authorization.split(" ")[0]).toEqual("")
    expect(authorization.slice(7, authorization.length).split(".").length).toEqual(1)

    expect(res.body).toEqual({ success: false, errors: ["Mot de passe non sécurisé, trop faible"] })
  })
  test("Success, get Auth token", async () => {
    const res = await request(app).post("/api/auth/sign-up").send(credentials).set("Accept", "application/json").expect("Content-Type", /json/).expect(200)

    const authorization = res.header.authorization

    expect(authorization.split(" ")[0]).toEqual("Bearer")
    expect(authorization.slice(7, authorization.length).split(".").length).toEqual(3)

    expect(res.body).toEqual({ success: true })
  })
  test("failed email exists", async () => {
    const res = await request(app).post("/api/auth/sign-up").send(credentials).set("Accept", "application/json").expect("Content-Type", /json/).expect(403)

    const authorization = res.header.authorization

    expect(authorization.split(" ")[0]).toEqual("")
    expect(authorization.slice(7, authorization.length).split(".").length).toEqual(1)

    expect(res.body).toEqual({ success: false, errors: ["Cet email est utilisé"] })
  })

  afterAll(() => {
    apiStore.prepare("DELETE FROM Users WHERE email = ?").run(credentials.email)
  })
})

describe("/api/auth/sign-in ", () => {
  beforeAll(async () => {
    const hash = await bcrypt.hash(credentials.password)
    await apiStore.prepare("INSERT INTO Users (userId, email, password) VALUES (?,?,?)").run(generateUUID(credentials.email), credentials.email, hash)
  })

  describe("loggedIn successfull", () => {
    test("Response OK", async () => {
      const res = await request(app).post("/api/auth/sign-in").send(credentials).set("Accept", "application/json").expect("Content-Type", /json/).expect(201)

      expect(res.body).toEqual({ success: true })
    })

    test("Token provided", async () => {
      const res = await request(app).post("/api/auth/sign-in").send(credentials).set("Accept", "application/json").expect("Content-Type", /json/).expect(201)

      const authorization = res.header.authorization
      expect(authorization.split(" ")[0]).toEqual("Bearer")
      expect(authorization.slice(7, authorization.length).split(".").length).toEqual(3)
    })

    test("Check token payload and compare with database", async () => {
      const res = await request(app).post("/api/auth/sign-in").send(credentials).set("Accept", "application/json").expect("Content-Type", /json/).expect(201)

      let authorization = res.header.authorization

      if (authorization.startsWith("Bearer ")) authorization = authorization.slice(7, authorization.length)

      auth.verify(authorization)

      const user = apiStore.prepare("SELECT email FROM Users WHERE userId = ?").get(auth.payload.userId) as { email: string } | undefined

      expect(user?.email).toEqual(credentials.email)
    })
  })

  test("wrong email only or inexists", async () => {
    const res = await request(app)
      .post("/api/auth/sign-in")
      .send({ email: "abc7@localhost.com", password: credentials.password })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401)

    expect(res.header.authorization).toEqual("")

    expect(res.body).toEqual({ success: false, errors: ["Identifiants erronés"] })
  })
  test("wrong password only", async () => {
    const res = await request(app)
      .post("/api/auth/sign-in")
      .send({ email: credentials.email, password: "123" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401)

    expect(res.header.authorization).toEqual("")

    expect(res.body).toEqual({ success: false, errors: ["Identifiants erronés"] })
  })

  afterAll(() => apiStore.prepare("DELETE FROM Users WHERE email = ?").run(credentials.email))
})
