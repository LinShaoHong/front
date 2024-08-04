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
    ukPhonetic: string
    usPhonetic: string
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
    phrases:[{
      en: string,
      zh: string
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
      phrasesLoading: boolean
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
    date: string
    sort: number
    passed: number
    viewed: number
    total: number
  }
}