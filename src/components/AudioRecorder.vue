<template>
  <div>
    <span>audio</span>
    <button @click="actStart">start</button>
    <button @click="actStop">stop</button>
    <label>{{avaliable}}</label>
  </div>
</template>

<script lang="ts">

import {AudioRecorder} from "../nnt/Audio";

export default {
  name: "AudioRecorder",
  data() {
    return {
      avaliable: "",
      recorder: null
    }
  },
  mounted() {
    AudioRecorder.IsValid(sup => {
      if (sup) {
        this.recorder = new AudioRecorder();
        this.avaliable = "enable";
      } else {
        this.avaliable = "disable";
      }
    });
  },
  methods: {
    actStart() {
      if (!this.recorder)
        return;
    },
    actStop() {
      if (!this.recorder)
        return;
    }
  }
}
</script>

<style scoped>

</style>
