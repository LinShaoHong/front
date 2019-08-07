<template>
  <div
    class="sidebar"
  >
    <div class="header-container">
      <div class="sidebar-header">
        <span style="color: white">专题</span>
      </div>
    </div>
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
              <span class="category-num">{{ i }}</span>
            </div>
          </router-link>
        </div>
      </div>
      <div class="footer-container" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ErrorLog from '@/components/ErrorLog/index.vue'
import LangSelect from '@/components/LangSelect/index.vue'

@Component({
  name: 'Sidebar',
  components: {
    ErrorLog,
    LangSelect
  }
})
export default class extends Vue {
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: $sideBarWidth !important;
  background: #101010;
  border-radius: 3px;
  z-index: 1001;
}

.header-container {
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  width: $sideBarWidth !important;
  background: #1c1c1c;
  border-left: 1px solid #2F2F2F;
  border-right: 1px solid #2F2F2F;
  border-top: 1px solid #2F2F2F;
}

.sidebar-header {
  height: 35px;
  padding: 10px;
  color: white;
  font-size: 18px;
}

.sidebar-container {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  max-height: $sideBarHeight !important;
  padding-top: 5px;
  border-left: 1px solid #2F2F2F;
  border-right: 1px solid #2F2F2F;
  border-bottom: 1px solid #2F2F2F;
}

.sidebar-container::-webkit-scrollbar {
  display: none;
}

.menu-container {
}

span {
  color: #A3A2A2;
}

.menu-item {
  padding-top: 2px;
}

.route-content {
  padding: 5px;
}

.route-content:hover {
  background: #1c1c1c;
  border-left: 1px solid #f90;
}

.route-content:hover .category-name {
  color: white;
}

.route-content:hover .category-num {
  color: white;
}

.category-name {
  margin-left: 10px;
}

.category-num {
  float: right;
  font-size: 14px;
}

.footer-container {
  margin-top: 5px;
  display: flex;
  justify-content: center;
}
</style>
