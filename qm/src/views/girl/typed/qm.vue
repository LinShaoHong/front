<template>
  <div :class="mobile ? 'app-container mobile' : 'app-container'">
    <div class="image-container">
      <div
        class="image-list"
        :style="mobile ? ('width: ' + mobileImagesWidth + 'px;') : ''"
      >
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
import { paged } from '@/api/girls'
import GirlItem from '../components/GirlItem.vue'
import { deviceResizeSupporter } from '@/utils/mixin'

@Component({
  name: 'GirlQM',
  components: {
    GirlItem
  }
})
export default class extends mixins(Layout) {
  private rank: string = ''

  private STEP_COUNT = 20
  private SERVER = process.env.VUE_APP_IMAGE_SERVER
  private girls: GirlResp[] = []

  private loadedAll: boolean = false
  private mobileImagesWidth = 0

  private async getGirls(start: number, count: number) {
    let data = await paged({ start: start, count: count, type: "QM", rank: this.rank })
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
    let counter = 1
    window.addEventListener('scroll', async(e: Event) => {
      if (!this.loadedAll) {
        const viewHeight = document.documentElement.clientHeight || window.innerHeight
        const scrollTop = window.document.scrollingElement.scrollTop
        const scrollHeight = window.document.scrollingElement.scrollHeight
        if (scrollTop + viewHeight >= scrollHeight) {
          await this.getGirls(this.STEP_COUNT * (counter++), this.STEP_COUNT)
        }
      }
    })
  }

  mounted() {
    this.getGirls(0, this.STEP_COUNT)
  }

  created() {
    this.rank =  this.$route.query.rank as string
    this.resize()
    deviceResizeSupporter(this.resize)
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
