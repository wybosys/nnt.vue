<template>
  <div>{{message}}</div>
</template>

<script lang="ts">

import {Storage} from "./Storage";

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
    if (site)
      Storage.shared.set(KEY_CURRENT_SITE, site)
    else
      site = Storage.shared.value(KEY_CURRENT_SITE)
    if (!site) {
      this.message = '404 SITE NOT FOUND'
      return
    }
  }
}
</script>
