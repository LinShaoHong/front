<template>
  <div :class="mobile ? 'mobile' : ''">
    <div
      :id="id"
      class="image-shadow js-tilt-container"
      :style="carousel ? ('background-image:url(' + imgSrc + ');' + 'width: ' + width + 'px; height: ' + height + 'px;') : 'background-image:url(' + imgSrc + ');'"
      @mousemove="move"
      @mouseleave="leave"
      @click="showViewer"
    >
    </div>
    <image-details ref="imgDetails"></image-details>
    <div v-show="!carousel" class="content">
      <span class="title">绝美波霸厨娘真空巨乳风情身材火爆至绝美波霸厨娘真空巨乳风情身材火爆至</span>
    </div>
    <image-details></image-details>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { DeviceType, AppModule } from '@/store/modules/app'
import ImageDetails from './ImageDetails'

@Component({
  name: 'ImageItem',
  components: {
    ImageDetails
  }
})
export default class extends Vue {
  @Prop({ default: '#' }) private imgSrc: string
  @Prop({ default: '' }) private id: string
  @Prop({ default: false }) private carousel!: boolean
  @Prop({ default: 230 }) private width!: number
  @Prop({ default: 300 }) private height!: number

  private showViewer() {
    if(!this.carousel) {
      (this.$refs.imgDetails as ImageDetails).showViewer()
    }
  }

  private move(e: any) {
    const el: HTMLElement | null = window.document.getElementById(this.id)
    if (el !== null && !this.carousel && !this.mobile) {
      const left = el.offsetLeft
      const top = el.offsetTop
      const cursPosX = e.pageX - left
      const cursPosY = e.pageY - top
      const cursFromCenterX = el.clientWidth / 2 - cursPosX + 200
      const cursFromCenterY = el.clientHeight / 2 - cursPosY + 250
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
    return AppModule.device === DeviceType.Mobile
  }
}
</script>

<style>
.content {
  align-content: center;
  margin-top: 3px;
  margin-bottom: 10px;
}

.title {
  font-size: 14px;
  width: 100%;
  padding: 2px;
  color: #f90;
  line-height: 14px;
  white-space: nowrap;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-shadow:after {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: inherit;
  background-size: cover;
  transition: -webkit-filter .3s ease;
  transition: filter .3s ease;
}

.image-shadow {
  width: 100%;
  height: 22rem;
  display: block;
  position: relative;
  background-size: cover;
  cursor: pointer;
}

.js-tilt-container {
  transition: -webkit-transform .1s ease;
  transition: transform .1s ease;
  -webkit-transform: rotateX(0) rotateY(0);
  transform: rotateX(0) rotateY(0);
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
}

.leave {
  transform: rotateX(0) rotateY(0) !important;
  transition-timing-function: cubic-bezier(0.42, 0, 0, 1) !important;
  transition-duration: 1.5s;
}

.mobile .image-shadow {
  height: 15rem;
}
</style>
