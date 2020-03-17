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

export interface IMessageState {
  total: number
  unReads: number
  messages: IMessage[]
}

@Module({ dynamic: true, store, name: 'messages' })
class Messages extends VuexModule implements IMessageState {
  public total: number = 0
  public unReads: number = 0
  public messages: IMessage[] = []

  @Mutation
  private SET_TOTAL(total: number) {
    this.total = total
  }

  @Mutation
  private SET_UN_READS(unReads: number) {
    this.unReads = unReads
  }

  @Mutation
  private SET_MESSAGES(messages: IMessage[]) {
    this.messages.push(...messages)
  }

  @Mutation
  private PREPEND_MESSAGES(ms: IMessage[]) {
    this.messages.unshift(...ms)
    this.unReads += ms.filter(v => !v.read).length
    this.total += ms.length
  }

  @Mutation
  private CLEAR() {
    this.total = 0
    this.unReads = 0
    this.messages = []
  }

  @Action
  public async GetMessages(payload: { start: number, count: number }) {
    const data = await replyMessage({ start: payload.start, count: payload.count })
    if (data.code === 200) {
      this.SET_TOTAL(data.value.total)
      this.SET_UN_READS(data.value.unReads)
      this.SET_MESSAGES(data.value.messages)
    }
  }

  @Action
  public PrependMessages(ms: IMessage[]) {
    this.PREPEND_MESSAGES(ms)
  }

  @Action
  public decUnReads() {
    this.SET_UN_READS(this.unReads - 1)
  }

  @Action
  public clearUnReads() {
    this.SET_UN_READS(0)
  }

  @Action
  public Clear() {
    this.CLEAR()
  }
}

export const MessageModule = getModule(Messages)
