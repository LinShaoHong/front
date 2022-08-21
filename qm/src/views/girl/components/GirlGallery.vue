<template>
  <div
    :class="mobile ? 'image-viewer mobile' : 'image-viewer'"
  >
    <div class="image-viewer-container">
      <div
        v-show="!mobile"
        class="preview-list"
        id="preview-list"
      >
        <span class="gallery-span">{{ '相冊 (共' + currImage.detailImages.length + '張)' }}</span>
        <div
          id="previewList"
          class="preview-container"
        >
          <div
            v-for="(url, index) in urls"
            :key="'preview:' + index"
            class="preview-item"
          >
            <img
              :id="'preview:' + index"
              v-lazy="url"
              :class="actives[index] ? 'active': ''"
              @click="preview(index)"
            >
            <div style="display: flex; justify-content: center">
              <span :style="'color: ' + (actives[index] ? '#5AA766;' : '#f90;') + 'margin: auto; font-size: 14px;'">{{ index + 1 }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="main-image-info"
      >
        <div class="girl-info">
          <div class="info-label">名稱:</div>
          <div class="info-value">{{ currImage.name }}</div>
          <div class="info-label">描述:</div>
          <div class="info-value">{{ currImage.title }}</div>
          <div class="info-label">地區:</div>
          <div class="info-value">{{ currImage.city === null? '暫無' : currImage.city }}</div>
          <div class="info-label">消耗金幣:</div>
          <div class="info-value">{{ currImage.price }}</div>
          <div class="info-label">{{ contactLabel }}</div>
          <div v-if="currImage.accessible" class="info-value">
            <div>
            {{ contactValue }}
            <div v-show="currImage.type === 'QM'" style="margin-top: 3px;">温馨提示: 加妹子时最好备注【上课的】，若账号被封加不上，可评论区留言，平台会更新联系方式或补偿金币，并通知到您！</div>
            </div>
          </div>
          <div v-else-if="!currImage.onService" class="info-value">該教師已下課</div>
          <div v-else-if="currImage.needCharge" class="info-value">
            <el-button type="primary"
                       @click="recharge"
                       size="mini"
            >您金幣不足，點擊充值</el-button>
          </div>
          <div v-else class="info-value">
            <el-button type="primary"
                       @click="buy"
                       size="mini"
            >點擊購買</el-button>
          </div>
        </div>
        <div class="main-image">
          <div v-if="videos.length > 0">
            <el-tabs v-model="activeTab"
                     @tab-click="handleTab">
              <el-tab-pane v-if="currImage.type !== 'VIDEO' || !currImage.accessible " label="圖片" name="imageTab">
                <span v-if="mobile" style="color: whitesmoke; font-size: 11px;">{{ '點擊圖片翻頁 (' + (index + 1)  + '/' + currImage.detailImages.length + ')'}}</span>
                <div class="main-image-pic">
                  <img
                    v-show="false"
                    v-for="url in (mobile ? urls : [])"
                    :src="url"
                  >
                  <img
                    id="imgId"
                    ref="img"
                    class="image-viewer-img"
                    :src="currentImg"
                    :style="imgStyle"
                    @load="handleImgLoad"
                    @error="handleImgError"
                    @click="handleClick"
                  >
                </div>
              </el-tab-pane>
              <el-tab-pane v-if="currImage.type !== 'VIDEO' || currImage.accessible" label="視頻" name="videoTab">
                <div>
                  <video-player  v-for="playerOptions in playerOptionsList"
                                 style="margin-bottom: 20px;"
                                 class="video-player vjs-custom-skin"
                                 ref="videoPlayer"
                                 :playsinline="true"
                                 :options="playerOptions"
                                 @play="onPlayerPlay($event)"
                  ></video-player>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div v-else>
            <span v-if="mobile" style="color: whitesmoke; font-size: 11px;">{{ '點擊圖片翻頁 (' + (index + 1)  + '/' + currImage.detailImages.length + ')'}}</span>
            <div class="main-image-pic">
              <img
                v-show="false"
                v-for="url in (mobile ? urls : [])"
                :src="url"
              >
              <img
                id="imgId"
                ref="img"
                class="image-viewer-img"
                :src="currentImg"
                :style="imgStyle"
                @load="handleImgLoad"
                @error="handleImgError"
                @click="handleClick"
              >
            </div>
          </div>
          <div class="main-image-op">
            <span
                :class="like ? 'like-span liked' : 'like-span'"
                style="margin-right: 20px;"
                @click="onLike"
              >
              <svg-icon
                name="zan"
                style="font-size: 28px; margin-right: 3px;"
              />{{ currImage.likes | toThousands }}
            </span>
            <span
              :class="currImage.collected ? 'collect-span collected' : 'collect-span'"
              @click="onCollect"
            >
              <svg-icon
                name="collect"
                style="font-size: 28px; margin-right: 3px;"
              />{{ currImage.collects | toThousands }}
            </span>
          </div>
        </div>
      </div>
      <div
        v-show="!mobile"
        class="preview-description"
      >
        <span class="relate-span">相關推薦</span>
        <div class="recommendation">
          <div
            v-for="(r, index) in recommendations"
            :key="'recommendation:' + index"
            class="recommendation-item"
          >
            <img
              v-lazy="SERVER + r.mainImage"
              @click="chooseRec(r)"
            >
            <div
              class="rec-content"
            >
              <span class="rec-title">{{ r.city === null ? r.name : (r.city + ' ' + r.name) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="comment-area">
      <el-divider content-position="left">評論區<span
        style="color: whitesmoke; font-size: 14px; margin-left: 10px;"
      >{{ (commentSum > 0? commentSum : '') }}</span></el-divider>
      <div class="comment-list" style="background-color: #101010; padding: 5px;">
        <div class="comment-input" style="margin-bottom: 30px;">
          <textarea
            class="comment-text"
            v-model="comment"
            placeholder="友善評論，不可泄漏本教師的聯系或下載方式，若發現將做封號處理，多謝配合"
          ></textarea>
          <div  style="margin-top: 5px;">
            <el-button
              :disabled="comment.trim() === ''"
              size="mini"
              style="background-color: #101010; color: whitesmoke; float: right"
              @click="addComm"
            >評論</el-button>
          </div>
        </div>
        <div  v-for="(item, index) in comments"
              :id="item.id"
              class="comment-item"
              @click="noShadow(v.id)"
              :style="index < (comments.length - 1)? 'margin-top: 10px; border-bottom: solid 1px #2F2F2F; padding-bottom: 10px;' : 'margin-top: 10px; padding-bottom: 10px;'">
          <div class="commenter">
            <div style="float: left;">
              <img v-if="item.avatar" class="avatar" :src="SERVER + item.avatar">
            </div>
            <span style="color: #f90; font-size: 18px; margin-right: 5px; margin-left: 3px;">{{ item.commentatorName }}</span>
            <span style="color: #a3a2a2; font-size: 10px;">{{ item.time }}</span>
          </div>
          <div class="comment-content" style="margin-top: 5px;">
            <span style="color: #b8b8b8; font-size: 15px;">{{ item.content }}</span>
          </div>
          <div class="comment-op" style="margin-top: 7px;">
            <span style="font-size: 10px; color: #8faf1d; cursor: pointer; margin-right: 3px;">{{ item.likes }}</span>
            <svg-icon
              name="zan"
              style="font-size: 14px; color: #a3a2a2; cursor: pointer; margin-right: 10px;"
              @click="likeComm(item.id)"
            />
            <svg-icon
              name="cai"
              style="font-size: 14px; color: #a3a2a2; cursor: pointer;"
              @click="hateComm(item.id)"
            />
            <span style="font-size: 10px; color: #8faf1d; cursor: pointer; margin-left: 3px;  margin-right: 10px;">{{ item.hates }}</span>
            <span v-if="user === null || user.id !== item.commentatorId" style="color: #a3a2a2; font-size: 12px; cursor: pointer" @click="openReply(item.id, item.id, item.commentatorName)">回複</span>

            <div  v-for="(v, i) in item.replies"
                  v-if="item.expand || i < 5"
                  :id="v.id"
                  class="comment-item"
                  @click="noShadow(v.id)"
                  :style="i < (item.expand? (item.replies.length - 1) : Math.min(item.replies.length - 1, 4))? 'margin-top: 10px; padding-bottom: 10px; margin-left: 65px; border-bottom: solid 1px #2F2F2F;' : 'margin-top: 10px; padding-bottom: 10px; margin-left: 65px;'">
              <div class="commenter">
                <div style="float: left;">
                  <img v-if="v.avatar" class="avatar" :src="SERVER + v.avatar">
                </div>
                <span style="color: #f90; font-size: 18px; margin-right: 5px;">{{ v.commentatorName}}
                  <i class="el-icon-caret-right" style="color: #f90; font-size: 20px; margin-right: 4px;"></i>{{ v.replierName }}</span>
                <span style="color: #a3a2a2; font-size: 10px;">{{ v.time }}</span>
              </div>
              <div class="comment-content" style="margin-top: 5px;">
                <span style="color: #b8b8b8; font-size: 15px;">{{ v.content }}</span>
              </div>
              <div class="comment-op" style="margin-top: 7px;">
                <span style="font-size: 10px; color: #8faf1d; cursor: pointer; margin-right: 3px;">{{ v.likes }}</span>
                <svg-icon
                  name="zan"
                  style="font-size: 14px; color: #a3a2a2; cursor: pointer; margin-right: 10px;"
                  @click="likeReply(item.id, v.id)"
                />
                <svg-icon
                  name="cai"
                  style="font-size: 14px; color: #a3a2a2; cursor: pointer;"
                  @click="hateReply(item.id, v.id)"
                />
                <span style="font-size: 10px; color: #8faf1d; cursor: pointer; margin-left: 3px;  margin-right: 10px;">{{ v.hates }}</span>
                <span v-if="user === null || user.id !== v.commentatorId" style="color: #a3a2a2; font-size: 12px; cursor: pointer" @click="openReply(item.id, v.id, v.commentatorName)">回複</span>
              </div>
            </div>

            <div  v-if="!item.expand && item.replies.length > 5"
                  class="comment-item"
                  style="margin-left: 65px;"
            >
              <div class="comment-content" style="margin-top: 5px;">
                <span style="font-size: 10px; color: #8faf1d; cursor: pointer; margin-left: 3px;  margin-right: 10px;"
                      @click="expand(item.id)"
                >更多回複.....</span>
              </div>
            </div>

          </div>
        </div>
        <div style="text-align: center">
          <pagination v-show="commentTotal>0" :total="commentTotal" :start.sync="commentStart" :count.sync="commentCount" @pagination="listComments(false, null)" />
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="replayVisible"
      :width="mobile? '80%' : '30%'">
          <textarea
            v-model="replyContent"
            class="comment-text"
            style="font-size: 13px; height: 100px;"
            :placeholder="replyTitle"
          ></textarea>
      <span slot="footer" class="dialog-footer">
              <el-button @click="replayVisible = false" size="mini">取 消</el-button>
              <el-button type="primary" @click="doReply()" size="mini">回 複</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { off, on, rafThrottle } from '@/utils/image'
import { AppModule, DeviceType } from '@/store/modules/app'
import { GirlDetailResp, GirlResp } from '@/api/girlType'
import { detail, recommendation, like } from '@/api/girls'
import { consume } from '@/api/charge'
import { addComment, CommentResp, getComments, likeComment, hateComment, reply, read } from '@/api/comment'
import { addCollection, deleteByGirlId } from '@/api/collection'
import { LikesModule } from '@/store/modules/like'
import { Message } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { MessageModule } from '@/store/modules/message'
import Pagination from '@/components/Pagination/index.vue'
import Ripple from '@/components/Loading/Ripple.vue'

@Component({
  name: 'GirlGallery',
  components: {
    Pagination,
    Ripple
  }
})
export default class extends Vue {
  @Prop({ default: () => {} }) private image: GirlDetailResp
  @Prop({ default: (v: number) => {} }) private onSwitch!: Function
  @Prop({ default: () => {} }) private onClose!: Function
  @Prop({ default: 'false' }) private liked: boolean
  @Prop({ default: '' }) private commentId: string

  private SERVER = process.env.VUE_APP_IMAGE_SERVER

  private urls: string[] = []
  private videos: string[] = []
  private activeTab: string = 'imageTab'
  private currImage: GirlDetailResp = this.image

  private like: boolean = this.liked
  private index = 0
  private infinite = true
  private showPrevNext = true
  private showActions = true
  private showActionTools = false
  private actives: boolean[] = []
  private recommendations: GirlResp[] = []
  private transform = {
    scale: 0,
    deg: 0,
    offsetX: 0,
    offsetY: 0,
    enableTransition: false
  }
  private _keyDownHandler: any = null

  private commentSum = 0
  private commentTotal = 0
  private commentStart = 0
  private commentCount = 10
  private comment: string = ''
  private comments: CommentResp[] = []
  private replayVisible: boolean = false
  private sessionId: string = ''
  private replyId: string = ''
  private replyTitle: string = ''
  private replyContent = ''

  get collected() {
    return this.currImage.collected
  }

  get currentImg() {
    return this.urls[this.index]
  }

  get isSingle() {
    return this.urls.length <= 1
  }

  get isFirst() {
    return this.index === 0
  }

  get isLast() {
    return this.index === this.urls.length - 1
  }

  get imgStyle() {
    let { scale, deg, offsetX, offsetY, enableTransition } = this.transform
    return {
      maxWidth: '100%',
      maxHeight: '100%',
      transform: `scale(${scale}) rotate(${deg}deg)`,
      transition: enableTransition ? 'transform .3s' : '',
      marginLeft: `${offsetX}px`,
      marginTop: `${offsetY}px`
    }
  }

  get user() {
    return UserModule.user
  }

  get mobile() {
    return AppModule.device === DeviceType.Mobile
  }

  get contactLabel() {
    const type = this.currImage.type
    switch(type) {
      case 'PIC':
        return '更多美圖:'
      case 'VIDEO':
        return '在線觀看:'
    }
    return '聯系方式:'
  }

  get contactValue() {
    const type = this.currImage.type
    if (type === 'PIC') {
      return '已加載該教師所有詳情圖'
    }
    return this.currImage.contact
  }

  get playerOptionsList() {
    return this.videos.map(v => {
      return {
        autoplay: false,
        muted: false,
        loop: false,
        preload: 'metadata',
        language: 'zh-CN',
        aspectRatio: '16:9',
        fluid: true,
        sources: [{
          type: 'video/mp4',
          src: v + '#t=0.5'
        }],
        poster: '',
        notSupportedMessage: '此視頻暫無法播放，請稍後再試',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true
        }
      }
    })
  }

  private full(ele) {
    if (ele.requestFullscreen) {
      ele.requestFullscreen()
    } else if (ele.mozRequestFullScreen) {
      ele.mozRequestFullScreen()
    } else if (ele.msRequestFullscreen) {
      ele.msRequestFullscreen()
    } else if (ele.oRequestFullscreen) {
      ele.oRequestFullscreen()
    } else if (ele.webkitRequestFullscreen) {
      ele.webkitRequestFullScreen()
    } else {
      const docHtml = document.documentElement
      const docBody = document.body
      const videobox = document.getElementsByClassName("video-player")
      const cssText = "width:100%;height:100%;overflow:hidden;"
      docHtml.style.cssText = cssText
      docBody.style.cssText = cssText
      videobox['style'].cssText = cssText + ";" + "margin:0px;padding:0px;"
      document['IsFullScreen'] = true
    }
  }
  private onPlayerPlay(player) {
    if (this.mobile) {
      this.full(player)
    }
  }

  @Watch('index')
  onIndexChange(v: number) {
    this.actives = []
    this.$set(this.actives, this.index, true)
    this.scrollPreview()
    this.reset()
    if (this.onSwitch) {
      this.onSwitch(v)
    }
  }

  private recharge() {
    if (this.mobile) {
      this.$router.push({ path: '/user/recharge' })
    } else {
      window.open(window.location.origin + process.env.VUE_APP_PUBLIC_PATH + '/#/user/recharge')
    }
  }

  private buy() {
    if (this.user === null) {
      if (this.mobile) {
        this.$router.push({ path: '/user/login' })
      } else {
        window.open(window.location.origin + process.env.VUE_APP_PUBLIC_PATH + '/#/user/login')
      }
    } else {
      this.$confirm('確定購買？')
        .then(async _ => {
          const data = await consume({ girlId: this.currImage.id })
          if (data.code === 200) {
            Message({
              message: '購買成功！',
              type: 'success',
              duration: 1500
            })
            const data = await detail(this.currImage.id)
            if (data.code === 200) {
              this.activeTab = this.currImage.type === 'VIDEO' ? 'videoTab' : 'imageTab'
              this.currImage = data.value
              this.urls = this.currImage.detailImages.map(v => process.env.VUE_APP_IMAGE_SERVER + v)
              if (this.currImage.videos !== null && this.currImage.videos !== undefined && this.currImage.videos.length > 0) {
                this.videos = this.currImage.videos.map(v => process.env.VUE_APP_IMAGE_SERVER + v)
              } else {
                this.videos = []
              }
            }
            await UserModule.GetUserInfo()
          } else {
            Message({
              message: data.message,
              type: 'warning',
              duration: 1500
            })
          }
        })
        .catch(_ => {})
    }
  }

  private onLike() {
    if (this.like) {
      this.currImage.likes -= 1
      like(this.image.id, { like: false })
    } else {
      this.currImage.likes += 1
      like(this.image.id, { like: true })
    }
    LikesModule.Like(this.image.id)
    this.like = !this.like
  }

  private async onCollect() {
    if (this.user === null) {
      if (this.mobile) {
        this.$router.push({ path: '/user/login' })
      } else {
        window.open(window.location.origin + process.env.VUE_APP_PUBLIC_PATH + '/#/user/login')
      }
    } else {
      if (this.currImage.collected) {
        this.currImage.collects -= 1
        deleteByGirlId({ girlId : this.currImage.id })
      } else {
        this.currImage.collects += 1
        addCollection({ girlId : this.currImage.id })
      }
      this.currImage.collected = !this.currImage.collected
    }
  }

  private async addComm() {
    if (this.user === null) {
      Message({
        message: '請先登錄',
        type: 'info',
        duration: 1500
      })
    } else {
      const data = await addComment({ girlId: this.currImage.id, content: this.comment })
      if (data.code === 200) {
        this.comments.unshift({
          avatar: this.user.avatar,
          commentatorId: UserModule.user.id,
          commentatorName: UserModule.user.name,
          content: this.comment,
          time: '剛剛',
          id: data.value,
          read: true,
          likes: 0,
          hates: 0,
          hated: false,
          liked: false,
          expand: false,
          replies: [] })
        this.comment = ''
      }
    }
  }

  private noShadow(id: string) {
    const e = document.getElementById(id)
    if (e != null) {
      e.style.boxShadow = 'none'
    }
  }

  private async listComments(refresh: boolean, commentId: string) {
    let data = await getComments({ start: this.commentStart, count: this.commentCount, commentId: commentId, girlId: this.currImage.id })
    if (data.code === 200) {
      this.commentSum = data.value.sum
      this.commentStart = data.value.start
      this.commentTotal = data.value.total
      this.comments = data.value.comments
      // document.scrollingElement.scrollTop = document.getElementById('comment-btn')
      if (!refresh || commentId !== null) {
        let el = commentId !== null? document.getElementById(commentId) : document.getElementById('comment-area')
        if (commentId !== null && el === null) {
          let counter = 0;
          let interval2 = setTimeout(() => {
            el = document.getElementById(commentId)
            if (el !== null && counter < 10) {
              clearInterval(interval2)
              this.commentId = null
              this.animateScroll(el, true)
              el.style.boxShadow = 'darkgrey 0px 0px 8px 3px'
            }
            counter += 1
          }, 500)
        } else {
          this.animateScroll(el, commentId !== null)
        }
      }
    }
  }

  private animateScroll(element, down) {
    let rect = element.getBoundingClientRect()
    let top = window.pageYOffset + rect.top
    const el = document.documentElement
    let step = 0
    const viewHeight = document.documentElement.clientHeight || window.innerHeight
    let interval = setInterval(() => {
      if (down? (this.toBottom() || (el.scrollTop <= (top - 0.1 * viewHeight) && el.scrollTop >= (top - 0.3 * viewHeight))) : el.scrollTop <= (top - 20)) {
        clearInterval(interval)
        return
      }
      if (down) {
        step += 0.5
        el.scrollTop += step
      } else {
        step += 0.2
        el.scrollTop -= step
      }
    }, 1)
  }

  private toBottom() {
    return document.documentElement.scrollHeight === document.documentElement.scrollTop + window.innerHeight
  }

  private readWhenScroll() {
    window.addEventListener('scroll', (e: Event) => {
      if (UserModule.user !== null) {
        this.comments.forEach(v => v.replies.slice(0, v.expand ? v.replies.length : Math.min(v.replies.length, 5)).forEach(async(r) => {
          if (!r.read && r.replierId === UserModule.user.id) {
            const el = document.getElementById(r.id)
            let rect = el.getBoundingClientRect()
            const viewHeight = document.documentElement.clientHeight || window.innerHeight
            if (this.toBottom() || (rect.top < viewHeight / 2 && rect.top > viewHeight / 3.5)) {
              const data = await read(r.id);
              if (data.code === 200) {
                MessageModule.comment.messages.forEach(m => {
                  if (m.id === r.id) {
                    m.read = true
                    MessageModule.decUnReads(true)
                  }
                })
              }
            }
          }
        }))
      }
    })
  }

  private async likeComm(id) {
    const c = this.comments.find(v => v.id === id)
    if (!c.liked && (this.user === null || this.user.id !== c.commentatorId)) {
      const data = await likeComment(id)
      if (data.code === 200) {
        c.likes += 1
        c.liked = true
      }
    }
  }

  private async hateComm(id) {
    const c = this.comments.find(v => v.id === id)
    if (!c.hated && (this.user === null || this.user.id !== c.commentatorId)) {
      const data = await hateComment(id)
      if (data.code === 200) {
        c.hates += 1
        c.hated = true
      }
    }
  }

  private async likeReply(id, replyId) {
    const c = this.comments.find(v => v.id === id)
    const r = c.replies.find(v => v.id === replyId)
    if (!r.liked && (this.user === null || this.user.id !== r.commentatorId)) {
      const data = await likeComment(replyId)
      if (data.code === 200) {
        r.likes += 1
        r.liked = true
      }
    }
  }

  private async hateReply(id, replyId) {
    const c = this.comments.find(v => v.id === id)
    const r = c.replies.find(v => v.id === replyId)
    if (!r.hated && (this.user === null || this.user.id !== r.commentatorId)) {
      const data = await hateComment(replyId)
      if (data.code === 200) {
        r.hates += 1
        r.hated = true
      }
    }
  }

  private expand(id: string) {
    const c = this.comments.find(v => v.id === id)
    c.expand = true
  }

  private openReply(sessionId: string, replyId: string, userName: string) {
    if (this.user === null) {
      if (this.mobile) {
        this.$router.push({ path: '/user/login' })
      } else {
        window.open(window.location.origin + process.env.VUE_APP_PUBLIC_PATH + '/#/user/login')
      }
    } else {
      this.replayVisible = true
      this.sessionId = sessionId
      this.replyId = replyId
      this.replyTitle = '正在回複 ' + userName + '\n\n友善評論，不可泄漏本教師的聯系或下載方式，若發現將按封號處理，多謝配合'
    }
  }

  private async doReply() {
    const data = await reply(this.replyId, { content: this.replyContent })
    if (data.code === 200) {
      const c = this.comments.find(v => v.id === this.sessionId)
      if (this.sessionId === this.replyId) {
        c.replies.unshift({
          id: data.value,
          commentatorId: UserModule.user.id,
          commentatorName: UserModule.user.name,
          replierId: c.commentatorId,
          replierName: c.commentatorName,
          content: this.replyContent,
          time: '剛剛',
          likes: 0,
          hates: 0,
          avatar: this.user.avatar,
          liked: false,
          hated: false,
          read: false })
      } else {
        const r = c.replies.find(v => v.id === this.replyId)
        c.replies.unshift({
          id: data.value,
          commentatorId: UserModule.user.id,
          commentatorName: UserModule.user.name,
          replierId: r.commentatorId,
          replierName: r.commentatorName,
          content: this.replyContent,
          time: '剛剛',
          likes: 0,
          hates: 0,
          avatar: this.user.avatar,
          liked: false,
          hated: false,
          read: false})
        if (!r.read) {
          const m = MessageModule.comment.messages.find(v => v.id = r.id)
          if (m) {
            m.read = true
            MessageModule.decUnReads(true)
          }
        }
      }
      this.replayVisible = false
      this.replyId = ''
      this.sessionId = ''
      this.replyTitle = ''
      this.replyContent = ''
    }
  }

  private preview(index: number) {
    this.index = index
  }

  private toggleAction() {
    this.showActionTools = !this.showActionTools
  }

  private hide() {
    this.deviceSupportUninstall()
    this.transform.scale = 0
    this.showActions = false
    this.showPrevNext = false
    this.onClose()
  }

  private deviceSupportUninstall() {
    off(document, 'keydown', this._keyDownHandler)
    this._keyDownHandler = null
  }

  private deviceSupportInstall() {
    this._keyDownHandler = rafThrottle((e: any) => {
      const keyCode = e.keyCode
      switch (keyCode) {
        // ESC
        case 27:
          this.hide()
          break
        // LEFT_ARROW
        case 37:
          this.prev()
          break
        // UP_ARROW
        case 38:
          this.handleActions('zoomIn')
          break
        // RIGHT_ARROW
        case 39:
          this.next()
          break
        // DOWN_ARROW
        case 40:
          this.handleActions('zoomOut')
          break
      }
    })
    on(document, 'keydown', this._keyDownHandler)
  }

  private scrollPreview() {
    const step = 200
    const _previewDoc = document.getElementById('previewList')
    const item: HTMLElement = document.getElementById('preview:' + this.index)
    const viewHeight = document.documentElement.clientHeight || window.innerHeight
    const rectTop = item.getBoundingClientRect().top
    if (this.isFirst) {
      _previewDoc.scrollTop = 0
    } else if (this.isLast) {
      _previewDoc.scrollTop = this.urls.length * step
    } else {
      if (rectTop <= 0) {
        _previewDoc.scrollTop -= step
      } else if (rectTop >= viewHeight - step) {
        _previewDoc.scrollTop += 2 * step
      }
    }
  }

  private prev() {
    if (this.isFirst && !this.infinite) return
    const len = this.urls.length
    this.index = (this.index - 1 + len) % len
  }

  private next() {
    if (this.isLast && !this.infinite) return
    const len = this.urls.length
    this.index = (this.index + 1) % len
  }

  private handleClickOutside(e: any) {
    if (this.mobile) {
      this.handleClick(e)
    }
  }

  private handleClick(e: any) {
    if (this.showActionTools) {
      this.toggleAction()
    }
    const centerX = window.outerWidth / 2 + this.transform.offsetX
    const offset = e.pageX - centerX
    if (Math.abs(offset) > 40) {
      if (offset > 0) {
        this.next()
      } else {
        this.prev()
      }
    }
  }

  public reset() {
    this.transform = {
      scale: 1,
      deg: 0,
      offsetX: 0,
      offsetY: 0,
      enableTransition: false
    }
  }

  private handleImgLoad(e: any) {
  }

  private handleImgError(e: any) {
    e.target.alt = '加載失敗'
  }

  private handleActions(action: any, options = {}) {
    const { zoomRate, rotateDeg, enableTransition } = {
      zoomRate: 0.2,
      rotateDeg: 90,
      enableTransition: true,
      ...options
    }
    const { transform } = this
    switch (action) {
      case 'zoomOut':
        if (transform.scale > 0.2) {
          transform.scale = parseFloat((transform.scale - zoomRate).toFixed(3))
        }
        break
      case 'zoomIn':
        transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3))
        break
      case 'clocelise':
        transform.deg += rotateDeg
        break
      case 'anticlocelise':
        transform.deg -= rotateDeg
        break
    }
    transform.enableTransition = enableTransition
  }

  private showImgTimeout() {
    setTimeout(() => {
      this.transform.scale = 1
    }, 100)
  }

  private btnViewScale = 0
  private btnViewIconScale = 0

  private hideBtnPrevAndNext() {
    const handler = setInterval(() => {
      this.btnViewScale = this.btnViewScale === 1 ? 0.5 : 1
      this.btnViewIconScale = 0.8
    }, 500)

    setTimeout(() => {
      clearInterval(handler)
      this.btnViewScale = 0
      this.btnViewIconScale = 0
    }, 5000)
  }

  private async chooseRec(img: GirlResp) {
    this.reset()
    this.index = 0
    this.like = false
    this.actives = []
    this.actives[this.index] = true
    const data = await detail(img.id)
    if (data.code === 200) {
      this.activeTab = this.activeTab = (this.currImage.type === 'VIDEO' && this.currImage.accessible) ? 'videoTab' : 'imageTab'
      this.currImage = data.value
      this.urls = this.currImage.detailImages.map(v => process.env.VUE_APP_IMAGE_SERVER + v)
      if (this.currImage.videos !== null && this.currImage.videos !== undefined && this.currImage.videos.length > 0) {
        this.videos = this.currImage.videos.map(v => process.env.VUE_APP_IMAGE_SERVER + v)
      } else {
        this.videos = []
      }
      this.comments = []
      this.listComments(true, null)
    }
  }

  private async loadRecommendations() {
    let data = await recommendation(this.image.id, { count: 20 })
    this.recommendations = data.values
  }

  created() {
    this.actives[this.index] = true
    this.loadRecommendations()
    this.activeTab = this.activeTab = this.activeTab = (this.currImage.type === 'VIDEO' && this.currImage.accessible) ? 'videoTab' : 'imageTab'
    this.urls = this.image.detailImages.map(v => process.env.VUE_APP_IMAGE_SERVER + v)
    if (this.currImage.videos !== null && this.currImage.videos !== undefined && this.currImage.videos.length > 0) {
      this.videos = this.currImage.videos.map(v => process.env.VUE_APP_IMAGE_SERVER + v)
    } else {
      this.videos = []
    }
    this.listComments(true, this.commentId)
  }

  mounted() {
    this.showImgTimeout()
    this.hideBtnPrevAndNext()
    this.deviceSupportInstall()
    this.readWhenScroll()
  }
}
</script>

