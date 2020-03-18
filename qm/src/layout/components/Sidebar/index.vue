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
          <div class="route-content"
               @mouseover="onHover(i)"
          >
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

  created() {
    this.actives[0] = true
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
