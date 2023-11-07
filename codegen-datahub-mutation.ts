import type { CodegenConfig } from '@graphql-codegen/cli'

const queueUrl = process.env.DATAHUB_QUEUE_URL
if (!queueUrl) throw new Error('Codegen error: Datahub Queue URL not set')

const config: CodegenConfig = {
  overwrite: true,
  schema: queueUrl,
  documents: 'src/server/datahub/**/*.ts',
  generates: {
    'src/server/datahub/generated-mutation.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
}

export default config
