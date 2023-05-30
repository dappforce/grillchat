import type { CodegenConfig } from '@graphql-codegen/cli'

const squidUrl = process.env.NEXT_PUBLIC_SQUID_URL
if (!squidUrl) throw new Error('Codegen error: Squid URL not set')

const config: CodegenConfig = {
  overwrite: true,
  schema: squidUrl,
  documents: 'src/services/subsocial/*.ts',
  ignoreNoDocuments: true,
  generates: {
    'src/services/subsocial/gql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
}

export default config
