<template>
  <div
    :class="classObj"
  >
    <div
      v-if="mobile"
      class="mobile-top-header"
    >
      <div class="mobile-hamburger">
        <hamburger
          :is-active="sidebar.opened"
          class="hamburger-container"
          @toggleClick="toggleSideBar"
        />
      </div>
      <div class="search">
        <input
          v-model="q"
          class="search-input"
          placeholder="搜索"
          @keyup="pressSearch"
        >
        <button
          class="search-button"
          @click="search"
        >
          <i class="el-icon-search" />
        </button>
      </div>
      <div
        class="search-svg"
      >
        <svg-icon
          name="search"
          width="25"
          height="25"
          @click="showSearchBtn"
        />
      </div>
    </div>
    <div v-else style="height: 99%">
      <div
        class="desk-top-header"
      >
        <div>
          <a
            itemprop="url"
            href="/"
            onclick="ga('send', 'event', 'Header', 'click', 'Logo');"
          >
            <img
              :src="logo+'?imageView2/1/w/80/h/80'"
              class="logo"
            >
          </a>
        </div>
        <div class="search">
          <input
            v-model="q"
            class="search-input"
            placeholder="搜索"
            @keyup="pressSearch"
          >
          <button
            class="search-button"
            @click="search"
          >
            <i class="el-icon-search" />
          </button>
        </div>
        <div
          v-if="messageVisible"
          class="drawer-bg"
          @click="handleMessageOutside"
        ></div>
        <div v-if="user === null" class="login-register">
          <el-button type="primary" @click="toLogin" size="mini" style="margin-right: 10px;">登錄</el-button>
          <el-button type="primary" @click="toRegister" size="mini">注冊</el-button>
        </div>
        <div v-else style="z-index: 18;">
          <div style="float: left; z-index: 10; margin-right: 30px;">
            <div style="display: inline-block; position: relative; margin-left: 5px;">
              <div style="display: flex; align-items: center; height: 38px;">
                <svg-icon
                  name="message"
                  style="color: #f90; font-size: 25px; cursor: pointer;"
                  @click="showMessages"
                ></svg-icon>
              </div>
              <span class="message-num" v-show="unReads > 0">{{ unReads }}</span>
              <div
                v-show="messageVisible"
                class="message-menu"
              >
                <div class="message-menu-header">
                  <div :class="isComment? 'message-menu-header__comment active' : 'message-menu-header__comment'"
                       @click="isComment = !isComment"
                  >
                    評論
                    <span class="message-comment-num" v-show="commentUnReads > 0">{{ commentUnReads }}</span>
                  </div>
                  <div :class="isComment? 'message-menu-header__notice' : 'message-menu-header__notice active'"
                       @click="isComment = !isComment"
                  >
                    通知
                    <span class="message-comment-num" v-show="noticeUnReads > 0">{{ noticeUnReads }}</span>
                  </div>
                </div>
                <div
                  v-show="isComment"
                  id="message-comment-menu-list"
                  class="message-menu-list"
                >
                  <div v-for="(item, i) in commentMessages"
                  >
                    <div
                      :class="i < (messages.length - 1)? 'message-item bottom-solid' : 'message-item'"
                      @click="doRead(item.read, item.id)"
                    >
                      <div class="message-item-header">
                        <div v-if="!item.read" style="width: 6px; height: 6px; border-radius: 3px; background-color: red"></div>
                      </div>
                      <div class="message-item-content">
                        <div style="float: left; height: 17px; padding-top: 2px;">
                          <img v-if="item.avatar" style="width: 15px; height: 15px; margin-right: 5px;" class="avatar" :src="SERVER + item.avatar">
                        </div>
                        <span style="color: #f90; font-size: 15px; margin-right: 2px;">
                      {{ item.system? '系統消息: ' : item.commentatorName }}</span>
                        <span v-if="!item.system" style="color: whitesmoke; font-size: 12px; margin-right: 2px;">&nbsp;{{ item.time }}</span><br/>
                        <a v-if="!item.system" class="message-reply-content"
                           href="#"
                           @click="toComment(item.girlId, item.id)">{{ item.content }}</a>
                        <span v-if="item.system" style="color: whitesmoke">{{ item.content }}</span>
                      </div>
                      <div v-if="!item.system" class="message-item-reply">
                        <span @click="openReply(item.sessionId, item.id, item.commentatorName)">回複</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-show="!isComment"
                  id="message-notice-menu-list"
                  class="message-menu-list"
                >
                  <div v-for="(item, i) in noticeMessages"
                  >
                    <div
                      :class="i < (messages.length - 1)? 'message-item bottom-solid' : 'message-item'"
                      @click="doRead(item.read, item.id)"
                    >
                      <div class="message-item-header">
                        <div v-if="!item.read" style="width: 6px; height: 6px; border-radius: 3px; background-color: red"></div>
                      </div>
                      <div class="message-item-content">
                        <span style="color: #f90; font-size: 15px; margin-right: 2px;">
                      {{ item.system? '西子夭夭' : item.commentatorName }}</span><br/>
                        <span v-if="!item.system" style="color: whitesmoke; font-size: 12px; margin-right: 2px;">&nbsp;{{ item.time + ': ' }}</span>
                        <a v-if="!item.system" class="message-reply-content"
                           href="#"
                           @click="toComment(item.girlId, item.id)">{{ item.content }}</a>
                        <span v-if="item.system" style="color: whitesmoke">{{ item.content }}</span>
                      </div>
                      <div v-if="!item.system" class="message-item-reply">
                        <span @click="openReply(item.sessionId, item.id, item.commentatorName)">回复</span>
                      </div>
                    </div>
                  </div>
                </div>
                <el-dialog
                  :modal-append-to-body="false"
                  :visible.sync="replayVisible"
                  width="30%"
                >
                  <textarea
                    v-model="replyContent"
                    class="comment-text"
                    style="font-size: 13px; height: 100px;"
                    :placeholder="replyTitle">
                  </textarea>
                    <span slot="footer" class="dialog-footer">
                    <el-button @click="replayVisible = false" size="mini">取 消</el-button>
                    <el-button type="primary" @click="doReply()" size="mini">回 複</el-button>
                    </span>
                </el-dialog>
              </div>
            </div>
          </div>
          <div style="float: right; cursor: pointer;">
            <el-dropdown
              class="avatar-container right-menu-item hover-effect"
              trigger="click"
            >
              <div class="avatar-wrapper">
                <img v-if="user.avatar" class="user-avatar" :src="SERVER + user.avatar">
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="avatar-header" style="cursor: default;">
                  <span style="display:block; font-size: 10px;">{{ user.name }}</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span style="display:block; cursor: pointer;" @click="toUserDetail(1)"><i class="el-icon-s-custom"></i>我的主頁</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span style="display:block; cursor: pointer;" @click="toUserDetail(2)"><i class="el-icon-collection"></i>我的收藏</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span style="display:block; cursor: pointer;" @click="toUserDetail(3)"><i class="el-icon-view"></i>最近浏覽</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span style="display:block; cursor: pointer;" @click="toUserDetail(4)"><i class="el-icon-money"></i>金幣收支</span>
                </el-dropdown-item>
                <el-dropdown-item style="border-top: solid 1px #2F2F2F;">
                   <span style="display:block;" @click="logout"> <i class="el-icon-remove"></i>退出</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="desk-menu">
        <router-link v-for="(v, i) in menus"
                     :to="v.path"
                     :class="actives[i]? 'desc-menu-item active' : 'desc-menu-item'"
                     @click.native="changeMenu(i)"
        >
          <div><span class="menu-text">{{ v.label }}</span></div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { isExternal } from '@/utils/validate'
