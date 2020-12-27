<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <div v-if="!mobile" class="sidebar hidden-sm hidden-xs">
    <VideoList videoList="list"/>
  </div>
</template>

<script>
import VideoList from './components/VideoList.vue'

export default {
  name: 'App',
  components: {
    VideoList
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
