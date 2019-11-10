<template>
  <div class="login-container">
    <div class="login-box">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" >
        <img src="./logo_index.png" alt />
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号码">
            <i slot="prefix" class="iconfont icon-shouji--"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code" placeholder="请输入校验码">
            <i slot="prefix" class="iconfont icon-verify-fill"></i>
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:left" prop="xieyi">
          <el-checkbox style="margin-right:10px" ></el-checkbox>
          <span>我已阅读并同意用户协议和隐私条款</span>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%;" type="primary" @click="login()" :loading="isActive" :disabled="isActive">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import '@/assets/js/gt.js'

import '@/assets/font/iconfont.css'
export default {
  data () {
    // 自定义规则函数
    var xieyiTest = function (rule, value, callback) {
      value ? callback() : callback(new Error('请无条件遵守规矩'))
    }

    return {
      isActive: false,
      ctaObj: null,
      loginForm: {

        mobile: '15534083950', // 手机号码
        code: '246810', // 校验码
        xieyi: true // 协议
      },
      // 规则
      loginFormRules: {
        mobile: [

          { required: true, message: '手机号码必填' },
          { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
        ],
        code: [
          { required: true, message: '验证码必填' }
        ],
        xieyi: [
          { validator: xieyiTest }
        ]
      }

    }
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate(valid => {
        // 表单域校验成功
        if (valid) {
          if (this.ctaObj !== null) {
            return this.ctaObj.verify()
          }
          this.isActive = true
          let pro = this.$http.get(`/captchas/${this.loginForm.mobile}`)
          pro
            .then(result => {
              // 接收处理返回的极验请求秘钥信息
              let { data } = result.data
              window.initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success,
                new_captcha: true,
                product: 'bind' // 没有按钮，通过登录按钮激活验证
              }, captchaObj => {
                captchaObj.onReady(() => {
                  // 验证码ready之后才能调用verify方法显示验证码
                  captchaObj.verify() // 显示验证码窗口
                  this.isActive = false
                  this.ctaObj = captchaObj
                }).onSuccess(() => {
                  this.loginAct()
                }).onError(() => {
                  // your code
                })
              })
            })
            .catch(err => {
              return this.$message.error('获得极验初始校验信息错误：' + err)
            })
        }
      })
    },
    loginAct () {
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) {
          return false
        }
        var pro = this.$http.post('/authorizations', this.loginForm)
        pro
          .then(result => {
            if (result.data.message === 'OK') {
              // 客户端记录用户的信息
              window.sessionStorage.setItem('userinfo', JSON.stringify(result.data.data))
              this.$router.push('/home')
            }
          })
          .catch(err => {
            return this.$message.error('用户名或密码错误' + err)
          })
      })
    }
  }

}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;

  background-image: url("./login_bg.jpg");
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
img {
      width: 50%;
      margin: 20px auto;
    }
  .login-box {
    width: 410px;
    height: 345px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;

    .el-form{
      width: 75%;
    }
  }
}
</style>
