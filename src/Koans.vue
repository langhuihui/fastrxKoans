<template>
  <a-alert
    theme="info"
    message="输入的答案会替换代码中的下划线（__）然后执行代码，所以字符串不要忘记加上引号"
  />
  <a-alert
    theme="info"
    message="fastrx鼓励使用RxJS 5类似的链式写法（也支持使用RxJS 6/7类似的pipe写法但有所不同），但api命名采用RxJS 6/7，参数以及功能略微简化"
  />
  <a-form
    style="margin-top: 10px"
    :model="formData"
    :rules="rules"
    labelAlign="left"
    :labelCol="{ offset: 2, span: 8 }"
    :wrapperCol="{ span: 4, offset: 2 }"
  >
    <template v-for="q in currentLesson" :key="q.name">
      <a-form-item has-feedback :name="q.name">
        <template #label> {{ q.name }}. {{ q.label }} </template>
        <a-input
          v-if="q.length === 1"
          v-model:value="formData[q.name]"
          placeholder="输入答案"
        ></a-input>
        <template v-else>
          <a-input-group compact>
            <a-input
              v-for="i in q.length"
              v-model:value="formData[q.name + i]"
              :key="i"
              :style="{ width: '150px' }"
              :placeholder="'输入答案' + i"
            >
            </a-input>
          </a-input-group>
        </template>
      </a-form-item>
      <a-row>
        <a-col :span="18" :offset="2">
          <highlightjs language="javascript" :code="q.code" />
        </a-col>
      </a-row>
    </template>
  </a-form>
</template>
<script setup>
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import hljsVuePlugin from "@highlightjs/vue-plugin";
import { computed } from "@vue/reactivity";
const highlightjs = hljsVuePlugin.component;
const {
  state: { lessons, rules, formData },
} = useStore();
const route = useRoute();
const currentLesson = computed(() => lessons[route.params.lesson]);
</script>