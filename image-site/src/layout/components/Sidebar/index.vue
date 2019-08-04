<template>
  <div class="sidebar">
    <ul>
      <li v-for="i in 5">
        <span>Hello world</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { isExternal } from '@/utils/validate'
import ErrorLog from '@/components/ErrorLog/index.vue'
import LangSelect from '@/components/LangSelect/index.vue'
import { constantRoutes } from '@/router'

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

<style>
  .sidebar {
    width: 100%;
    border: white solid 2px;
  }
</style>
