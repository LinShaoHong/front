<template>
  <div
    :class="{'hidden': hidden}"
    class="pagination-container"
  >
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { scrollTo } from '@/utils/scroll-to'

@Component({
  name: 'Pagination'
})
export default class extends Vue {
  @Prop({ required: true }) private total!: number
  @Prop({ default: 1 }) private start!: number
  @Prop({ default: 10 }) private count!: number
  @Prop({ default: () => [10, 20, 30, 50] }) private pageSizes!: number[]
  @Prop({ default: 'total, sizes, prev, pager, next, jumper' }) private layout!: string
  @Prop({ default: true }) private background!: boolean
  @Prop({ default: true }) private autoScroll!: boolean
  @Prop({ default: false }) private hidden!: boolean

  get currentPage() {
    return this.start / this.count + 1
  }

  set currentPage(val) {
    this.$emit('update:start', (val - 1) * this.count)
  }

  get pageSize() {
    return this.count
  }

  set pageSize(value) {
    this.$emit('update:count', value)
  }

  handleSizeChange(val: number) {
    this.$emit('pagination', { start: this.start, count: val })
    if (this.autoScroll) {
      scrollTo(0, 800)
    }
  }

  handleCurrentChange(val: number) {
    this.$emit('pagination', { start: (val - 1) * this.count, count: this.pageSize })
    if (this.autoScroll) {
      scrollTo(0, 800)
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}

.pagination-container.hidden {
  display: none;
}
</style>
