import request from "supertest"

import app from "../src/app"

describe("Default route", () => {
  test("404 not found", async () => {
    const res = await request(app).get("/").expect(404).expect("Content-Type", /json/)
    expect(res.body).toEqual({ message: "Not found" })
  })
})
