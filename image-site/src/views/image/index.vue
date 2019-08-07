<template>
  <div :class="mobile ? 'app-container mobile' : 'app-container'">
    <div
      v-show="!mobile"
      class="carousel-wrapper"
    >
      <el-carousel
        :interval="4000"
        type="card"
        height="600px"
      >
        <el-carousel-item
          v-for="i in 10"
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
    <div class="image-list">
      <el-row :gutter="20">
        <el-col
          :lg="{span: 8}"
          :xl="{span: 6}"
          style="margin-bottom:10px;"
        >
          <image-item
            :id="'img1'"
            :img-src="imgList[0]"
          />
        </el-col>
        <el-col
          :lg="{span: 8}"
          :xl="{span: 6}"
          style="margin-bottom:10px;"
        >
          <image-item
            :id="'img2'"
            :img-src="imgList[1]"
          />
        </el-col>
        <el-col
          :lg="{span: 8}"
          :xl="{span: 6}"
          style="margin-bottom:10px;"
        >
          <image-item
            :id="'img3'"
            :img-src="imgList[2]"
          />
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col
          :lg="{span: 8}"
          :xl="{span: 6}"
          style="margin-bottom:10px;"
        >
          <image-item
            :id="'img4'"
            :img-src="imgList[0]"
          />
        </el-col>
        <el-col
          :lg="{span: 8}"
          :xl="{span: 6}"
          style="margin-bottom:10px;"
        >
          <image-item
            :id="'img5'"
            :img-src="imgList[1]"
          />
        </el-col>
        <el-col
          :lg="{span: 8}"
          :xl="{span: 6}"
          style="margin-bottom:10px;"
        >
          <image-item
            :id="'img6'"
            :img-src="imgList[2]"
          />
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col
          :lg="{span: 8}"
          :xl="{span: 6}"
          style="margin-bottom:10px;"
        >
          <image-item
            :id="'img7'"
            :img-src="imgList[0]"
          />
        </el-col>
        <el-col
          :lg="{span: 8}"
          :xl="{span: 6}"
          style="margin-bottom:10px;"
        >
          <image-item
            :id="'img8'"
            :img-src="imgList[1]"
          />
        </el-col>
        <el-col
          :lg="{span: 8}"
          :xl="{span: 6}"
          style="margin-bottom:10px;"
        >
          <image-item
            :id="'img9'"
            :img-src="imgList[2]"
          />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col
          :lg="{span: 8}"
          :xl="{span: 6}"
          style="margin-bottom:10px;"
        >
          <image-item
            :id="'img10'"
            :img-src="imgList[0]"
          />
        </el-col>
        <el-col
          :lg="{span: 8}"
          :xl="{span: 6}"
          style="margin-bottom:10px;"
        >
          <image-item
            :id="'img11'"
            :img-src="imgList[1]"
          />
        </el-col>
        <el-col
          :lg="{span: 8}"
          :xl="{span: 6}"
          style="margin-bottom:10px;"
        >
          <image-item
            :id="'img12'"
            :img-src="imgList[2]"
          />
        </el-col>
      </el-row>
    </div>
    <div class="image-others">
      <span style="background: red">aaaaaaaaaaaaaaaaaaaaaaaaa</span>
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
.carousel-wrapper {
  width: 93%;
  padding-left: 20px;
  padding-right: 20px;
}

.image-list {
  width: 70%;
  float: left;
}

.image-others {
  width: 30%;
  float: right;
}

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

.mobile {
  .image-list {
    width: 100%;
  }
}
</style>
