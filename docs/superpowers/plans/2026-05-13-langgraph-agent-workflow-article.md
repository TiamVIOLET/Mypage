# LangGraph Agent Workflow Article Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 发布《基于 LangGraph 的 Agent 工作流平台项目介绍》为中日英三语言文章，并让站点文章数据更新到 6 篇。

**Architecture:** 沿用 `content/articles/<slug>/<lang>.md` 的现有文章系统，不改页面结构。新增三份 Markdown，更新文章发布测试，运行 `npm run build:articles` 生成 `assets/data/articles.json`。

**Tech Stack:** Markdown front matter、Node.js 构建脚本、静态 HTML/CSS/JavaScript、Node built-in test runner。

---

## File Structure

- Create: `content/articles/langgraph-agent-workflow-platform/zh-CN.md`：中文原文文章。
- Create: `content/articles/langgraph-agent-workflow-platform/ja.md`：日语翻译文章。
- Create: `content/articles/langgraph-agent-workflow-platform/en.md`：英语翻译文章。
- Modify: `tests/article-publishing.test.js`：新增 LangGraph 文章校验，把构建输出数量从 5 改为 6。
- Generated: `assets/data/articles.json`：由 `npm run build:articles` 生成。

---

### Task 1: Add LangGraph article tests

**Files:**
- Modify: `tests/article-publishing.test.js`

- [ ] **Step 1: Add the new article file test**

Add this test after the AI Chef Mate article file test:

```js
test('LangGraph Agent workflow article is published in Chinese, Japanese, and English without dates', () => {
  const articleDir = path.join(root, 'content', 'articles', 'langgraph-agent-workflow-platform');

  for (const lang of ['zh-CN', 'ja', 'en']) {
    const file = path.join(articleDir, `${lang}.md`);
    assert.ok(fs.existsSync(file), `${lang}.md should exist`);
    const source = fs.readFileSync(file, 'utf8');
    assert.match(source, /^---\n[\s\S]*title:/, `${lang}.md should have front matter title`);
    assert.match(source, /category: /, `${lang}.md should have category`);
    assert.match(source, /summary: /, `${lang}.md should have summary`);
    assert.match(source, /cover: \.\/assets\/gallery\/gallery-02\.png/, `${lang}.md should use the LangGraph cover`);
    assert.match(source, /## /, `${lang}.md should have section headings`);
    assert.doesNotMatch(source, /^date:/m, `${lang}.md should not have a date field`);
  }
});
```

- [ ] **Step 2: Update build output count and article id assertion**

Change:

```js
test('article build output contains five multilingual markdown articles', () => {
  const articles = JSON.parse(read('assets/data/articles.json'));

  assert.equal(articles.length, 5);
  assert.ok(articles.some((article) => article.id === 'ai-girlfriend-project-introduction'));
  assert.ok(articles.some((article) => article.id === 'ai-personalized-diet-nutrition-system'));
```

to:

```js
test('article build output contains six multilingual markdown articles', () => {
  const articles = JSON.parse(read('assets/data/articles.json'));

  assert.equal(articles.length, 6);
  assert.ok(articles.some((article) => article.id === 'ai-girlfriend-project-introduction'));
  assert.ok(articles.some((article) => article.id === 'ai-personalized-diet-nutrition-system'));
  assert.ok(articles.some((article) => article.id === 'langgraph-agent-workflow-platform'));
```

- [ ] **Step 3: Add generated JSON test**

Add this test after the AI Chef Mate generated article test:

```js
test('LangGraph Agent workflow generated article keeps empty dates and complete sections', () => {
  const articles = JSON.parse(read('assets/data/articles.json'));
  const article = articles.find((item) => item.id === 'langgraph-agent-workflow-platform');

  assert.ok(article, 'LangGraph Agent workflow article should be generated');
  for (const lang of ['zh-CN', 'ja', 'en']) {
    const translation = article.translations?.[lang];
    assert.ok(translation, `${lang} translation should exist`);
    assert.equal(translation.date, '', `${lang} date should be empty`);
    assert.match(translation.summary, /LangGraph|Agent/, `${lang} summary should mention LangGraph or Agent`);
    assert.ok(translation.sections.length >= 10, `${lang} should have complete sections`);
  }
});
```

- [ ] **Step 4: Run failing targeted tests**

Run:

```bash
node --test tests/article-publishing.test.js
```

Expected: FAIL because the new article files and regenerated JSON do not exist yet.

---

### Task 2: Add LangGraph Chinese article

