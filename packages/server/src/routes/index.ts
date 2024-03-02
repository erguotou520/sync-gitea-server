import type { ServerType } from '..'
import { addAppRoutes } from './app'
import { addLoginRoutes } from './login'
import { addOrganizationRoutes } from './organization'
import { addRegisterRoutes } from './register'
import { addUserRoutes } from './user'
import { addWebhookRoutes } from './webhook'

export function registerAPIRoutes(server: ServerType) {
  server.get('/health', () => ({ status: 'ok' }))
  addRegisterRoutes('/register', server)
  addLoginRoutes('/login', server)
  server.group(
    '/api',
    {
      async beforeHandle({ bearer, set }) {
        if (!bearer) {
          set.status = 401
          return 'Unauthorized'
        }
      }
    },
    app => {
      app.get('/info', () => {
        return {
          publicUrl: process.env.PUBLIC_URL
        }
      })
      addUserRoutes('/user', app)
      addOrganizationRoutes('/organizations', app)
      addAppRoutes('/apps/:orgId', app)
      return app
    }
  )

  addWebhookRoutes('/webhook', server)
}
