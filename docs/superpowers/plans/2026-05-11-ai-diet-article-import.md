# AI 个性化饮食与营养系统文章导入 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将《基于人工智能的个性化饮食与营养系统》发布为站点文章，并提供中文、日语、英语三个 Markdown 版本，且文章不显示日期。

**Architecture:** 沿用现有 `content/articles/<slug>/<lang>.md` 文章系统，通过 `scripts/build-articles.js` 生成 `assets/data/articles.json`。新增文章源文件、放宽构建脚本的日期必填限制，并让前端文章元信息在没有日期时只显示分类。

**Tech Stack:** 静态 HTML/CSS/JavaScript、Node.js build script、Node built-in test runner、Markdown front matter。

---

## File Structure

- Create: `content/articles/ai-personalized-diet-nutrition-system/zh-CN.md`
  - 中文原文文章，保留来源 Markdown 的正文结构。
- Create: `content/articles/ai-personalized-diet-nutrition-system/ja.md`
  - 日语翻译版本，使用正式项目介绍文风。
- Create: `content/articles/ai-personalized-diet-nutrition-system/en.md`
  - 英语翻译版本，使用正式项目介绍文风。
- Modify: `scripts/build-articles.js:7-8`
  - 从必填字段中移除 `date`，允许无日期文章构建。
- Modify: `content.js:587-589`, `content.js:699-713`, `content.js:839-844`
  - 新增文章元信息渲染 helper，避免空日期生成空 `<span>`。
- Modify: `tests/article-publishing.test.js`
  - 增加新文章三语言发布测试、无日期测试、构建输出数量测试、前端无空日期渲染测试。
- Generated: `assets/data/articles.json`
  - 由 `npm run build:articles` 生成，不手写。

---

### Task 1: Add tests for no-date multilingual article publishing

**Files:**
- Modify: `tests/article-publishing.test.js`

- [ ] **Step 1: Add failing tests for the new article and no-date behavior**

Insert this test after the existing `AI-Girlfriend article is published in Chinese, Japanese, and English` test:

```js
test('AI personalized diet article is published in Chinese, Japanese, and English without date', () => {
  const articleDir = path.join(root, 'content', 'articles', 'ai-personalized-diet-nutrition-system');

  const expectedTitles = {
    'zh-CN': '基于人工智能的个性化饮食与营养系统',
    ja: '人工知能に基づくパーソナライズされた食事・栄養システム',
    en: 'An AI-Based Personalized Diet and Nutrition System'
  };

  for (const lang of ['zh-CN', 'ja', 'en']) {
    const file = path.join(articleDir, `${lang}.md`);
    assert.ok(fs.existsSync(file), `${lang}.md should exist`);
    const source = fs.readFileSync(file, 'utf8');
    assert.match(source, new RegExp(`title: ${expectedTitles[lang]}`), `${lang}.md should have localized title`);
    assert.match(source, /category: /, `${lang}.md should have category`);
    assert.match(source, /summary: /, `${lang}.md should have summary`);
    assert.match(source, /cover: \.\/assets\/gallery\/gallery-01\.png/, `${lang}.md should use the default cover`);
    assert.match(source, /## /, `${lang}.md should have section headings`);
    assert.doesNotMatch(source, /^date:/m, `${lang}.md should not define a date`);
  }
});
```

Update the existing build output test from:

```js
test('article build output contains four multilingual markdown articles', () => {
  const articles = JSON.parse(read('assets/data/articles.json'));

  assert.equal(articles.length, 4);
  assert.ok(articles.some((article) => article.id === 'ai-girlfriend-project-introduction'));
```

to:

```js
test('article build output contains five multilingual markdown articles', () => {
  const articles = JSON.parse(read('assets/data/articles.json'));

  assert.equal(articles.length, 5);
  assert.ok(articles.some((article) => article.id === 'ai-girlfriend-project-introduction'));
  assert.ok(articles.some((article) => article.id === 'ai-personalized-diet-nutrition-system'));
```

Insert this test after the build output test:

