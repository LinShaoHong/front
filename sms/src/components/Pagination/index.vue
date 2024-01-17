<template>
  <el-pagination
    :hide-on-single-page="true"
    :current-page.sync="currentPage"
    :page-size.sync="pageSize"
    :layout="layout"
    :page-sizes="pageSizes"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
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
  @Prop({ default: 'prev, pager, next' }) private layout!: string
  @Prop({ default: false }) private background!: boolean
  @Prop({ default: false }) private autoScroll!: boolean
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
<style lang="less">
.el-pagination button[disabled=disabled] {
  background-color: #1b1b1b;
}

.el-pagination button {
  background-color: #1b1b1b;
  color: #a3a2a2;
}

.el-pagination .btn-next {
  background-color: #1b1b1b;
  color: #a3a2a2;
}

.el-pagination .btn-prev {
  background-color: #1b1b1b;
  color: #a3a2a2;
}

.el-pager li {
  background-color: #1b1b1b;
  color: #a3a2a2;
}

.el-pagination__total {
  color: #a3a2a2;
}
</style>
