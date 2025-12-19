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
      console.log('No hay tablas de usuario en la base de datos.')
      return
    }

    for (const { name } of tables) {
      console.log(`\n=== Tabla: ${name} ===`)
      const cols = await all<{ cid: number; name: string; type: string; notnull: number; dflt_value: any; pk: number }>(
        `PRAGMA table_info(${JSON.stringify(name)});`
      )
      for (const c of cols) {
        console.log(`- ${c.name} (${c.type})${c.pk ? ' [PK]' : ''}${c.notnull ? ' NOT NULL' : ''}`)
      }
    }
  } catch (err) {
    console.error('Error al listar tablas:', err)
  } finally {
    db.close()
  }
}

main()
