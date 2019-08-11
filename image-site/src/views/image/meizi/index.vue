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
      <div
        v-if="!mobile"
        class="image-right"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Layout from '../../common/layout'
import { getPaged } from '@/api/imageApi'
import ImageItem from './components/ImageItem.vue'
import { ImageResp } from '@/api/imageType'
import { DeviceType, AppModule } from '@/store/modules/app'
import { deviceResizeSupporter } from '@/utils/mixin'

@Component({
  name: 'Dashboard',
  components: {
    ImageItem
  }
})
export default class extends mixins(Layout) {
  private mobileImagesWidth = 0
  private images: ImageResp[] = []

  created() {
    this.getImages()
  }

  private async getImages() {
    this.images = []
    let data = await getPaged({ start: 0, count: 51, type: 'meizi', category: this.category })
    this.images = data.values
  }

  private resize() {
    if (this.mobile) {
      const c = Math.floor(window.outerWidth * 0.98 / 165)
      this.mobileImagesWidth = c * 170
    }
  }

  mounted() {
    this.resize()
    deviceResizeSupporter(this.resize)
    this.changeCategory('image', 'meizi')
  }
}
</script>

<style lang="scss" scoped>
.image-container {
  width: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(3, 243px) 320px;
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

  .image-right {
    width: 100%;
    margin-top: 20px;
    grid-column: 4 / 5;
    border: 1px #f90 solid;
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
