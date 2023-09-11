import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://staging-data-hub-service.subsocial.network/graphql',
  documents: 'src/services/datahub/**/*.ts',
  generates: {
    'src/services/datahub/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
}

export default config
