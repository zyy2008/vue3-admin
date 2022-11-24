# 技术框架

Webpack + Vue3 + TypeScript + Ant Design Vue + Umi-Request

> 兼容性注意

> Webpack 需要 Node.js v8.9 或更高版本 (推荐 v10 以上)。然而，有些模板需要依赖更高的 Node 版本才能正常运行，当你的包管理器发出警告时，请注意升级你的 Node 版本。

> 存在多个版本共存建议安装 [nvm windows](https://github.com/coreybutler/nvm-windows/releases) 进行 node 版本管理。

# 目录结构

本项目已经为你生成基础开发结构，提供了涵盖中后台开发的所需基础布局。

```bash
├── .husky                     # git提交校验
├── public                     # 静态资源
│   │── favicon.ico            # favicon图标
│   └── index.html             # vue 入口模板
├── src                        # 源代码
│   ├── assets                 # 主题 字体等静态资源
│   ├── components             # 业务通用组件
│   ├── layouts                # 全局 layout
│   ├── router                 # 路由
│   ├── store                  # 全局 store管理
│   ├── utils                  # 全局公用方法
│   ├── views                  # views 所有页面
│   ├── App.tsx                # 入口页面
│   ├── global.less            # 全局样式
│   └── main.ts                # 入口文件 加载组件 初始化等
├── types                      # 全局公用类型 包括类型注入
├── commitlint.config.js       # git提交规则 配置
├── json2service.json          # autos 参数配置
├── tsconfig.json              # typescript 配置
├── vue.config.js              # webpack 配置
└── package.json               # package.json
```

# 工具配置

如果您使用的 IDE 是[vscode](https://code.visualstudio.com/)(推荐)的话，可以安装以下工具来提高开发效率及代码格式化

- [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur) - vue 开发必备 （也可以选择 Volar）
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - 脚本代码检查
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - 代码格式化
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) - css 格式化
- [DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv) - .env 文件 高亮

# 新增文件

在 src/views 下新建页面的 vue 文件，如果相关页面有多个，可以新建一个文件夹来放置相关文件。

```bash
├── src
│   └── views
│       └── newPage                   # 新建页面文件名称
│            │── index.vue|.tsx       # 界面入口文件
│            │── index.module.less    # 存放index样式
│            └── components           # 当前界面提取的组件 非必须
```

# 样式

## 介绍

主要介绍如何在项目中使用和规划样式文件。

默认使用 less 作为预处理语言，建议在使用前或者遇到疑问时学习一下 [Less](http://lesscss.org/) 的相关特性（如果想获取基础的 CSS 知识或查阅属性，请参考 [MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference)）。

## 为什么使用 Less

主要是因为 Ant Design 默认使用 less 作为样式语言，使用 Less 可以跟其保持一致。

## 开启 scoped

没有加 `scoped` 属性，默认会编译成全局样式，可能会造成全局污染

```vue
<style></style>

<style scoped></style>
```

::: tip 温馨提醒

使用 scoped 后，父组件的样式将不会渗透到子组件中。不过一个子组件的根节点会同时受其父组件的 scoped CSS 和子组件的 scoped CSS 的影响。这样设计是为了让父组件可以从布局的角度出发，调整其子组件根元素的样式。

:::

## 深度选择器

有时我们可能想明确地制定一个针对子组件的规则。

如果你希望 `scoped` 样式中的一个选择器能够作用得“更深”，例如影响子组件，你可以使用 `>>>` 操作符。有些像 Sass 之类的预处理器无法正确解析 `>>>`。这种情况下你可以使用 `/deep/` 或 `::v-deep` 操作符取而代之——两者都是 `>>>` 的别名，同样可以正常工作。

详情可以查看 RFC[0023-scoped-styles-changes](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0023-scoped-styles-changes.md)。

使用 scoped 后，父组件的样式将不会渗透到子组件中，所以可以使用以下方式解决：

```vue
<style scoped>
/* deep selectors */
::v-deep(.foo) {
}
/* shorthand */
:deep(.foo) {
}

/* targeting slot content */
::v-slotted(.foo) {
}
/* shorthand */
:slotted(.foo) {
}

/* one-off global rule */
::v-global(.foo) {
}
/* shorthand */
:global(.foo) {
}
</style>
```

# 和服务端进行交互

1. 执行命令 yarn run api，生成 services 接口 ts 文件
2. 调用模块 services；
3. 获取服务端返回数据
4. 更新 data；

界面引用请求 index.vue

```vue
<template>
  <a-table :dataSource="list"> </a-table>
</template>
<script>
import { ref } from "vue";
import { message } from "ant-design-vue";
import { APIS } from "@/services";
export default defineComponent({
  setup() {
   const list = ref<Api.User[]>([]);
   APIS.DefaultApi.commonTaskPut().then((res) => {
       const {code, data, msg} = res;
      if(code === 'S-00001'){
        list.value = data
        message.success(msg)
      }else{
        message.warning(msg);
      }
    });
   return {
     list
   };
  },
});
</script>
```

# Git 提交信息

message 信息格式采用目前主流的 Angular 规范，这是目前使用最广的写法，比较合理和系统化，并且有配套的工具。

## commit message 格式说明

Commit message 一般包括三部分：Header、Body 和 Footer。

### Header

type(scope):subject

- type：用于说明 commit 的类别，规定为如下几种
  - feat：新增功能；
  - fix：修复 bug；
  - docs：修改文档；
  - refactor：代码重构，未新增任何功能和修复任何 bug；
  - build：改变构建流程，新增依赖库、工具等（例如 webpack 修改）；
  - style：仅仅修改了空格、缩进等，不改变代码逻辑；
  - perf：改善性能和体现的修改；
  - chore：非 src 和 test 的修改；
  - test：测试用例的修改；
  - revert：回滚到上一个版本；
- scope：【可选】用于说明 commit 的影响范围
- subject：commit 的简要说明，尽量简短

### Body

对本次 commit 的详细描述，可分多行

### Footer

不兼容变动：需要描述相关信息
关闭指定 Issue：输入 Issue 信息

# 构建和发布

## 构建

当项目开发完毕，只需要运行一行命令就可以打包你的应用：

```
$ yarn build

or

$ npm run build
```

# 跨域处理

## 产生原因

跨域产生的原因是由于前端地址与后台接口不是同源，从而导致 ajax 不能发送

::: tip 非同源产生的问题

1. Cookie、LocalStorage 和 IndexDB 无法获取
2. DOM 无法获得
3. AJAX 请求不能发送

:::

::: tip 同源条件

**协议**，**端口**，**主机** 三者相同即为同源

反之，其中只要 **某一个** 不一样则为不同源

:::

## 解决方式

**本地开发跨域**

本地开发一般使用下面 3 种方式进行处理

1. webpack 的 proxy 进行代理
2. 后台开启 cors
3. 使用 nginx 转发请求

**生产环境跨域**

生产环境一般使用下面 2 种方式进行处理

1. 后台开启 cors
2. 使用 nginx 转发请求

**后台开启 cors 不需要前端做任何改动**
