import type { CodegenConfig } from '@graphql-codegen/cli'

const queueUrl = 'https://moderation-queue-data-hub.subsocial.network/graphql'
if (!queueUrl) throw new Error('Codegen error: Datahub Queue URL not set')

const config: CodegenConfig = {
  overwrite: true,
  schema: queueUrl,
  documents: 'src/server/datahub/**/*.ts',
  generates: {
    'src/server/datahub/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
}

export default config
