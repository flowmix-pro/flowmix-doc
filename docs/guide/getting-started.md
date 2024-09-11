有关产品介绍相关话题可以参考我们之前录制的视频:

<a href="https://www.bilibili.com/video/BV1jo4y1b7Cm/?share_source=copy_web&vd_source=3f71a66c932dba65afde99c93d818d8b" target="_blank">【3 分钟了解新一代低代码神器 Dooring】 </a>

接下来重点介绍如何本地快速上手 `Dooring-Saas` 开发.

## 工程目录介绍

客户再购买私有化部署之后, 会交付如下几个工程:

- <b>editor</b> 可视化搭建编辑器
  - 技术栈: react + hooks + antd + 自研组件 + 自研引擎
  - 路径: [编辑器](https://dooring.vip/h5_plus/editor)
  - 构建产物:
    - 编辑器页面
    - 搭建之后的落地页
    - 下载代码的基座
- <b>entry</b> 入口工程
  - 技术栈: vue3 全家桶
  - 路径:
    - [入口页](https://dooring.vip/#/entry)
    - [登录注册页](https://dooring.vip/#/login)
    - [预览页](https://dooring.vip/#/preview?pid=dee44cbc-e967-40fe-b7a8-d3f02e9f0ace)
- <b>dooring-admin</b> Dooring-Saas 的管理端
  - 技术栈: vue3 全家桶
  - 路径: [Dooring-Saas 管理后台](https://dooring.vip/admin/#/dashboard)
- <b>dooring-server</b> 后台服务工程
  - nodejs + mysql + redis 版本
  - java + mysql + redis 版本(高阶版专享)

## 服务器部署

### nginx配置

```xml

user  nginx;
worker_processes  auto;
worker_cpu_affinity auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       ./mime.types; #文件扩展名与类型映射表
    default_type  application/octet-stream; #默认文件类型
    client_max_body_size 100m;
    #设置日志模式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    sendfile        on; #开启高效传输模式
    #tcp_nopush     on; #减少网络报文段的数量

    keepalive_timeout  65; #保持连接的时间，也叫超时时间

    gzip  on; #开启gzip压缩
    gzip_disable "msie6"; 
    # gzip_static on; 
    gzip_proxied any; 
    gzip_min_length 1000; 
    gzip_comp_level 4; 
    gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;


    server {
    
        listen       80;
        listen  [::]:80;
        server_name  localhost;

        access_log  /var/log/nginx/host.access.log  main;

        location ^~/api/ { ## 解决跨域，隐藏服务器真实地址端口，
        proxy_pass http://127.0.0.1:3000/;
        }

        location /h5_plus { ## 编辑器
            if ($request_filename ~* .*\.(?:htm|html)$)  ## 配置页面不缓存html和htm结尾的文件
            {
                add_header Cache-Control "private, no-store, no-cache, must-revalidate, proxy-revalidate";
            }
            ## add_header Content-Security-Policy upgrade-insecure-requests always; 强制使用https
            alias   /usr/share/nginx/html/h5_plus;
            try_files $uri $uri/ /index.html;
            index  index.html index.htm;
        }

        location /h5 { ## 编辑器-产物H5
            ##  add_header Content-Security-Policy upgrade-insecure-requests;
            alias   /usr/share/nginx/html/h5;
            index  index.html index.htm;
        }


        location /admin { ## 后台管理
            alias   /usr/share/nginx/html/admin;
            index  index.html index.htm;
        }

        location / { ## entry 入口项目
            ## add_header Content-Security-Policy upgrade-insecure-requests;
            root   /usr/share/nginx/html;
            index  index.html index.htm;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }
    
}
```

### 1. 编辑器工程

环境参数介绍:

| 包名       |  版本   |                  备注                   |
| ---------- | :-----: | :-------------------------------------: |
| nodejs     | 14.15.4 或 v18.16.1 |             建议使用此版本              |
| yarn(推荐) | 1.22.4  | 也可用 npm, pnpm 等, 但需要保证版本一致 |

进入 `editor` 目录之后, 在终端执行安装命令:

```
yarn
```

安装完毕之后, 再运行命令:

```
yarn start
```

此时在终端控制台会打印访问的 ip 端口号, 我们在浏览器中打开即可运行.

🚀 注意: 如果需要调用实际的后台服务, 需要先启动本地后台工程, 修改后台的 api 代理地址.

#### 构建

我们在项目的 `package.json` 文件中可以看到如下脚本配置:

```json
"scripts": {
    "start": "umi dev -- editor",
    "start:h5": "umi dev -- h5",
    "start:down": "umi dev -- downH5",
    "build": "umi build -- editor",
    "build:h5": "umi build -- h5",
    "build:down": "umi build -- downH5"
  }
```

这里给大家介绍一下这几个命令的用途:

- **build** 用于打包编辑器工程
- **build:h5** 用于打包 H5 基座工程, 必需
- **build:down** 用于打包下载代码的基座工程(主要用于在线下载 H5 页面代码)

我们执行完 build 后, 会将打包后的文件统一移动到 `server/static` 目录下. 部署也只需要部署 `server` 目录即可.

#### 公共配置

工程化我们采用的是 `umi3.0`, 所以我们在 `.umirc.ts` 文件下统一管理编辑器相关的公共配置, 这里我们需要关注一下文件中的 `define`, 主要用来提供自定义配置:

```ts
define: {
    // 启动环境
    START_ENV,
    // 启动语言
    lang,
    // 编辑器拖拽精度(纵向精度)
    rowHeight: 1,
    // 编辑器拖拽精度(横向精度)
    colCell: 375,
    // 微信appid
    appId: 'xxx',
    // 测试和生产域名
    domain: isTest ? 'https://h5dooring.online' : 'https://dooring.vip',
    // 是否为测试
    isTest,
    // 资源库地址
    resourceUrl: isTest ? 'https://h5dooring.online/#/material' : 'https://dooring.vip/#/material',
    // 是否开启埋点
    openTrack: true,
    // 是否展示数据源
    showDataSource: !isTest,
    // 配置api路由请求前缀
    apiPrefix: isTest ? 'javaApi' : 'api',
  },
```

### 2. entry 入口页工程

环境参数介绍:

| 包名       |  版本   |                  备注                   |
| ---------- | :-----: | :-------------------------------------: |
| nodejs     | 16.15.1 |             建议使用此版本              |
| yarn(推荐) | 1.22.4  | 也可用 npm, pnpm 等, 但需要保证版本一致 |

进入 `entry` 目录之后, 在终端执行安装命令:

```
yarn 
```

安装完毕之后, 再运行命令:

```
yarn dev
```

```json
"scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build --mode production",
    "build:test": "vue-tsc --noEmit && vite build --mode test",
    "preview": "pnpm build:development && vite preview",
    "lint:eslint": "eslint --cache --max-warnings 0 \"src/**/*.{vue,js,ts,tsx}\" --fix",
    "lint:prettier": "prettier --write  \"src/**/*.{js,ts,json,tsx,css,less,scss,vue,html,md}\"",
    "lint": "pnpm lint:eslint && pnpm lint:prettier"
  }
```

### 3. 管理后台

环境参数介绍:

| 包名       |  版本   |                  备注                   |
| ---------- | :-----: | :-------------------------------------: |
| nodejs     | 16.15.1 |             建议使用此版本              |
| yarn(推荐) | 1.22.4  | 也可用 npm, pnpm 等, 但需要保证版本一致 |

进入 `admin` 目录之后, 在终端执行安装命令:

```
yarn
```

安装完毕之后, 再运行命令:

```
yarn dev
```

```json
  "scripts": {
    "dev": "vite",
    "build:test": "vue-tsc --noEmit && vite build --mode development",
    "build:prod": "vue-tsc --noEmit && vite build  --mode production",
    "preview:stage": "pnpm build:stage && vite preview",
    "preview:prod": "pnpm build:prod && vite preview",
    "lint:eslint": "eslint --cache --max-warnings 0 \"src/**/*.{vue,js,ts,tsx}\" --fix",
    "lint:prettier": "prettier --write  \"src/**/*.{js,ts,json,tsx,css,less,scss,vue,html,md}\"",
    "lint": "pnpm lint:eslint && pnpm lint:prettier",
    "prepare": "husky install"
  }
```

### 4. 后台服务

#### 后端服务介绍

后台服务主要采用的 nest + mysql + redis, 接口遵循 restful 规范, 并且提供了接口文档，企业可以轻松基于此使用自己的后端语言来接入, 比如 java, python, go, php 等。

- tencentcloud-sdk 短信服务
- 七牛云 sdk 资源云储存
- 微信 sdk 实现微信登录，微信分享等功能
- puppeteer 实现 html 转图片，html 转 pdf 等
- nodemailer-smtp-transport 实现邮件服务

#### 接口文档地址

链接: https://www.apifox.cn/apidoc/shared-87d5db8d-6d23-4dce-a13f-bf77b2affe80 访问密码 : eHog1sSr

#### 环境准备

- pm2
- Node 16+
- Npm
- mysql 8+
- redis

#### 安装依赖

1.通过 docker 安装

```bash
docker run -itd --name dooring-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql
```

![](/dooring-saas-mysql-model.jpg)

2.创建仓库

```bash
sudo mysql -u root -p
create database dooring-h5 //此处仓库对应项目内配置 DB_DATABASE
```

#### Redis 


```bash
sudo docker run -p 6379:6379 --name redis -v /root/redis/redis.conf:/etc/redis/redis.conf  -v /root/redis/data:/data -d redis redis-server /etc/redis/redis.conf --appendonly yes
```

##### 修改项目配置文件
涉及邮箱服务，短信服务，微信认证服务，七牛云服务


```ts
export default {
  //数据库-ip
  DB_HOST: 'localhost',
  //数据库-用户
  DB_USERNAME: 'root',
  //数据库-访问密码
  DB_PASSWORD: '123456',
  //数据库-仓库名
  DB_DATABASE: 'dooring-h5',
  //数据库-端口
  DB_PORT: 3306,
  DB_LOGGING: false,
  DB_SYNC: true,
  //邮件服务-地址
  SMTP_HOST: 'smtp.feishu.cn',
  //邮件服务-端口
  SMTP_PORT: 465,
  //邮件服务-用户
  SMTP_USER: 'h5@dooring.cn',
  //邮件服务-密码
  SMTP_PASSWORD: 'xxxxx',
  ISDEV: true,
  PROTOCOL: 'http',
  //服务启动端口
  PORT: 3000,
  //服务启动地址
  DOMAIN: 'localhost',
  //联系邮箱
  CONTACT_EMAIL: 'xxx.@qq.cn',
  //七牛云-SCOPE
  QINIU_SCOPE: 'dooring',
  //七牛云-accessKey
  QINIU_ACCESS_KEY: 'xxxxxxx',
  //七牛云-secretKey
  QINIU_SECRET_KEY: 'xxxxxxx',
  //短信服务-appid
  SMS_APPID:'xxxxx',
  //短信服务-secretId
  SMS_SECRET_ID:'xxxxx',
  //短信服务-secretKey
  SMS_SECRET_KEY:'xxxx',
  //短信服务-签名
  SMS_SIGN_NAME:'dooring',
  //redis-地址
  REDIS_HOST: 'localhost',
  //redis-端口
  REDIS_PORT: 6379,
  //redis-密码
  REDIS_PASSWORD: 'xxxxxx',
  //微信服务-appid
  APPID: 'xxxxxx',
  //微信服务-SECRET
  APP_SECRET: 'xxxxxx'
}
```

#### 启动服务

```bash
cd ./dooring-h5-server //切换到项目文件夹
yarn  //安装依赖

yarn run start:prod //以正式环境运行
或者使用pm2守护
pm2 start npm --name h5-dooring-server -- run start:prod
```
#### 测试

浏览器访问localhost:3000 端口，如下则部署成功

![](/dooring-saas-hello-word.jpg)




## java版部署文档

### 准备环境

Maven 3.6.3

下载地址：https://archive.apache.org/dist/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.zip

需要配置maven环境变量，具体配置方法自行查阅网络资料。

### 打包

```shell
# clone代码，需要输入用户名密码
git clone https://e.coding.net/xujiang1995/dooring-backend/dooring-backend.git
# 进入项目目录
cd dooring-backend
# maven打包
mvn -B -U clean package
```

### 产物

打包完成，会产生一个**target**文件夹，该文件夹下的**dooring-backend-0.0.1-SNAPSHOT.jar**为实际最终产物


## 运行

### 方式一：docker运行

需要安装docker环境，具体安装方法自行查阅网络资料。

```shell
# 步骤一
mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)
# 步骤二，注意后面-f后有个.
docker build -t dooring-backend:latest -f Dockerfile target/dependency
# 运行，其中spring_profile_active=dev指定环境，prod为生产，不指定默认为dev
docker run -d -p 8089:8089 --name dooring-backend -e spring_profile_active=prod dooring-backend:latest
```

### 方式二：jar包运行

需要安装jdk8环境，具体安装方法自行查阅网络资料。

```shell
# 进入打包后的文件夹
cd target
# 运行,其中--spring.profiles.active=dev可以指定运行环境，dev为测试环境，prod为生产环境，不指定默认为dev
java -jar dooring-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```



# 开源框架

| 框架         | License            | 版本   | 官网                                                  |
| ------------ | ------------------ | ------ | ----------------------------------------------------- |
| Spring Boot  | Apache License 2.0 | 2.7.12 | [Spring Boot](https://spring.io/projects/spring-boot) |
| MyBatis Plus | Apache License 2.0 | 3.5.2  | [MyBatis-Plus](https://baomidou.com/)                 |
| satoken      | Apache License 2.0 | 1.31.0 | [Sa-Token](https://sa-token.cc/)                      |


### 默认密码

- 账号 15014078468
- 密码 test123456








