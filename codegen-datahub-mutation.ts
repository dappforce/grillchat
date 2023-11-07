import type { CodegenConfig } from '@graphql-codegen/cli'

const mutationUrl = process.env.DATAHUB_MUTATION_URL
if (!mutationUrl) throw new Error('Codegen error: Datahub Mutation URL not set')

const config: CodegenConfig = {
  overwrite: true,
  schema: mutationUrl,
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
