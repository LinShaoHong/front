<template>
  <div :class="mobile ? 'app-container mobile' : 'app-container'">
    <div class="image-container">
      <div
        class="image-list"
        :style="mobile ? ('width: ' + mobileImagesWidth + 'px;') : ''"
      >
        <div class="category-rank-city-select">
          <span style="color: whitesmoke">排序:</span>
          <el-select v-model="rank"
                     size="mini"
                     style="width: 80px; margin-right: 20px;"
                     @change="onChange"
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
                     style="width: 80px; margin-right: 20px;"
                     @change="onChange"
          >
            <el-option
              label="不限"
              value=""
            >
            </el-option>
            <el-option
              v-for="city in cities"
              :label="city"
              :value="city"
            >
            </el-option>
          </el-select>
          <span v-if="categories.length > 2" style="color: whitesmoke">類型:</span>
          <el-select v-if="categories.length > 2"
                     v-model="category2"
                     size="mini"
                     style="width: 130px;"
                     @change="onChange"
          >
            <el-option
              label="不限"
              value=""
            >
            </el-option>
            <el-option
              v-for="r in categories"
              :label="r.name"
              :value="r.nameSpell"
            >
            </el-option>
          </el-select>
          <input
            v-if="!mobile"
            class="sub-search-input"
            v-model="q"
            @keyup="pressSearch"
            :placeholder="searchPlaceholder"
          >
          </input>
          <button
            v-if="!mobile"
            class="sub-search-button"
            @click="search"
          >
            <i class="el-icon-search" />
          </button>
        </div>
        <ul v-if="girls.length > 0">
          <li
            v-for="item in girls"
            :key="item.id"
          >
            <girl-item
              :image="item"
              :src="SERVER + item.mainImage"
              :keyWords="item.keyWords"
            />
          </li>
        </ul>
        <div v-else class="empty">
          <span>{{ '抱歉，' + (city === ''?  '沒找到' : '【' + city + '】地區没有') + '妳想要的' + (categoryName === ''? '' : '【' + categoryName + '】') + '教師.....' }}<svg-icon
            style="font-size: 22px; margin-left: 10px;"
            name="cry"
          /></span>
        </div>
        <div v-if="!loadedAll" class="loading"
        >
          <ripple />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Layout from '@/common/layout'
import { GirlResp } from '@/api/girlType'
import { paged, city, getCategory } from '@/api/girls'
import GirlItem from '../components/GirlItem.vue'
import { deviceResizeSupporter } from '@/utils/mixin'
import Ripple from '@/components/Loading/Ripple.vue'

@Component({
  name: 'GirlQM',
  components: {
    GirlItem,
    Ripple
  }
})
export default class extends mixins(Layout) {
  private TYPE: string = 'QM'

  private loading = true
  private category2: string = ''
  private categories: { name: string, nameSpell: string }[] = []

  private rank: string = 'updateTime'
  private ranks: { label: string, value: string }[] = [
    { label: "最新", value: "updateTime" },
    { label: "人氣", value: "visits" },
    { label: "點贊", value: "likes" },
    { label: "購買", value: "payments" },
    { label: "收藏", value: "collects" }
  ]
  private q: string = ''

  private STEP_COUNT = 20
  private SERVER = process.env.VUE_APP_IMAGE_SERVER
  private girls: GirlResp[] = []

  private scrollCounter: number = 1;

  private loadedAll: boolean = false
  private mobileImagesWidth = 0

  private cities: string[] = []
  private city: string = ''

  get searchPlaceholder() {
    return '按名字搜索 ' + this.city + ' 樓鳳'
  }

  get categoryName() {
    if (this.category2 === '') {
      return ''
    }
    const v = this.categories.find(v => v.nameSpell === this.category2)
    console.log(v)
    if (v) {
      return v.name
    }
    return ''
  }

  private async getGirls(start: number, count: number) {
    this.loading = true
    let data = await paged({ start: start, count: count, type: this.TYPE, rank: this.rank, city: this.city, category: this.category2, q: this.q })
    this.loading = false
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
        if (scrollTop + viewHeight >= scrollHeight - 200) {
          await this.getGirls(this.STEP_COUNT * (this.scrollCounter++), this.STEP_COUNT)
        }
      }
    })
  }

  private async onChange() {
    this.girls = []
    this.loadedAll = false
    this.scrollCounter = 1
    await this.getGirls(0, this.STEP_COUNT)
  }

  private async search() {
    this.girls = []
    this.loadedAll = false
    this.scrollCounter = 1
    await this.getGirls(0, this.STEP_COUNT)
  }

  private pressSearch(e: KeyboardEvent) {
    if (e.code === 'Enter') {
      this.search()
    }
  }

  private async getCities() {
    const data = await city({ type: this.TYPE })
    this.cities = data.values
  }

  private async getCategories() {
    const data = await getCategory({ type: this.TYPE })
    this.categories = data.values
  }

  mounted() {
    this.getGirls(0, this.STEP_COUNT)
    this.getCities()
    this.getCategories()
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

.category-rank-city-select {
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

.el-select-dropdown__item:hover {
  background-color: #757575;
}

.sub-search-input {
  width: 180px;
  margin-left: 20px;
  display: inline-block;
  color: #cacaca;
  background: #363636;
  border-radius: 3px 0 0 3px;
  outline: 0;
  border: none;
  padding: 2px 5px;
  vertical-align: top;
  cursor: text;
  font-size: 14px;
  height: 30px;
  border-left: 1px solid #757575;
  border-bottom: 1px solid #757575;
  border-top: 1px solid #757575;
  transition: all .5s ease;
}

.sub-search-input:focus {
  outline-offset: -2px;
  transition: .1s;
  box-shadow: 0 0 0.1rem #c2c2c2;
}

.sub-search-input:focus + .sub-search-button {
  box-shadow: 0 0 0.1rem #f90;
}

.sub-search-button {
  height: 30px;
  width: 50px;
  cursor: pointer;
  background: #f90;
  outline: 0;
  outline-offset: -2px;
  border: 0;
  transition: all .5s ease;

  .el-icon-search {
    margin: 0 auto;
  }
}

.loading {
  width: 100%;
  height: 200px;
  display: flex;
  justify-items: center;
  .lds-ripple {
    margin: 20px auto auto;
  }
}

.empty {
  width: 100%;
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

.mobile {
  .image-container {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    justify-content: center;
    justify-items: center;

    .loading {
      height: 100px;
    }

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