**Files:**
- Create: `content/articles/langgraph-agent-workflow-platform/zh-CN.md`

- [ ] **Step 1: Create the article directory**

Run:

```bash
mkdir -p "content/articles/langgraph-agent-workflow-platform"
```

- [ ] **Step 2: Write the Chinese Markdown**

Create `content/articles/langgraph-agent-workflow-platform/zh-CN.md` with this front matter, then copy the source Markdown body from `C:/Users/EDY/Desktop/md/基于LangGraph的Agent工作流平台项目介绍.md` starting at `## 1. 项目概述`:

```md
---
title: 基于 LangGraph 的 Agent 工作流平台项目介绍
category: AI 应用 / Agent 工作流
summary: 这是一个以 LangGraph 为有状态工作流编排核心、以 FastAPI 提供服务接口的 Agent 工作流平台 MVP，围绕工单前置分析和项目 Bug 排查验证 AI Agent 在企业研发场景中的价值。
tags:
  - AI
  - LangGraph
  - Agent
  - FastAPI
  - Workflow
cover: ./assets/gallery/gallery-02.png
---
```

- [ ] **Step 3: Run targeted tests**

Run:

```bash
node --test tests/article-publishing.test.js
```

Expected: still FAIL because `ja.md`, `en.md`, and regenerated JSON are not complete yet.

---

### Task 3: Add LangGraph Japanese article

**Files:**
- Create: `content/articles/langgraph-agent-workflow-platform/ja.md`

- [ ] **Step 1: Write the Japanese Markdown**

Create `content/articles/langgraph-agent-workflow-platform/ja.md` with this front matter and a complete Japanese translation of every section in `zh-CN.md`:

```md
---
title: LangGraph に基づく Agent ワークフロープラットフォームのプロジェクト紹介
category: AI アプリケーション / Agent ワークフロー
summary: LangGraph を状態管理型ワークフロー編成の中核に、FastAPI をサービス接口に用いた Agent ワークフロープラットフォーム MVP です。チケット事前分析とプロジェクト Bug 調査を通じて、企業の開発現場における AI Agent の価値を検証します。
tags:
  - AI
  - LangGraph
  - Agent
  - FastAPI
  - Workflow
cover: ./assets/gallery/gallery-02.png
---
```

Keep the same section structure as the Chinese article, translating headings and body naturally.

- [ ] **Step 2: Run targeted tests**

Run:

```bash
node --test tests/article-publishing.test.js
```

Expected: still FAIL because `en.md` and regenerated JSON are not complete yet.

---

### Task 4: Add LangGraph English article

**Files:**
- Create: `content/articles/langgraph-agent-workflow-platform/en.md`

- [ ] **Step 1: Write the English Markdown**

Create `content/articles/langgraph-agent-workflow-platform/en.md` with this front matter and a complete English translation of every section in `zh-CN.md`:

```md
---
title: Project Introduction: A LangGraph-Based Agent Workflow Platform
category: AI Application / Agent Workflow
summary: This MVP is an Agent workflow platform that uses LangGraph as its stateful workflow orchestration core and FastAPI as its service interface, validating the value of AI Agents in enterprise engineering scenarios through ticket pre-analysis and project bug diagnosis.
tags:
  - AI
  - LangGraph
  - Agent
  - FastAPI
  - Workflow
cover: ./assets/gallery/gallery-02.png
---
```

Keep the same section structure as the Chinese article, translating headings and body naturally.

- [ ] **Step 2: Run targeted tests**

Run:

```bash
node --test tests/article-publishing.test.js
```

Expected: still FAIL until `assets/data/articles.json` is rebuilt.

---

### Task 5: Rebuild article data and verify

**Files:**
- Generated: `assets/data/articles.json`

- [ ] **Step 1: Build articles**

Run:

```bash
npm run build:articles
```

Expected output contains:

```text
Generated assets\data\articles.json with 6 articles.
```

- [ ] **Step 2: Run targeted article tests**

Run:

```bash
node --test tests/article-publishing.test.js
```

Expected: PASS.

- [ ] **Step 3: Run all tests**

Run:

```bash
node --test tests/*.js
```

Expected: PASS.

---

## Self-Review

- Spec coverage: The plan adds the three requested language files, omits dates, uses the chosen metadata, regenerates JSON, and verifies 6 articles.
- Placeholder scan: No placeholders or incomplete implementation instructions remain.
- Type consistency: Tests and generated JSON use existing fields `title`, `date`, `category`, `summary`, `tags`, `cover`, `body`, and `sections`.
