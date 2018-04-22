<template>
  <div class="response-info">
    <div>{{hits}} results ({{time}} seconds)</div>
  </div>
</template>

<script>
export default {
  name: 'ResponseInfo',
  props: ["time", "hits"],
}
</script>

<style scoped>
.response-info {
    margin-left: 15px;
    margin-top: 18px;
    margin-bottom: 10px;
}
</style>
