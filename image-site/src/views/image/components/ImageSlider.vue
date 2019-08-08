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
      :style="showActionTools? '' : 'opacity: 0.1; width: ' + (mobile ? '100px;' : '30px;')"
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
          style="cursor: pointer; font-size: 25px;"
          @click="toggleAction"
        />
        <i
          v-if="showActionTools"
          class="el-icon-menu"
          style="cursor: pointer"
          @click="toggleAction"
        />
        <i
          v-if="mobile && !showActionTools"
          class="el-icon-circle-close"
          style="cursor: pointer; font-size: 28px; margin-left: 10px;"
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
      <img
        id="imgId"
        ref="img"
        class="image-viewer-img"
        style="max-width: 10%"
        :src="currentImg"
        :style="imgStyle"
        @load="handleImgLoad"
        @error="handleImgError"
        @click="handleClick"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { isFirefox, off, on, rafThrottle } from '@/utils/image'
import { slider } from '@/utils/mobile'
import { AppModule, DeviceType } from '@/store/modules/app'

const mousewheelEventName = isFirefox() ? 'DOMMouseScroll' : 'mousewheel'

@Component({
  name: 'ImageSlider'
})
export default class extends Vue {
  @Prop({ default: [] }) private urlList!: string[]
  @Prop({ default: (v: number) => {} }) private onSwitch!: Function
  @Prop({ default: () => {} }) private onClose!: Function

  private index = 0
  private isShow = false
  private infinite = true
  private loading = false
  private showPrevNext = true
  private showActions = true
  private showActionTools = false
  private transform = {
    scale: 0,
    deg: 0,
    offsetX: 0,
    offsetY: 0,
    enableTransition: false
  }
  private _keyDownHandler: any = null
  private _mouseWheelHandler: any = null

  get currentImg() {
    return this.urlList[this.index]
  }

  get isSingle() {
    return this.urlList.length <= 1
  }

  get isFirst() {
    return this.index === 0
  }

  get isLast() {
    return this.index === this.urlList.length - 1
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
    off(document, mousewheelEventName, this._mouseWheelHandler)
    this._keyDownHandler = null
    this._mouseWheelHandler = null
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
    this._mouseWheelHandler = rafThrottle((e: any) => {
      const delta = e.wheelDelta ? e.wheelDelta : -e.detail
      if (delta > 0) {
        this.handleActions('zoomIn', {
          zoomRate: 0.015,
          enableTransition: false
        })
      } else {
        this.handleActions('zoomOut', {
          zoomRate: 0.015,
          enableTransition: false
        })
      }
    })
    on(document, 'keydown', this._keyDownHandler)
    on(document, mousewheelEventName, this._mouseWheelHandler)
  }

  private prev() {
    if (this.isFirst && !this.infinite) return
    const len = this.urlList.length
    this.index = (this.index - 1 + len) % len
  }

  private next() {
    if (this.isLast && !this.infinite) return
    const len = this.urlList.length
    this.index = (this.index + 1) % len
  }

  private handleClickOutside(e: any) {
    if (!this.mobile) {
      this.hide()
    } else {
      this.handleClick(e)
    }
  }

  private handleClick(e: any) {
    if (this.showActionTools) {
      this.toggleAction()
    }
    if (this.mobile) return
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

  private bindSliderEvent() {
    const el: Node = window.document.getElementById('imgId')
    slider(el, (x, y) => {
      if (x < -5) {
        this.prev()
      } else if (x > 5) {
        this.next()
      }
    })
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
      }, 3000)
    }
  }

  mounted() {
    this.bindSliderEvent()
    this.showImgTimeout()
    this.hideBtnPrevAndNext()
    this.deviceSupportInstall()
  }

  // private handleMouseDown(e: any) {
  //   if (this.loading || e.button !== 0) return
  //   const { offsetX, offsetY } = this.transform
  //   const startX = e.pageX
  //   const startY = e.pageY
  //   this._dragHandler = rafThrottle((ev: any) => {
  //     this.transform.offsetX = offsetX + ev.pageX - startX
  //     this.transform.offsetY = offsetY + ev.pageY - startY
  //   })
  //   on(document, 'mousemove', this._dragHandler)
  //   on(document, 'mouseup', () => {
  //     off(document, 'mousemove', this._dragHandler)
  //   })
  //   e.preventDefault()
  // }
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
  opacity: 0.8;
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
}

.image-viewer-container {
  width: 100%;
  height: 100%;
  display: -webkit-box;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;

  .image-viewer-img {
    z-index: 1100;
    transition: all 1s ease;
    border-radius: 6px;
    cursor: pointer;
  }
}

.mobile {
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
