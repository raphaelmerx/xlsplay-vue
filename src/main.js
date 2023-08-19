import './assets/main.css';
import 'handsontable/dist/handsontable.full.min.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import LogRocket from 'logrocket';

LogRocket.init('jymlud/xlsplayraphadev');

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);

app.use(createPinia());
app.use(vuetify);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app');
