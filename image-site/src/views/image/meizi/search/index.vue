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
import { Component, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Layout from '@/common/layout'
import { search } from '@/api/imageApi'
import ImageItem from '../components/ImageItem.vue'
import { ImageResp } from '@/api/imageType'
import { DeviceType, AppModule } from '@/store/modules/app'
import { CategoryModule } from '@/store/modules/category'
import { deviceResizeSupporter } from '@/utils/mixin'
import NProgress from 'nprogress'

@Component({
  name: 'ImageSearch',
  components: {
    ImageItem
  }
})
export default class extends mixins(Layout) {
  private TYPE = 'image'
  private SUB_TYPE = 'meizi'

  private mobileImagesWidth = 0
  private images: ImageResp[] = []

  @Watch('$route')
  onQueryChange(v: any) {
    this.getImages(this.$route.query.q as string)
  }

  private async getImages(q: string) {
    NProgress.start()
    let data = await search({ q: q })
    this.images = data.values
    NProgress.done()
  }

  private resize() {
    if (this.mobile) {
      const c = Math.floor(window.outerWidth * 0.98 / 165)
      this.mobileImagesWidth = c * 170
    }
  }

  mounted() {
    this.getImages(this.$route.query.q as string)
    CategoryModule.ChangeIndex(-1)
  }

  created() {
    this.resize()
    deviceResizeSupporter(this.resize)
    this.changeCategory(this.TYPE, this.SUB_TYPE)
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
