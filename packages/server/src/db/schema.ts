import { v4 } from '@lukeed/uuid/secure'
import { relations, sql } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export function genUUID() {
  return text('id')
    .primaryKey()
    .$defaultFn(() => v4())
}

function commonColumns() {
  return {
    id: genUUID(),
    createdAt: text('created_at').default(sql`(datetime('now', 'localtime'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now', 'localtime'))`)
  }
}

export const users = sqliteTable('users', {
  ...commonColumns(),
  username: text('username').unique().notNull(),
  nickname: text('nickname'),
  hashedPassword: text('hashed_password').notNull()
})

export const organizations = sqliteTable('organizations',
  {
    ...commonColumns(),
    name: text('name').notNull(),
    giteaUrl: text('gitea_url').notNull(),
    giteaToken: text('gitea_token'),
    creatorId: text('creator_id')
      .notNull()
      .references(() => users.id)
  }
)

export const apps = sqliteTable('apps', {
  ...commonColumns(),
  name: text('name').notNull(),
  upstreamRepoType: text('upstream_repo_type', { enum: ['codeup'] }).notNull(),
  upstreamRepoUrl: text('upstream_repo_url').notNull(),
  upstreamSecretToken: text('upstream_secret_token'),
  giteaRepo: text('gitea_repo').notNull(),
  giteaToken: text('gitea_token'),
  generatedWebhookUrl: text('generated_webhook_url'),
  organizationId: text('organization_id').references(() => organizations.id)
})

export const usersRelations = relations(users, ({ many }) => ({
  organizations: many(organizations)
}))

export const organizationsRelations = relations(organizations, ({ one, many }) => ({
  creator: one(users, {
    fields: [organizations.creatorId],
    references: [users.id]
  }),
  apps: many(apps)
}))

export type UpstreamRepoType = typeof apps.$inferSelect.upstreamRepoType
