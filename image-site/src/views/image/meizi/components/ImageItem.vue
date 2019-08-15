<template>
  <div :class="mobile ? 'image-wrapper mobile' : 'image-wrapper'">
    <div
      :id="image.id"
      class="image-shadow js-tilt-container"
      @mousemove="move"
      @mouseleave="leave"
      @click="showViewerOnImage"
    >
      <img
        :id="image.id"
        v-lazy="src"
        :style="'width: ' + reWidth + 'px; height: ' + reHeight + 'px;'"
      >
    </div>
    <image-details
      ref="imgDetails"
      :image="image"
    />
    <div
      class="content"
      @click="showViewer"
    >
      <span
        :id="'title:' + image.id"
        class="title"
        :style="'width: '+ reWidth + 'px;'"
      >{{ image.title }}</span>
    </div>
    <div class="view-like">
      <span class="view-span">
        浏览({{ visits | toThousands }})
      </span>
      <span class="like-span">
        点赞({{ likes | toThousands }})
      </span>
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
  @Prop({ default: () => [] }) private keyWords!: string[]
  @Prop({ default: V_IMAGE.width }) private width!: number
  @Prop({ default: V_IMAGE.height }) private height!: number

  private visits: number = this.image.visits
  private likes: number = this.image.likes

  private showViewer() {
    (this.$refs.imgDetails as ImageDetails).showViewer()
    this.visits = this.visits + 1
  }

  private showViewerOnImage() {
    if (!this.mobile) {
      this.showViewer()
    }
  }

  private move(e: MouseEvent) {
    const el: HTMLElement | null = window.document.getElementById(this.image.id)
    if (el !== null && !this.mobile) {
      const cursPosY = e.pageY - el.offsetTop
      const cursFromCenterY = el.clientHeight / 2 - cursPosY
      el.style.transform = 'perspective(500px) rotateX(' + (cursFromCenterY / 40) + 'deg) translateZ(10px)'
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

  private highlight() {
    const el: HTMLElement = document.getElementById('title:' + this.image.id)
    let title: string = this.image.title
    if (title.length > 24) {
      title = title.substring(0, 24)
    }
    if (this.keyWords.length > 0) {
      this.keyWords.forEach(word => {
        title = title.replace(word, '<em style="color: #5AA766; font-style: normal;">' + word + '</em>')
      })
    }
    el.innerHTML = title
  }

  mounted() {
    this.highlight()
  }
}
</script>

<style lang="scss" scoped>
.image-wrapper {
  border: 1px solid #2F2F2F;
  margin-bottom: 15px;
}

.image-wrapper:hover {
  border: 1px solid #f90;
  transition: all 1s ease;
}

.image-shadow {
  position: relative;
  background-size: cover;
  cursor: pointer;
  transition: all 2.5s ease;

  img {
    object-fit: fill;
    transition: all 1s ease;
    margin: auto;
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
  margin-top: 5px;
  cursor: pointer;

  .title {
    height: 30px;
    font-size: 13px;
    line-height: 14px;
    display: block;
    width: 100%;
    margin-top: 2px;
    padding: 2px;
    color: #f90;
  }

  .title:hover{
    color: #5AA766;
    transition: all .5s ease;
  }
}

.view-like {
  padding-top: 5px;
  width: 100%;
  display: inline-grid;
  grid-template-columns: 1fr 1fr;

  span {
    line-height: 20px;
    color: #A3A2A2;
    font-size: 11px;
  }

  .view-span {
    grid-column: 1 / 2;
    justify-self: left;
    margin-left: 5px;
  }

  .like-span {
    grid-column: 2 / 3;
    justify-self: right;
    margin-right: 5px;
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
    }
  }
}
</style>
