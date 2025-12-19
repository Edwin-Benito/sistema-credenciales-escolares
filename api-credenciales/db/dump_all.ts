import sqlite3 from 'sqlite3'
import path from 'path'

const dbPath = path.join(__dirname, '..', 'database.sqlite')
const db = new sqlite3.Database(dbPath)

function all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows as T[])
    })
  })
}

async function main() {
  try {
    console.log(`Usando base de datos: ${dbPath}`)
    const tables = await all<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
    )

    if (tables.length === 0) {
      console.log('No hay tablas de usuario.')
      return
    }

    for (const { name } of tables) {
      const [{ cnt }] = await all<{ cnt: number }>(`SELECT COUNT(*) as cnt FROM ${name}`)
      console.log(`\n=== ${name} (filas: ${cnt}) ===`)
      const rows = await all<any>(`SELECT * FROM ${name} LIMIT 5`)
      if (rows.length) console.table(rows)
    }
  } catch (err) {
    console.error('Error en dump:', err)
  } finally {
    db.close()
  }
}

main()
