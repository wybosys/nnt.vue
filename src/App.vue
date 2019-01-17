<template>
  <div id="app">
    <router-view v-if="router"/>
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      router: true
    }
  },
  methods: {
    reload() {
      this.router = false
      this.$nextTick(() => {
        this.router = true
      })
    }
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
