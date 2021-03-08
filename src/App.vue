<template>
  <div class="app">
    <div>
      <Pipeline :source="source" />
    </div>
    <a-card title="输入表达式" style="width: 1000px">
      <template #extra><a @click="sub">OK</a></template>
      <a-textarea v-model:value="input" auto-size />
    </a-card>
  </div>
</template>

<script setup>
import { nextTick, reactive, ref, triggerRef, watch, watchEffect } from "vue";
import Pipeline from "./components/pipeline.jsx";
const source = ref();
const input = ref("");
let disposes = [];
function ok() {
  while (disposes.length) {
    disposes.pop()();
  }
  const items = input.value
    .replace(/\n|\r/g, "")
    .split(").")
    .map((x) => x + ")");
  const convert = (str) => {
    const g = /(.+?)\((.*?)\)/.exec(str);
    return g
      ? {
          name: g[1],
          arg: g[2],
          streams: [],
        }
      : null;
  };
  source.value = items.reduce((acc, c) => {
    c = convert(c);
    if (!c) return acc;
    if (acc) c.source = acc;
    return c;
  }, null);
}
watch(input, ok);
function sub() {
  if (source.value.name != "subscribe") {
    source.value = {
      name: "subscribe",
      arg: "",
      streams: [],
      source: source.value,
    };
  }
  nextTick(() => {
    disposes.push(source.value.subscribe(console.log, console.log));
  });
}
// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>
.app {
  display: flex;
  flex-direction: column;
  place-items: center;
  place-content: center;
}
.app > div:first-child {
  display: flex;
  place-items: center;
  place-content: center;
  min-height: 200px;
}
</style>