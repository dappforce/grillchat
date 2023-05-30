export * from './base'
export * from './types'

export interface PoolQueryConfig<SingleParam, SingleReturn> {
  getQueryId?: (param: SingleParam) => string
  multiCall: (params: SingleParam[]) => Promise<SingleReturn[]>
  resultMapper?: {
    resultToKey: (result: SingleReturn) => string
    paramToKey: (param: SingleParam) => string
  }
  singleCall?: (param: SingleParam) => Promise<SingleReturn>
  waitTime?: number
}

function generateBatchPromise<BatchData>() {
  let batchResolver: (value: BatchData | PromiseLike<BatchData>) => void = () =>
    undefined
  const batchPromise = new Promise<BatchData>((resolve) => {
    batchResolver = resolve
  })
  return { batchPromise, batchResolver }
}

export function poolQuery<SingleParam, SingleReturn>(
  config: PoolQueryConfig<SingleParam, SingleReturn>
): (param: SingleParam) => Promise<SingleReturn | null> {
  const {
    getQueryId,
    multiCall,
    singleCall,
    waitTime = 250,
    resultMapper,
  } = config
  let queryPool: SingleParam[] = []
  let timeout: number | undefined

  type BatchData =
    | SingleReturn[]
    | {
        [key: string]: SingleReturn
      }

  let { batchPromise, batchResolver } = generateBatchPromise<BatchData>()

  const later = async function () {
    timeout = undefined
    let response: Promise<SingleReturn[]>
    if (singleCall && queryPool.length === 1) {
      const queries = queryPool.map((singleParam) => {
        return singleCall(singleParam)
      })
      response = Promise.all(queries)
    } else {
      let allParams = queryPool
      if (getQueryId) {
        allParams = []
        const uniqueQueries = new Set()
        for (let i = queryPool.length - 1; i >= 0; i--) {
          const queryId = getQueryId(queryPool[i])
          if (uniqueQueries.has(queryId)) continue
          uniqueQueries.add(queryId)
          allParams.push(queryPool[i])
        }
      }
      response = multiCall(allParams)
    }
    const resultArray = await response

    let result: { [key: string]: SingleReturn } | SingleReturn[] = resultArray
    if (resultMapper) {
      const resultMap: { [key: string]: SingleReturn } = {}
      resultArray.forEach((singleResult) => {
        const key = resultMapper.resultToKey(singleResult)
        resultMap[key] = singleResult
      })
      result = resultMap
    }
    batchResolver(result)
    queryPool = []
    ;({ batchPromise, batchResolver } = generateBatchPromise<BatchData>())
  }

  return async function executedFunction(
    param: SingleParam
  ): Promise<SingleReturn | null> {
    const currentIndex = queryPool.length
    queryPool.push(param)
    clearTimeout(timeout)
    timeout = setTimeout(later, waitTime) as unknown as number

    const result = await batchPromise
    if (Array.isArray(result)) {
      return result[currentIndex] ?? null
    } else {
      const key = resultMapper?.paramToKey(param)
      return key ? result[key] ?? null : null
    }
  }
}
