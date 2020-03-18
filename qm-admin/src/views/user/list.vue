<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="filter-container">
        <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="用户ID" />
        <el-input v-model="listQuery.username" clearable class="filter-item" style="width: 200px;" placeholder="用户名" />
        <el-input v-model="listQuery.email" clearable class="filter-item" style="width: 200px;" placeholder="邮箱" />
        <el-select v-model="listQuery.vip" clearable placeholder="vip" class="filter-item" style="width: 70px;">
          <el-option label="是" value="true"></el-option>
          <el-option label="否" value="false"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      </div>

        <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" class="table-expand">
                <el-form-item label="ID">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
                <el-form-item label="头像">
                  <img :src="imageServer + props.row.avatar" width="60" height="60">
                </el-form-item>
                <el-form-item v-if="props.row.vip" label="VIP充值时间">
                  <span>{{ props.row.vipStartTime | parseTime }}</span>
                </el-form-item>
                <el-form-item v-if="props.row.vip" label="VIP到期时间">
                  <span>{{ props.row.vipEndTime | parseTime }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column align="center" label="用户名" prop="username" />
          <el-table-column align="center" label="邮箱" prop="email" />
          <el-table-column align="center" width="70px;" label="VIP" prop="vip">
            <template slot-scope="scope">
              <el-tag :type="scope.row.vip ? 'success' : 'danger' ">{{ scope.row.vip ? '是' : '否' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" width="90px;" label="签到次数" prop="signInCount" />
          <el-table-column align="center" width="100px;" label="金币" prop="amount" />
          <el-table-column align="center" label="上次登录时间" prop="createTime">
            <template slot-scope="scope">
              {{ scope.row.lastLoginTime | parseTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="注册时间" prop="createTime">
            <template slot-scope="scope">
              {{ scope.row.createTime | parseTime }}
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
import { paged } from '@/api/user'
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
    id: '',
    username: '',
    vip: null,
    email: '',
    start: 0,
    count: 10
  }

  private visible = false
  private id: string = ''
  private content: string = ''

  private async getList() {
    if (!this.listQuery.vip) {
      delete this.listQuery.vip
    }
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
</style>
