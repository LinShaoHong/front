<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="filter-container">
        <el-input v-model="listQuery.userName" clearable class="filter-item" style="width: 160px;" placeholder="推广人" />
        <el-select v-model="listQuery.status" clearable placeholder="状态" class="filter-item" style="width: 100px;">
          <el-option label="通过" value="PASS"></el-option>
          <el-option label="审批中" value="APPROVING"></el-option>
          <el-option label="拒绝" value="REJECT"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      </div>

        <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" class="table-expand">
                <el-form-item label="推广图">
                  <img v-for="pic in props.row.images" :key="pic" :src="imageServer + pic" class="gallery">
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="100" label="推广人" prop="userName">
          </el-table-column>
          <el-table-column align="center" min-width="100" label="提交时间" prop="createTime">
            <template slot-scope="scope">
              {{ scope.row.createTime | parseTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" prop="status">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === 'PASS'  ? 'success' : (scope.row.status === 'REJECT'? 'danger' : 'info') ">
                {{ scope.row.status === 'PASS' ? '通过' : (scope.row.status === 'REJECT'? '已拒绝' : '审批中') }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="110" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-link
                :underline="false"
                :disabled="row.status !== 'APPROVING'"
                type="primary"
                style="font-size: 10px; margin-right: 5px;"
                @click="handleApprove(row.id)"
              >
                通过
              </el-link>
              <el-link
                :underline="false"
                :disabled="row.status !== 'APPROVING'"
                type="primary"
                style="font-size: 10px; margin-right: 5px;"
                @click="handleReject(row.id)"
              >
                拒绝
              </el-link>
            </template>
          </el-table-column>
        </el-table>
      <pagination v-show="total>0" :total="total" :start.sync="listQuery.start" :count.sync="listQuery.count" @pagination="getList" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Pagination from '@/components/Pagination/index.vue'
import { paged, approve, reject } from '@/api/promotion'
import { imageServer } from '@/api/storage'

@Component({
  name: 'GirlList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private imageServer = imageServer
  private total = 0
  private list = []
  private listLoading = true
  private listQuery = {
    status: '',
    userName: null,
    start: 0,
    count: 10
  }
  private types = [
    { label: '会所', value: 'SN' },
    { label: '个人', value: 'QM' },
    { label: '视频', value: 'VIDEO' },
    { label: '图片', value: 'PIC' }
  ]

  private async getList() {
    paged(this.listQuery).then(response => {
      this.list = response.values
      this.total = response.total
      this.listLoading = false
    }).catch(() => {
      this.list = []
      this.total = 0
      this.listLoading = false
    })
  }

  private handleFilter() {
    this.getList()
  }

  private handleCreate() {
    this.$router.push({ path: 'girl-create' })
  }

  private async handleApprove(id: string) {
    await approve(id, { award: 5 })
    this.getList()
  }

  private async handleReject(id: string) {
    await reject(id)
    this.getList()
  }

  private created() {
    this.getList()
  }
}
</script>

<style>
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }
  .gallery {
    width: 300px;
    height: 300px;
    margin-right: 10px;
  }
  .goods-detail-box img {
    width: 100%;
  }
</style>
