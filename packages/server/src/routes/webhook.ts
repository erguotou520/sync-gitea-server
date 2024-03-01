import { db } from '@/db'
import { apps, organizations } from '@/db/schema'
import { syncGiteaRepo } from '@/utils'
import { eq } from 'drizzle-orm'
import { t } from 'elysia'
import type { ServerType } from '..'

export async function addWebhookRoutes(path: string, server: ServerType) {
  server.post(
    `${path}/:organizationId/:appId/codeup`,
    async ({ params, set, log }) => {
      const { organizationId, appId } = params
      const organization = await db.query.organizations.findFirst({
        where: eq(organizations.id, organizationId)
      })
      if (!organization) {
        set.status = 404
        return 'Organization not found'
      }

      const app = await db.query.apps.findFirst({
        where: eq(apps.id, appId)
      })
      if (!app) {
        set.status = 404
        return 'App not found'
      }
      const giteaUrl = organization.giteaUrl || process.env.GITEA_URL
      const giteaToken = app.giteaToken || organization.giteaToken || process.env.GITEA_TOKEN
      if (!giteaUrl ||!giteaToken) {
        set.status = 400
        return 'Gitea url or token not found'
      }
      const ret = await syncGiteaRepo(giteaUrl, app.giteaRepo, giteaToken)
      if (!ret.success) {
        log.error(ret)
      } else {
        log.info('success')
      }
    },
    {
      params: t.Object({
        organizationId: t.String(),
        appId: t.String(),
      })
    }
  )
}
