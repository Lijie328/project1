<template>
  <!--卡片区-->
  <el-card class="box-card">
    <!--命名插槽，头部内容设置-->
    <div slot="header" class="clearfix">
      <span>账户信息</span>
    </div>
    <!--匿名插槽，卡片主体内容-->
    <div class="text item cardbody">
      <div id="lt">
        <el-form
          ref="accountFormRef"
          :rules="accountFormRules"
          :model="accountForm"
          label-width="100px"
        >
          <el-form-item label="用户名：" prop="name">
            <el-input v-model="accountForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：">
            <el-input v-model="accountForm.mobile" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="accountForm.email"></el-input>
          </el-form-item>
          <el-form-item label="简介：">
            <el-input type="textarea" v-model="accountForm.intro"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editAccount()">更新账户</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div id="rt">
        <!--上传头像区域-->
        <el-upload action :show-file-list="false" :http-request="httpRequest">
          <img
            v-if="accountForm.photo"
            :src="accountForm.photo"
            class="avatar"
            width="210"
            height="210"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>
  </el-card>
</template>
<script>
import bus from '@/utils/bus.js'
export default {
  name: 'Account',
  data () {
    return {
      accountFormRules: {
        name: [
          { required: true, message: '名字必填' },
          // 后端要求title长度介于1-7个字符
          {
            min: 1,
            max: 7,
            message: '名字长度介于1-7个字符之间'
          }
        ],
        email: [
          { required: true, message: '邮箱必填' },
          { type: 'email', message: '邮箱格式不正确' }
        ]
      },
      accountForm: {
        // 各个成员来自api参考【2.4 编辑用户资料】
        id: '', // id
        name: '', // 名称
        mobile: '', // 手机号码
        email: '', // 邮箱
        intro: '' // 简介
      }
    }
  },
  created () {
    this.getAccountInfo()
  },
  methods: {
    // 上传图片
    httpRequest (resource) {
      let fd = new FormData()
      fd.append('photo', resource.file)
      let pro = this.$http.patch('/user/photo', fd)
      pro.then(result => {
        if (result.data.message === 'OK') {
          this.accountForm.photo = result.data.data.photo
          // 提示成功
          this.$message.success('更新头像成功')
          bus.$emit('upAccountPhoto', result.data.data.photo)
        }
      }).catch(err => {
        return this.$message.error('更新头像失败：' + err)
      })
    },
    editAccount () {
      this.$refs.accountFormRef.validate(valid => {
        if (valid) {
          let pro = this.$http.patch('/user/profile', this.accountForm)
          pro
            .then(result => {
              if (result.data.message === 'OK') {
                // bus通过$emit调用自己的相关方法更新   首页home  的账户信息
                bus.$emit('upAccountName', result.data.data.name)
                this.$message.success('修改账号成功')
              }
            })
            .catch(err => {
              return this.$message.error('修改失败：' + err)
            })
        }
      })
    },
    getAccountInfo () {
      let pro = this.$http.get('/user/profile')
      pro
        .then(result => {
          this.accountForm = result.data.data
        })
        .catch(err => {
          return this.$message.error('获得账号信息失败：' + err)
        })
    }
  }
}
</script>
<style lang="less" scoped>
// 给表单 和 头像区域做布局样式设计
.cardbody {
  display: flex;
  justify-content: space-between;
  #lt {
    width: 40%;
    // background-color: pink;
  }
  #rt {
    width: 30%;
    // background-color: lightgreen;
  }
}
</style>
