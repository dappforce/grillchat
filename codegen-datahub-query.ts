import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://first-test-data-hub.subsocial.network/graphql',
  documents: 'src/services/datahub/**/query.ts',
  generates: {
    'src/services/datahub/generated-query.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
}

export default config
