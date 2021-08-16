<template>
  <a-layout>
    <a-layout-sider
      :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }"
    >
      <div class="logo" />
      <a-menu theme="dark" mode="inline" @click="onClick" :openKeys="['koans']">
        <a-sub-menu key="koans">
          <template #title
            ><shop-outlined /> <span class="nav-text">Koans</span></template
          >
          <a-menu-item
            :key="label"
            v-for="(item, label, index) in lessons"
            :value="label"
          >
            {{ `0${index + 1} ${label}` }}
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="viz">
          <bar-chart-outlined />
          <span class="nav-text">可视化</span>
        </a-menu-item>
        <a-menu-item key="rxjs-dev.firebaseapp.com/api">
          <upload-outlined />
          <span class="nav-text">官方API</span>
        </a-menu-item>
        <a-menu-item key="rxmarbles.com">
          <appstore-outlined />
          <span class="nav-text">弹珠图</span>
        </a-menu-item>
        <a-sub-menu>
          <template #title>
            <cloud-outlined />
            <span class="nav-text">github</span>
          </template>
          <a-menu-item key="github.com/langhuihui/fastrx">
            <span class="nav-text">fastrx</span>
          </a-menu-item>
          <a-menu-item key="github.com/langhuihui/fastrxKoans">
            <span class="nav-text">本程序</span>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="space.bilibili.com/328443019">
          <video-camera-outlined />
          <span class="nav-text">视频教程</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout :style="{ marginLeft: '200px' }">
      <router-view></router-view>
    </a-layout>
  </a-layout>
</template>
<script setup>
import { watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
} from "@ant-design/icons-vue";
const router = useRouter();
const {
  state: { lessons },
} = useStore();
console.log(lessons);
function onClick({ item, key, keyPath }) {
  if (key === "viz") {
    router.push("/viz");
  } else if (keyPath[0] === "koans") {
    router.push({ name: "koans", params: { lesson: key } });
  } else {
    window.open("https://" + key, "_blank");
  }
}
</script>
