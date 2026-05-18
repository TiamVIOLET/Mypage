# LangGraph Agent 工作流平台文章导入设计

## 目标

将桌面 Markdown 文件《基于 LangGraph 的 Agent 工作流平台项目介绍》加入现有文章系统，并提供简体中文、日语、英语三个版本。文章不设置日期，能出现在文章列表并在详情页随语言切换展示对应内容。

## 方案

沿用现有 Markdown 文章流程，在 `content/articles/langgraph-agent-workflow-platform/` 下新增：

- `zh-CN.md`：保留原中文正文结构与内容。
- `ja.md`：翻译为自然、正式的日语项目介绍文风。
- `en.md`：翻译为自然、正式的英文项目介绍文风。

front matter 包含 `title`、`category`、`summary`、`tags`、`cover`，不包含 `date`。分类使用 `AI 应用 / Agent 工作流` 及对应日英翻译；tags 使用 `AI`, `LangGraph`, `Agent`, `FastAPI`, `Workflow`；封面使用 `./assets/gallery/gallery-02.png`。

## 数据流与验证

新增 Markdown 后运行 `npm run build:articles` 生成 `assets/data/articles.json`。更新文章发布测试，将文章数量从 5 调整为 6，并校验新文章三语言文件、无日期、生成 JSON 与 sections。最后运行文章测试和全量测试。

## 范围

不新增页面、不改文章系统结构、不新增依赖、不提交代码。
