<template>
  <div :class="mobile ? 'mobile' : ''">
    <div
      :id="image.id"
      class="image-shadow js-tilt-container"
      @mousemove="move"
      @mouseleave="leave"
      @click="showViewer"
    >
      <img
        v-lazy="src"
        :id="image.id"
        :style="'width: ' + reWidth + 'px; height: ' + reHeight + 'px;'"
      >
    </div>
    <image-details
      :image="image"
      ref="imgDetails"
    />
    <div
      class="content"
    >
      <span
        class="title"
        :style="'width: '+ reWidth + 'px;'"
      >{{ image.title }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { DeviceType, AppModule } from '@/store/modules/app'
import ImageDetails from './ImageDetails.vue'
import { V_IMAGE } from '@/constant/image'
import { ImageResp } from '@/api/imageType'

@Component({
  name: 'ImageItem',
  components: {
    ImageDetails
  }
})
export default class extends Vue {
  @Prop({ default: '#' }) private src: string
  @Prop({ default: {} }) private image: ImageResp
  @Prop({ default: V_IMAGE.width }) private width!: number
  @Prop({ default: V_IMAGE.height }) private height!: number

  private showViewer() {
    (this.$refs.imgDetails as ImageDetails).showViewer(this.image.id)
  }

  private move(e: MouseEvent) {
    const el: HTMLElement | null = window.document.getElementById(this.image.id)
    if (el !== null && !this.mobile) {
      const cursPosX = e.pageX - el.offsetLeft
      const cursPosY = e.pageY - el.offsetTop
      const cursFromCenterX = el.clientWidth / 2 - cursPosX + 200
      const cursFromCenterY = el.clientHeight / 2 - cursPosY + 100
      el.style.transform = 'perspective(500px) rotateX(' + (cursFromCenterY / 20) + 'deg) rotateY(' + -(cursFromCenterX / 20) + 'deg) translateZ(10px)'
      el.classList.remove('leave')
    }
  }

  private leave(e: any) {
    const el: HTMLElement | null = window.document.getElementById(this.image.id)
    if (el !== null && !this.mobile) {
      el.classList.add('leave')
    }
  }

  get reWidth() {
    return this.mobile ? V_IMAGE.mobile.width : this.width
  }

  get reHeight() {
    return this.mobile ? V_IMAGE.mobile.height : this.height
  }

  get mobile() {
    return AppModule.device === DeviceType.Mobile
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

.mobile {
  .image-shadow {
    img {
      border-radius: 4px;
    }
  }
}
</style>
