// NOTE This file is auto-generated by ./src/drizzle/gen-drizzle.ts based on the schema in ./src/schema.ts

import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const todos = sqliteTable('todos', {
  id: text('id').primaryKey().notNull(),
  text: text('text').notNull().default(''),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  deleted: integer('deleted'),
})

export const app = sqliteTable('app', {
  id: text('id').primaryKey().notNull(),
  newTodoText: text('newTodoText').notNull().default(''),
  filter: text('filter').notNull().default('all'),
})

export const __livestore_schema = sqliteTable('__livestore_schema', {
  tableName: text('tableName').primaryKey().notNull(),
  schemaHash: integer('schemaHash').notNull(),
  updatedAt: text('updatedAt').notNull(),
})
