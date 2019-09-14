<template>
  <div :class="mobile ? 'app-container mobile' : 'app-container'">
    <div class="image-container">
      <div
        class="image-list"
        :style="mobile ? ('width: ' + mobileImagesWidth + 'px;') : ''"
      >
        <div
          v-for="(v, index) in groupedImages"
          :key="v.name"
        >
          <div
            :id="'label:' + v.name"
            class="category-label"
          >
            <div class="divider_text_left">
              <hr class="divider">
            </div>
            <div class="span_text">
              <span
                class="category-span"
              >{{ v.label }}</span>
              <div class="category-rank">
                <div
                  class="rank-item"
                  :style="groupedRanks[index] === 'updateTime' ? 'border-bottom: 1px solid #5AA766;' : ''"
                  @mouseover="selectRank(v.name, 'updateTime')"
                >
                  <span
                    @click="toCategorized(v.name, 'updateTime')"
                  >最新</span>
                </div>
                <div
                  class="rank-item"
                  :style="groupedRanks[index] === 'visits' ? 'border-bottom: 1px solid #5AA766;' : ''"
                  @mouseover="selectRank(v.name, 'visits')"
                >
                  <span
                    @click="toCategorized(v.name, 'visits')"
                  >人气</span>
                </div>
                <div
                  class="rank-item"
                  :style="groupedRanks[index] === 'likes' ? 'border-bottom: 1px solid #5AA766;' : ''"
                  @mouseover="selectRank(v.name, 'likes')"
                >
                  <span
                    @click="toCategorized(v.name, 'likes')"
                  >点赞</span>
                </div>
              </div>
            </div>
            <div class="divider_text_right">
              <hr class="divider">
            </div>
          </div>
          <ul v-if="v.images.length > 0">
            <li
              v-for="item in v.images"
              :key="item.id"
            >
              <image-item
                :image="item"
                :src="SERVER + item.src"
              />
            </li>
          </ul>
          <div
            v-else
            class="loading"
          >
            <ripple />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Layout from '@/common/layout'
import { getPaged } from '@/api/imageApi'
import ImageItem from './components/ImageItem.vue'
import { ImageResp } from '@/api/imageType'
import { DeviceType, AppModule } from '@/store/modules/app'
import { CategoryModule, ICategory } from '@/store/modules/category'
import { deviceResizeSupporter } from '@/utils/mixin'
import Ripple from '@/components/Loading/Ripple.vue'

@Component({
  name: 'ImageMeizi',
  components: {
    Ripple,
    ImageItem
  }
})
export default class extends mixins(Layout) {
  private TYPE = 'image'
  private SUB_TYPE = 'meizi'
  private SERVER = process.env.VUE_APP_IMAGE_SERVER

  private mobileImagesWidth = 0
  private groupedImages: { label: string, name: string, images: ImageResp[] }[] = []
  private groupedRanks: string[] = []

  private async selectRank(category: string, rank: string) {
    const count = this.mobile ? 6 : 10
    const index = this.groupedImages.findIndex(v => v.name === category)
    if (index >= 0) {
      this.groupedRanks[index] = rank
      let data = await getPaged({ start: 0, count: count, type: this.SUB_TYPE, category: category, rank: rank })
      this.groupedImages[index].images = data.values
    }
  }

  private toCategorized(name: string, rank: string) {
    this.$router.push({ name: this.TYPE.concat('-', this.SUB_TYPE, '-category'), params: { category: name, rank: rank } })
  }

  private async getImages(count: number, label: string, name: string) {
    let index = this.groupedImages.findIndex(v => v.name === name)
    if (index < 0 || (index > 0 && this.groupedImages[index].images.length === 0)) {
      let data = await getPaged({ start: 0, count: count, type: this.SUB_TYPE, category: name })
      index = this.groupedImages.findIndex(v => v.name === name)
      if (index < 0) {
        this.groupedImages.push({ label: label, name: name, images: data.values })
      } else {
        this.groupedImages[index].images = data.values
      }
      this.groupedImages.sort((o1, o2) => {
        const i1 = this.items.findIndex(v => v.name === o1.name)
        const i2 = this.items.findIndex(v => v.name === o2.name)
        return i1 - i2
      })
    }
  }

