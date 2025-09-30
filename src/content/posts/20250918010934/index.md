---
title: Vue Router || 路由设置
published: 2025-09-18
description: 为什么要重复文档的内容？
image: ""
tags: []
category: ""
draft: true
lang: zh-CN
---
草稿：光顾着自己用忘记写了，下次用的时候再补充吧
# 什么是路由

在我们以往的开发中，如果遇到多页面应用大家是怎么做的呢？

v-if? v-show?

if(window.localtion.path?)

这对吗，对，对吗？

好像不对吧，这页面也太复杂了。

那么有没有一种东西，可以自动检测访问的链接来跳转到某个页面呢？

有的兄弟，有的

[入门 \| Vue Router](https://router.vuejs.org/zh/guide/)

**Vue Router**  就是为此而生的

在大家创建vue应用时，会提示是否配置路由，那么如果你没有配置，那你捡到宝了，在这个教程中，我会从0开始配置一个路由 :D

# 安装

[安装 \| Vue Router](https://router.vuejs.org/zh/installation.html)

```bash
npm install vue-router@4
```

当你安装完后，可以创建一个ts文件来配置路由

@/src/router/index.ts

```ts
import { createRouter, createWebHistory } from 'vue-router'
//导入创建路由方法，和历史模式，历史模式不同请查阅
//[不同的历史模式 \| Vue Router](https://router.vuejs.org/zh/guide/essentials/history-mode.html)
  

import pageNologin from '@/page/page-nologin.vue'
//如果用户未登陆，跳转至此
  

import pageMain from '@/page/page-main.vue'
//如果用户登陆了，跳转至此
  

const router = [

  { path: '/login', component: pageNologin },

  { path: '/study', component: pageMain },

]

//页面链接
  

const router = createRouter({

  routes: routers,

  history: createWebHistory(),

})

//创建路由
  
//暴露方法
export default router
```

然后在

@/src/main.ts使用此脚本

```ts
import { createApp } from 'vue'

import App from './App.vue'

import router from '@/router'

createApp(App).use(router).mount('#app')
```

@/src/App.vue

在应用中插入路由显示的内容

```vue

<script setup lang='ts'>

</script>

<template>

<RouterView />
<!--只用添加这个即可-->
</template>

<style scoped>

</style>
```


