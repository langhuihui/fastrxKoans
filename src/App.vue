<template>
    <Pipeline :source="source" />
    <input ref="input" />
    <button @click="ok">OK</button>
    <button @click="sub">sub</button>
</template>

<script setup>
import { reactive, ref, triggerRef } from "vue";
import Pipeline from "./components/pipeline.jsx";
import HelloWorld from "./components/HelloWorld.vue";
const source = ref();
const input = ref();
function ok() {
    const items = input.value.value.split(".");
    const convert = (str) => {
        const g = /(.+?)\((.*?)\)/.exec(str);
        return {
            name: g[1],
            arg: g[2],
        };
    };
    source.value = items.reduce((acc, c) => {
        c = convert(c);
        if (acc) c.source = acc;
        return c;
    }, null);
}
function sub() {
    source.value.subscribe(console.log, console.log);
}
// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>
</style>