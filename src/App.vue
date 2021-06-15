<template>
  <div class="app">
    <div class="head">
      <img src="./assets/Rx_Logo_S.png" />
      <div>
        <div class="title">Rx 可视化学习工具</div>
        <div class="sub-title">Animated playground for Rx Observables</div>
      </div>
      <div style="float: right">
        <span style="color: white">图例：</span>
        <a-tag
          :key="item"
          v-for="item in sample"
          :color="
            item.status == -1
              ? 'error'
              : ['default', 'processing', 'warning', 'success'][
                  item.status || 0
                ]
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
    </div>

    <div class="pipeline">
      <Pipeline :source="source" />
    </div>
    <div class="input">
      <a-textarea placeholder="输入表达式" v-model:value="input" auto-size />
      <a-button @click="sub" type="danger" style="height: auto"
        >subscribe</a-button
      >
    </div>
    <div class="components">
      <a-tag
        color="lightgray"
        v-for="k in observables"
        :key="k"
        @click="input += k"
      >
        {{ k }}
      </a-tag>
    </div>
    <div style="height: 30px"></div>
    <a-list
      bordered
      size="small"
      class="demo"
      item-layout="horizontal"
      :data-source="demos"
      :split="false"
    >
      <template #header>
        <div style="color: white" contenteditable="true">例子</div>
      </template>
      <template #renderItem="{ item }">
        <a-list-item class="demo-item" @click="input = item">
          {{ item }}</a-list-item
        >
      </template>
    </a-list>
  </div>
</template>

<script setup>
import { nextTick, ref, watch, shallowRef } from "vue";
import * as fastrx from "fastrx";
const observables = Object.keys(fastrx).filter((x) => {
  switch (x) {
    case "default":
    case "pipe":
    case "toPromise":
    case "toRef":
    case "reusePipe":
    case "Sink":
      return false;
  }
  return true;
});
import Pipeline from "./components/pipeline.jsx";
import { parse, Node, parseSource } from "./components/node";
const source = shallowRef();
const input = ref("");
const demos = [
  "of(1,2,3,4).takeWhile(x=>x<3)",
  "interval(1000).take(5)",
  "interval(1000).skip(5)",
  "race(fromEvent(document,'click'),interval(2000),interval(3000))",
  "interval(1000).share()",
  "fromEvent(document,'mousemove').map(x=>x.offsetX)",
  "fromEvent(document,'mousedown').switchMapTo(fromEvent(document,'mousemove').map(x=>x.offsetX).takeUntil(fromEvent(document,'mouseup')))",
  "concat(interval(1000).take(2),interval(1000).take(3),throwError('err'),timer(1000))",
  "fromPromise(fetch('http://www.baidu.com'))",
  "fromPromise(fetch('/').then(x=>x.text()))",
  "fromEvent(document,'mousemove').map(x=>x.offsetX).throttleTime(1000)",
  "fromEvent(document,'mousemove').map(x=>x.offsetX).debounceTime(1000)",
  "fromEvent(document,'click').switchMap(x=>interval(1000*Math.random()>>0))",
  "fromEvent(document,'click').mergeMap(x=>interval(1000*Math.random()>>0))",
  "fromEvent(document,'compositionend').startWith(1).switchMapTo(fromEvent(document,'keydown').takeUntil(fromEvent(document,'compositionstart'))).map(x=>x.keyCode)",
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
    disposes.pop().dispose();
  }
  try {
    source.value = parse(parseSource(value));
  } catch (er) {
    console.error(er);
  }
}
watch(input, ok);
function sub() {
  if (source.value.name != "subscribe") {
    const node = new Node("subscribe");
    node.source = source.value;
    node.clickTag = (s) => s.dispose();
    source.value = node;
  }
  setTimeout(
    () => disposes.push(source.value.subscribe(console.log, console.log)),
    200
  );
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
.head {
  background: black;
  height: 60px;
  width: 100%;
  padding: 10px;
}
.head > div {
  display: inline-block;
}
.head img {
  width: 35px;
  height: 35px;
  vertical-align: super;
  margin-right: 10px;
}
.input {
  display: flex;
  width: 80%;
  justify-content: stretch;
}
.title {
  color: violet;
  font-size: 18px;
  font-weight: bold;
}
.sub-title {
  color: white;
  font-size: 12px;
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

.pipeline {
  text-align: center;
}
.pipeline span.arrow,
.subpipe .before,
.subpipe .after {
  font-size: 40px;
  color: white;
}
span.arrow.disable {
  color: rgb(167, 167, 167);
}
.subpipes {
  display: flex;
}
.subpipe {
  position: relative;
  display: flex;
  margin: 5px;
  align-items: flex-end;
  margin-bottom: 35px;
}
.subpipe .before {
  content: "↑";
  position: absolute;
  bottom: -45px;
  left: 10px;
}
.subpipe .after {
  content: "↓";
  position: absolute;
  bottom: -45px;
  right: 10px;
}
.demo {
  padding: 10px;
  margin: 10px;
}
.demo-item:hover {
  background: gray;
}
.demo-item {
  background: black;
  color: darkgray;
  cursor: pointer;
  padding-left: 20px;
}
</style>