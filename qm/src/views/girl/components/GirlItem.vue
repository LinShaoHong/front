<template>
  <div :class="mobile ? 'image-wrapper mobile' : 'image-wrapper'">
    <div
      :id="image.id"
      class="image-shadow js-tilt-container"
      @mousemove="move"
      @mouseleave="leave"
      @click="showViewer"
    >
      <img
        :id="image.id"
        v-lazy="src"
        :style="'width: ' + reWidth + 'px; height: ' + reHeight + 'px;'"
      >
    </div>
    <div
      class="content"
      @click="showViewer"
    >
      <span
        :id="'title:' + image.id"
        class="title"
        :style="'width: '+ reWidth + 'px;'"
      >{{ image.name }}</span>
    </div>
    <div class="view-like">
      <span class="view-span">
        <svg-icon
          name="click"
          style="font-size: 18px; margin-right: 3px;"
        />{{ this.image.visits | toThousands }}
      </span>
      <span
        class="like-span"
      >
        <svg-icon
          name="zan"
          style="font-size: 18px; margin-right: 3px;"
        />{{ this.image.likes | toThousands }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { DeviceType, AppModule } from '@/store/modules/app'
import { V_IMAGE } from '@/constant/image'
import { GirlResp } from '@/api/girlType'
import { LikesModule } from '@/store/modules/like'

@Component({
  name: 'GirlItem'
})
export default class extends Vue {
  @Prop({ default: '#' }) private src: string
  @Prop({ default: {} }) private image: GirlResp
  @Prop({ default: () => [] }) private keyWords!: string[]
  @Prop({ default: V_IMAGE.width }) private width!: number
  @Prop({ default: V_IMAGE.height }) private height!: number

  private showViewer() {
    let ret = LikesModule.likes.get(this.image.id)
    const liked = ret === undefined ? false : ret
    window.open(window.location.origin + process.env.VUE_APP_PUBLIC_PATH + '/#/girl/detail?id=' + this.image.id + '&liked=' + liked)
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
    let title: string = this.image.name
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
  border: 1px solid #2F2F2F;
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
    box-shadow: 0 0 16px hotpink;
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
    margin-top: 2px;
    padding: 2px;
    color: #f90;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
  }

  .title:hover{
    color: #5AA766;
    transition: all .2s ease;
  }
}

.view-like {
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
    svg-icon {

    }
  }

  .like-span {
    grid-column: 2 / 3;
    justify-self: right;
    margin-right: 5px;

    &.liked {
      color: #5AA766;
    }
  }
}

.leave {
  transform: rotateX(0) rotateY(0) !important;
  transition-timing-function: cubic-bezier(0.42, 0, 0, 1) !important;
  transition-duration: 1.5s;
}

.mobile {
  .image-shadow {
    img:hover {
      box-shadow: none;
      transform: none;
    }
  }
}
</style>
