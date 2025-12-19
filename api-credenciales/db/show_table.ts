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
  const [tableArg, limitArg] = process.argv.slice(2)
  const limit = Number.isFinite(Number(limitArg)) ? Math.max(1, Number(limitArg)) : 10

  if (!tableArg) {
    console.error('Uso: ts-node db/show_table.ts <Tabla> [limite=10]')
    process.exit(1)
  }

  try {
    const tables = await all<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    )
    const tableNames = tables.map(t => t.name)

    if (!tableNames.includes(tableArg)) {
      console.error(`Tabla no encontrada: ${tableArg}`)
      console.error('Disponibles:', tableNames.join(', '))
      process.exit(2)
    }

    const [{ cnt }] = await all<{ cnt: number }>(`SELECT COUNT(*) as cnt FROM ${tableArg}`)
    console.log(`Base de datos: ${dbPath}`)
    console.log(`Tabla: ${tableArg} (total filas: ${cnt})`)

    const rows = await all<any>(`SELECT * FROM ${tableArg} LIMIT ${limit}`)
    if (rows.length === 0) {
      console.log('No hay filas para mostrar.')
    } else {
      console.table(rows)
    }
  } catch (err) {
    console.error('Error:', err)
  } finally {
    db.close()
  }
}

main()
