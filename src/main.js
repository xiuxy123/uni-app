import Vue from 'vue';

import store from './store';

import App from './App';
// 引入全局uView
import uView from 'uview-ui';
// i18n部分的配置
// 引入语言包，注意路径
import Chinese from '@/common/locales/zh.js';

import English from '@/common/locales/en.js';
// VueI18n
import VueI18n from '@/common/vue-i18n.min.js';

import httpInterceptor from '@/common/http.interceptor.js';
// http接口API抽离，免于写url或者一些固定的参数
import httpApi from '@/common/http.api.js';

Vue.config.productionTip = false;
Vue.prototype.$store = store;
Vue.prototype.$backgroundAudioData = {
  playing: false,
  playTime: 0,
  formatedPlayTime: '00:00:00',
};
Vue.prototype.$adpid = '1111111111';
App.mpType = 'app';

// uview
// 此处为演示Vue.prototype使用，非uView的功能部分
Vue.prototype.vuePrototype = '枣红';
Vue.use(uView);
// 引入uView对小程序分享的mixin封装
const mpShare = require('uview-ui/libs/mixin/mpShare.js');

Vue.mixin(mpShare);
// VueI18n
Vue.use(VueI18n);
const i18n = new VueI18n({
  // 默认语言
  locale: 'zh',
  // 引入语言文件
  messages: {
    zh: Chinese,
    en: English,
  },
});
// 由于微信小程序的运行机制问题，需声明如下一行，H5和APP非必填
Vue.prototype._i18n = i18n;

const app = new Vue({
  store,
  i18n,
  ...App,
});

// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
Vue.use(httpInterceptor, app);

Vue.use(httpApi, app);

app.$mount();
