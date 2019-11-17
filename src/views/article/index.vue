<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      </div>
      <div class="text item">
        <el-form ref="searchFormRef" :model="searchForm">
          <el-form-item label="文章状态:">
            <el-radio-group v-model="searchForm.status" @change="getArticleList()">
              <el-radio v-model="searchForm.status" label>全部</el-radio>
              <el-radio v-model="searchForm.status" label="0">草稿</el-radio>
              <el-radio v-model="searchForm.status" label="1">待审核</el-radio>
              <el-radio v-model="searchForm.status" label="2">审核通过</el-radio>
              <el-radio v-model="searchForm.status" label="3">审核失败</el-radio>
              <el-radio v-model="searchForm.status" label="4">已删除</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道列表:">
            <!-- <el-select
              v-model="searchForm.channel_id"
              placeholder="请选择"
              clearable
              @change="getArticleList()"
            >
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select> -->
            <channel-com @slt="selectHandler"></channel-com>
          </el-form-item>
          <el-form-item label="时间选择:">
            <el-date-picker
              v-model="timetotime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <el-table :data="articleList" style="width:100%;">
          <el-table-column label="图标">
            <img
              :src="stData.row.cover.images[0]"
              slot-scope="stData"
              alt="没有图标"
              width="150px"
              height="100px"
            />
          </el-table-column>
          <el-table-column label="标题" prop="title" width="300px"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="stData">
              <el-tag v-if="stData.row.status===0">草稿</el-tag>
              <el-tag v-else-if="stData.row.status===1" type="success">待审核</el-tag>
              <el-tag v-else-if="stData.row.status===2" type="info">审核通过</el-tag>
              <el-tag v-else-if="stData.row.status===3" type="warning">审核失败</el-tag>
              <el-tag v-else type="danger">已删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="发布时间" prop="pubdate" width="160px"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="stData">
              <el-button type="primary" size="mini" @click="$router.push(`/articleedit/${stData.row.id}`)">修改</el-button>
              <el-button type="danger" size="mini " @click="del(stData.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card>
      <div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.page"
          :page-sizes="[10, 15, 20, 40]"
          :page-size="searchForm.per_page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tot"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import ChannelCom from '@/components/channel.vue'
export default {
  name: 'ArticleList',
  components: {
    ChannelCom
  },
  data () {
    return {
      searchForm: {
        status: '',
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: '',
        page: 1,
        per_page: 10
      },
      tot: 0,
      // channelList: [],
      timetotime: [],
      articleList: []
    }
  },
  // 监听器
  watch: {
    searchForm: {
      handler: function (newV, oldV) {
        this.getArticleList()
      },
      deep: true
    },
    timetotime (newval) {
      if (newval) {
        this.searchForm.begin_pubdate = newval[0]
        this.searchForm.end_pubdate = newval[1]
      } else {
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
      this.getArticleList()
    }
  },
  // 生命周期
  created () {
    // this.getChanneList()
    this.getArticleList()
  },
  methods: {
    selectHandler (val) {
      this.searchForm.channel_id = val
    },
    del (id) {
      this.$confirm('确认要删除该数据么?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let pro = this.$http.delete(`/articles/${id}`)
          pro
            .then(result => {
              this.$message.success('文章删除成功!')
              // 更新删除的文章
              this.getArticleList()
            })
            .catch(err => {
              return this.$message.error('删除文章错误：' + err)
            })
        })
        .catch(() => {})
    },
    handleSizeChange (val) {
      console.log(val)
      this.searchForm.per_page = val
      this.getArticleList()
    },
    handleCurrentChange (val) {
      // console.log(val)
      this.searchForm.page = val
      this.getArticleList()
    },

    // getChanneList () {
    //   var pro = this.$http.get('/channels')
    //   pro
    //     .then(result => {
    //       if (result.data.message === 'OK') {
    //         this.channelList = result.data.data.channels
    //       }
    //     })
    //     .catch(err => {
    //       return this.$message.error('获得文章频道错误' + err)
    //     })
    // },
    getArticleList () {
      let searchData = {}
      for (var i in this.searchForm) {
        if (this.searchForm[i] || this.searchForm[i] === 0) {
          searchData[i] = this.searchForm[i]
        }
      }
      let pro = this.$http.get('/articles', { params: searchData })
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.articleList = result.data.data.results
            this.tot = result.data.data.total_count
          }
        })
        .catch(err => {
          return this.$message.error('获得文章列表错误:' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-bottom: 15px;
}
</style>
