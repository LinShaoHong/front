<template>
  <div :class="mobile ? 'app-container mobile' : 'app-container'">
    <div class="image-carousel">
      <el-carousel
        v-show="!mobile"
        :interval="4000"
        type="card"
        :height="carouselHeight + 'px'"
      >
        <el-carousel-item
          :style="'width: ' + carouselWidth + 'px'"
          v-for="i in 3"
          :key="i"
        >
          <image-item
            :id="'img' + (i + 100)"
            :carousel="true"
            :width="carouselWidth"
            :height="carouselHeight"
            :img-src="imgList[i - 1]"
          />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="image-container">
      <div
        class="image-wrapper"
        :style="mobile ? ('width: ' + mobileImagesWidth + 'px;') : ''"
      >
        <ul class="image-list">
          <li v-for="(item, index) in imgList">
            <image-item
              :id="index"
              :key="index"
              :img-src="item"
            />
          </li>
        </ul>
      </div>
      <div
        v-if="!mobile"
        class="image-right"
      >
        <span style="background: red; white-space: nowrap">dddddddd</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ImageItem from './components/ImageItem.vue'
import { DeviceType, AppModule } from '@/store/modules/app'
import { deviceResizeSupporter } from '@/utils/mixin'
import { V_IMAGE } from '@/constant/image'

@Component({
  name: 'Dashboard',
  components: {
    ImageItem
  }
})
export default class extends Vue {
  private mobileImagesWidth = 0
  private carouselWidth = V_IMAGE.carousel.width
  private carouselHeight= V_IMAGE.carousel.height

  private imgList: string[] = [
    'http://172.20.10.2/images/158514725/1637791670/details/200228125.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/1540541095.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/864560260.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/91420632.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/1540541095.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/864560260.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/91420632.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/1540541095.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/864560260.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/91420632.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/1540541095.jpg',
    'http://172.20.10.2/images/158514725/1637791670/details/200228125.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/1540541095.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/864560260.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/91420632.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/1540541095.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/864560260.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/91420632.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/1540541095.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/864560260.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/91420632.jpg',
    'http://172.20.10.2/images/158514725/1856011515/details/1540541095.jpg'
  ]

  get mobile() {
    return AppModule.device === DeviceType.Mobile
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
  }
}
</script>

<style lang="scss" scoped>
.image-container {
  margin-top: 1%;
  width: 100%;
  overflow: hidden;

  .image-wrapper {
    float: left;
    .image-list {
      margin-top: 20px;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      grid-column-gap: 10px;
    }
  }

  .image-right {
    margin-top: 20px;
    float: left;
    border: 1px #f90 solid;
  }
}

.image-carousel {
  width: 85%;
  margin-left: 50px;

  .el-carousel__item h3 {
    background-color: #000;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #000;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #000;
  }
}

.mobile {
  .image-container {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    justify-content: center;
    justify-items: center;

    .image-wrapper {
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
