import { FunctionalComponent } from "vue";
import { ConfigProvider } from "ant-design-vue";
import { RouterView } from "vue-router";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import "./global.less";

const App: FunctionalComponent = () => (
  <ConfigProvider
    style={{
      height: "100%",
    }}
    locale={zhCN}
  >
    <RouterView />
  </ConfigProvider>
);

export default App;
