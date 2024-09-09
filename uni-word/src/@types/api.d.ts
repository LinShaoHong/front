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
        ukAudioId: string
        ukPhonetic: string
        usAudioId: string
        usPhonetic: string
        meaning: {
            nouns: string
            verbs: string
            adjectives: string
            adverbs: string
        }
        examples: [{
            audioId: string
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
        }
        origin: string
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
        differs: []
        collocation: {
            formulas: [{
                en: string
                zh: string
                examples: [{
                    sentence: string
                    translation: string
                }]
            }]
            phrases: [{
                en: string
                zh: string
            }]
        }
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
            originLoading: boolean
            synAntsLoading: boolean
            collocationLoading: boolean
            derivativesLoading: boolean
            differsLoading: boolean
            createTreeLoading: boolean
            mergeTreeLoading: boolean
        }
        passed: boolean
        loadTime: any
        passTime: any
        sort: number
    }

    interface Tree {
        id: string
        root: string
        rootDesc: string
        version: number
        derivatives: [{
            word: string
            index: number
            version: number
            merged: boolean
        }]
    }

    interface Diff {
        meaning: string
        words: [{
            id: string
            word: string
            definition: string
            scenario: string
            examples: [{
                audioId: string
                sentence: string
                translation: string
            }]
        }]
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