import { DeviceType, AppModule } from '@/store/modules/app'
import { slider } from '@/utils/mobile'
import { UserModule } from '@/store/modules/user'
import { MenuModule } from '@/store/modules/menu'
import { MessageModule } from '@/store/modules/message'
import Hamburger from '@/components/Hamburger/index.vue'
import ErrorLog from '@/components/ErrorLog/index.vue'
import LangSelect from '@/components/LangSelect/index.vue'
import { constantRoutes } from '@/router'
import { logout } from '@/api/session'
import { info } from '@/api/user'
import { read, readAll, replyMessage, reply } from '@/api/comment'
import Pagination from '@/components/Pagination/index.vue'
import Cookies from 'js-cookie'

@Component({
  name: 'Navbar',
  components: {
    ErrorLog,
    LangSelect,
    Hamburger,
    Pagination
  }
})
export default class extends Vue {
  private SERVER = process.env.VUE_APP_IMAGE_SERVER
  private actives: boolean[] = []
  private width = 0
  private hideSearch = true
  private q: string = ''
  private routes = constantRoutes.filter(v => !v.meta.hidden)
  private messageCount: number = 20
  private commentStart: number = 0
  private noticeStart: number = 0
  private messageVisible: boolean = false
  private loadCommentMessageAll: boolean = false
  private loadNoticeMessageAll: boolean = false
  private addedMessageScroll: boolean = false

