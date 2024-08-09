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

  removePart: (id: string, part: string, path: string, userId: number) => http.get<Word.Dict>('/loader/remove/part', {
    word: id,
    part: part,
    path: path,
    userId: userId
  }),

  remove: (id: string) => http.get<Word.Dict>('/loader/remove', { word: id }),

  editStruct: (id: string, struct: any) => http.post<any>('/loader/edit/struct', {
    id: id,
    struct: struct
  }),

  editMeaning: (id: string, meaning: any) => http.post<any>('/loader/edit/meaning', {
    id: id,
    meaning: meaning
  }),

  moveDerivative: (id: string, word: string, op: string) => http.get<any>('/loader/move/derivative', {
    id: id,
    word: word,
    op: op
  }),

  pass: (id: string) => http.get<Word.Dict>('/loader/pass', { word: id }),

  stat: (date: string, userId: number) => http.get<Loader.Stat>('/loader/stat', { date: date, userId: userId }),

  stats: (userId: number) => http.get<Loader.Stat>('/loader/stats', { userId: userId }),

  dicts: (date: string) => http.get<Word.Dict>('/loader/dicts', { date: date }),

  dict: (date: string, sort: any, userId: number) => http.get<Word.Dict>('/loader/dict', {
    date: date,
    sort: sort,
    userId: userId
  }),

  affix: (id: string) => http.get<any>('/loader/affix', {
    word: id
  })
};

export default apiLoader;