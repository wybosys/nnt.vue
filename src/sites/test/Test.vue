<template>
  <div>
    TEST
    <ul>
      <li v-for="(item,index) in '12'" :key="index">
        此处为测试代码{{item}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Test',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
ul {
  @include font-dpr(16px);
  li {
    padding: 20px;
    @include border-1px($color-base)
  }
}
</style>
