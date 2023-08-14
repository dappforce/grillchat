import type { CodegenConfig } from '@graphql-codegen/cli'

const squidUrl = 'https://squid.subsquid.io/subsocial/graphql'

const config: CodegenConfig = {
  overwrite: true,
  schema: squidUrl,
  documents: 'src/services/mainnet-squid/**/*.ts',
  generates: {
    'src/services/mainnet-squid/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-document-nodes',
      ],
    },
  },
}

export default config
