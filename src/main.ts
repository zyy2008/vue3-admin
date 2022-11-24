import "./public-path";
import { createApp, App } from "vue";
import {
  Router,
  createWebHistory,
  RouterHistory,
  createRouter,
} from "vue-router";
import routes from "@/router";
import Antd from "ant-design-vue";
import AppCom from "./App";
import "@ant-design-vue/pro-layout/dist/style.css";
import packageInfo from "../package.json";

let router: Router | null;
let instance: App<Element> | null;
let history: RouterHistory | null;

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: string;
  }
}

function render(props?: any) {
  const { container } = props ?? {};
  history = createWebHistory(
    window.__POWERED_BY_QIANKUN__ ? `/${packageInfo?.name}` : "/"
  );
  router = createRouter({
    history,
    routes,
  });

  instance = createApp(AppCom);
  instance
    .use(router)
    .use(Antd)
    .mount(container ? container.querySelector("#app") : "#app");
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log("%c%s", "color: green;", "vue3.0 app bootstraped");
}

export async function mount(props: any) {
  render(props);
  (instance as App<Element>).config.globalProperties.$onGlobalStateChange =
    props.onGlobalStateChange;
  (instance as App<Element>).config.globalProperties.$setGlobalState =
    props.setGlobalState;
}

export async function unmount() {
  instance?.unmount();
  if (instance && instance._container) {
    instance._container.innerHTML = "";
  }
  instance = null;
  router = null;
  history?.destroy();
}
