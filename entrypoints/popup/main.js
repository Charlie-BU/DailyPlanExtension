import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

// Vant 组件库
import * as Vant from "vant";
import "vant/lib/index.css";

const app = createApp(App);

Object.values(Vant).forEach((component) => {
    if (component && component.name) {
        app.use(component);
    }
});

app.mount("#app");