  private replayVisible: boolean = false
  private sessionId: string = ''
  private replyId: string = ''
  private replyTitle: string = ''
  private replyContent = ''

  private isComment: boolean = true

  get classObj() {
    return {
      navbar: true,
      hideSearch: this.hideSearch,
      openSearch: !this.hideSearch,
      mobile: AppModule.device === DeviceType.Mobile
    }
  }

  get logo() {
    return require('../../../assets/logo.jpg')
  }

  get mobile() {
    return AppModule.device === DeviceType.Mobile
  }

  get sidebar() {
    return AppModule.sidebar
  }

  get user() {
    return UserModule.user
  }

  get menus() {
    return MenuModule.menus
  }

  get messages() {
    return this.isComment?  MessageModule.comment.messages : MessageModule.notice.messages
  }

  get unReads() {
    return MessageModule.comment.unReads + MessageModule.notice.unReads
  }

  get commentMessages() {
    return MessageModule.comment.messages
  }

  get noticeMessages() {
    return MessageModule.notice.messages
  }

  get commentUnReads() {
    return MessageModule.comment.unReads
  }

  get noticeUnReads() {
    return MessageModule.notice.unReads
  }

  get commentTotal() {
    return MessageModule.comment.total
  }

  get noticeTotal() {
    return MessageModule.notice.total
  }

  private changeMenu(index: number) {
    MenuModule.SET_INDEX(index)
    if (MenuModule.index === index) {
      this.toIndex(index)
    }
  }

  get index() {
    return MenuModule.index
  }

  @Watch('index')
  toIndexedMenu(index: number) {
    this.toIndex(index)
  }

  private toIndex(index: number) {
    for (let i = 0; i < this.menus.length; i++) {
      if (i !== index) {
        this.$set(this.actives, i, false)
      } else {
        this.$set(this.actives, i, true)
      }
    }
  }

  private async logout() {
    await logout()
    UserModule.Set(null)
    MessageModule.Clear()
    this.toIndex(0)
    this.$router.push({ path: '/' })
  }

  private toLogin() {
    MenuModule.SetIndex(-1)
    this.$router.push({ path: '/user/login' })
  }

  private toRegister() {
    MenuModule.SetIndex(-1)
    this.$router.push({ path: '/user/register' })
  }

  private toUserDetail(name) {
    MenuModule.ToMenu('/user/detail')
    window.open(window.location.origin + '/#/user/detail?name=' + name)
  }

  private async search() {
    if (this.q !== null && this.q.trim().length > 0) {
      this.$router.push({ path: '/girl/search', query: { q: this.q.trim() } })
    } else {
      this.$router.push({ path: '/' })
    }
  }

  private pressSearch(e: KeyboardEvent) {
    if (e.code === 'Enter') {
      this.search()
    }
  }

  private showSearchBtn() {
    this.hideSearch = false
  }

  private toggleSideBar() {
    AppModule.ToggleSideBar(false)
  }

  private resolvePath(basePath: string, routePath: string) {
    if (isExternal(routePath)) {
      return routePath
    }
    if (isExternal(basePath)) {
      return basePath
    }
    return path.resolve(basePath, routePath)
  }

