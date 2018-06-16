<template>
  <div class="node-tree">
    <span class="label">{{ node.label }}</span>

    <div v-if="node.children && node.children.length">
      <node v-for="(child, idx) in node.children" v-bind:key="idx" :node="child"></node>
    </div>
  </div>
</template>

<script>
export default {
  name: "node",
  props: {
    node: Object
  }
};
</script>