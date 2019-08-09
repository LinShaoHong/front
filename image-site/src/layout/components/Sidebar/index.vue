<template>
  <div :class="classObj"
  >
    <div v-if="categories.length > 0" class="sidebar-container">
      <div class="menu-container">
        <div
          v-for="v in categories"
          :key="v.name"
          class="menu-item"
          @click="jump(v.name)"
        >
          <div class="route-content">
            <span class="category-name">{{ v.name }}</span>
          </div>
        </div>
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
  get classObj() {
    return {
      sidebar: true,
      mobile: AppModule.device === DeviceType.Mobile
    }
  }

  get type() {
    return CategoryModule.category.type
  }

  get categories() {
    return CategoryModule.category.items
  }

  private jump(name: string) {
    this.$router.push({ path: '/' + this.type + '/' + name })
  }

  mounted() {
    this.loadCategory()
  }

  private async loadCategory() {
    let data = await getCategories()
    const categories: Map<string, ICategory> = new Map<string, ICategory>()
    data.values.forEach(v => {
      const type: string = v.type
      const items: { name: string, path: string }[] = []
      v.items.forEach(item => {
        items.push({ name: item.label, path: item.name })
      })
      categories.set(type, { type: type, items: items })
    })
    CategoryModule.SetCategories(categories)
    CategoryModule.ChangeType('image')
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: $sideBarWidth !important;
  background: #101010;
  border-radius: 10px;
  z-index: 1001;
}

.sidebar-container {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  max-height: $sideBarHeight !important;
  padding-top: 5px;
  border: 1px solid #2F2F2F;
  border-radius: 10px;

  .menu-container {
    span {
      font-size: 15px;
      color: #A3A2A2;
    }

    .menu-item {
      cursor: pointer;
      padding-top: 2px;
    }

    .route-content {
      padding: 5px;

      .category-name {
        margin-left: 10px;
      }
    }
  }
}

.route-content:hover .category-name {
  color: #f90;
}

.sidebar-container:hover {
  box-shadow: 0 0 12px #f90;
  transition: all .5s ease;
}

.sidebar-container::-webkit-scrollbar {
  display: none;
}

.mobile {
  &.sidebar {
    width: $mobileSideBarWidth !important;
  }
}
</style>
