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

        <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row @cell-click="editCell">
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
          <el-table-column
            align="center"
            width="140px"
            label="金币"
          >
            <template slot-scope="{row}">
              <template v-if="row.editAmount">
                <el-input
                  style="width: 70px;"
                  v-model="row.amount"
                  class="edit-input"
                  size="small"
                />
                <i class="el-icon-check" style="margin-left: 10px; color: #1EB7CD; cursor: pointer" @click="confirmEditAmount(row)"></i>
                <i class="el-icon-close" style="margin-left: 5px; color: deeppink; cursor: pointer" @click="cancelEditAmount(row)"></i>
              </template>
              <span v-else>{{ row.amount }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="注册时间" prop="createTime">
            <template slot-scope="scope">
              {{ scope.row.createTime | parseTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="IP" prop="lastLoginIp" />
          <el-table-column align="center" label="地址" prop="location" />
        </el-table>
      <pagination v-show="total>0" :total="total" :start.sync="listQuery.start" :count.sync="listQuery.count" @pagination="getList" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Pagination from '@/components/Pagination/index.vue'
import { paged, update } from '@/api/user'
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
    if (this.listQuery.username.endsWith('(VIP)')) {
      const len = this.listQuery.username.length
      this.listQuery.username = this.listQuery.username.substr(0, len - 5)
    }
    paged(this.listQuery).then(response => {
      this.list = response.values.map((v: any) => {
        this.$set(v, 'editAmount', false)
        return v
      })
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

  private editCell(row: any, column: number, cell: any) {
    if (!row.editAmount && column.label === '金币') {
      row.editAmount = true
    }
  }

  private cancelEditAmount(row: any) {
    row.editAmount = false
  }

  private async confirmEditAmount(row: any) {
    const data = await update(row.id, { amount: row.amount })
    if (data.code === 200) {
      row.editAmount = false
      this.$message({
        message: '修改成功',
        type: 'success'
      })
    }
  }

  private created() {
    this.listQuery.username = this.$route.query.userName as string
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
