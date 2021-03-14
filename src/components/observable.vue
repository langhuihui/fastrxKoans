<template>
    <div>
        <div class="subpipes">
            <slot></slot>
        </div>
        <div class="root">
            <div>
                <div class="red"></div>
                <div class="yellow"></div>
                <div class="green"></div>
                <span>{{ ctx.toString() }}</span>
            </div>

            <div
                v-for="stream in ctx.streams"
                :key="stream"
                :style="`padding-left:5px;background:${stream.color};overflow:hidden;max-width:200px`"
            >
                <a-tag
                    @click="ctx.clickTag(stream)"
                    :color="
                        stream.status == -1
                            ? 'error'
                            : ['default', 'processing', 'warning', 'success'][
                                  stream.status || 0
                              ]
                    "
                >
                    <template #icon>
                        <sync-outlined :spin="true" v-if="stream.status == 1" />
                        <CheckSquareOutlined v-else-if="stream.status == 3" />
                        <CloseCircleOutlined v-else-if="stream.status == -1" />
                        <PoweroffOutlined v-else-if="stream.status == 2" />
                        <ApiOutlined v-else />
                    </template>
                    {{ stream.label }}
                </a-tag>
            </div>
        </div>
    </div>
</template>
<script>
import Pipeline from "./pipeline.jsx";
export default {
    props: ["ctx"],
};
</script>
<style scoped>
.root {
    border-radius: 5px 5px 0 0;
    background: lightgray;
    border: 1px solid rgb(68, 68, 68);
    box-shadow: 1px 10px 20px black;
    min-height: 60px;
}
.root > div:first-child {
    display: flex;
    background: black;
    border-radius: 5px 5px 0 0;
    color: white;
    font-size: 8px;
    padding: 4px;
}
.root > div:first-child > div {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin: 2px;
}
.red {
    background: indianred;
}
.yellow {
    background: gold;
}
.green {
    background: green;
}
</style>