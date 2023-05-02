import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://staging-moderation.subsocial.network/graphql',
  documents: 'src/services/moderation/*.ts',
  ignoreNoDocuments: true,
  generates: {
    'src/services/moderation/gql/': {
      preset: 'client',
      plugins: [],
    },
  },
}

export default config
