## 快速开始

![](https://cdn.dooring.cn/FqcIC75BCFMybWZ_LKU8HDubp2DM)

私有化的客户, 在获取源码之后, 可以本地运行调试.

### 安装依赖

目前文档引擎工程脚手架采用 `umi` 搭建, 大家进入项目工程之后可以执行如下命令安装依赖:

```bash
# npm install 或者yarn 也可以
pnpm install
```

安装完依赖之后可以本地启动:

```bash
pnpm start
```

### 项目全局配置

```ts
import { defineConfig } from "umi";

export default defineConfig({
  base: '/docx/',   // 基础路由
  publicPath: '/docx/',
  outputPath: 'editor', // 打包路径
  routes: [
    { path: "/", component: "index" }, // 首页
    { path: "/edit", component: "edit/index" },  // 编辑器
    { path: "/design/board", component: "design/board" }, // 白板页面
    { path: "/design/form", component: "design/form" }, // 表单收集列表, 可自行开发UI
    { path: "/preview", component: "preview" },  // 文档预览/发布页面
  ],
  npmClient: 'pnpm',
  define: {
    BASE_API_URL: `http://localhost:3000/api`, // 基础服务配置, 需要替换成自己的服务器地址
    UPLOAD_PATH: '/upload',  // 文件上传接口, 可自行配置
    AI_ASK__TEXT_PATH: '/ai/text' // AI问答接口地址, 可自行配置
  }
});
```

编辑器项目采用组件化的方式开发, 编辑器核心部分采用`JS`实现, 部分`UI`采用`React`实现, 所以大家可以低成本将编辑器集成到任何框架的系统中.
