import { createApp } from "vue";
import router from "@/router";
import antd from "ant-design-vue";
import App from "./App";
import "@ant-design-vue/pro-layout/dist/style.css";

createApp(App).use(router).use(antd).mount("#app");
