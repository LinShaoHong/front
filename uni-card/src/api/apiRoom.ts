import http from '@/utils/request';

const apiRoom = {
  shuffle: (mainUserId: string, userId: string) => http.get<any>('/room/shuffle', {
    mainUserId: mainUserId,
    userId: userId
  }),

  open: (mainUserId: string, userId: string, index: number, music: boolean) => http.get<any>('/room/open', {
    mainUserId: mainUserId,
    userId: userId,
    index: index,
    music: music
  }),

  close: (mainUserId: string) => http.get<any>('/room/close', {
    mainUserId: mainUserId
  }),

  next: (mainUserId: string, playerId: string) => http.get<any>('/room/next', {
    mainUserId: mainUserId,
    playerId: playerId
  }),

  leave: (mainUserId: string, userId: string) => http.get<any>('/room/leave', {
    mainUserId: mainUserId,
    userId: userId
  }),

  assign: (mainUserId: string, userId: string) => http.get<any>('/room/assign', {
    mainUserId: mainUserId,
    userId: userId
  }),

  players: (mainUserId: string) => http.get<any>('/room/players', {
    mainUserId: mainUserId
  }),

  player: (mainUserId: string) => http.get<any>('/room/player', {
    mainUserId: mainUserId
  }),

  joined: (userId: string) => http.get<any>('/room/joined', {
    userId: userId
  })
};

export default apiRoom;