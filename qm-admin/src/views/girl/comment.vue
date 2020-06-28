<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.commentatorName" clearable class="filter-item" style="width: 200px;" placeholder="评论人" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="table-expand">
            <el-form-item label="ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="教师ID">
              <span><a href="#" @click="toGirl(props.row.girlId)">{{ props.row.girlName }}</a></span>
            </el-form-item>
            <el-form-item label="时间">
              <span>{{ timestampToTime(props.row.time) }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="评论人" width="150" prop="commentatorName">
        <template slot-scope="scope">
          <span><a href="#" @click="toUser(scope.row.commentatorName)">{{ scope.row.commentatorName }}</a></span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="被回复人" width="150" prop="replierName" />
      <el-table-column align="center" label="评论内容" prop="content" />
      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :start.sync="listQuery.start" :count.sync="listQuery.count" @pagination="getList" />

  </div>
</template>

<script>
import { listComments, deleteComment } from '@/api/comment'
import Pagination from '@/components/Pagination'

export default {
  name: 'Comment',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        start: 0,
        count: 20,
        id: null,
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
