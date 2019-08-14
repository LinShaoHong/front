<template>
  <div
    :class="classObj"
  >
    <div
      v-if="category !== undefined && category.items.length > 0"
      class="sidebar-container"
    >
      <div
        id="menuContainer"
        class="menu-container"
      >
        <div
          v-for="(v, i) in category.items"
          :id="'item:'+ i"
          :key="v.name"
          class="menu-item"
          @click="jump(category.subType, v.name, i)"
        >
          <div class="route-content">
            <span :class="actives[i] ? 'category-label active' : 'category-label'">{{ v.label }}</span>
            <span :class="actives[i] ? 'category-num active' : 'category-num'">{{ v.count | toThousands }}</span>
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
import { Component, Vue, Watch } from 'vue-property-decorator'
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
    if (CategoryModule.category !== undefined && CategoryModule.category.items.length > 0) {
      if (CategoryModule.category.items[0].name !== null) {
        const total = CategoryModule.category.items.map(v => v.count).reduce((a, b) => a + b)
        CategoryModule.category.items.unshift({ label: '所有', name: null, count: total })
      }
      if (this.$route.path.startsWith('/' + CategoryModule.category.type.concat('/', CategoryModule.category.subType, '/category-'))) {
        const name = this.$route.params['category']
        if (name !== null && name !== undefined) {
          const index = CategoryModule.category.items.findIndex(v => v.name === name)
          if (index >= 0) {
            CategoryModule.ChangeIndex(index)
            this.resetIndex(index)
          }
        } else if (name === null) {
          CategoryModule.ChangeIndex(0)
        }
      } else {
        CategoryModule.ChangeIndex(-1)
      }
    }
    return CategoryModule.category
  }

  private jump(subType: string, name: string, index: number) {
    this.resetIndex(index)
    if (name === null) {
      this.$router.push({ name: this.category.type.concat('-', subType) })
    } else {
      this.$router.push({ name: this.category.type.concat('-', subType, '-category'), params: { category: name } })
    }
  }

  private resetIndex(index: number) {
    if (CategoryModule.category) {
      for (let i = 0; i < CategoryModule.category.items.length; i++) {
        if (i !== index) {
          this.$set(this.actives, i, false)
        } else {
          this.$set(this.actives, i, true)
        }
      }
    } else {
      this.actives = []
    }
  }

  get index() {
    return CategoryModule.index
  }

  @Watch('index')
  scrollToPreview(index: number) {
    if (index >= 0) {
      const step = 50
      const _containerDoc = document.getElementById('menuContainer')
      const item: HTMLElement = document.getElementById('item:' + index)
      const viewHeight = _containerDoc.clientHeight
      const rectTop = item.getBoundingClientRect().top - _containerDoc.getBoundingClientRect().top
      if (rectTop <= 0) {
        _containerDoc.scrollTop -= step
      } else if (rectTop >= viewHeight - step) {
        _containerDoc.scrollTop += step
      }
    }
    this.resetIndex(index)
  }

  private async loadCategory() {
    let data = await getCategories()
    const categories: Map<string, ICategory> = new Map<string, ICategory>()
    data.values.forEach(v => {
      const type: string = v.type
      const subType: string = v.subType
      const items: { label: string, name: string, count: number }[] = []
      v.items.forEach(item => {
        items.push({ label: item.label, name: item.name, count: item.count })
      })
      categories.set(type + ':' + subType, { type: type, subType: subType, items: items })
    })
    CategoryModule.SetCategories(categories)
  }

  created() {
    this.actives[0] = true
    this.loadCategory()
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: $sideBarWidth !important;
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
    scrollbar-width: none;
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
      position: relative;
      text-indent: 10px;

      .active {
        color: #f90;
      }

      .category-label {
        max-width: 64%;
        font-size: 14px;
        font-family: "Songti SC",serif;
        text-indent: 0;
        margin-right: 20px;
      }

      .category-num {
        float: right;
        font-size: 12px;
        text-indent: 0;
        margin-right: 3px;
        margin-top: 4px;
      }
    }
  }
}

.route-content:hover .category-label {
  color: #f90;
}

.route-content:hover .category-num {
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
    width: $mobileSideBarWidth !important;
  }
}
</style>
