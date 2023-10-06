import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://first-test-queue-data-hub.subsocial.network/graphql',
  documents: 'src/services/datahub/**/mutation.ts',
  generates: {
    'src/services/datahub/generated-mutation.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
}

export default config