<style lang="scss">
.image-viewer {
}

.image-viewer-mask {
  background: #000;
  opacity: 0.95;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
}

.el-image-viewer__btn {
  transition: all .5s ease;
  opacity: 0.2;

  &.el-image-viewer__prev {
    left: 35%;
    opacity: 0.2;
    transition: all .5s ease;
  }

  &.el-image-viewer__next {
    right: 35%;
    opacity: 0.2;
    transition: all .5s ease;
  }
}

.el-image-viewer__btn,.el-image-viewer__actions {
  opacity: 0.4;
  transition: all .5s ease;

  .counter {
    font-size: 15px;
    margin-right: 3px;
    margin-left: 3px;
  }
}

.image-viewer-container {
  width: 100%;
  height: 100%;
  display: grid;
  margin-top: 50px;
  margin-bottom: 100px;
  grid-template-columns: 152px 1fr 152px;
  justify-items: center;

  .preview-list {
    grid-column: 1 / 2;
    display: grid;
    grid-template-rows: 50px 1080px;
    margin-bottom: 10px;

    .gallery-span {
      grid-row: 1 / 2;
      color: #f90;
      margin-bottom: 10px;
      margin-top: 10px;
      border-bottom: 1px solid #5AA766;
    }

    .preview-container {
      grid-row: 2 / 3;
      overflow-y: scroll;
      height: 100%;
      scrollbar-width: none;
      -ms-overflow-style: none;
      overflow: -moz-scrollbars-none;
      width: 152px;
      border: 1px solid #2F2F2F;
      margin-bottom: 10px;
      border-bottom: 1px solid #5AA766;
      padding-bottom: 10px;

      .preview-item {
        float: left;
        img {
          width: 150px;
          height: 200px;
          cursor: pointer;
          padding: 5px;

          &.active {
            border: 1px solid #f90;
          }
        }

        img:hover {
          border: 1px solid #f90;
        }
      }
    }

    .preview-container::-webkit-scrollbar {
      width: 0 !important
    }
  }

  .main-image-info {
    grid-column: 2 / 3;

    .girl-info {
      width: 100%;
      display: grid;
      grid-template-rows: repeat(5, auto);
      grid-template-columns: 1fr 5fr;
      margin-top: 25px;

      .info-label {
        padding-bottom: 10px;
        min-width: 100px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        color: whitesmoke;
        font-size: 15px;
      }

      .info-value {
        padding-bottom: 10px;
        width: 520px;
        margin-left: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: whitesmoke;
        font-size: 15px;
        white-space:normal;
        word-break:break-all;
        word-wrap:break-word;
      }
    }

    .main-image {
      padding-left: 8px;
      padding-right: 8px;

      .main-image-pic {
        .image-viewer-img {
          justify-self: center;
          align-self: center;
          border-radius: 6px;
          cursor: pointer;
          width: 628px;
          height: auto;
          object-fit: fill;
        }

        .loading {
          margin-top: 100px;
          width: 100%;
          height: 200px;
          display: flex;
          justify-items: center;
          .lds-ripple {
            margin: 20px auto auto;
          }
        }
      }

      .main-image-op {
        span {
          color: #a3a2a2;
        }

        .like-span {
          cursor: pointer;
          font-size: 10px;

          &.liked {
            color: #5AA766;
          }
        }

        .collect-span {
          cursor: pointer;
          font-size: 10px;

          &.collected {
            color: #5AA766;
          }
        }
      }
    }
  }

  .preview-description {
    grid-column: 3 / 4;
    display: grid;
    grid-template-rows: 50px 1080px;
    margin-bottom: 10px;

    .relate-span {
      grid-row: 1 / 2;
      color: #f90;
      margin-bottom: 10px;
      margin-top: 10px;
      border-bottom: 1px solid #5AA766;
    }
    .recommendation {
      overflow-y: scroll;
      height: 100%;
      scrollbar-width: none;
      -ms-overflow-style: none;
      overflow: -moz-scrollbars-none;
      grid-row: 2 / 3;
      justify-self: left;
      border: 1px solid #2F2F2F;
      width: 152px;
      margin-bottom: 10px;
      border-bottom: 1px solid #5AA766;
      padding-bottom: 10px;

      .recommendation-item {
        float: left;

        img {
          width: 150px;
          height: 200px;
          cursor: pointer;
          padding: 5px;
        }

        .rec-content {
          padding-left: 5px;
          align-content: center;
          .rec-title {
            width: 145px;
            color: #f90;
            font-size: 12px;
            line-height: 12px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            display: inline-block;
          }
        }

        img:hover {
          border: 1px solid #f90;
        }
      }
    }

    .recommendation::-webkit-scrollbar {
      width: 0 !important
    }
  }
}