  private async loadUser() {
    const user = await info()
    UserModule.Set(user.value)
  }

  private handleMessageOutside() {
    this.messageVisible = false
  }

  private showMessages() {
    this.messageVisible = !this.messageVisible
    if (this.messageVisible && !this.addedMessageScroll) {
      this.loadMessageWhenScroll()
    }
  }

  private async getMessages(isComment: boolean) {
    if (UserModule.user !== null && (isComment? !this.loadCommentMessageAll : !this.loadNoticeMessageAll)) {
      const start = isComment? this.commentStart : this.noticeStart
      await MessageModule.GetMessages({ start: start, count: this.messageCount, isComment: isComment })
      if (start + this.messageCount >= (isComment? this.commentTotal : this.noticeTotal)) {
        if (isComment) {
          this.loadCommentMessageAll = true
        } else {
          this.loadNoticeMessageAll = true
        }
      } else {
        if (isComment) {
          this.commentStart += this.messageCount
        } else {
          this.noticeStart += this.messageCount
        }
      }
    }
  }

  private async doRead(isRead: boolean, id: string) {
    if (!isRead) {
      const data = await read(id)
      if (data.code === 200) {

        const m = this.isComment? this.commentMessages.find(v => v.id === id) : this.noticeMessages.find(v => v.id === id)
        if (m) {
          m.read = true
          MessageModule.decUnReads(this.isComment)
        }
      }
    }
  }

  private loadMessageWhenScroll() {
    let e1 = document.getElementById('message-comment-menu-list')
    let e2 = document.getElementById('message-notice-menu-list')
    let interval = setTimeout(() => {
      e1 = document.getElementById('message-comment-menu-list')
      e2 = document.getElementById('message-notice-menu-list')
      if (e1 !== null && e2 != null) {
        clearInterval(interval)
        Array(e1, e2).forEach(ele => {
          ele.onscroll = (e: Event) => {
            if (UserModule.user !== null) {
              let scrollTop = ele.scrollTop
              let clientHeight = ele.clientHeight
              let scrollHeight = ele.scrollHeight
              if(scrollHeight > clientHeight && scrollTop + clientHeight === scrollHeight) {
                this.getMessages(this.isComment)
              }
            }
          }
        })
      }
    }, 500)
  }

  private toComment(girlId: string, commentId: string) {
    window.open(window.location.origin + '/#/girl/detail?liked=false&id=' + girlId+"&commentId="+commentId)
  }

  private fetchMessage() {
    setInterval(async() => {
      const latestId = this.commentMessages.length > 0? this.commentMessages[0].id : null
      if (UserModule.user !== null && this.commentMessages.length > 0) {
        const data = await replyMessage({ start: 0, count: 20, latestId: latestId, isComment: true })
        if (data.code === 200) {
          if (data.value.messages.length > 0) {
            MessageModule.PrependMessages({ isComment: true, messages: data.value.messages })
          }
        }
      }
    }, 10000)


    setInterval(async() => {
      const latestId = this.noticeMessages.length > 0? this.noticeMessages[0].id : null
      if (UserModule.user !== null && this.noticeMessages.length > 0) {
        const data = await replyMessage({ start: 0, count: 20, latestId: latestId, isComment: false })
        if (data.code === 200) {
          if (data.value.messages.length > 0) {
            MessageModule.PrependMessages({ isComment: false, messages: data.value.messages })
          }
        }
      }
    }, 60000 * 10)
  }

  private openReply(sessionId: string, replyId: string, userName: string) {
    if (this.user === null) {
      window.open(window.location.origin + '/#/user/login')
    } else {
      this.replayVisible = true
      this.sessionId = sessionId
      this.replyId = replyId
      this.replyTitle = '正在回複 ' + userName + '\n\n友善評論，不可泄漏本教師的聯系或下載方式，若發現將按封號處理，多謝配合'
    }
  }

  private async doReply() {
    await reply(this.replyId, { content: this.replyContent })
    this.replayVisible = false
    this.replyId = ''
    this.sessionId = ''
    this.replyTitle = ''
    this.replyContent = ''
  }

