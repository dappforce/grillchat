import type { CodegenConfig } from '@graphql-codegen/cli'

const moderationUrl = process.env.NEXT_PUBLIC_MODERATION_URL
if (!moderationUrl) throw new Error('Codegen error: Moderation URL not set')

const config: CodegenConfig = {
  overwrite: true,
  schema: moderationUrl,
  documents: 'src/services/moderation/*.ts',
  ignoreNoDocuments: true,
  generates: {
    'src/services/moderation/gql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
}

export default config
