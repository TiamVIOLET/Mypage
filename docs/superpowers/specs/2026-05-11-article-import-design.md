# 新增 AI 个性化饮食与营养系统文章设计

## 目标

将桌面 Markdown 文件《基于人工智能的个性化饮食与营养系统》加入现有文章系统，并提供简体中文、日语、英语三个版本。文章应能出现在文章列表中，并在详情页随站点语言切换展示对应内容。

## 方案

采用现有 Markdown 文章流程：在 `content/articles/ai-personalized-diet-nutrition-system/` 下新增三份语言文件：

- `zh-CN.md`：保留原中文正文结构与内容。
- `ja.md`：翻译为自然、正式的日语项目介绍文风。
- `en.md`：翻译为自然、正式的英文项目介绍文风。

每份文件使用现有 front matter 格式，包含：

- `title`
- `category`
- `summary`
- `tags`
- `cover`

按用户要求不写 `date` 字段。分类使用中文默认值 `AI 应用 / 项目记录`，日语和英语使用对应翻译。tags 使用 `AI`, `Nutrition`, `Next.js`, `Web App`。封面沿用现有图库图，例如 `./assets/gallery/gallery-01.png`。

## 数据流

新增 Markdown 文件后，运行现有构建脚本 `npm run build:articles`。脚本会读取 `content/articles/*/{zh-CN,ja,en}.md`，生成 `assets/data/articles.json`。前端 `content.js` 已经从该 JSON 加载文章，因此无需改动文章列表页或详情页结构。

## 边界与校验

现有构建脚本只要求中文主文件包含必填字段 `title`、`date`、`category`、`summary`。由于用户要求不写日期，需要同步调整构建脚本，让 `date` 不再作为必填字段，并保持没有日期时前端正常展示。完成后运行构建脚本验证 JSON 可生成。

## 不做事项

不新增静态 HTML 详情页，不绕过 Markdown 文章系统直接修改 `content.js` 默认文章数组，不引入新的翻译或构建依赖。
