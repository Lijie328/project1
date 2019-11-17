<template>
  <el-select v-model="chid" placeholder="请选择" clearable>
    <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'ChannelCom',
  props: {
    // cid的值有类型 和 默认值 修饰
    cid: {
      // type: Number, // Object Array
      default: 0 // 设置默认值
    }
  },
  watch: {
    chid: function (newV) {
      this.$emit('slt', newV)
    }
  },
  data () {
    return {
      chid: '',
      channelList: []
    }
  },
  created () {
    this.getChannelList()
  },
  methods: {
    getChannelList () {
      let pro = this.$http.get('/channels')
      pro.then(result => {
        if (result.data.message === 'OK') {
          this.channelList = result.data.data.channels
        }
      }).catch(err => {
        return this.$message.error('获得频道错误' + err)
      })
    }
  }
}
</script>
