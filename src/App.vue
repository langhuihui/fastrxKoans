<template>
    <div class="app">
        <div>
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
        <div class="pipeline">
            <Pipeline :source="source" />
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
import { nextTick, ref, watch,shallowRef } from "vue";
import * as components from "./components/rx";
import Pipeline from "./components/pipeline.jsx";
import { parse, Node, parseSource } from "./components/node";
const source = shallowRef();
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
    "fromEvent(document,'mousedown').switchMap(x=>interval(1000*Math.random()>>0))",
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
    source.value = parse(parseSource(value));
}
watch(input, ok);
function sub() {
    if (source.value.name != "subscribe") {
        const node = new Node("subscribe");
        node.source = source.value;
        node.clickTag = (s) => s.dispose();
        source.value = node;
    }
    setTimeout(() => {
        disposes.push(
            source.value.subscribe(
                (data) => console.log(data.value),
                console.log
            )
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
.pipeline {
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
</style>