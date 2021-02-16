<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>充值记录</span>
      </div>
      <div class="filter-container">
        <el-select v-model="listQuery.chargeType" clearable placeholder="产品" class="filter-item" style="width: 150px;">
          <el-option label="10金币" value="TEN"></el-option>
          <el-option label="30金币" value="THIRTY"></el-option>
          <el-option label="50金币" value="FIFTY"></el-option>
          <el-option label="月VIP" value="VIP_MONTH"></el-option>
          <el-option label="季VIP" value="VIP_QUARTER"></el-option>
          <el-option label="年VIP" value="VIP_YEAR"></el-option>
          <el-option label="永久VIP" value="VIP_FOREVER"></el-option>
        </el-select>
        <el-input v-model="listQuery.userName" clearable class="filter-item" style="width: 160px;" placeholder="充值人" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      </div>
        <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
          <el-table-column align="center" label="充值人" prop="userName" >
            <template slot-scope="scope">
              <span><a href="#" @click="toUser(scope.row.userName)">{{ scope.row.userName }}</a></span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="类型" prop="chargeType">
            <template slot-scope="scope">
              {{ asType(scope.row.chargeType) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="充值金额" prop="amount" />
          <el-table-column align="center" label="充值时间" prop="createTime">
            <template slot-scope="scope">
              {{ timestampToTime(scope.row.createTime) }}
            </template>
          </el-table-column>
        </el-table>
      <br/>
      总计  {{ rechargeTotal }}
      <pagination v-show="total>0" :total="total" :start.sync="listQuery.start" :count.sync="listQuery.count" @pagination="getList" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Pagination from '@/components/Pagination/index.vue'
import { payLog, rechargeTotal } from '@/api/charge'

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
    type: 'RECHARGE',
    chargeType: '',
    userName: null,
    start: 0,
    count: 10
  }

  private rechargeTotal = 0

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

  private handleFilter() {
    this.getList()
  }

  private asType(type: string) {
    switch (type) {
      case 'TEN':
        return '10金币'
      case 'THIRTY':
        return '30金币'
      case 'FIFTY':
        return '50金币'
      case 'VIP_MONTH':
        return '月VIP'
      case 'VIP_QUARTER':
        return '季VIP'
      case 'VIP_YEAR':
        return '年VIP'
      case 'VIP_FOREVER':
        return '永久VIP'
    }
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

  private toUser(userName: string) {
    this.$router.push({ path: '/user-list', query: { userName: userName } })
  }

  private async getTotal() {
    const data = await rechargeTotal()
    this.rechargeTotal = data.value
  }

  private created() {
    this.getList()
    this.getTotal()
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
