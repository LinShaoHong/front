<template>
  <div
    :class="mobile ? 'image-viewer mobile' : 'image-viewer'"
  >
    <div
      class="image-viewer-mask"
      @click="handleClickOutside"
    />
    <template v-if="!isSingle && showPrevNext">
      <span
        class="el-image-viewer__btn el-image-viewer__prev"
        :class="{'is-disabled': !infinite && isFirst}"
        :style="'transform: scale('+ btnViewScale + ')'"
        @click="prev"
      >
        <i
          class="el-icon-arrow-left"
          :style="'transform: scale('+ btnViewIconScale + ')'"
        />
      </span>
      <span
        class="el-image-viewer__btn el-image-viewer__next"
        :class="{'is-disabled': !infinite && isLast}"
        :style="'transform: scale('+ btnViewScale + ')'"
        @click="next"
      >
        <i
          class="el-icon-arrow-right"
          :style="'transform: scale('+ btnViewIconScale + ')'"
        />
      </span>
    </template>
    <div
      v-show="showActions"
      id="actions"
      class="el-image-viewer__btn el-image-viewer__actions"
      :style="showActionTools? '' : 'opacity: 0.2; width: ' + (mobile ? '115px;' : '105px;')"
    >
      <div
        class="el-image-viewer__actions__inner"
      >
        <i
          v-if="showActionTools"
          class="el-icon-zoom-out"
          style="cursor: pointer"
          @click="handleActions('zoomOut')"
        />
        <i
          v-if="showActionTools"
          class="el-icon-zoom-in"
          style="cursor: pointer"
          @click="handleActions('zoomIn')"
        />
        <i
          v-if="showActionTools"
          class="el-image-viewer__actions__divider"
        />
        <i
          v-if="!showActionTools"
          class="el-icon-full-screen"
          :style="'cursor: pointer; font-size: ' + (mobile ? 25 : 23) + 'px;'"
          @click="toggleAction"
        />
        <sapn v-if="!showActionTools" class="counter">{{ (index + 1) + '/' + urls.length }}</sapn>
        <i
          v-if="showActionTools"
          class="el-icon-menu"
          style="cursor: pointer"
          @click="toggleAction"
        />
        <i
          v-if="!showActionTools"
          class="el-icon-circle-close"
          :style="'cursor: pointer; font-size: 28px;'"
          @click="hide"
        />
        <i
          v-if="showActionTools"
          class="el-image-viewer__actions__divider"
        />
        <i
          v-if="showActionTools"
          class="el-icon-refresh-left"
          style="cursor: pointer"
          @click="handleActions('anticlocelise')"
        />
        <i
          v-if="showActionTools"
          class="el-icon-refresh-right"
          style="cursor: pointer"
          @click="handleActions('clocelise')"
        />
      </div>
    </div>
    <div class="image-viewer-container">
      <div
        v-show="!mobile"
        class="preview-list"
      >
        <span class="gallery-span">相册</span>
        <div class="preview-container"
             id="previewList"
        >
          <img
            v-for="(url, index) in urls"
            :id="'preview:' + index"
            :key="'preview:' + index"
            v-lazy="url"
            :class="actives[index] ? 'active': ''"
            @click="preview(index)"
          >
        </div>
      </div>
      <div v-show="!mobile" class="title">
        <span>{{ image.title }}</span>
      </div>
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
      <div
        v-show="!mobile"
        class="preview-description"
      >
        <span class="relate-span">相关推荐</span>
        <div class="recommendation">
          <div class="recommendation-item"
               v-for="(r, index) in recommendations"
               :key="'recommendation:' + index"
          >
            <img
              v-lazy="'http://172.20.10.2/images' + r.src"
              @click="chooseRec(r)"
            >
            <div
              class="rec-content"
            >
              <span class="rec-title">{{ r.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { isFirefox, off, on, rafThrottle } from '@/utils/image'
import { slider } from '@/utils/mobile'
import { AppModule, DeviceType } from '@/store/modules/app'
import { ImageResp } from '@/api/imageType'
import { getDetails, getRecommendations } from '@/api/imageApi'

@Component({
  name: 'ImageGallery'
})
export default class extends Vue {
  @Prop({ default: [] }) private urls!: string[]
  @Prop({ default: {} }) private image: ImageResp
  @Prop({ default: (v: number) => {} }) private onSwitch!: Function
  @Prop({ default: () => {} }) private onClose!: Function

  private index = 0
  private isShow = false
  private infinite = true
  private loading = false
  private showPrevNext = true
  private showActions = true
  private showActionTools = false
  private actives: boolean[] = []
  private recommendations: ImageResp[] = []
  private transform = {
    scale: 0,
    deg: 0,
    offsetX: 0,
    offsetY: 0,
    enableTransition: false
  }
  private _keyDownHandler: any = null

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

  get mobile() {
    return AppModule.device === DeviceType.Mobile
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

  @Watch('currentImg')
  onCurrentImg(v: any) {
    this.$nextTick(() => {
      if (!(this.$refs.img as HTMLImageElement).complete) {
        this.loading = true
      }
    })
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
    this.loading = false
  }

  private handleImgError(e: any) {
    this.loading = false
    e.target.alt = '加载失败'
  }

  private handleActions(action: any, options = {}) {
    if (this.loading) return
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
    if (!this.loading) {
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
  }

  private async chooseRec(img: ImageResp) {
    this.reset()
    let data = await getDetails(img.id)
    this.index = 0
    this.actives = []
    this.image = img
    this.urls = data.values.map(v => 'http://172.20.10.2/images' + v)
  }

  private async loadRecommendations() {
    let data = await getRecommendations(this.image.id, { count: 20 })
    this.recommendations = data.values
  }

  created() {
    this.actives[this.index] = true
    this.loadRecommendations()
  }

  mounted() {
    this.showImgTimeout()
    this.hideBtnPrevAndNext()
    this.deviceSupportInstall()
  }
}
</script>

<style lang="scss" scoped>
.image-viewer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
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
  z-index: 1200;
  opacity: 0.4;
  transition: all .5s ease;

  .counter {
    font-size: 15px;
    margin-right: 3px;
    margin-left: 3px;
  }
}

.image-viewer-container {
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 20px 2fr 1fr;
  justify-items: center;

  .preview-list {
    overflow-y: scroll;
    z-index: 1100;
    justify-self: center;
    grid-column: 1 / 2;
    display: grid;
    grid-template-rows: 50px 1fr;
    margin-bottom: 10px;
    border-bottom: 1px solid #5AA766;

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
      width: 303px;
      border: 1px solid #2F2F2F;
      margin-bottom: 10px;

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

  .title {
    z-index: 1100;
    grid-column: 2 / 3;
    writing-mode: vertical-lr;
    margin-top: 37px;
    margin-right: 5px;
    justify-self: center;
    span {
      color: #f90;
    }
  }

  .image-viewer-img {
    grid-column: 3 / 4;
    z-index: 1100;
    transition: all 1s ease;
    border-radius: 6px;
    cursor: pointer;
  }

  .preview-description {
    overflow-y: scroll;
    grid-column: 4 / 5;
    z-index: 1000;
    display: grid;
    grid-template-rows: 50px 1fr;
    margin-bottom: 10px;
    border-bottom: 1px solid #5AA766;

    .relate-span {
      grid-row: 1 / 2;
      color: #f90;
      margin-bottom: 10px;
      margin-top: 10px;
      border-bottom: 1px solid #5AA766;
    }
    .recommendation {
      overflow-y: scroll;
      grid-row: 2 / 3;
      z-index: 1100;
      justify-self: center;
      border: 1px solid #2F2F2F;
      width: 303px;
      margin-bottom: 10px;

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
  }
}

.preview-list::-webkit-scrollbar {
  display: none;
}

.preview-description::-webkit-scrollbar {
  display: none;
}

.mobile {
  .image-viewer-container {
    display: block;
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
}
</style>
