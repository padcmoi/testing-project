import BetterSqlite3 from "better-sqlite3"
import type { Options } from "better-sqlite3"

const options: Options = { fileMustExist: false }
export const apiStore = new BetterSqlite3("./data/apiStore.sqlite3", options)
apiStore.pragma("journal_mode = WAL") // performance

export function createDatabase() {
  const createTables: string[] = [
    "Users (userId TEXT type PRIMARY KEY, identifier TEXT type UNIQUE, password TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)",
    "Todos (todoId TEXT type PRIMARY KEY, label TEXT, status BOOLEAN, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, userId TEXT, FOREIGN KEY(userId) REFERENCES Users(userId) ON DELETE CASCADE)",
  ]

  createTables.forEach((table) => apiStore.exec(`CREATE TABLE IF NOT EXISTS ${table}`))
}
