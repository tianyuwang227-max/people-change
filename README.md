# 逆命者

`逆命者` 是一个面向个人成长的 Cloudflare Pages 应用，定位是一个有节奏感、能快速复盘和执行的“人生控制台”。

当前已经落下基础架构，并完成前四个模块中的前四个关键切面：

- `Vite + React + TypeScript`
- `Tailwind CSS + Framer Motion + Recharts`
- `Cloudflare Pages Functions + D1`
- 已实现全部主模块：`Dashboard`、`习惯打卡`、`学习管理`、`AI 复盘`、`财务`、`身体数据`、`项目与作品`、`设置`

## 快速开始

1. 安装依赖
2. 启动前端开发环境：`npm run dev`
3. 构建项目：`npm run build`

## Cloudflare Pages / D1

前端通过 `/api/*` 调用 Pages Functions。生产环境建议给项目绑定一个名为 `DB` 的 D1 数据库。

如果你想启用真实 AI 分析，而不是本地降级逻辑，还需要在 Pages / Wrangler 环境里配置：

- `OPENAI_API_KEY`
- 可选：`OPENAI_MODEL`

当前默认模型会回退到 `gpt-4o-mini`。

推荐准备步骤：

1. 创建 D1 数据库
2. 执行 [migrations/0001_init.sql](/Users/clay/clay_project/Github/people-change/migrations/0001_init.sql)
3. 在 Pages 或 `wrangler` 配置中绑定 `DB`
4. 在 Pages 环境变量中配置 `OPENAI_API_KEY`

Functions 内部已经带了“首次访问自动补默认数据”的逻辑，因此数据库准备好后，应用会自动生成第一批演示数据。

## 部署准备

仓库里已经带了这些部署文件：

- [wrangler.toml](/Users/clay/clay_project/Github/people-change/wrangler.toml)
- [.dev.vars.example](/Users/clay/clay_project/Github/people-change/.dev.vars.example)
- [.env.example](/Users/clay/clay_project/Github/people-change/.env.example)

你需要在真正部署前做这几步：

1. 把 `wrangler.toml` 里的 `database_id` 改成真实 D1 ID
2. 复制 `.dev.vars.example` 为 `.dev.vars`，填入真实 `OPENAI_API_KEY`
3. 执行本地迁移：`npm run db:migrate:local`
4. 远端迁移：`npm run db:migrate:remote`
5. Pages 项目里绑定 D1 和 `OPENAI_API_KEY`

## 当前已完成

- `Dashboard`
- `习惯打卡`
- `学习管理`
- `AI 复盘`
- `财务`
- `身体数据`
- `项目与作品`
- `设置`

## 当前外部阻塞

- 当前仓库还没有 Git 远端
- 本机 `gh auth status` 显示 GitHub token 已失效
- 当前会话里 `wrangler whoami` 没有登录成功，且网络解析 `dash.cloudflare.com` 失败

## 当前数据库能力

- 习惯定义与打卡记录
- 学习时间块、今日待办、本周目标
- 复盘记录与分析结果存档
- 财务收支记录、目标进度、分析建议
- 身体数据趋势、围度、睡眠、饮食和训练状态
- 项目档案、技术栈、问题与解决方法、商用展示状态
- 品牌文案、模块显示顺序、习惯项启用与排序、伪终端日志

## 后续方向

- 学习管理的时间块编辑
- AI 复盘对话链路
- 财务 AI 分析
- Passkey 登录
