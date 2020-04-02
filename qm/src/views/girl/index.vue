<template>
  <div :class="mobile ? 'app-container mobile' : 'app-container desktop'">
    <div  class="main-image-container">
      <div v-if="!mobiel && carousels.length > 0" class="image-header">
        <div class="image-carousel">
          <el-carousel :interval="2000" type="card" height="550px">
            <el-carousel-item v-for="item in carousels" :key="item.id">
              <img
                :src="SERVER + item.mainImage"
                style="width: 360px; height: 550px;"
                @click="toDetail(item.id)"
              >
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div v-else-if="loading" class="loading"
      >
        <ripple />
      </div>
      <div
        class="main-image-list"
      >
        <div
          v-for="(v, index) in groupedGirls"
          v-if="v.girls.length > 0"
          :key="v.name"
          class="typed-girls"
        >
          <div class="typed-girls-item"
               :style="mobile ? ('width: ' + mobileImagesWidth + 'px;') : ''"
          >
            <div
              :id="'label:' + v.type"
              class="category-label"
            >
              <div class="divider_text_left">
                <hr class="divider">
              </div>
              <div class="span_text">
                <span
                  class="category-span"
                >{{ v.label }}</span>
                <div v-if="!mobile" class="category-rank">
                  <div
                    class="rank-item"
                    :style="groupedRanks[index] === 'updateTime' ? 'border-bottom: 1px solid #5AA766;' : ''"
                  >
                  <span
                    @click="selectRank(v.type, 'updateTime')"
                  >最新</span>
                  </div>
                  <div
                    class="rank-item"
                    :style="groupedRanks[index] === 'visits' ? 'border-bottom: 1px solid #5AA766;' : ''"
                  >
                  <span
                    @click="selectRank(v.type, 'visits')"
                  >人氣</span>
                  </div>
                  <div
                    class="rank-item"
                    :style="groupedRanks[index] === 'likes' ? 'border-bottom: 1px solid #5AA766;' : ''"
                  >
                  <span
                    @click="selectRank(v.type, 'likes')"
                  >點贊</span>
                  </div>
                </div>
              </div>
              <div class="divider_text_medium">
                <hr class="divider">
              </div>
              <div  class="span_text_right">
                <div class="category-rank-right">
                  <div
                    class="rank-item"
                    style="cursor: pointer"
                    @click="refresh(v.type)"
                  >
                    <i class="el-icon-refresh" style="color: whitesmoke; float: left; margin-right: 3px; line-height: 20px; cursor: pointer"></i>
                    <span
                    >換一換</span>
                  </div>
                  <div
                    class="rank-item more"
                  >
                  <span
                    @click="showMore(v.type)"
                  >更多</span>
                    <i class="el-icon-arrow-right" style="color: whitesmoke; line-height: 20px"></i>
                  </div>
                </div>
              </div>
            </div>
            <ul v-if="v.girls.length > 0">
              <li
                v-for="item in v.girls"
                :key="item.id"
              >
                <girl-item
                  :image="item"
                  :src="SERVER + item.mainImage"
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
          <div v-if="!mobile" class="girl-hot-list">
            <div class="gir-hot-header" style="padding-bottom: 10px;">
              <span style="color: whitesmoke; font-size: 30px;">熱門</span>
            </div>
            <div class="hot-item__list">
              <div class="hot-item"
                   v-for="(item, i ) in v.hots"
                   :key="item.id"
              >
                <div class="hot-item__wrapper">
                  <div v-if="i < 3" class="hot-num">
                    <el-tag size="mini" style="background-color: #1b1b1b">{{ i + 1 }}</el-tag>
                  </div>
                  <div v-else class="hot-num" style="display: flex; align-items: center;">
                    <span style="color: #a3a2a2;">{{ i + 1 }}</span>
                  </div>
                  <div v-if="i < 3" class="hot-info-img__wrapper">
                    <div class="hot-img" style="margin-right: 3px;">
                      <img :src="SERVER + item.mainImage" style="width: 100px; height: 120px; cursor: pointer;" @click="toDetail(item.id)">
                    </div>
                    <div class="hot-info" style="align-content: center">
                      <span @click="toDetail(item.id)">{{ (item.city === null? '' : item.city) + ' ' + item.name }}</span>
                    </div>
                  </div>
                  <div v-else class="hot-info__wrapper">
                    <div class="hot-info-name" style="display: flex; align-items: center;">
                      <span @click="toDetail(item.id)">{{ (item.city === null? '' : item.city) + ' ' + item.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
import { paged, getIndex } from '@/api/girls'
import GirlItem from './components/GirlItem.vue'
import { GirlResp } from '@/api/girlType'
import { MenuModule, MenuItem } from '@/store/modules/menu'
import { deviceResizeSupporter } from '@/utils/mixin'
import Ripple from '@/components/Loading/Ripple.vue'

@Component({
  name: 'Girl',
  components: {
    Ripple,
    GirlItem
  }
})
export default class extends mixins(Layout) {
  private TYPE = 'girl'
  private SERVER = process.env.VUE_APP_IMAGE_SERVER

  private loading: boolean = true
  private mobileImagesWidth = 0
  private groupedGirls: { label: string, type: string, girls: GirlResp[], hots: GirlResp[] }[] = []
  private groupedRanks: string[] = []
  private curRank: string = 'visits'
  private typeStarts: Map<string, number> = new Map()

  get carousels() {
    if (this.mobile) {
      return []
    }
    let carousels: GirlResp[] = []
    if (this.groupedGirls && this.groupedGirls.length > 0) {
      this.groupedGirls.forEach(g => g.hots.forEach((v, i) => {
        if (i < 5) {
          carousels.push(v)
        }
      }))
    }
    return carousels
  }

  get menus(): MenuItem[] {
    return MenuModule.menus.filter(m => m.type !== null)
  }

  private toDetail(id: string) {
    if (this.mobile) {
      this.$router.push({ path: '/girl/detail', query: { id: id, liked: 'false' } })
    } else {
      window.open(window.location.origin + process.env.VUE_APP_PUBLIC_PATH + '/#/girl/detail?liked=false&id=' + id)
    }
  }

  private async selectRank(type: string, rank: string) {
    const count = this.mobile ? 6 : 8
    const index = this.groupedGirls.findIndex(v => v.type === type)
    if (index >= 0) {
      this.groupedRanks[index] = rank
      let data = await paged({ start: 0, count: count, type: type, rank: rank })
      this.groupedGirls[index].girls = data.values
      this.curRank = rank
    }
  }

  private async refresh(type: string) {
    const count = this.mobile ? 6 : 8
    const index = this.groupedGirls.findIndex(v => v.type === type)
    if (index >= 0) {
      let start = this.typeStarts.get(type)
      let data = await paged({ start: start, count: count, type: type, rank: this.curRank })
      const total = data.total
      if (start + count > total) {
        start = 0
        data = await paged({ start: start, count: count, type: type, rank: this.curRank })
      }
      this.groupedGirls[index].girls = data.values
      this.typeStarts.set(type, start + count)
    }
  }

  private showMore(type: string) {
    const index = this.groupedGirls.findIndex(v => v.type === type)
    if (index >= 0) {
      const rank = this.groupedRanks[index]
      if (this.mobile) {
        this.$router.push({ path: '/girl/' + type.toLocaleLowerCase(), query: { rank: rank } })
      } else {
        window.open(window.location.origin + process.env.VUE_APP_PUBLIC_PATH + '/#/girl/' + type.toLocaleLowerCase() + '?rank=' + rank)
      }
    }
  }

  private async getGirls() {
    this.loading = true
    const types = this.menus.map(v => v.type).join(',')
    const data = await getIndex({ types: types, start: 0, count: this.mobile ? 6 : 8, hotCount: this.mobile ? 0 : 20, rank: 'visits' })
    this.groupedGirls = data.values
    this.groupedGirls.forEach(g => {
      const v = this.menus.find(v => v.type === g.type)
      if (v) {
        g.label = v.label
      }
    })
    this.groupedGirls.sort((o1, o2) => {
      const i1 = this.menus.findIndex(v => v.type === o1.type)
      const i2 = this.menus.findIndex(v => v.type === o2.type)
      return i1 - i2
    })
    this.menus.forEach((v, i) => this.groupedRanks[i] = 'visits')
    this.loading = false
  }

  private resize() {
    if (this.mobile) {
      const c = Math.floor(window.outerWidth * 0.98 / 165)
      this.mobileImagesWidth = c * 172
    }
  }

  created() {
    this.resize()
    deviceResizeSupporter(this.resize)
    this.getGirls()
  }

  mounted() {
    this.scrollToPosition()
  }
}
</script>

<style lang="less">
.desktop {
  .main-image-container {
    width: 100%;
    overflow: hidden;

    .image-header {
      margin-top: 20px;
      margin-right: 100px;

      .image-carousel {
        text-align: center;
        img {
          object-fit: fill;
          transition: all 0.5s ease;
          margin: auto;
        }

        img:hover {
          transform: scale(1.08);
        }
      }

      /deep/ .el-carousel ul {
        display: none;
      }
    }

    .main-image-list {
      margin-top: 20px;
      width: 100%;

      .typed-girls {
        height: 720px;
        display: grid;
        grid-template-columns: 2fr 1fr;

        .typed-girls-item {
          grid-column: 1 / 2;

          .category-label {
            margin-bottom: 10px;
            display: grid;
            grid-template-columns: 60px 230px 2fr 1fr;
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
            }

            .category-rank {
              float: right;
              padding-top: 2px;
              margin-left: 10px;
            }

            .rank-item {
              float: left;
              padding-bottom: 3px;
              margin-left: 10px;
              span {
                line-height: 20px;
                font-size: 15px;
                color: white;
                cursor: pointer;
              }
            }

            .category-rank-right {
              float: left;
              padding-top: 2px;
            }

            .divider_text_left {
              grid-column: 1 / 2;
            }

            .divider_text_medium {
              grid-column: 3 / 4;
            }

            .span_text_right {
              grid-column: 4 / 5;
            }

            .divider {
              float: left;
              width: 100%;
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

        .girl-hot-list {
          grid-column: 2 / 3;
          margin-bottom: 15px;

          .hot-item__list {
            overflow-y: scroll;
            scrollbar-width: none;
            -ms-overflow-style: none;
            overflow: -moz-scrollbars-none;
            height: 640px;
            border-bottom: 1px solid #2F2F2F;
            .hot-item__wrapper {
              display: grid;
              grid-template-columns: 25px 1fr;

              .hot-num {
                grid-column: 1 / 2;
              }

              .hot-info-img__wrapper {
                grid-column: 2 / 3;
                display: grid;
                grid-template-columns: 100px 1fr;

                .hot-img {
                  grid-column: 1 / 2;

                  img {
                    object-fit: fill;
                    transition: all 0.5s ease;
                    margin: auto;
                  }

                  img:hover {
                    box-shadow: 0 0 16px hotpink;
                    transform: scale(1.02);
                  }
                }

                .hot-info {
                  grid-column: 2 / 3;
                  width: 100%;
                  span {
                    cursor: pointer;
                    margin-left: 7px;
                    width: 170px;
                    color: whitesmoke;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    display: inline-block;
                  }

                  span:hover{
                    color: #5AA766;
                    transition: all .2s ease;
                  }
                }
              }

              .hot-info__wrapper {
                .hot-info-name {
                  grid-column: 2 / 3;
                  width: 100%;
                  span {
                    cursor: pointer;
                    width: 270px;
                    line-height: 28px;
                    color: whitesmoke;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    display: inline-block;
                  }

                  span:hover{
                    color: #5AA766;
                    transition: all .2s ease;
                  }
                }
              }
            }
          }

          .hot-item__list::-webkit-scrollbar {
            width: 0 !important
          }
        }
      }
    }
  }
}

.category-span:hover {
  color: #5AA766;
}

.loading {
  margin-top: 100px;
  width: 100%;
  height: 200px;
  display: flex;
  justify-items: center;
  .lds-ripple {
    margin: 20px auto auto;
  }
}

.mobile {
  .loading {
    height: 100px;
  }

  .main-image-container {
    .main-image-list {
      .typed-girls {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
        justify-content: center;
        justify-items: center;

        .typed-girls-item {
          margin-top: 10px;
          .category-label {
            margin-bottom: 10px;
            display: grid;
            grid-template-columns: 10px 100px 1fr 2fr;
            grid-column-gap: 10px;
            align-content: center;
            justify-content: center;
            margin-left: 5px;

            .span_text {
              grid-column: 2 / 3;
              .category-span {
                color: white;
                font-size: 24px;
                line-height: 24px;
              }
            }

            .category-rank {
              float: right;
              padding-top: 2px;
              margin-left: 10px;
            }

            .rank-item {
              float: left;
              padding-bottom: 3px;
              margin-left: 10px;
              span {
                line-height: 20px;
                font-size: 15px;
                color: white;
                cursor: pointer;
              }
            }

            .category-rank-right {
              float: left;
              padding-top: 2px;
            }

            .divider_text_left {
              grid-column: 1 / 2;
            }

            .divider_text_medium {
              grid-column: 3 / 4;
            }

            .span_text_right {
              grid-column: 4 / 5;
            }

            .divider {
              float: left;
              width: 100%;
              border: 1px solid #2F2F2F;
            }
          }

          ul {
            padding: 0;
            margin-top: 20px;
            @include clearfix;
            li {
              margin-top: 0;
              float: left;
              list-style: none;
              margin-left: 5px;
            }
          }
          .loading {
            height: 800px;
          }
        }
      }
    }
  }
}

.el-carousel__mask {
  display: none;
}
</style>