  created() {
    const q = this.$route.query.q as string
    if (q !== null && q !== undefined) {
      this.q = q
    }
    for (let i = 0; i < this.menus.length; i++) {
      if (this.menus[i].path === this.$route.path) {
        this.actives[i] = true
      }
    }
    if (UserModule.user != null) {
      this.loadUser()
      this.getMessages(true)
      this.getMessages(false)
    }
    this.loadMessageWhenScroll()
    this.fetchMessage()
  }

  mounted() {
    slider(window.document.body, false, (x, y) => {
      if (y > 25 || y < -25) {
        this.hideSearch = true
      }
    })
  }
}
</script>

<style lang="less">
.navbar {
  height: 130px;
  position: relative;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: #1b1b1b;
}

.search {
  .search-input {
    width: 100%;
    margin-left: 0;
    display: inline-block;
    color: #cacaca;
    background: #363636;
    border-radius: 3px 0 0 3px;
    outline: 0;
    border: none;
    padding: 2px 5px;
    vertical-align: top;
    cursor: text;
    font-size: 14px;
    height: 30px;
    border-left: 1px solid #757575;
    border-bottom: 1px solid #757575;
    border-top: 1px solid #757575;
    transition: all .5s ease;
  }

  .search-input:focus {
    outline-offset: -2px;
    transition: .1s;
    box-shadow: 0 0 0.1rem #c2c2c2;
  }

  .search-input:focus + .search-button {
    box-shadow: 0 0 0.1rem #f90;
  }

  .search-button {
    height: 30px;
    width: 100%;
    cursor: pointer;
    background: #f90;
    outline: 0;
    outline-offset: -2px;
    border: 0;
    transition: all .5s ease;

    .el-icon-search {
      margin: 0 auto;
    }
  }
}

.desk-top-header {
  width: 100%;
  display: grid;
  height: 80%;
  grid-template-columns: 1fr 3fr 1fr;
  grid-column-gap: 5px;
  justify-items: center;
  align-items: center;
  margin: auto;

  .search {
    width: 40%;
    display: grid;
    grid-template-columns: 8fr 2fr;

    .search-input {
      min-width: 100px;
    }
  }
}

.desk-menu {
  height: 22%;
  width: 100%;
  display: inline-grid;
  grid-template-columns: repeat(7, 1fr);
  vertical-align: center;

  .active {
    border-bottom: solid #f90;
  }

  .desc-menu-item {
    cursor: pointer;
    text-align: center;
    border-radius: 2px;
    padding-top: 5px;

    &:hover {
      background: #363636;
    }

    .menu-text {
      color: whitesmoke;
    }
  }
}

