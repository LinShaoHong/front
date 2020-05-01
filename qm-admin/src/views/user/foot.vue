<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="filter-container">
        <el-input v-model="listQuery.userName" clearable class="filter-item" style="width: 200px;" placeholder="用户" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      </div>

        <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
          <el-table-column align="center" label="用户" prop="userName" >
            <template slot-scope="scope">
              <span><a href="#" @click="toUser(scope.row.userName)">{{ scope.row.userName }}</a></span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="浏览教师" prop="girlName" >
            <template slot-scope="scope">
              <span><a href="#" @click="toGirl(scope.row.girlId)">{{ scope.row.girlName }}</a></span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="浏览时间" prop="updateTime">
            <template slot-scope="scope">
              {{ scope.row.updateTime | parseTime }}
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
import { listFootprints } from '@/api/footprint'
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
    start: 0,
    count: 10,
    userName: null
  }

  private async getList() {
    listFootprints(this.listQuery).then(response => {
      this.list = response.values
      this.total = response.total
      this.listLoading = false
    }).catch(() => {
      this.list = []
      this.total = 0
      this.listLoading = false
    })
  }

  private toGirl(girlId: string) {
    this.$router.push({ path: '/girl-edit', query: { id: girlId } })
  }

  private toUser(userName: string) {
    this.$router.push({ path: '/user-list', query: { userName: userName } })
  }

  private handleFilter() {
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
    width: 120px;
    height: 100px;
    margin-right: 10px;
  }
  .goods-detail-box img {
    width: 100%;
  }
</style>
