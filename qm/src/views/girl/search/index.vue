<template>
  <div :class="mobile ? 'app-container mobile' : 'app-container'">
    <div class="image-container">
      <div
        v-if="!loading && girls.length > 0"
        class="image-list"
        :style="mobile ? ('width: ' + mobileImagesWidth + 'px;') : ''"
      >
        <div
          v-for="type in types"
          :key="type"
          style="text-align: center"
        >
          <el-divider
            content-position="left"
          >
            <span style="color: whitesmoke; font-size: 30px;">{{ asType(type) }}</span></el-divider>
          <ul>
            <li
              v-for="image in girls"
              v-if="image.type === type"
              :key="image.id"
            >
              <girl-item
                :key-words="keyWords"
                :image="image"
                :src="SERVER + image.mainImage"
              />
            </li>
          </ul>
        </div>
      </div>
      <div
        v-if="loading"
        class="loading"
      >
        <ripple />
      </div>
      <div
        v-if="!loading && girls.length === 0"
        class="empty"
      >
        <span>抱歉，沒找到妳想要的教師.....<svg-icon
          style="font-size: 22px; margin-left: 10px;"
          name="cry"
        /></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Layout from '@/common/layout'
import { search } from '@/api/girls'
import GirlItem from '../components/GirlItem.vue'
import { GirlResp } from '@/api/girlType'
import { deviceResizeSupporter } from '@/utils/mixin'
import NProgress from 'nprogress'
import Ripple from '@/components/Loading/Ripple.vue'

@Component({
  name: 'GirlSearch',
  components: {
    Ripple,
    GirlItem
  }
})
export default class extends mixins(Layout) {
  private SERVER = process.env.VUE_APP_IMAGE_SERVER
  private types: string[] = []
  private girls: GirlResp[] = []
  private keyWords: string[] = []

  private mobileImagesWidth = 0
  private loading: boolean = true

  @Watch('$route')
  onQueryChange(v: any) {
    this.getImages(this.$route.query.q as string)
  }

  private async getImages(q: string) {
    this.loading = true
    NProgress.start()
    this.types = []
    const data = await search({ q: q })
    this.loading = false
    this.keyWords = data.value.keyWords
    this.girls =  data.value.girls
    this.girls.forEach(g => {
      if (this.types.indexOf(g.type) < 0) {
        this.types.push(g.type)
      }
    })
    NProgress.done()
  }

  private asType(type: string) {
    switch (type) {
      case "QM":
        return "楼风"
      case "SN":
        return "会所"
      case "VIDEO":
        return "视频"
      case "PIC":
        return "美图"
    }
  }

  private resize() {
    if (this.mobile) {
      const c = Math.floor(window.outerWidth * 0.98 / 165)
      this.mobileImagesWidth = c * 172
    }
  }

  mounted() {
    this.getImages(this.$route.query.q as string)
  }

  created() {
    this.resize()
    deviceResizeSupporter(this.resize)
  }
}
</script>

<style lang="scss" scoped>
.image-container {
  width: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 5px;
  justify-items: center;
  margin-top: 20px;

  .image-list {
    width: 950px;
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

.el-divider__text {
  background-color: #000;
}

.el-divider--horizontal {
  background-color: #2F2F2F;
  margin-left: 15px;
  width: 140px;
}

.el-input__suffix {
  display: none;
}

.el-input__inner {
  background-color: whitesmoke;
}
</style>
