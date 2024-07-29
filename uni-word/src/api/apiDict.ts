import http from '@/utils/request';

const apiDict = {
  byId: (id: string) => http.get<Word.Dict>('/dict/' + id, null)
};

export default apiDict;
