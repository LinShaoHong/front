import http from '@/utils/request';

const apiLoader = {
    loadAll: (words: string, userId: number) => http.get<any>('/loader/all', {
        words: words,
        userId: userId
    }),

    loadPart: (id: string, part: string, attr: any, userId: number) => http.post<any>('/loader/part', {
        word: id,
        part: part,
        attr: attr,
        userId: userId
    }),

    removePart: (id: string, part: string, path: string, attr: any, userId: number) => http.post<Word.Dict>('/loader/remove/part', {
        word: id,
        part: part,
        path: path,
        attr: attr,
        userId: userId
    }),

    remove: (id: string) => http.get<Word.Dict>('/loader/remove', {word: id}),

    editStruct: (id: string, struct: any) => http.post<any>('/loader/edit/struct', {
        id: id,
        struct: struct
    }),

    editMeaning: (id: string, meaning: any) => http.post<any>('/loader/edit/meaning', {
        id: id,
        meaning: meaning
    }),

    moveDerivative: (id: string, version: number, word: string, op: string) => http.get<any>('/loader/move/derivative', {
        id: id,
        version: version,
        word: word,
        op: op
    }),

    addDerivative: (id: string, word: string, input: string, version: number) => http.get<Word.Tree>('/loader/add/derivative', {
        id: id,
        word: word,
        input: input,
        version: version
    }),

    pass: (id: string) => http.get<Word.Dict>('/loader/pass', {word: id}),

    stat: (date: string, userId: number) => http.get<Loader.Stat>('/loader/stat', {date: date, userId: userId}),

    stats: (userId: number) => http.get<Loader.Stat>('/loader/stats', {userId: userId}),

    dicts: (date: string) => http.get<Word.Dict>('/loader/dicts', {date: date}),

    search: (q: string) => http.get<Word.Dict>('/loader/search', {q: q}),

    dict: (date: string, sort: any, userId: number) => http.get<Word.Dict>('/loader/dict', {
        date: date,
        sort: sort,
        userId: userId
    }),

    affix: (id: string) => http.get<any>('/loader/affix', {
        word: id
    }),

    differs: (id: string) => http.get<Word.Diff>('/loader/differs', {
        word: id
    }),

    trees: (root: string) => http.get<Word.Tree>('/loader/trees', {
        root: root
    }),

    findTree: (word: string) => http.get<Word.Tree>('/loader/findTree', {
        word: word
    }),

    createTree: (word: string) => http.get<Word.Tree>('/loader/createTree', {word: word}),

    mergeTree: (treeId: string, word: string) => http.get<Word.Tree>('/loader/mergeTree', {treeId: treeId, word: word}),

    editTreeDesc: (treeId: string, desc: string, version: number) => http.get<Word.Tree>('/loader/editTreeDesc', {
        treeId: treeId,
        desc: desc,
        version: version
    })
};

export default apiLoader;