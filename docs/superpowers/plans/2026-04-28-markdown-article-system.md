# Markdown 文章系统 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把文章从 `localStorage` 编辑改成 Markdown 文件编写、构建生成 JSON、前台静态读取的正式文章系统。

**Architecture:** 文章源文件放在 `content/articles/<slug>/<lang>.md`，Node 脚本在构建时生成 `assets/data/articles.json`。前台加载 JSON 后按当前语言读取对应译文，缺失时回退中文；`editor.html` 只保留非文章内容管理。

**Tech Stack:** 静态 HTML/CSS/JavaScript、Node.js 原生 `fs/path`、无第三方依赖。

---

### Task 1: 增加 Markdown 文章源文件与生成脚本

**Files:**
- Create: `content/articles/*/*.md`
- Create: `scripts/build-articles.js`
- Create: `assets/data/articles.json`
- Modify: `package.json`（如不存在则创建）

- [ ] 创建三篇现有文章的中 / 日 / 英 Markdown 源文件，字段包含 `title/date/category/summary/tags/cover`。
- [ ] 编写 `scripts/build-articles.js`，扫描 `content/articles`、解析 front matter、拆分 `##` 章节并输出 JSON。
- [ ] 增加 `npm run build:articles`。
- [ ] 运行 `npm run build:articles`，确认生成 `assets/data/articles.json`。

### Task 2: 前台读取生成后的文章 JSON

**Files:**
- Modify: `content.js`

- [ ] 增加文章 JSON 加载状态。
- [ ] 页面初次渲染先用默认内容，JSON 加载成功后重新渲染文章。
- [ ] 将生成后的多语言文章转换成当前渲染函数需要的文章数组。
- [ ] 语言切换时按当前语言读取译文，缺失时回退 `zh-CN`。

### Task 3: 展示封面图和 tags

**Files:**
- Modify: `content.js`
- Modify: `style.css`

- [ ] 文章列表卡片显示封面和 tags。
- [ ] 文章详情页顶部显示封面。
- [ ] 保持没有封面或标签时的兼容显示。

### Task 4: 移除 editor.html 文章管理

**Files:**
- Modify: `editor.html`
- Modify: `content.js`

- [ ] 删除文章管理 UI。
- [ ] 删除文章选择、新增、保存相关 JS。
- [ ] 更新编辑器说明，提示文章用 Markdown 文件维护。
- [ ] 保留访问码、关于我、联系页、图库管理。

### Task 5: 简单自测

**Files:**
- No code files unless fixes are needed

- [ ] 运行 `npm run build:articles`。
- [ ] 用 Node 读取 `assets/data/articles.json`，确认有三篇文章且每篇有中文版本。
- [ ] 检查关键文件中不存在文章编辑表单 ID。
