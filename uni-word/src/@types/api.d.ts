declare namespace Http {
  type Response<T> = Promise<{
    code: string
    message: string
    value: T
    values: [T]
    total: number
  }>
}

declare namespace Word {
  interface Dict {
    id: string
    ukTranscription: string
    usTranscription: string
    meaning: {
      nouns: string
      verbs: string
      adjectives: string
      adverbs: string
    }
    examples: [{
      sentence: string
      translation: string
    }]
    struct: {
      parts: [{
        part: string
        root: boolean
        prefix: boolean
        infix: boolean
        suffix: boolean
        meaning: string
        meaningTrans: string
      }]
      analysis: string
      analysisTrans: string
    }
    inflection: {
      plural: []
      progressive: []
      perfect: []
      past: []
      thirdPresent: []
      comparative: []
      superlative: []
    }
    derivatives: [{
      word: string
      index: number
    }]
    synAnts: {
      synonyms: []
      antonyms: []
    }
    tags: string
    loadState: {
      meaningLoading: boolean
      examplesLoading: boolean
      inflectionLoading: boolean
      structLoading: boolean
      synAntsLoading: boolean
      derivativesLoading: boolean
    }
    passed: boolean
    loadTime: any
    passTime: any
    sort: number
  }
}

declare namespace Loader {
  interface Stat {
    id: string
    sort: number
    passed: number
    viewed: number
    total: number
  }
}