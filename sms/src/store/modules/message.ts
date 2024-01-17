import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import { replyMessage } from '@/api/comment'

export interface IMessage {
  id: string
  sessionId: string
  girlId: string
  content: string
  avatar: string
  commentatorId: string
  commentatorName: string
  replierId: string
  time: string
  read: boolean
  system: boolean
}

export interface IMessageItem {
  total: number
  unReads: number
  messages: IMessage[]
}


export interface IMessageState {
  comment: IMessageItem
  notice: IMessageItem
}

@Module({ dynamic: true, store, name: 'messages' })
class Messages extends VuexModule implements IMessageState {
  public comment: IMessageItem = {
    total: 0,
    unReads: 0,
    messages: []
  }

  public notice: IMessageItem = {
    total: 0,
    unReads: 0,
    messages: []
  }

  @Mutation
  private SET_TOTAL(payload: { isComment: boolean, total: number }) {
    if (payload.isComment) {
      this.comment.total = payload.total
    } else {
      this.notice.total = payload.total
    }
  }

  @Mutation
  private SET_UN_READS(payload: { isComment: boolean, unReads: number }) {
    if (payload.isComment) {
      this.comment.unReads = payload.unReads
    } else {
      this.notice.unReads = payload.unReads
    }
  }

  @Mutation
  private SET_MESSAGES(payload: { isComment: boolean, messages: IMessage[] }) {
    if (payload.isComment) {
      this.comment.messages.push(...payload.messages)
    } else {
      this.notice.messages.push(...payload.messages)
    }
  }

  @Mutation
  private PREPEND_MESSAGES(payload: { isComment: boolean, messages: IMessage[] }) {
    if (payload.isComment) {
      this.comment.messages.unshift(...payload.messages)
      this.comment.unReads += payload.messages.filter(v => !v.read).length
      this.comment.total += payload.messages.length
    } else {
      this.notice.messages.unshift(...payload.messages)
      this.notice.unReads += payload.messages.filter(v => !v.read).length
      this.notice.total += payload.messages.length
    }
  }

  @Mutation
  private CLEAR() {
    this.comment.total = 0
    this.comment.unReads = 0
    this.comment.messages = []

    this.notice.total = 0
    this.notice.unReads = 0
    this.notice.messages = []
  }

  @Action
  public async GetMessages(payload: { start: number, count: number, isComment: boolean }) {
    const data = await replyMessage({ start: payload.start, count: payload.count, isComment: payload.isComment })
    if (data.code === 200) {
      this.SET_TOTAL({ isComment: payload.isComment, total: data.value.total })
      this.SET_UN_READS({ isComment: payload.isComment, unReads: data.value.unReads })
      this.SET_MESSAGES({ isComment: payload.isComment, messages: data.value.messages })
    }
  }

  @Action
  public PrependMessages(payload: { isComment: boolean, messages: IMessage[] }) {
    this.PREPEND_MESSAGES(payload)
  }

  @Action
  public decUnReads(isComment: boolean) {
    const c =  (isComment? this.comment.unReads : this.notice.unReads) - 1
    this.SET_UN_READS({ isComment: isComment, unReads: c })
  }

  @Action
  public clearUnReads() {
    this.SET_UN_READS({ isComment: true, unReads: 0 })
    this.SET_UN_READS({ isComment: false, unReads: 0 })
  }

  @Action
  public Clear() {
    this.CLEAR()
  }
}

export const MessageModule = getModule(Messages)
