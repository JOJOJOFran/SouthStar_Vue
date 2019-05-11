<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" v-if="item.meta.title" :key="item.path">
        <!-- <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{ generateTitle(item.meta.title) }}</span> -->
        <!-- <a v-else @click.prevent="handleLink(item)">{{ generateTitle(item.meta.title) }}</a> -->
        <!-- <span v-if="item.path==='/dashboard'" style="font-size:20px;">江夏区公务用车管理平台</span>
        <span v-else-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{ generateTitle(item.meta.title) }}</span>
        <a v-else @click.prevent="handleLink(item)" style="font-size:20px;">江夏区公务用车管理平台</a> -->
        <a @click.prevent="handleLink(item)" style="font-size:30px;color:white;font-weight:bold;font-family:'STKaiti';margin-left:50px;">江 夏 区 公 务 用 车 管 理 平 台</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { generateTitle } from '@/utils/i18n'
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    generateTitle,
    getBreadcrumb() {
      // let matched = this.$route.matched.filter(item => {
      //   if (item.name) {
      //     return true
      //   }
      // })
      // const first = matched[0]
      // if (first && first.name.trim().toLocaleLowerCase() !== 'Dashboard'.toLocaleLowerCase()) {
      //   // matched = [{ path: '/dashboard', meta: { title: 'dashboard' }}].concat(matched)
      //   matched = [{ path: '/dashboard', meta: { title: 'dashboard' }}].concat(matched)
      // }
      // this.levelList = matched
      this.levelList = [{ path: '/dashboard', meta: { title: 'dashboard' }}];
    },
    pathCompile(path) {
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
