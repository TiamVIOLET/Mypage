# Markdown 文章系统设计

## 背景
当前站点已经有文章列表页、文章详情页和 `editor.html` 的文章编辑区。文章内容主要来自 `content.js` 的默认数据或浏览器 `localStorage`。这种方式适合本地预览，但不适合正式发布：换浏览器会丢内容，部署到静态托管后也不方便通过 Git 管理文章历史。

目标是把文章改成更正式的 Markdown 文件系统，适配 GitHub Pages / Vercel / Netlify 等静态托管，并继续支持站点已有的中 / 日 / 英语言切换。

## 范围
本次设计包含：

- 使用 Markdown 文件管理文章正文。
- 每篇文章可提供中文、日文、英文版本。
- 缺少当前语言版本时回退中文。
- 构建时生成前台可读取的 JSON 数据。
- 前台文章列表和详情页读取生成后的 JSON。
- `editor.html` 移除文章管理，仅保留关于我、联系页和图库管理。

不包含：

- 后台登录发布系统或 CMS。
- 浏览器端 Markdown 实时解析。
- 评论、搜索、归档、RSS 等扩展功能。

## 文章目录结构
文章按 slug 建目录，每个语言一个 Markdown 文件：

```text
content/
  articles/
    blue-evening-ui/
      zh-CN.md
      ja.md
      en.md
    frontend-anime-storyboard/
      zh-CN.md
      ja.md
      en.md

assets/
  data/
    articles.json
```

`zh-CN.md` 是主版本。`ja.md` 和 `en.md` 可选。没有中文主版本的文章不进入生成结果，避免前台缺少兜底内容。

## Markdown 格式
每个 Markdown 文件顶部使用 front matter：

```md
---
title: 为什么我做页面时，总会忍不住想起日漫里的蓝色黄昏
date: 2026.04
category: 追番感想 / 设计随笔
summary: 对我来说，很多页面的灵感其实不是来自网页设计趋势。
tags:
  - Anime
  - UI
  - Blue Hour
cover: ./assets/gallery/gallery-01.png
---

## 一、我会先想到画面，而不是功能

正文内容……
```

字段要求：

- `title`：文章标题，必填。
- `date`：展示日期，必填，沿用当前 `2026.04` 这类文本格式。
- `category`：文章分类，必填。
- `summary`：列表页摘要，必填。
- `tags`：标签数组，可为空。
- `cover`：封面图路径，可为空。

正文继续支持用 `## 小标题` 拆分章节。构建脚本会按章节转换，详情页继续使用当前的卡片式阅读体验。

## 构建脚本
新增 `scripts/build-articles.js`。

脚本职责：

1. 扫描 `content/articles/*/*.md`。
2. 按文章目录名生成文章 `id` / `slug`。
3. 解析 front matter 和正文。
4. 校验中文主版本必填字段。
5. 将正文按 `## 小标题` 拆成章节数据。
6. 聚合三语内容。
7. 输出 `assets/data/articles.json`。

推荐 npm script：

```json
{
  "scripts": {
    "build:articles": "node scripts/build-articles.js"
  }
}
```

生成流程：

```text
写 Markdown
  ↓
运行 npm run build:articles
  ↓
生成 assets/data/articles.json
  ↓
articles.html / article-detail.html 加载 JSON
  ↓
按当前语言展示对应文章
```

## 生成数据结构
`articles.json` 建议结构：

```json
[
  {
    "id": "blue-evening-ui",
    "slug": "blue-evening-ui",
    "translations": {
      "zh-CN": {
        "title": "为什么我做页面时，总会忍不住想起日漫里的蓝色黄昏",
        "date": "2026.04",
        "category": "追番感想 / 设计随笔",
        "summary": "对我来说，很多页面的灵感其实不是来自网页设计趋势。",
        "tags": ["Anime", "UI", "Blue Hour"],
        "cover": "./assets/gallery/gallery-01.png",
        "body": "## 一、我会先想到画面，而不是功能\n\n正文内容……",
        "sections": [
          {
            "title": "一、我会先想到画面，而不是功能",
            "content": "正文内容……"
          }
        ]
      }
    }
  }
]
```

前台通过当前语言读取 `translations[lang]`，不存在时读取 `translations['zh-CN']`。

## 前台读取与展示
`content.js` 保留现有默认文章作为兜底，同时新增加载 `assets/data/articles.json` 的逻辑。

文章列表页：

- 保持现有卡片网格。
- 展示封面图、分类、日期、标题、摘要和 tags。
- 点击进入 `article-detail.html?id=<slug>`。

文章详情页：

- 通过 `id` 查找文章。
- 根据当前语言选择内容；缺少译文时回退中文。
- 继续按章节卡片展示正文。
- 有 `cover` 时，在详情顶部展示封面氛围图。
- 保留上一篇、返回列表、下一篇导航。

语言切换：

- 切换语言后重新渲染动态内容。
- 有当前语言版本则显示当前语言。
- 没有当前语言版本则显示中文。
- 没有中文主版本的文章不显示。

## `editor.html` 调整
`editor.html` 不再负责文章编辑。

保留：

- 访问码保护。
- 关于我管理。
- 联系页管理。
- 图库管理。

移除：

- 文章选择下拉框。
- 新增文章按钮。
- 文章标题、分类、日期、摘要、正文表单。
- 保存文章逻辑。

使用说明改成：文章请写入 `content/articles/<slug>/<lang>.md`，然后运行 `npm run build:articles` 生成数据。

## 错误处理
构建脚本：

- 缺少中文主版本：跳过该文章，并输出警告。
- 中文主版本缺少 `title/date/category/summary`：报错并中止生成。
- front matter 格式错误：报错并指出文件路径。
- `tags` 不是数组时：报错并指出文件路径。

前台：

- `articles.json` 加载失败时，使用 `content.js` 中的默认文章。
- 文章 id 找不到时，显示文章不存在提示，并提供返回文章列表入口。
- 某语言缺失时回退中文，不打断浏览。

## 测试计划
- 运行 `npm run build:articles`，确认能生成 `assets/data/articles.json`。
- 新增一篇三语文章，确认列表页和详情页在中 / 日 / 英下都正确展示。
- 删除某篇文章的 `ja.md`，确认日文模式回退中文。
- 删除某篇文章的 `zh-CN.md`，确认构建跳过并给出警告。
- 缺少必填字段时，确认脚本报错且不生成错误数据。
- 打开 `articles.html`，确认卡片包含封面和 tags。
- 打开 `article-detail.html?id=<slug>`，确认章节卡片、封面和前后导航正常。
- 打开旧的 `article-detail-1.html` 跳转页，确认仍能进入对应文章或可接受地回退到文章列表。
- 打开 `editor.html`，确认文章编辑区已移除，关于我、联系页、图库仍可使用。

## 实施顺序
1. 创建 Markdown 目录和示例文章。
2. 增加构建脚本和 npm script。
3. 生成 `assets/data/articles.json`。
4. 修改前台文章加载逻辑。
5. 调整列表和详情页展示封面、tags、章节内容。
6. 移除 `editor.html` 的文章编辑 UI 和 JS 逻辑。
7. 执行测试计划。
