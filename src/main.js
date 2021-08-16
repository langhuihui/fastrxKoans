import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import './assets/site.less';
import * as Icons from "@ant-design/icons-vue";
import Observable from './components/observable.vue'
import { createRouter, createWebHashHistory } from 'vue-router';
import { createStore } from 'vuex'
import Store from './store'
import Koans from './Koans.vue';
import Index from './Index.vue';
import Viz from './Viz.vue';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import hljsVuePlugin from "@highlightjs/vue-plugin";
import 'highlight.js/styles/github-dark.css';
hljs.registerLanguage('javascript', javascript);
const app = createApp(Index);

const routes = [
    { path: '/koans/:lesson', component: Koans, name: 'koans' },
    { path: '/viz', component: Viz },
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

// Create a new store instance.
const store = createStore(Store)
app.use(store)
app.use(hljsVuePlugin)
app.use(router)
app.use(Antd);
for (const i in Icons) {
    app.component(i, Icons[i]);
}
app.component('observable', Observable)
app.mount('#app')
router.push({ name: 'koans', params: { lesson: 'streams' } })