.preview-list::-webkit-scrollbar {
  display: none;
}

.preview-container::-webkit-scrollbar {
  display: none;
}

.preview-description::-webkit-scrollbar {
  display: none;
}

.recommendation::-webkit-scrollbar {
  display: none;
}

.mobile {
  .image-viewer-container {
    display: block;
  }

  .main-image-info {
    .girl-info {
      .info-value {
        width: 100%;
        padding-right: 20px;
      }
    }
  }

  .el-image-viewer__btn {
    &.el-image-viewer__prev {
      left: 10%;
    }

    &.el-image-viewer__next {
      right: 10%;
    }
  }

  .el-image-viewer__actions {
    opacity: 0.18;
    background: #000;
    transition: all .5s ease;
  }

  .el-icon-circle-close {
    font-size: 30px;
  }

  .vjs-custom-skin > .video-js .vjs-control-bar {
    display: none;
  }
}

.el-divider__text {
  background-color: #000;
  font-size: 20px;
  color: whitesmoke;
}

.el-divider--horizontal {
  background-color: #5AA766;
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

.el-tabs__item {
  color: whitesmoke;
}

.vjs-custom-skin {
  outline: none;
}

.vjs-custom-skin:focus {
  outline: 0;
}

.vjs-custom-skin > .video-js .vjs-big-play-button {
  background-color: rgba(0,0,0,0);
  font-size: 4em;
  height: 1em !important;
  width: 1em !important;
  line-height: 1em !important;
  margin-top: -1em !important;
  margin-left: -0.5em;
  border: none;
  outline: none;
}

.vjs-custom-skin > .video-js .vjs-big-play-button:focus {
  outline: 0;
}

.vjs-button {
  outline: none;
}

.vjs-button:focus {
  outline: 0;
}

.avatar {
  width: 30px;
  height: 30px;
  margin-right: 5px;
}
</style>
