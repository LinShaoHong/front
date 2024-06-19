import http from '@/utils/request';

const apiRoom = {
  shuffle: (mainUserId: string, userId: string, hks: boolean, cardType: string) => http.get<any>('/room/shuffle', {
    mainUserId: mainUserId,
    userId: userId,
    hks: hks,
    cardType: cardType
  }),

  open: (mainUserId: string, userId: string, hks: boolean, cardType: string, index: number, music: boolean) => http.get<any>('/room/open', {
    mainUserId: mainUserId,
    userId: userId,
    hks: hks,
    cardType: cardType,
    index: index,
    music: music
  }),

  close: (mainUserId: string, hks: boolean) => http.get<any>('/room/close', {
    mainUserId: mainUserId,
    hks: hks,
  }),

  next: (mainUserId: string, hks: boolean, playerId: string) => http.get<any>('/room/next', {
    mainUserId: mainUserId,
    hks: hks,
    playerId: playerId
  }),

  leave: (mainUserId: string, userId: string, hks: boolean) => http.get<any>('/room/leave', {
    mainUserId: mainUserId,
    userId: userId,
    hks: hks,
  }),

  assign: (mainUserId: string, userId: string, hks: boolean) => http.get<any>('/room/assign', {
    mainUserId: mainUserId,
    userId: userId,
    hks: hks,
  }),

  changeCardType: (mainUserId: string, cardType: string) => http.get<any>('/room/changeCardType', {
    mainUserId: mainUserId,
    cardType: cardType
  }),

  reply: (mainUserId: string, userId: string, message: string) => http.post<any>('/room/reply', {
    mainUserId: mainUserId,
    userId: userId,
    message: message
  }),

  withdrawReply: (mainUserId: string, userId: string, chatId: string) => http.get<any>('/room/withdrawReply', {
    mainUserId: mainUserId,
    userId: userId,
    chatId: chatId
  }),

  byReplyId: (mainUserId: string, chatId: string) => http.get<any>('/room/byReplyId', {
    mainUserId: mainUserId,
    chatId: chatId
  }),

  replies: (mainUserId: string) => http.get<any>('/room/replies', {
    mainUserId: mainUserId
  }),

  players: (mainUserId: string, hks: boolean) => http.get<any>('/room/players', {
    mainUserId: mainUserId,
    hks: hks,
  }),

  player: (mainUserId: string, hks: boolean) => http.get<any>('/room/player', {
    mainUserId: mainUserId,
    hks: hks,
  }),

  total: (mainUserId: string, cardType: string) => http.get<any>('/room/total', {
    mainUserId: mainUserId,
    cardType: cardType,
  }),

  joined: (userId: string, hks: boolean) => http.get<any>('/room/joined', {
    userId: userId,
    hks: hks,
  })
};

export default apiRoom;