```js
test('AI personalized diet article build output omits date and keeps translated summaries', () => {
  const articles = JSON.parse(read('assets/data/articles.json'));
  const article = articles.find((item) => item.id === 'ai-personalized-diet-nutrition-system');

  assert.ok(article, 'AI personalized diet article should exist in build output');
  assert.equal(article.translations['zh-CN'].date, '');
  assert.equal(article.translations.ja.date, '');
  assert.equal(article.translations.en.date, '');
  assert.match(article.translations['zh-CN'].summary, /AI Chef Mate/);
  assert.match(article.translations.ja.summary, /AI Chef Mate/);
  assert.match(article.translations.en.summary, /AI Chef Mate/);
  assert.ok(article.translations['zh-CN'].sections.length >= 7);
  assert.ok(article.translations.ja.sections.length >= 7);
  assert.ok(article.translations.en.sections.length >= 7);
});
```

Insert this test after `article pages render covers and tags from article data`:

```js
test('article meta renderer omits empty date spans', () => {
  const content = read('content.js');

  assert.match(content, /const renderArticleMeta = \(\.\.\.items\) => \{/);
  assert.match(content, /filter\(Boolean\)/);
  assert.match(content, /renderArticleMeta\(article\.category, article\.date\)/);
  assert.doesNotMatch(content, /<span>\$\{escapeHtml\(article\.date\)\}<\/span>/);
});
```

- [ ] **Step 2: Run the tests to verify they fail before implementation**

Run:

```bash
node --test tests/article-publishing.test.js
```

Expected: FAIL because `content/articles/ai-personalized-diet-nutrition-system` does not exist, the build output still contains 4 articles, and `content.js` still renders `article.date` directly.

---

### Task 2: Allow articles without date and hide empty date metadata

**Files:**
- Modify: `scripts/build-articles.js:7-8`
- Modify: `content.js:587-589`, `content.js:699-713`, `content.js:839-844`

- [ ] **Step 1: Remove `date` from required Markdown fields**

Change `scripts/build-articles.js` from:

```js
const REQUIRED_FIELDS = ['title', 'date', 'category', 'summary'];
```

to:

```js
const REQUIRED_FIELDS = ['title', 'category', 'summary'];
```

- [ ] **Step 2: Add an article meta renderer that filters empty values**

In `content.js`, replace:

```js
  const renderArticleCover = (article, className) => article.cover
    ? `<div class="${className}"><img src="${escapeHtml(article.cover)}" alt="${escapeHtml(article.title)}" /></div>`
    : '';
```

with:

