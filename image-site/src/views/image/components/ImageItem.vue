<template>
  <div :class="mobile ? 'mobile' : (carousel ? 'carousel' : '')">
    <div
      :id="id"
      class="image-shadow js-tilt-container"
      @mousemove="move"
      @mouseleave="leave"
      @click="showViewer"
    >
      <img
        :src="imgSrc"
        :style="'width: ' + width + 'px; height: ' + height + 'px;'"
      >
    </div>
    <image-details ref="imgDetails" />
    <div
      v-show="!carousel"
      class="content"
    >
      <span class="title" :style="'width: '+ width + 'px;'">绝美波霸厨娘真空巨乳风情身材火爆至绝美波霸厨娘真空巨乳风情身材火爆至</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { DeviceType, AppModule } from '@/store/modules/app'
import ImageDetails from './ImageDetails.vue'

@Component({
  name: 'ImageItem',
  components: {
    ImageDetails
  }
})
export default class extends Vue {
  @Prop({ default: '#' }) private imgSrc!: string
  @Prop({ default: '' }) private id!: string
  @Prop({ default: false }) private carousel!: boolean
  @Prop({ default: 230 }) private width!: number
  @Prop({ default: 300 }) private height!: number

  private showViewer() {
    if (!this.carousel) {
      (this.$refs.imgDetails as ImageDetails).showViewer()
    }
  }

  private move(e: MouseEvent) {
    const el: HTMLElement | null = window.document.getElementById(this.id)
    if (el !== null && !this.carousel && !this.mobile) {
      const cursPosX = e.pageX - el.offsetLeft
      const cursPosY = e.pageY - el.offsetTop
      const cursFromCenterX = el.clientWidth / 2 - cursPosX + 250
      const cursFromCenterY = el.clientHeight / 2 - cursPosY
      el.style.transform = 'perspective(500px) rotateX(' + (cursFromCenterY / 20) + 'deg) rotateY(' + -(cursFromCenterX / 20) + 'deg) translateZ(10px)'
      el.classList.remove('leave')
    }
  }

  private leave(e: any) {
    const el: HTMLElement | null = window.document.getElementById(this.id)
    if (el !== null && !this.carousel && !this.mobile) {
      el.classList.add('leave')
    }
  }

  get mobile() {
    const b = AppModule.device === DeviceType.Mobile
    if (b) {
      this.width = 160
      this.height = 230
    }
    return b
  }
}
</script>

<style lang="scss" scoped>
.image-shadow {
  display: block;
  position: relative;
  background-size: cover;
  cursor: pointer;
  padding-left: 5px;
  transition: all 2.5s ease;

  img {
    object-fit: fill;
    border-radius: 6px;
    transition: all 1s ease;
  }

  img:hover {
    box-shadow: 0 0 16px #f90;
    transform: scale(1.08);
  }
}

.js-tilt-container {
  transition: -webkit-transform .1s ease;
  transition: transform .1s ease;
  -webkit-transform: rotateX(0) rotateY(0);
  transform: rotateX(0) rotateY(0);
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
}

.content {
  align-content: center;
  margin-top: 3px;
  margin-bottom: 10px;

  .title {
    font-size: 14px;
    width: 100%;
    margin-top: 2px;
    padding: 2px;
    color: #f90;
    line-height: 14px;
    white-space: nowrap;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.leave {
  transform: rotateX(0) rotateY(0) !important;
  transition-timing-function: cubic-bezier(0.42, 0, 0, 1) !important;
  transition-duration: 1.5s;
}

.carousel {
  .image-shadow {
    padding-left: 0;
    img {
      object-fit: fill;
      border-radius: 0;
    }

    img:hover {
      transform: scale(1.15);
    }
  }
}

.mobile {
  .image-shadow {
    img {
      width: 10px;
      border-radius: 4px;
    }
  }
}
</style>
