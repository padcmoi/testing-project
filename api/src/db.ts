import BetterSqlite3 from "better-sqlite3"
import type { Options } from "better-sqlite3"

const options: Options = { fileMustExist: false }
export const apiStore = new BetterSqlite3("database.sqlite3", options)
apiStore.pragma("journal_mode = WAL") // performance

export function createDatabase() {
  const createTables: string[] = [
    "Users (userId TEXT type PRIMARY KEY, identifier TEXT type UNIQUE, password TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)",
    "Todos (todoId TEXT type PRIMARY KEY, label TEXT, status BOOLEAN, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, userId TEXT, FOREIGN KEY(userId) REFERENCES Users(userId))",
  ]

  createTables.forEach((table) => apiStore.exec(`CREATE TABLE IF NOT EXISTS ${table}`))

  // apiStore.prepare("INSERT INTO Todos (label, status) VALUES (?,?)").run("abc", 0)
}

// FOREIGN KEY(ownerId) REFERENCES album(userId)

// CREATE TABLE album(
//   albumartist TEXT,
//   albumname TEXT,
//   albumcover BINARY,
//   PRIMARY KEY(albumartist, albumname)
// );

// CREATE TABLE song(
//   songid     INTEGER,
//   songartist TEXT,
//   songalbum TEXT,
//   songname   TEXT,
//   FOREIGN KEY(songartist, songalbum) REFERENCES album(albumartist, albumname)
// );
