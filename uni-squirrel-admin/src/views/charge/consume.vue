<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>消费记录</span>
      </div>
      <div class="filter-container">
        <el-input v-model="listQuery.userName" clearable class="filter-item" style="width: 160px;" placeholder="消费人" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      </div>

      <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
        <el-table-column align="center" label="消费人" prop="userName" >
          <template slot-scope="scope">
            <span><a href="#" @click="toUser(scope.row.userName)">{{ scope.row.userName }}</a></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="消费教师" prop="girlName" >
          <template slot-scope="scope">
            <span><a href="#" @click="toGirl(scope.row.girlId)">{{ scope.row.girlName }}</a></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="消费金额" prop="amount" />
        <el-table-column align="center" label="消费时间" prop="createTime">
          <template slot-scope="scope">
            {{ timestampToTime(scope.row.createTime) }}
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
import { payLog } from '@/api/charge'

@Component({
  name: 'GirlList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private total = 0
  private list = []
  private listYQ = []
  private listLoading = true
  private listQuery = {
    type: 'PAYMENT',
    userName: null,
    start: 0,
    count: 10
  }

  private visible = false
  private type: string = ''
  private cards: string = ''

  private visibleYQ = false
  private typeYQ: string = ''
  private url: string = ''
  private amount: number = 0

  private async getList() {
    payLog(this.listQuery).then(response => {
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

  private timestampToTime(timestamp: number) {
    let date = new Date(timestamp);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes() + ':';
    let s = date.getSeconds();
    return Y+M+D+h+m+s;
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

  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
