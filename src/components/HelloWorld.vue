<template>
    <h1>{{ msg }}</h1>
</template>

<script setup>
import { defineProps, reactive } from "vue";

const props = defineProps({
    msg: String,
    source: Object,
});
console.log(props.source);
</script>