<template>
  <div :class="mobile ? 'app-container mobile' : 'app-container'">
    <div class="image-container">
      <div
        v-if="!loading && result.images.length > 0"
        class="image-list"
        :style="mobile ? ('width: ' + mobileImagesWidth + 'px;') : ''"
      >
        <ul>
          <li
            v-for="image in result.images"
            :key="image.id"
          >
            <image-item
              :key-words="result.keyWords"
              :image="image"
              :src="'http://172.20.10.2/images' + image.src"
            />
          </li>
        </ul>
      </div>
      <div
        v-if="loading"
        class="loading"
      >
        <ripple />
      </div>
      <div
        v-if="!loading && result.images.length === 0"
        class="empty"
      >
        <span>对不起，没找到你要的妹子.....</span>
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
import Ripple from '@/components/Loading/Ripple.vue'

@Component({
  name: 'ImageSearch',
  components: {
    Ripple,
    ImageItem
  }
})
export default class extends mixins(Layout) {
  private TYPE = 'image'
  private SUB_TYPE = 'meizi'

  private mobileImagesWidth = 0
  private result: { images: ImageResp[], keyWords: string[] } = {
    images: [],
    keyWords: []
  }
  private loading: boolean = true

  @Watch('$route')
  onQueryChange(v: any) {
    this.getImages(this.$route.query.q as string)
  }

  private async getImages(q: string) {
    this.loading = true
    NProgress.start()
    let data = await search({ q: q })
    this.loading = false
    this.result = data.value
    NProgress.done()
  }

  private resize() {
    if (this.mobile) {
      const c = Math.floor(window.outerWidth * 0.98 / 165)
      this.mobileImagesWidth = c * 172
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

  .loading {
    margin: 20% auto auto;
  }

  .empty {
    width: 80%;
    height: 200px;
    margin: 4% auto auto;
    border: 2px solid #2F2F2F;
    display: flex;
    justify-content: center;

    span {
      margin: auto;
      font-size: 20px;
      color: #A3A2A2;
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
