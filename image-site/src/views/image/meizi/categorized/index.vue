<template>
  <div :class="mobile ? 'app-container mobile' : 'app-container'">
    <div class="image-container">
      <div
        class="image-list"
        :style="mobile ? ('width: ' + mobileImagesWidth + 'px;') : ''"
      >
        <ul>
          <li
            v-for="item in images"
            :key="item.id"
          >
            <image-item
              :image="item"
              :src="'http://172.20.10.2/images' + item.src"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Layout from '@/common/layout'
import { getPaged } from '@/api/imageApi'
import ImageItem from '../components/ImageItem.vue'
import { ImageResp } from '@/api/imageType'
import { DeviceType, AppModule } from '@/store/modules/app'
import { deviceResizeSupporter } from '@/utils/mixin'

@Component({
  name: 'ImageCategorized',
  components: {
    ImageItem
  }
})
export default class extends mixins(Layout) {
  private TYPE = 'image'
  private SUB_TYPE = 'meizi'
  private STEP_COUNT = 20

  private loadedAll: boolean = false
  private mobileImagesWidth = 0
  private images: ImageResp[] = []

  private async getImages(start: number, count: number) {
    let data = await getPaged({ start: start, count: count, type: this.SUB_TYPE, category: this.category, rank: this.$route.params.rank })
    if (data.values.length > 0) {
      this.images.push(...data.values)
    } else {
      this.loadedAll = true
    }
  }

  private resize() {
    if (this.mobile) {
      const c = Math.floor(window.outerWidth * 0.98 / 165)
      this.mobileImagesWidth = c * 172
    }
  }

  private loadWhenScroll() {
    let counter = 1
    window.addEventListener('scroll', async(e: Event) => {
      if (!this.loadedAll) {
        const viewHeight = document.documentElement.clientHeight || window.innerHeight
        const scrollTop = window.document.scrollingElement.scrollTop
        const scrollHeight = window.document.scrollingElement.scrollHeight
        if (scrollTop + viewHeight >= scrollHeight) {
          await this.getImages(this.STEP_COUNT * (counter++), this.STEP_COUNT)
        }
      }
    })
  }

  mounted() {
    this.getImages(0, this.STEP_COUNT)
  }

  created() {
    this.resize()
    deviceResizeSupporter(this.resize)
    this.changeCategory(this.TYPE, this.SUB_TYPE)
    this.scrollToPosition()
    this.loadWhenScroll()
  }
}
</script>

<style lang="scss" scoped>
.image-container {
  width: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 900px;
  grid-column-gap: 5px;
  justify-items: left;

  .image-list {
    width: 100%;
    grid-column: 1 / 4;

    ul {
      padding: 0;
      margin-top: 20px;
      @include clearfix;
      li {
        margin-top: 0;
        float: left;
        list-style: none;
        margin-left: 15px;
      }
    }
  }
}

.mobile {
  .image-container {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    justify-content: center;
    justify-items: center;

    .image-list {
      width: 100%;
      ul {
        padding-right: 0;
        li {
          margin-left: 5px;
          margin-right: 0;
        }
      }
    }
  }
}
</style>
