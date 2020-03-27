<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>发送通知</span>
      </div>
      <div class="filter-container">
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      </div>

        <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
          <el-table-column align="center" label="消息内容" prop="content" />
          <el-table-column align="center" label="时间" prop="time">
            <template slot-scope="scope">
              {{ timestampToTime(scope.row.time) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="80" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-link
                :underline="false"
                type="primary"
                style="font-size: 10px; margin-right: 5px;"
                @click="handleUpdate(row.id, row.content)"
              >
                编辑
              </el-link>
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
        <span>发送邮件</span>
      </div>
      <el-form ref="emailForm" :model="emailForm" label-width="80px">
        <el-form-item label="收件人">
          <el-input v-model="emailForm.to"></el-input>
        </el-form-item>
        <el-form-item label="主题">
          <el-input v-model="emailForm.title"></el-input>
        </el-form-item>
        <el-form-item label="邮件内容">
          <el-input type="textarea" v-model="emailForm.body"></el-input>
        </el-form-item>
        <el-form-item label="文本格式">
          <el-select v-model="emailForm.format">
            <el-option label="HTML" value="HTML"></el-option>
            <el-option label="TEXT" value="TEXT"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSend">发送</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog
      :visible.sync="visible"
      width="30%">
          <textarea
            v-model="content"
            style="font-size: 13px; height: 100px; width: 100%;"
          ></textarea>
      <span slot="footer" class="dialog-footer">
              <el-button @click="visible = false" size="mini">取 消</el-button>
              <el-button type="primary" @click="addOrUpdate" size="mini">确定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Pagination from '@/components/Pagination/index.vue'
import { listMessages, deleteMessage, updateMessage, addMessage, sendEmail } from '@/api/message'
import { imageServer } from '@/api/storage'
import { Message } from 'element-ui'

@Component({
  name: 'GirlList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private total = 0
  private list = []
  private listLoading = true
  private listQuery = {
    start: 0,
    count: 10
  }

  private visible = false
  private id: string = ''
  private content: string = ''

  private emailForm =  {
    to: '',
    title: '',
    body: '',
    format: 'TEXT'
  }

  private async getList() {
    listMessages(this.listQuery).then(response => {
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

  private async addOrUpdate() {
    if(this.id === '') {
     await addMessage({ content: this.content })
    } else {
     await updateMessage(this.id, { content: this.content })
    }
    this.id = ''
    this.content = ''
    this.visible = false
    this.getList()
  }

  private handleCreate() {
    this.visible = true
  }

  private handleUpdate(id: string, content: string) {
    this.id = id
    this.content = content
    this.visible = true
  }

  private async handleDelete(id: string) {
    await deleteMessage(id)
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

  private async onSend() {
    const data = await sendEmail(this.emailForm)
    if (data.code === 200) {
      Message({
        message: '发送成功！',
        type: 'success',
        duration: 1500
      })
    }
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
