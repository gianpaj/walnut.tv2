import Vue from 'vue';
import 'pwacompat';

import App from './App.vue';
import router from './router';
import store from './store';
// import '@/misc/register-service-worker';
import '@/misc/handle-network-status';
// import '@/misc/handle-apple-install-prompt';
import '@/firebase/init';
import '@/firebase/authentication';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
