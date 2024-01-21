import BetterSqlite3 from "better-sqlite3"

const tokenStore = new BetterSqlite3("tokenStore.sqlite3", { fileMustExist: false })
tokenStore.pragma("journal_mode = WAL") // performance

/**
 * Create tables
 */
function createDatabase() {
  const createTables: string[] = [
    "Tokens (`token` char(36) NOT NULL,`isRevoke` tinyint(1) DEFAULT '0',`expireAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,`renewAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,`createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,`userId` char(36) DEFAULT NULL)",
  ]

  createTables.forEach((table) => tokenStore.exec(`CREATE TABLE IF NOT EXISTS ${table}`))
}

createDatabase()

export { tokenStore }