```js
  const renderArticleCover = (article, className) => article.cover
    ? `<div class="${className}"><img src="${escapeHtml(article.cover)}" alt="${escapeHtml(article.title)}" /></div>`
    : '';

  const renderArticleMeta = (...items) => {
    const visibleItems = items
      .map((item) => normalizeString(item, '').trim())
      .filter(Boolean);
    return visibleItems.length
      ? `<div class="article-meta">${visibleItems.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div>`
      : '';
  };
```

- [ ] **Step 3: Use the helper on the empty article card**

In `content.js`, replace:

```js
        <article class="article-card reveal show">
          <div class="article-meta"><span>${escapeHtml(ui.emptyArticleMetaLabel)}</span><span>${escapeHtml(ui.emptyArticleMetaStatus)}</span></div>
          <h3>${escapeHtml(ui.emptyArticleTitle)}</h3>
```

with:

```js
        <article class="article-card reveal show">
          ${renderArticleMeta(ui.emptyArticleMetaLabel, ui.emptyArticleMetaStatus)}
          <h3>${escapeHtml(ui.emptyArticleTitle)}</h3>
```

- [ ] **Step 4: Use the helper on article list cards**

In `content.js`, replace:

```js
        <div class="article-meta"><span>${escapeHtml(article.category)}</span><span>${escapeHtml(article.date)}</span></div>
```

with:

```js
        ${renderArticleMeta(article.category, article.date)}
```

This occurrence appears in `renderArticlesPage`.

- [ ] **Step 5: Use the helper on article detail hero**

In `content.js`, replace the remaining article detail meta line:

```js
      <div class="article-meta"><span>${escapeHtml(article.category)}</span><span>${escapeHtml(article.date)}</span></div>
```

with:

```js
      ${renderArticleMeta(article.category, article.date)}
```

This occurrence appears in `renderArticleDetailPage`.

- [ ] **Step 6: Run the targeted tests**

Run:

```bash
node --test tests/article-publishing.test.js
```

Expected: still FAIL because the new article files and rebuilt JSON do not exist yet; the meta-renderer assertion should now pass.

---

### Task 3: Add the Chinese article Markdown

**Files:**
- Create: `content/articles/ai-personalized-diet-nutrition-system/zh-CN.md`

- [ ] **Step 1: Create the article directory**

Run:

```bash
mkdir -p "content/articles/ai-personalized-diet-nutrition-system"
```

Expected: directory exists.

- [ ] **Step 2: Write `zh-CN.md` with front matter and source content**

Create `content/articles/ai-personalized-diet-nutrition-system/zh-CN.md` with this front matter followed by the full body copied from `C:/Users/EDY/Desktop/md/基于人工智能的个性化饮食与营养系统.md` starting at its first `## 一、项目概述` heading:

```md
---
title: 基于人工智能的个性化饮食与营养系统
category: AI 应用 / 项目记录
summary: AI Chef Mate 是一个围绕食材识别、智能餐单生成、餐单管理和营养追踪构建的人工智能个性化饮食与营养系统，展示了 AI 技术在日常健康饮食管理中的落地价值。
tags:
  - AI
  - Nutrition
  - Next.js
  - Web App
cover: ./assets/gallery/gallery-01.png
---
```

The first body section must be:

```md
## 一、项目概述

随着人们对健康饮食、科学营养和生活质量的关注不断提高，传统依靠经验进行饮食安排的方式已经难以满足个性化、便捷化和智能化的需求。不同用户在身体目标、饮食习惯、过敏情况、食材条件和营养摄入方面存在明显差异，因此，一个能够结合用户实际情况进行智能分析和推荐的饮食辅助系统具有较高的现实意义。
```

The final body section must end with:

```md
随着多模态 AI、个性化推荐、营养知识库和移动端体验的进一步完善，该系统未来有望在个人健康管理、家庭饮食规划和智能营养服务等场景中发挥更大的作用。
```

- [ ] **Step 3: Run the targeted tests**

Run:

```bash
node --test tests/article-publishing.test.js
```

Expected: still FAIL because `ja.md`, `en.md`, and rebuilt JSON do not exist yet.

---

### Task 4: Add the Japanese translation Markdown

**Files:**
- Create: `content/articles/ai-personalized-diet-nutrition-system/ja.md`

- [ ] **Step 1: Write `ja.md`**

Create `content/articles/ai-personalized-diet-nutrition-system/ja.md` with this front matter:

```md
---
title: 人工知能に基づくパーソナライズされた食事・栄養システム
category: AI アプリケーション / プロジェクト記録
summary: AI Chef Mate は、食材認識、スマート献立生成、献立管理、栄養トラッキングを中心に構築された、人工知能によるパーソナライズ食事・栄養システムです。
tags:
  - AI
  - Nutrition
  - Next.js
  - Web App
cover: ./assets/gallery/gallery-01.png
---
```

Translate every Chinese section from `zh-CN.md` into Japanese, preserving these section headings in order:

```md
## 一、プロジェクト概要
## 二、システムの主要機能
### 1. 食材認識と入力
### 2. パーソナライズ献立生成
### 3. 献立の保存と管理
### 4. 栄養トラッキングと集計
## 三、技術実装のハイライト
### 1. Next.js に基づくフルスタックアプリケーション構成
### 2. モダンなフロントエンド技術スタック
### 3. AI 機能の柔軟な接続
### 4. シンプルさと拡張性を両立したデータ保存方式
### 5. 初期研究実装を残し、プロジェクトの発展過程を示す
## 四、プロジェクトの特徴と強み
### 1. 完整な機能ループ
### 2. 高いパーソナライズ性
### 3. 使いやすいユーザー体験
### 4. 安定したデモ性能
### 5. 十分な拡張余地
## 五、応用価値
## 六、今後の拡張方向
### 1. より強力なマルチモーダル AI モデルの接続
### 2. より充実したユーザープロファイルの構築
### 3. 専門的な栄養知識ベースの導入
### 4. 推薦アルゴリズムと長期計画能力の最適化
### 5. データ可視化能力の強化
### 6. アカウント体系と権限管理の整備
### 7. モバイル端末とクロスプラットフォーム体験の拡張
### 8. スマートデバイスや外部サービスとの連携
### 9. 本番運用レベルの安定性向上
## 七、まとめ
```

- [ ] **Step 2: Run the targeted tests**

Run:

```bash
node --test tests/article-publishing.test.js
```

Expected: still FAIL because `en.md` and rebuilt JSON do not exist yet.

---

### Task 5: Add the English translation Markdown

**Files:**
- Create: `content/articles/ai-personalized-diet-nutrition-system/en.md`

- [ ] **Step 1: Write `en.md`**

Create `content/articles/ai-personalized-diet-nutrition-system/en.md` with this front matter:

```md
---
title: An AI-Based Personalized Diet and Nutrition System
category: AI Application / Project Notes
summary: AI Chef Mate is an AI-powered personalized diet and nutrition system built around ingredient recognition, intelligent meal-plan generation, meal-plan management, and nutrition tracking.
tags:
  - AI
  - Nutrition
  - Next.js
  - Web App
cover: ./assets/gallery/gallery-01.png
---
```

Translate every Chinese section from `zh-CN.md` into English, preserving these section headings in order:

```md
## 1. Project Overview
## 2. Core System Features
### 1. Ingredient Recognition and Input
### 2. Personalized Meal Plan Generation
### 3. Meal Plan Saving and Management
### 4. Nutrition Tracking and Summary
## 3. Technical Implementation Highlights
### 1. Full-Stack Application Architecture Based on Next.js
### 2. Modern Front-End Technology Stack
### 3. Flexible Integration of AI Capabilities
### 4. A Data Storage Design Balancing Simplicity and Extensibility
### 5. Preserving Early Research Implementations to Show Project Evolution
## 4. Project Characteristics and Advantages
### 1. Complete Functional Loop
### 2. High Degree of Personalization
### 3. User-Friendly Experience
### 4. Strong Demonstration Stability
### 5. Sufficient Room for Future Expansion
## 5. Application Value
## 6. Future Expansion Directions
### 1. Integrating Stronger Multimodal AI Models
### 2. Building a More Complete User Profile
### 3. Introducing a Professional Nutrition Knowledge Base
### 4. Optimizing Recommendation Algorithms and Long-Term Planning
### 5. Enhancing Data Visualization
### 6. Improving Account Systems and Permission Management
### 7. Expanding Mobile and Cross-Platform Experiences
### 8. Connecting with Smart Hardware and External Services
### 9. Improving Production-Level Stability
## 7. Conclusion
```

- [ ] **Step 2: Run the targeted tests**

Run:

```bash
node --test tests/article-publishing.test.js
```

Expected: still FAIL until `assets/data/articles.json` is rebuilt.

---

### Task 6: Rebuild article data and verify

**Files:**
- Generated: `assets/data/articles.json`

- [ ] **Step 1: Build articles**

Run:

```bash
npm run build:articles
```

Expected output contains:

```text
Generated assets/data/articles.json with 5 articles.
```

- [ ] **Step 2: Run the targeted article tests**

Run:

```bash
node --test tests/article-publishing.test.js
```

Expected: PASS for all tests in `tests/article-publishing.test.js`.

- [ ] **Step 3: Run all project tests**

Run:

```bash
node --test tests/*.js
```

Expected: PASS for all tests.

- [ ] **Step 4: Check git diff**

Run:

```bash
git diff -- scripts/build-articles.js content.js tests/article-publishing.test.js content/articles/ai-personalized-diet-nutrition-system/zh-CN.md content/articles/ai-personalized-diet-nutrition-system/ja.md content/articles/ai-personalized-diet-nutrition-system/en.md assets/data/articles.json
```

Expected: diff shows only the new article, translations, date-optional behavior, metadata rendering helper, tests, and regenerated article JSON.

---

## Self-Review

- Spec coverage: The plan creates three language files, uses the requested slug and metadata, omits `date`, rebuilds `assets/data/articles.json`, and verifies front-end date omission behavior.
- Placeholder scan: No `TBD`, `TODO`, or unspecified implementation steps remain.
- Type consistency: The plan uses existing article fields `title`, `category`, `summary`, `tags`, `cover`, `date`, `body`, and `sections`. The new helper `renderArticleMeta(...items)` accepts strings and returns HTML, matching existing rendering style.
