<template>
  <div class="app">
    <div>
      <a-tag
        :key="item"
        v-for="item in sample"
        :color="
          item.status == -1
            ? 'error'
            : ['default', 'processing', 'warning', 'success'][item.status || 0]
        "
      >
        <template #icon>
          <sync-outlined :spin="true" v-if="item.status == 1" />
          <CheckSquareOutlined v-else-if="item.status == 3" />
          <CloseCircleOutlined v-else-if="item.status == -1" />
          <PoweroffOutlined v-else-if="item.status == 2" />
          <ApiOutlined v-else />
        </template>
        {{ item.label }}
      </a-tag>
    </div>
    <div>
      <Pipeline v-model:source="source" />
    </div>
    <a-card title="输入表达式" style="width: 1000px">
      <template #extra><a @click="sub">subscribe</a></template>
      <a-textarea v-model:value="input" auto-size />
    </a-card>
    <div class="components">
      <a-tag
        color="lightgray"
        v-for="(v, k) in components"
        :key="k"
        @click="input += k"
      >
        {{ k }}
      </a-tag>
    </div>
    <a-divider>demo</a-divider>
    <div class="demo">
      <a-button
        type="link"
        v-for="demo in demos"
        :key="demo"
        @click="input = demo"
      >
        {{ demo }}
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";
import * as components from "./components/rx";
import Pipeline from "./components/pipeline.jsx";
const source = ref("");
const input = ref("");
const demos = [
  "of(1,2,3,4).takeWhile(x=>x<3)",
  "interval(1000).take(5)",
  "interval(1000).skip(5)",
  "race(interval(1000),interval(2000),interval(3000))",
  "interval(1000).share()",
  "fromEvent(document,'mousemove').map(x=>x.offsetX)",
  "fromEvent(document,'mousedown').switchMapTo(fromEvent(document,'mousemove').map(x=>x.offsetX).takeUntil(fromEvent(document,'mouseup')))",
  "concat(interval(1000).take(1),throwError('err'))",
  "fromPromise(fetch('http://www.baidu.com'))",
  "fromPromise(fetch('http://localhost:3000').then(x=>x.text()))",
  "fromEvent(document,'mousemove').map(x=>x.offsetX).throttleTime(2000)",
  "fromEvent(document,'mousemove').map(x=>x.offsetX).debounceTime(2000)",
];
let disposes = [];
const sample = [
  {
    status: -1,
    label: "error",
  },
  {
    status: 1,
    label: "alive",
  },
  {
    status: 2,
    label: "cancel",
  },
  {
    status: 3,
    label: "complete",
  },
];
function ok(value) {
  while (disposes.length) {
    disposes.pop()();
  }
  source.value = value;
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
  setTimeout(() => {
    disposes.push(
      source.value.subscribe((data) => console.log(data.data), console.log)
    );
  }, 200);
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
.app > div:nth-child(2) {
  min-height: 200px;
  margin: 30px;
  width: 100vw;
  overflow: auto;
}
.app > div:nth-child(2) > * {
  display: inline-block;
}
.components {
  margin-top: 10px;
}
.demo {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  align-self: start;
  color: lightpink;
}
</style>