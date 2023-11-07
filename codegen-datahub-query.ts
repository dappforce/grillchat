import type { CodegenConfig } from '@graphql-codegen/cli'

const queryUrl = process.env.NEXT_PUBLIC_DATAHUB_QUERY_URL
if (!queryUrl) throw new Error('Codegen error: Datahub Query URL not set')

const config: CodegenConfig = {
  overwrite: true,
  schema: queryUrl,
  documents:
    'src/services/subsocial/datahub/**/{fetcher,subscription,query}.ts',
  generates: {
    'src/services/subsocial/datahub/generated-query.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
}

export default config
