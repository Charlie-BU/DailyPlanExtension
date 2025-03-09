import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

// 1. 引入你需要的组件
import * as Vant from "vant";
// 2. 引入组件样式
import "vant/lib/index.css";

const app = createApp(App);
app.use(Vant.Button);
app.use(Vant.Field);
app.use(Vant.CellGroup);
app.mount("#app");
