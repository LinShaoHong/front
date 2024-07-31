import http from '@/utils/request';

const apiLoader = {
  loadPart: (id: string, part: string, userId: number) => http.get<Word.Dict>('/loader/part', {
    word: id,
    part: part,
    userId: userId
  }),

  removePart: (id: string, part: string, path: string, userId: number) => http.get<Word.Dict>('/loader/remove', {
    word: id,
    part: part,
    path: path,
    userId: userId
  }),

  pass: (id: string) => http.get<Word.Dict>('/loader/pass', { word: id }),

  stat: (date: string, userId: number) => http.get<Loader.Stat>('/loader/stat', { date: date, userId: userId }),

  stats: (userId: number) => http.get<Loader.Stat>('/loader/stats', { userId: userId }),

  dicts: (date: string) => http.get<Word.Dict>('/loader/dicts', { date: date }),

  dict: (date: string, sort: any, userId: number) => http.get<Word.Dict>('/loader/dict', {
    date: date,
    sort: sort,
    userId: userId
  })
};

export default apiLoader;