  private loadWhenScrolling() {
    window.addEventListener('scroll', (e: Event) => {
      let j = 1
      let found: boolean = false
      const count = this.mobile ? 6 : 10
      for (let index = 1; index < this.items.length; index++) {
        const item = this.items[index]
        const id = 'label:' + item.name
        const el: HTMLElement = document.getElementById(id)
        const rectTop = el === null ? 0 : el.getBoundingClientRect().top
        const viewHeight = document.documentElement.clientHeight || window.innerHeight
        if (rectTop < 0) {
          j = index
        }
        if (rectTop > 0 && rectTop < viewHeight) {
          CategoryModule.ChangeIndex(index)
          this.getImages(count, item.label, item.name)
          if (index > 1) {
            this.getImages(count, this.items[index - 1].label, this.items[index - 1].name)
          }
          if (index < this.items.length - 1) {
            this.getImages(count, this.items[index + 1].label, this.items[index + 1].name)
          }
          found = true
          break
        }
      }
      if (!found) {
        const item = this.items[j]
        this.getImages(count, item.label, item.name)
        if (j > 1) {
          this.getImages(count, this.items[j - 1].label, this.items[j - 1].name)
        }
        if (j < this.items.length - 1) {
          this.getImages(count, this.items[j + 1].label, this.items[j + 1].name)
        }
      }
    }, false)
  }

  private resize() {
    if (this.mobile) {
      const c = Math.floor(window.outerWidth * 0.98 / 165)
      this.mobileImagesWidth = c * 172
    }
  }

  get items(): { label: string, name: string }[] {
    return CategoryModule.category.items
  }

  private async loadGroupedImages() {
    let len: number = this.items.length
    len = len < 2 ? len : 2
    const count = this.mobile ? 6 : 10
    for (let i = 1; i < this.items.length; i++) {
      this.groupedRanks.push('updateTime')
      if (i <= len) {
        await this.getImages(count, this.items[i].label, this.items[i].name)
      } else {
        if (this.groupedImages[i] === undefined) {
          this.groupedImages.push({ label: this.items[i].label, name: this.items[i].name, images: [] })
        }
      }
    }
  }

  created() {
    this.resize()
    deviceResizeSupporter(this.resize)
    this.changeCategory(this.TYPE, this.SUB_TYPE)
  }

  mounted() {
    let interval = setInterval(() => {
      if (CategoryModule.category !== undefined) {
        this.loadGroupedImages()
        clearInterval(interval)
      }
    }, 100)
    this.loadWhenScrolling()
    this.scrollToPosition()
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
    margin-top: 20px;
    width: 100%;
    grid-column: 1 / 4;

    .category-label {
      margin-bottom: 10px;
      display: grid;
      grid-template-columns: 60px auto 1fr;
      grid-column-gap: 10px;
      align-content: center;
      justify-content: center;
      margin-left: 16px;

      .span_text {
        grid-column: 2 / 3;
        .category-span {
          color: white;
          font-size: 24px;
          line-height: 24px;
        }

        .category-rank {
          float: right;
          padding-top: 2px;
          margin-left: 10px;

          .rank-item {
            float: left;
            padding-bottom: 3px;
            margin-left: 10px;
            span {
              font-size: 15px;
              color: white;
              cursor: pointer;
            }
          }
        }
      }

      .divider_text_left {
        grid-column: 1 / 2;
      }

      .divider_text_right {
        grid-column: 3 / 4;
        margin-right: 13px;
      }

      .divider {
        float: left;
        width: 98%;
        border: 1px solid #2F2F2F;
      }
    }

    ul {
      padding: 0;
      margin-top: 5px;
      @include clearfix;
      li {
        margin-top: 0;
        float: left;
        list-style: none;
        margin-left: 15px;
      }
    }

    .loading {
      width: 100%;
      height: 500px;
      display: flex;
      justify-items: center;
      .lds-ripple {
        margin: 20px auto auto;
      }
    }
  }
}

.category-span:hover {
  color: #5AA766;
}

.mobile {
  .image-container {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    justify-content: center;
    justify-items: center;

    .image-list {
      .category-label {
        margin-left: 0;
        grid-column-gap: 5px;
        .span_text {
          .category-span {
            margin-left: 10px;
            margin-right: 5px;
          }
        }

        .divider_text_left {
          margin-left: 5px;
        }

        .divider_text_right {
          margin-right: 1px;
        }
      }

      width: 100%;
      ul {
        padding-right: 0;
        li {
          margin-left: 5px;
          margin-right: 0;
        }
      }
      .loading {
        height: 800px;
      }
    }
  }
}
</style>