.mobile {
  .mobile-top-header {
    height: 100%;
    display: grid;
    grid-template-columns: 50px auto 50px;
    grid-column-gap: 10px;
    justify-items: center;
    align-items: center;
  }

  .mobile-hamburger {
    .hamburger-container {
      height: 100%;
      padding: 0 15px;
      cursor: pointer;
      transition: background .3s;
      border-right: 1px solid #000;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }
  }

  .search-svg {
    cursor: pointer;
    padding: 0 15px;
    margin-right: 2px;
    border-left: 1px solid #000;

    .svg-icon {
      vertical-align: middle;
      color: #f90;
    }
  }

  .search {
    width: 85%;
    margin: 10px auto auto;
    transition: transform .38s;
    .search-input {
      width: 80%;
    }

    .search-button {
      width: 20%;
    }
  }

  &.openSearch {
    .search {
    }
  }

  &.hideSearch {
    .search {
      pointer-events: none;
      transition-duration: 2s;
      transform: translate3d(0, -300px, 0);
    }
  }
}

.message-num {
  position: absolute;
  bottom: 50%;
  left: 50%;
  padding: 0 4px;
  font-size: 11px;
  color: #fff;
  background-color: #f1403c;
  border: 2px solid #fff;
  border-radius: 20px;
  cursor: pointer;
}

.message-comment-num {
  position: absolute;
  bottom: 40%;
  left: 58%;
  padding: 0 4px;
  font-size: 11px;
  color: #fff;
  background-color: #f1403c;
  border: 1px solid #fff;
  border-radius: 20px;
  cursor: pointer;
}

.drawer-bg {
  background: transparent;
  opacity: 0.5;
  width: 100%;
  top: 0;
  height: 100%;
  position: fixed;
  z-index: 9;
  margin-left: 0 !important;
}

.message-menu {
  position: absolute;
  top: 45px;
  left: -430px;
  z-index: 10;
  margin: 5px 0;
  background-color: #1b1b1b;
  border: 1px solid #f90;
  border-radius: 2px;
  -webkit-box-shadow: 0 2px 12px 0 #f90;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .message-menu-header {
    width: 430px;
    background-color: #1b1b1b;
    display: grid;
    margin-bottom: 10px;
    grid-template-columns: repeat(2, 1fr);
    border-bottom: solid 1px #363636;

    .message-menu-header__comment {
      grid-column: 1 / 2 ;
      height: 30px;
      cursor: pointer;
      align-content: center;
      display: flex;
      align-items: center;
      justify-content: center;
      color: whitesmoke;
      position: relative;

      &.active {
        background-color: #363636;
      }
    }

    .message-menu-header__notice {
      grid-column: 2 / 3 ;
      height: 30px;
      cursor: pointer;
      align-content: center;
      display: flex;
      align-items: center;
      justify-content: center;
      color: whitesmoke;
      position: relative;

      &.active {
        background-color: #363636;
      }
    }
  }

  .message-menu-list {
    height: 450px;
    overflow-y: scroll;
    scrollbar-width: none;
    width: 430px;

    .message-item {
      border-radius: 3px;
      display: grid;
      grid-template-columns: 30px 350px 50px;
      padding-top: 10px;
      padding-bottom: 10px;

      .message-item-header {
        grid-column: 1 / 2;
        display: flex;
        align-items: center;
        justify-content: center;

        white-space:normal;
        word-break:break-all;
        word-wrap:break-word;
      }

      .message-item-content {
        grid-column: 2 / 3;
        justify-content: flex-start;
        white-space:normal;
        word-break:break-all;
        word-wrap:break-word;
        padding-right: 2px;
        line-height: 20px;

        .message-reply-content {
          color: whitesmoke;
          font-size: 15px;
          cursor: pointer;
        }

        .message-reply-content:visited {
          color: whitesmoke;
        }

        .message-reply-content:hover {
          color: #f90;
        }
      }

      .message-item-reply {
        grid-column: 3 / 4;
        display: flex;
        align-items: center;
        justify-content: center;

        span {
          color: #f90;
          font-size: 13px;
          cursor: pointer;
        }
      }

      &.bottom-solid {
        border-bottom: solid 1px #2F2F2F;
      }
    }

    .message-item:hover {
      background-color: #363636;
    }
  }
}

.comment-text {
  resize: none;
  border: none;
  width: 100%;
  height: 80px;
  word-break: break-all;
}

.comment-text:focus {
  outline: none !important;
  border-color: #719ECE;
  box-shadow: 0 0 10px #719ECE;
}

.el-dialog__header {
  display: none;
}

.el-dialog__body {
  border-top: solid 1px #f90;
  background-color: #101010;
  border-left: solid 1px #f90;
  border-right: solid 1px #f90;
  padding: 14px 10px 2px;
}

.el-dialog__footer {
  background-color: #101010;
  border-bottom: solid 1px #f90;
  border-left: solid 1px #f90;
  border-right: solid 1px #f90;
}

.el-dialog__headerbtn {
  display: none;
}

.user-avatar {
  width: 36px;
  height: 36px;
}
.el-dropdown-menu {
  background-color: #101010;
  border: solid 1px #f90;

  li.el-dropdown-menu__item:hover {
    background-color: #101010;
  }

  li.avatar-header:hover {
    background-color: #101010;
  }
}

.el-popper[x-placement^=bottom] .popper__arrow {
  display: none;
}

.el-dropdown-menu__item {
  color: whitesmoke;
}

.logo {
  width: 200px;
  height: 90px;
}
</style>
