import fs from 'node:fs'

import { printSqliteDrizzleTables } from '@livestore/db-schema/codegen'

import { schema } from '../schema/index.js'

const str = `\
// NOTE This file is auto-generated by ./src/drizzle/gen-drizzle.ts based on the schema in ./src/schema.ts

${printSqliteDrizzleTables(Object.values(schema.tables))}
`

const targetPath = new URL('./schema.ts', import.meta.url)

fs.writeFileSync(targetPath, str)
