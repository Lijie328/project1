<template>
  <el-container>
    <el-aside :width="isCollapse?'65px':'200px'">
      <el-menu router background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <img src="./logo_admin.png" alt="">
        <el-menu-item
          index="/welcome"
          style="width:200px"
          :collapse="isCollapse"
          :collapse-transition="false"
        >
          <i class="el-icon-location"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2" :style=" {width :isCollapse?'65px':'200px' }">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">内容管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/articleadd">发布文章</el-menu-item>
            <el-menu-item  index="/article">内容列表</el-menu-item>
            <el-menu-item index="2-3">评论列表</el-menu-item>
            <el-menu-item index="/material">素材管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="3" :style=" {width :isCollapse?'65px':'200px' }">
          <i class="el-icon-location"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>

        <el-menu-item index="/account" :style=" {width :isCollapse?'65px':'200px' }">
          <i class="el-icon-location"></i>
          <span slot="title">账户信息</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div id="lt">
          <i
            class="el-icon-s-fold"
            slot="prefix"
            :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"
            style="cursor:pointer;"
            @click="isCollapse=!isCollapse"
          ></i>
          <span>江苏传智播客教育科技股份有限公司</span>
        </div>
        <div id="rt">
          <el-input type="text" placeholder="请输入搜索的文章内容" v-model="input">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span style="margin:0 10px;">消息</span>
          <el-dropdown>
            <span class="el-dropdown-link">
              <img :src="photo" alt width="40" height="40" />
              {{name}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>git地址</el-dropdown-item>
              <el-dropdown-item @click.native="loginout()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import bus from '@/utils/bus.js'
export default {
  data () {
    return {
      tmpname: '', // 临时账户名称
      tmpphoto: '', // 临时账户头像
      isCollapse: false,
      input: ''
    }
  },
  created () {
    // 1. 对  名称  进行更新
    bus.$on('upAccountName', nm => {
      // 更新sessionStorage中name的信息
      let userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
      userinfo.name = nm
      window.sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
      // 更新临时成员tmpname
      this.tmpname = nm
    })
    // 2. 对  名称  进行更新
    bus.$on('upAccountPhoto', ph => {
      // 更新sessionStorage中photo的信息
      let userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
      userinfo.photo = ph
      window.sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
      // 更新临时成员tmpphoto
      this.tmpphoto = ph
    })
  },
  computed: {
    name () {
      return this.tmpname || JSON.parse(window.sessionStorage.getItem('userinfo')).name
    },
    photo () {
      return this.tmpphoto || JSON.parse(window.sessionStorage.getItem('userinfo')).photo
    }
  },
  methods: {
    loginout () {
      this.$confirm('确定要提出系统?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.sessionStorage.clear()
        this.$router.push('/login')
      }).catch(() => { })
    }
  }
}

</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-aside {
    height: 100%;
    background-color: #000;
    img{
      margin-top: 5px;
      width: 180px;
    }
  }
  .el-header {
    padding: 0 10px 0 9px;
    min-width: 950px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    #lt {
      height: 100%;
      width: 40%;
      background-color: white;
      font-size: 20px;
      display: flex;
      align-items: center;
    }
    #rt {
      height: 100%;
      width: 50%;
      background-color: white;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .el-dropdown-link {
        display: flex;
        align-items: center;
      }
    }
  }
  .el-main {
    background-color: #515153;
  }
}
</style>
