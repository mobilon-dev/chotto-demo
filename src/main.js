import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@mobilon-dev/chotto/style.css';
import '@mobilon-dev/chotto/themes/default.css';
import '@mobilon-dev/chotto/themes/dark.css';
import '@mobilon-dev/chotto/themes/green.css';
import '@mobilon-dev/chotto/themes/mobilon1.css';

import 'primeicons/primeicons.css'
import './assets/style.css'

import App from './App.vue'
import router from './router';
const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app')