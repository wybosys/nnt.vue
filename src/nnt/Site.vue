<template>
  <div>{{message}}</div>
</template>

<script lang="ts">

import {Storage} from "./Storage";
import {Application, IRoute} from "./Application";

const KEY_CURRENT_SITE = '::nnt::vue::sites::current'

export default {
  name: 'Site',
  data() {
    return {
      message: ''
    }
  },
  mounted() {
    // 通过url传递
    let site = this.$route.params.site
    if (!site)
      site = Storage.shared.value(KEY_CURRENT_SITE)
    if (!site) {
      this.message = '404 SITE NOT FOUND'
      return
    }

    // 查询一下site是否存在
    let sites = Application.shared.router.sites
    if (!(site in sites)) {
      // 从storage加载，放置二次重入带来的二级路径被踢掉
      site = Storage.shared.value(KEY_CURRENT_SITE)
      if (!(site in sites)) {
        this.message = '404 SITE NOT AVALIABLE'
        return
      }
    }

    // 设置为当前
    Storage.shared.set(KEY_CURRENT_SITE, site)

    // 加载该站点的router
    sites[site]().then(obj => {
      let routes: IRoute[] = obj.default
      this.$router.options.routes = routes
      this.$router.addRoutes(this.$router.options.routes)

      // 跳转到新的根页面
      Application.shared.push('/echo')
    })
  }
}
</script>
