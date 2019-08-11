<template>
  <div
    :class="classObj"
  >
    <div
      v-if="category !== undefined && category.items.length > 0"
      class="sidebar-container"
    >
      <div class="menu-container">
        <div
          v-for="(v, i) in category.items"
          :key="v.path"
          class="menu-item"
          @click="jump(category.subType, v.path, i)"
        >
          <div class="route-content">
            <span :class="actives[i] ? 'category-name active' : 'category-name'">{{ v.name }}</span>
          </div>
        </div>
      </div>
      <div
        v-show="!classObj.mobile"
        class="backtop"
        @click="backtop"
      >
        <i class="el-icon-arrow-up" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ErrorLog from '@/components/ErrorLog/index.vue'
import LangSelect from '@/components/LangSelect/index.vue'
import { DeviceType, AppModule } from '@/store/modules/app'
import { CategoryModule, ICategory } from '@/store/modules/category'
import { getCategories } from '@/api/categoryApi'

@Component({
  name: 'Sidebar',
  components: {
    ErrorLog,
    LangSelect
  }
})
export default class extends Vue {
  private actives: boolean[] = []

  private backtop() {
    const el = document.documentElement
    let step = 0
    let interval = setInterval(() => {
      if (el.scrollTop <= 0) {
        clearInterval(interval)
        return
      }
      step += 10
      el.scrollTop -= step
    }, 20)
  }

  get classObj() {
    return {
      sidebar: true,
      mobile: AppModule.device === DeviceType.Mobile
    }
  }

  get category() {
    this.actives = []
    if (CategoryModule.category !== undefined && CategoryModule.category.items.length > 0) {
      if (CategoryModule.category.items[0].name !== '所有') {
        CategoryModule.category.items.unshift({ name: '所有', path: null })
      }
      const name = this.$route.params['category']
      if (name !== undefined) {
        let i = 0
        CategoryModule.category.items.forEach(v => {
          if (name === v.path) {
            this.$set(this.actives, i++, true)
          } else {
            this.$set(this.actives, i++, false)
          }
        })
      } else {
        this.$set(this.actives, 0, true)
      }
    }
    return CategoryModule.category
  }

  private jump(subType: string, path: string, index: number) {
    let i = 0
    this.actives = []
    CategoryModule.category.items.forEach(v => {
      this.$set(this.actives, i++, false)
    })
    this.$set(this.actives, index, true)
    console.log(this.actives)
    if (path === null) {
      this.$router.push({ name: this.category.type.concat('-', subType) })
    } else {
      this.$router.push({ name: this.category.type.concat('-', subType, '-category'), params: { category: path } })
    }
  }

  mounted() {
    this.loadCategory()
  }

  private async loadCategory() {
    let data = await getCategories()
    const categories: Map<string, ICategory> = new Map<string, ICategory>()
    data.values.forEach(v => {
      const type: string = v.type
      const subType: string = v.subType
      const items: { name: string, path: string }[] = []
      v.items.forEach(item => {
        items.push({ name: item.label, path: item.name })
      })
      categories.set(type + ':' + subType, { type: type, subType: subType, items: items })
    })
    CategoryModule.SetCategories(categories)
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  min-width: $sideBarWidth !important;
  border-radius: 10px;
  z-index: 1001;
}

.sidebar-container {
  background: #101010;
  border: 1px solid #2F2F2F;
  border-radius: 10px;

  .menu-container {
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    max-height: $sideBarHeight !important;
    padding-top: 3px;
    padding-bottom: 5px;

    span {
      font-size: 13px;
      color: #A3A2A2;
    }

    .menu-item {
      cursor: pointer;
      padding-top: 2px;
    }

    .route-content {
      padding: 2px;
      text-align: center;

      .active {
        color: #f90;
      }

      .category-name {
        margin-left: 2px;
        margin-right: 2px;
      }
    }
  }
}

.route-content:hover .category-name {
  color: #f90;
}

.sidebar-container:hover {
  box-shadow: 0 0 6px #f90;
  transition: all .5s ease;
}

.menu-container::-webkit-scrollbar {
  display: none;
}

.backtop {
  width: 100%;
  height: 30px;
  display: inline-flex;
  justify-items: center;
  border-radius: 10px;
  cursor: pointer;

  .el-icon-arrow-up {
    color: #f90;
    margin: auto;
  }
}

.mobile {
  &.sidebar {
    min-width: $mobileSideBarWidth !important;
  }
}
</style>
