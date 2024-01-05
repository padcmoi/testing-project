import request from "supertest"

import app from "../../src/app"
import { apiStore } from "../../src/db"
import { bcrypt, generateUUID } from "../../src/utils/tools"

const credentials = { identifier: "abc-testlocalhostcom", password: "n9wb@DTJ.MLZ3" }

describe("Todo controller", () => {
  let authorization: string

  beforeAll(async () => {
    await apiStore.prepare("DELETE FROM Users WHERE identifier = ?").run(credentials.identifier)
    const hash = await bcrypt.hash(credentials.password)
    await apiStore.prepare("INSERT INTO Users (userId, identifier, password) VALUES (?,?,?)").run(generateUUID(""), credentials.identifier, hash)
  })

  test("connect to app and await provided token", async () => {
    const res = await request(app).post("/api/auth/sign-in").send(credentials).set("Accept", "application/json").expect("Content-Type", /json/).expect(201)

    authorization = res.header.authorization

    expect(res.body).toEqual({
      success: true,
      __toastify: [{ type: "success", message: "Connecté" }],
    })
  })

  test("check authorisation token", async () => {
    console.log("provided token: ", authorization)

    expect(authorization.split(" ")[0]).toEqual("Bearer")
    expect(authorization.slice(7, authorization.length).split(".").length).toEqual(3)
  })

  describe("[GET] /api/todo", () => {
    test("returns the list matching my auth token", async () => {
      const res = await request(app)
        .get("/api/todo")
        .set("Authorization", authorization)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body).toEqual({
        success: true,
        todo: [],
      })
    })
  })

  afterAll(() => apiStore.prepare("DELETE FROM Users WHERE identifier = ?").run(credentials.identifier))
})
