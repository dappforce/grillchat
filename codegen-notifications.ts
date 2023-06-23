import type { CodegenConfig } from '@graphql-codegen/cli'

const notificationsUrl = process.env.NEXT_PUBLIC_NOTIFICATIONS_URL
if (!notificationsUrl)
  throw new Error('Codegen error: Notifications URL not set')

const config: CodegenConfig = {
  overwrite: true,
  schema: notificationsUrl,
  documents: 'src/services/notifications/*.ts',
  generates: {
    'src/services/notifications/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
}

export default config
