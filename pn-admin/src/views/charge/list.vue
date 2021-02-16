<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>卡号管理</span>
      </div>
      <div class="filter-container">
        <el-select v-model="listQuery.type" clearable placeholder="产品" class="filter-item" style="width: 150px;">
          <el-option label="10金币" value="TEN"></el-option>
          <el-option label="30金币" value="THIRTY"></el-option>
          <el-option label="50金币" value="FIFTY"></el-option>
          <el-option label="月VIP" value="VIP_MONTH"></el-option>
          <el-option label="季VIP" value="VIP_QUARTER"></el-option>
          <el-option label="年VIP" value="VIP_YEAR"></el-option>
          <el-option label="永久VIP" value="VIP_FOREVER"></el-option>
        </el-select>
        <el-select v-model="listQuery.used" clearable placeholder="已用" class="filter-item" style="width: 90px;">
          <el-option label="是" value="true"></el-option>
          <el-option label="否" value="false"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      </div>

        <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
          <el-table-column align="center" label="卡号" prop="id" />
          <el-table-column align="center" label="类型" prop="type">
            <template slot-scope="scope">
              {{ asType(scope.row.type) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="80" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-link
                :underline="false"
                type="primary"
                style="font-size: 10px; margin-right: 5px;"
                @click="handleDelete(row.id)"
              >
                删除
              </el-link>
            </template>
          </el-table-column>
        </el-table>
      <pagination v-show="total>0" :total="total" :start.sync="listQuery.start" :count.sync="listQuery.count" @pagination="getList" />
    </el-card>

    <el-card class="box-card" style="margin-top: 20px;">
      <div slot="header" class="clearfix">
        <span>支付链接管理</span>
      </div>
      <div class="filter-container">
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreateYQ">添加</el-button>
      </div>

      <el-table :data="listYQ" border fit highlight-current-row>
        <el-table-column align="center" label="类型" prop="type">
          <template slot-scope="scope">
            {{ asType(scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="购买链接" prop="url">
        </el-table-column>
        <el-table-column align="center" label="金额" prop="amount">
        </el-table-column>
        <el-table-column align="center" label="操作" width="160" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-link
              :underline="false"
              type="primary"
              style="font-size: 10px; margin-right: 5px;"
              @click="handleUpdateYQ(row)"
            >
              编辑
            </el-link>
            <el-link
              :underline="false"
              type="primary"
              style="font-size: 10px; margin-right: 5px;"
              @click="handleDeleteYQ(row.type)"
            >
              删除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :visible.sync="visible" width="50%">
      <el-select v-model="type" clearable placeholder="产品" class="filter-item" style="width: 150px; margin-bottom: 20px;">
        <el-option label="10金币" value="TEN"></el-option>
        <el-option label="30金币" value="THIRTY"></el-option>
        <el-option label="50金币" value="FIFTY"></el-option>
        <el-option label="月VIP" value="VIP_MONTH"></el-option>
        <el-option label="季VIP" value="VIP_QUARTER"></el-option>
        <el-option label="年VIP" value="VIP_YEAR"></el-option>
        <el-option label="永久VIP" value="VIP_FOREVER"></el-option>
      </el-select>
      <textarea
        v-model="cards"
        style="font-size: 13px; height: 200px; width: 100%;"
      ></textarea>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="addCard" size="mini">确定</el-button>
      </span>
    </el-dialog>


    <el-dialog :visible.sync="visibleYQ" width="50%">
      <el-select v-model="typeYQ" clearable placeholder="产品" class="filter-item" style="width: 150px; margin-bottom: 20px;">
        <el-option label="10金币" value="TEN"></el-option>
        <el-option label="30金币" value="THIRTY"></el-option>
        <el-option label="50金币" value="FIFTY"></el-option>
        <el-option label="月VIP" value="VIP_MONTH"></el-option>
        <el-option label="季VIP" value="VIP_QUARTER"></el-option>
        <el-option label="年VIP" value="VIP_YEAR"></el-option>
        <el-option label="永久VIP" value="VIP_FOREVER"></el-option>
      </el-select>
      <el-input-number
        v-model="amount"
        class="filter-item"
        style="margin-left: 20px; width: 150px;"
      ></el-input-number>
      <textarea
        v-model="url"
        style="font-size: 15px; height: 25px; width: 100%;"
        placeholder="官方url"
      ></textarea>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visibleYQ = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="addYq" size="mini">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Pagination from '@/components/Pagination/index.vue'
import { paged, add, del, getYQ, yqDel, addYQ } from '@/api/charge'
import { imageServer } from '@/api/storage'

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
    type: '',
    used: null,
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
    if (!this.listQuery.used) {
      delete this.listQuery.used
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

  private handleCreate() {
    this.visible = true
  }

  private handleCreateYQ() {
    this.visibleYQ = true
  }

  private async addCard() {
    await add({ type: this.type, cards: this.cards })
    this.cards = ''
    this.type = ''
    this.visible = false
    this.getList()
  }

  private async addYq() {
    await addYQ({ type: this.typeYQ, url: this.url, amount: this.amount })
    this.url = ''
    this.typeYQ = ''
    this.visibleYQ = false
    this.getYq()
  }

  private cancelEdit(row: any) {
    row.edit = false
  }

  private async handleDelete(id: string) {
    await del(id)
    this.getList()
  }

  private async handleDeleteYQ(id: string) {
    await yqDel(id)
    this.getYq()
  }

  private async handleUpdateYQ(row: any) {
    this.typeYQ = row.type
    this.url = row.url
    this.amount = row.amount
    this.visibleYQ = true
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

  private async getYq() {
    const data = await getYQ()
    this.listYQ = data.values
  }

  private created() {
    this.getList()
    this.getYq()
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
