<template>
  <template v-if="source.source">
    <pipeline :source="source.source" />
    <span
      class="arrow"
      :style="{ color: 'white', opacity: source.source.cdSub }"
      >←</span
    >
    <span
      class="arrow"
      :style="{ color: source.pickColor(), opacity: source.source.cdData }"
      >→</span
    >
  </template>
  <observable :ctx="source" :streams="source.streams">
    <div v-for="(s, i) in source.sources" class="subpipe" :key="i">
      <pipeline :source="s" />
      <div class="after" :style="{ color: 'white', opacity: s.cdSub }">↑</div>
      <div
        class="after"
        :style="{ color: s.pickColor(), opacity: source.cdData }"
      >
        ↓
      </div>
    </div>
  </observable>
</template>
<script>
export default {
  name: "pipeline",
  props: ["source"],
};
</script>