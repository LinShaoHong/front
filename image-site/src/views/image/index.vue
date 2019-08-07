<template>
  <div :class="mobile ? 'app-container mobile' : 'app-container'">
    <div class="image-carousel">
      <el-carousel
        v-show="!mobile"
        :interval="4000"
        type="card"
        height="600px"
      >
        <el-carousel-item
          v-for="i in 3"
          :key="i"
        >
          <image-item
            :id="'img' + (i + 100)"
            :carousel="true"
            :width="500"
            :height="600"
            :img-src="imgList[i - 1]"
          />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="image-container">
      <div class="image-list">
        <ul>
          <li>
            <image-item
              :img-src="imgList[0]"
              :id="1"
            >
            </image-item>
          </li>
          <li>
            <image-item
              :img-src="imgList[1]"
              :id="2"
            >
            </image-item>
          </li>
          <li>
            <image-item
              :img-src="imgList[2]"
              :id="3"
            >
            </image-item>
          </li>
          <li>
            <image-item
              :img-src="imgList[3]"
              :id="4"
            >
            </image-item>
          </li>
          <li>
            <image-item
              :img-src="imgList[4]"
              :id="5"
            >
            </image-item>
          </li>
          <li>
            <image-item
              :img-src="imgList[5]"
              :id="6"
            >
            </image-item>
          </li>
        </ul>
      </div>
      <div v-show="!mobile" class="image-right">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ImageItem from './components/ImageItem.vue'
import { DeviceType, AppModule } from '@/store/modules/app'

@Component({
  name: 'Dashboard',
  components: {
    ImageItem
  }
})
export default class extends Vue {
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
    'http://172.20.10.2/images/158514725/1856011515/details/1540541095.jpg'
  ]

  get mobile() {
    return AppModule.device === DeviceType.Mobile
  }
}
</script>

<style lang="scss" scoped>
.image-container {
  margin-top: 1%;
  width: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 48rem 1fr;

  .image-list {
    margin-top: 20px;
    width: 770px;

    ul {
      padding: 0;
      margin-top: 0;
      li{
        margin-top: 0;
        float: left;
        list-style:none;
        margin-left: 15px;
      }
    }
  }

  .image-right {
    width: 350px;
    height: 1000px;
    margin-top: 20px;
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

  .el-carousel__item {
    width: 500px;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #000;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #000;
  }
}

.mobile {
  .image-list {
    width: 100%;
    ul li {
      margin-left: 10px;
    }
  }
}
</style>
