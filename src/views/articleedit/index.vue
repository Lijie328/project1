<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>修改文章</span>
      </div>
      <div class="text item">
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="120px">
          <el-form-item label="标题：" prop="title">
            <el-input v-model="editForm.title"></el-input>
          </el-form-item>
          <el-form-item label="内容：" prop="content">
            <quill-editor v-model="editForm.content"></quill-editor>
          </el-form-item>
          <el-form-item label="封面：">
            <el-radio-group v-model="editForm.cover.type">
              <el-radio :label="1">单图</el-radio>
              <el-radio :label="3">三图</el-radio>
              <el-radio :label="0">无图</el-radio>
              <el-radio :label="-1">自动</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道：" prop="channel_id">
            <!-- <el-select v-model="editForm.channel_id" placeholder="请选择" clearable>
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select> -->
            <channel-com @slt="selectHandler" :cid="editForm.channel_id"
               ></channel-com>
          </el-form-item>

        <el-form-item>
              <el-button type="primary" @click="editarticle(false)"> 修改</el-button>
              <el-button @click="editarticle(true)">存入草稿</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import ChannelCom from '@/components/channel.vue'
export default {
  name: 'ArticleEdit',
  components: {
    quillEditor,
    ChannelCom
  },

  data () {
    return {
      // channelList: [], // 接收频道列表数据
      editFormRules: {
        title: [
          { required: true, message: '标题必填' },
          // 后端要求title长度介于5-30个字符
          {
            min: 5,
            max: 30,
            message: '标题长度介于5-30个字符'
          }
        ],
        content: [{ required: true, message: '内容必填' }],
        channel_id: [{ required: true, message: '频道必选' }]
      },
      editForm: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: {
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: []
        },
        channel_id: '' // 频道
      }
    }
  },
  computed: {
    aid () {
      return this.$route.params.aid
    }
  },
  created () {
    // this.getChannelList()
    this.getArticleById()
  },
  methods: {
    selectHandler (val) {
      this.editForm.channel_id = val
    },
    getArticleById () {
      let pro = this.$http.get(`/articles/${this.aid}`)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            // 把文章赋予给editForm里边
            this.editForm = result.data.data
          }
        })
        .catch(err => {
          return this.$message.error('获得文章失败！：' + err)
        })
    },
    //   修改文章-收集数据储存
    editarticle (flag) {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          var pro = this.$http.put(`/articles/${this.aid}`, this.editForm, {
            params: { draft: flag }
          })
          pro
            .then(result => {
              this.$message.success('文章修改成功')
              this.$router.push({ name: 'article' })
            }).catch(err => {
              return this.$message.error('修改文章失败' + err)
            })
        }
      })
    }
    // 获取频道列表数据
    // getChannelList () {
    //   var pro = this.$http.get('/channels')
    //   pro
    //     .then(result => {
    //       if (result.data.message === 'OK') {
    //         this.channelList = result.data.data.channels
    //       }
    //     })
    //     .catch(err => {
    //       retuhis.$message.error('获得文章频道错误：' + err)
    //     })rn t
    // }
  }
}
</script>

<style lang="less" scoped>
    .el-form /deep/ .ql-editor{
        height: 100px;
    }
</style>
