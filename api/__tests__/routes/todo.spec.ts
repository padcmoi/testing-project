import request from "supertest"

import app from "../../src/app"
import { apiStore } from "../../src/db"
import { bcrypt, generateUUID, validateUUID } from "../../src/utils/tools"

const credentials = { identifier: "abc-testlocalhostcom", password: "n9wb@DTJ.MLZ3" }

describe("Todo controller", () => {
  let authorization: string
  let itemId: string
  let userId: string

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

  describe("[POST] /api/todo", () => {
    test("create 3 new todo with my auth token", async () => {
      for (let index = 0; index < 3; index++) {
        const res = await request(app)
          .post("/api/todo")
          .send({ label: `test-${index + 1}` })
          .set("Authorization", authorization)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(201)

        expect(res.body).toEqual({ success: true })
      }
    })
  })
  describe("[GET] /api/todo", () => {
    test("returns the list matching my auth token", async () => {
      const res = await request(app)
        .get("/api/todo")
        .set("Authorization", authorization)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      const { success, todo } = res.body as { success: boolean; todo: { id: string; label: string; status: boolean }[] }

      expect(typeof todo[1].id).toEqual("string")
      expect(success).toBeTruthy()
      expect(todo.map(({ id, label, status }) => ({ id: typeof id, label, status }))).toEqual([
        { id: "string", label: "test-1", status: false },
        { id: "string", label: "test-2", status: false },
        { id: "string", label: "test-3", status: false },
      ])

      itemId = todo[1].id
    })
  })

  describe("[PUT] /api/todo/:todoId", () => {
    test("check itemId as valid", async () => {
      expect(validateUUID(itemId)).toBeTruthy()
    })
    test("change status an item with an id doesnt exist (/api/todo/___id-doesnt-exist)", async () => {
      const res = await request(app)
        .put("/api/todo/___id-doesnt-exist")
        .send({ status: true })
        .set("Authorization", authorization)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(404)

      expect(res.body.success).toBeFalsy()
      expect(res.body.__toastify).toEqual([{ type: "error", message: "Ce TODO n'existe pas ou a été supprimé" }])
    })
    test("change status an item by the id with a status not boolean", async () => {
      const res = await request(app)
        .put(`/api/todo/${itemId}`)
        .send({ status: 1 })
        .set("Authorization", authorization)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(403)

      expect(res.body.success).toBeFalsy()
      expect(res.body.__toastify).toEqual([{ type: "error", message: "Le status de l'item doit être un boolean" }])
    })
    test("change status an item by the id and matching my auth token and check the right value in Database", async () => {
      const res = await request(app)
        .put(`/api/todo/${itemId}`)
        .send({ status: true })
        .set("Authorization", authorization)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.success).toBeTruthy()

      // check expected result 1 == status true
      const exists = (await apiStore.prepare("SELECT userId,status FROM Todos WHERE todoId = ?").get(itemId)) as { userId: string; status: number } | undefined
      if (exists) userId = exists.userId
      expect(exists?.status).toEqual(1)
    })
  })

  describe("[PUT] /api/todo", () => {
    test("check userId as valid", async () => {
      expect(validateUUID(userId)).toBeTruthy()
    })
    test("change status false each items and matching my auth token and check the right value in Database", async () => {
      const res = await request(app)
        .put("/api/todo")
        .send({ status: false })
        .set("Authorization", authorization)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(404)

      expect(res.body.success).toBeTruthy()

      const todos = (await apiStore.prepare("SELECT status FROM Todos WHERE userId = ?").all(userId)) as { status: number }[]
      expect(todos.map((todo) => `${todo.status}`).includes("1") || todos.length == 0).toBeFalsy()
    })
  })

  // afterAll(() => apiStore.prepare("DELETE FROM Users WHERE identifier = ?").run(credentials.identifier))
})
