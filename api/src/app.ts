import {} from "./types/express"
import express from "express"
import cors from "cors"
import morgan from "morgan"
import helmet from "helmet"

import routes from "./routes/index"
import { createDatabase } from "./db"

import type { Request, Response, NextFunction } from "express"

createDatabase()

const app = express()

app
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
  })
  .use(cors({ exposedHeaders: ["authorization"] }), (_req, res, next) => {
    res.header("authorization", "")
    next()
  })
  .use(morgan(":remote-addr - :remote-user [:date[clf]] ':method :url HTTP/:http-version' :status :res[content-length]"))
  .use(helmet())
  .use(express.json())

app.use("/api", routes)

app.use("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Not found" })
})

export default app
