import { createServer as createHTTP } from "http"
import { createServer as createHTTPS } from "https"
import fs from "fs"
import dotenv from "dotenv"
dotenv.config()

import app from "./app"

const httpsOptions = {
  key: fs.readFileSync("./ssl/key.pem"),
  cert: fs.readFileSync("./ssl/cert.pem"),
}
const httpPort = Number(process.env.HTTP_PORT)
const httpsPort = Number(process.env.HTTPS_PORT)

if (!isNaN(httpPort)) createHTTP(app).listen(httpPort, () => console.warn(`API listening on HTTP PORT ${httpPort}`))
try {
  if (!isNaN(httpsPort)) createHTTPS(httpsOptions, app).listen(httpsPort, () => console.warn(`API listening on HTTPS PORT ${httpsPort}`))
} catch (error) {
  console.log(error)
}
