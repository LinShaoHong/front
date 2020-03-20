<template>
  <div :class="mobile ? 'app-container mobile' : 'app-container'">
    <div class="image-container">
      <div
        class="image-list"
        :style="mobile ? ('width: ' + mobileImagesWidth + 'px;') : ''"
      >
        <div class="rank-city-select">
          <span style="color: whitesmoke">排序:</span>
          <el-select v-model="rank"
                     size="mini"
                     style="width: 80px; margin-right: 20px;"
                     @change="onRankChange"
          >
            <el-option
              v-for="r in ranks"
              :label="r.label"
              :value="r.value"
            >
            </el-option>
          </el-select>
          <span v-if="cities.length > 0" style="color: whitesmoke">地區:</span>
          <el-select v-if="cities.length > 0"
                     v-model="city"
                     size="mini"
                     style="width: 80px;"
                     @change="onCityChange"
                     placeholder="不限"
                     clearable
          >
            <el-option
              v-for="city in cities"
              :label="city"
              :value="city"
            >
            </el-option>
          </el-select>
        </div>
        <ul>
          <li
            v-for="item in girls"
            :key="item.id"
          >
            <girl-item
              :image="item"
              :src="SERVER + item.mainImage"
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
import { GirlResp } from '@/api/girlType'
import { paged, city } from '@/api/girls'
import GirlItem from '../components/GirlItem.vue'
import { deviceResizeSupporter } from '@/utils/mixin'

@Component({
  name: 'GirlQM',
  components: {
    GirlItem
  }
})
export default class extends mixins(Layout) {
  private rank: string = 'updateTime'
  private ranks: { label: string, value: string }[] = [
    { label: "最新", value: "updateTime" },
    { label: "人氣", value: "visits" },
    { label: "點贊", value: "likes" },
    { label: "購買", value: "payments" },
    { label: "收藏", value: "collects" }
  ]

  private STEP_COUNT = 20
  private SERVER = process.env.VUE_APP_IMAGE_SERVER
  private girls: GirlResp[] = []

  private scrollCounter: number = 1;

  private loadedAll: boolean = false
  private mobileImagesWidth = 0

  private cities: string[] = []
  private city: string = ''

  private async getGirls(start: number, count: number) {
    let data = await paged({ start: start, count: count, type: "QM", rank: this.rank, city: this.city })
    if (data.values.length > 0) {
      this.girls.push(...data.values)
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
    window.addEventListener('scroll', async(e: Event) => {
      if (!this.loadedAll) {
        const viewHeight = document.documentElement.clientHeight || window.innerHeight
        const scrollTop = window.document.scrollingElement.scrollTop
        const scrollHeight = window.document.scrollingElement.scrollHeight
        if (scrollTop + viewHeight >= scrollHeight) {
          await this.getGirls(this.STEP_COUNT * (this.scrollCounter++), this.STEP_COUNT)
        }
      }
    })
  }

  private async onCityChange() {
    this.girls = []
    this.loadedAll = false
    this.scrollCounter = 1
    await this.getGirls(0, this.STEP_COUNT)
  }

  private async onRankChange(){
    this.girls = []
    this.loadedAll = false
    this.scrollCounter = 1
    await this.getGirls(0, this.STEP_COUNT)
  }

  private async getCities() {
    const data = await city({ type: 'QM' })
    this.cities = data.values
  }

  mounted() {
    this.getGirls(0, this.STEP_COUNT)
    this.getCities()
  }

  created() {
    this.rank =  this.$route.query.rank? this.$route.query.rank as string : this.rank
    this.resize()
    deviceResizeSupporter(this.resize)
    this.scrollToPosition()
    this.loadWhenScroll()
  }
}
</script>

<style lang="less">
.image-container {
  width: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 5px;
  justify-items: center;

  .image-list {
    width: 950px;
    grid-column: 1 / 1;

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

.rank-city-select {
  color: #000;
  background-color: #000;
  margin-top: 20px;
  padding-left: 16px;

  .el-select {
    width: 120px;
  }

  .el-select--medium {
    border: solid 1px #000;
  }

  .el-input__inner {
    background-color: #000;
    border: none;
    color: whitesmoke;
    font-size: 16px;
  }

  .el-input__suffix {
    display: block;
  }
}

.el-select-dropdown {
  background-color: #1b1b1b;
  border: solid 1px #f90;
}

.el-select-dropdown__item {
  color: whitesmoke;

  &.hover {
    background-color: #757575;
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
