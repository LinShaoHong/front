<template>
  <div :class="classObj"
  >
    <div class="sidebar-container">
      <div class="menu-container">
        <div
          v-for="i in 120"
          :key="i"
          class="menu-item"
        >
          <router-link to="dashboard">
            <div class="route-content">
              <span class="category-name">性感</span>
            </div>
          </router-link>
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
