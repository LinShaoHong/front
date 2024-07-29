import http from '@/utils/request';

const apiLoader = {
  loadPart: (id: string, part: string) => http.get<Word.Dict>('/loader/part', { word: id, part: part }),

  removePart: (id: string, part: string, path: string) => http.get<Word.Dict>('/loader/remove', {
    word: id,
    part: part,
    path: path
  }),

  pass: (id: string) => http.get<Word.Dict>('/loader/pass', { word: id }),

  stat: (date: string) => http.get<Loader.Stat>('/loader/stat', { date: date }),

  stats: () => http.get<Loader.Stat>('/loader/stats', null),

  dicts: (date: string) => http.get<Word.Dict>('/loader/dicts', { date: date }),

  byDate: (date: string, sort: any) => http.get<Word.Dict>('/loader/byDate', { date: date, sort: sort })
};

export default apiLoader;