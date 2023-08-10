import type { CodegenConfig } from '@graphql-codegen/cli'

const moderationUrl = process.env.MODERATION_URL
if (!moderationUrl) throw new Error('Codegen error: Moderation URL not set')

const config: CodegenConfig = {
  overwrite: true,
  schema: moderationUrl,
  documents: 'src/server/moderation/*.ts',
  generates: {
    'src/server/moderation/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
}

export default config
