<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.commentatorName" clearable class="filter-item" style="width: 200px;" placeholder="评论人" />
      <el-input v-model="listQuery.replierName" clearable class="filter-item" style="width: 200px;" placeholder="回复人" />
      <el-input v-model="listQuery.girlName" clearable class="filter-item" style="width: 200px;" placeholder="教师名称" />
      <el-select v-model="listQuery.system" placeholder="系统" class="filter-item" style="width: 90px;">
        <el-option label="是" value="true"></el-option>
        <el-option label="否" value="false"></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label="评论人" width="150" prop="commentatorName">
        <template slot-scope="scope">
          <span><a href="#" @click="toUser(scope.row.commentatorName)">
            {{(scope.row.commentatorName === null? 'SYSTEM' : scope.row.commentatorName) + (scope.row.replierName === null? '' : (' > ' + scope.row.replierName)) }}
          </a></span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="教师" prop="girlName">
        <template slot-scope="scope">
          <span><a href="#" @click="toGirl(scope.row.girlId)">{{ scope.row.girlName }}</a></span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="450px;"  label="评论内容" prop="content" />
      <el-table-column align="center" width="170px;" label="时间" prop="time">
        <template slot-scope="scope">
          {{ scope.row.time | parseTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="70px;" label="已读" prop="privately">
        <template slot-scope="scope">
          <el-tag :type="scope.row.read ? 'success' : 'danger' ">{{ scope.row.read ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" width="70px;" label="禁开" prop="privately">
        <template slot-scope="scope">
          <el-tag :type="scope.row.privately ? 'success' : 'danger' ">{{ scope.row.privately ? '禁' : '开' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="225" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-show="!scope.row.privately" type="warning" size="mini" @click="handlePrivated(scope.row)">禁开</el-button>
          <el-button type="primary" size="mini" @click="handleReply(scope.row)">回复</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :start.sync="listQuery.start" :count.sync="listQuery.count" @pagination="getList" />

    <el-dialog
      :visible.sync="visible"
      width="70%">
          <textarea
            v-model="content"
            style="font-size: 13px; height: 100px; width: 100%;"
          ></textarea>
      <span slot="footer" class="dialog-footer">
              <el-button @click="visible = false" size="mini">取 消</el-button>
              <el-button type="primary" @click="addNotice" size="mini">确定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
import { listComments, deleteComment, privateComment, noticeComment } from '@/api/comment'
import Pagination from '@/components/Pagination'
import {Message} from "element-ui";

export default {
  name: 'Comment',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      content: null,
      username: null,
      visible: false,
      girlId: null,
      listQuery: {
        start: 0,
        count: 20,
        id: null,
        system: 'false',
        girlName: null,
        replierName: null,
        commentatorName: null
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    toGirl(girlId) {
      this.$router.push({ path: '/girl-edit', query: { id: girlId } })
    },
    getList() {
      this.listLoading = true
      listComments(this.listQuery).then(response => {
        this.list = response.values
        this.total = response.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleReply(row) {
      this.visible = true
      this.girlId = row.girlId
      this.username = row.commentatorName
    },
    addNotice() {
      noticeComment({ username: this.username, content: this.content, girlId: this.girlId }).then(response => {
        if (response.code === 200) {
          Message({
            message: '发送成功！',
            type: 'success',
            duration: 1500
          })
        }
      })
      this.username = null
      this.content = null
      this.girlId = null
      this.visible = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDelete(row) {
      deleteComment(row.id).then(response => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    handlePrivated(row) {
      privateComment(row.id).then(response => {
        this.$notify({
          title: '成功',
          message: '禁开成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    toUser(userName) {
      this.$router.push({ path: '/user-list', query: { userName: userName } })
    },
    timestampToTime(timestamp) {
      let date = new Date(timestamp);
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      let D = date.getDate() + ' ';
      let h = date.getHours() + ':';
      let m = date.getMinutes() + ':';
      let s = date.getSeconds();
      return Y+M+D+h+m+s;
    }
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
