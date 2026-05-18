# Gallery Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This repository has no explicit commit authorization in the current conversation, so each task ends with a review checkpoint instead of a commit command.

**Goal:** 新增一个三语图库模块，让访客可以从首页进入图库、浏览系列相册、在相册详情中用瀑布流看图，并让用户在 `editor.html` 维护相册和图片。

**Architecture:** 继续使用现有静态多页面架构：`script.js` 负责全站静态翻译，`content.js` 负责本地内容数据、动态图库渲染和 editor 保存。图库数据放在 `content.js` 的 `gallery.albums`，前台从默认数据或 `localStorage` 读取；新增 `gallery.html` 和 `gallery-detail.html?id=...` 承载图库首页与动态相册详情。

**Tech Stack:** HTML, CSS, Vanilla JavaScript, LocalStorage, FileReader data URL, Node.js `node:test`, `node:assert/strict`

---

## File map

- `tests/gallery-module.test.js`
  - 新增 Node 原生测试。
  - 校验导航入口、图库页面骨架、首页预览区、翻译键、图库数据/渲染函数、editor 控件、CSS 选择器。
- `gallery.html`
  - 新增图库首页静态骨架。
  - 只放 hero 和动态容器，具体相册内容由 `content.js` 渲染。
- `gallery-detail.html`
  - 新增动态相册详情页。
  - 通过 URL query `id` 由 `content.js` 渲染对应相册。
- `index.html`
  - 全站导航新增图库入口。
  - 首页新增精选图库预览区，容器为 `#home-gallery-preview`。
- `about.html`, `profile.html`, `works.html`, `music.html`, `articles.html`, `article-detail.html`, `contact.html`
  - 导航新增图库入口。
- `editor.html`
  - 导航新增图库入口。
  - editor app 内新增图库管理卡片，提供相册和图片表单控件。
- `script.js`
  - 三语 `nav.gallery`。
  - 三语首页精选图库静态文案。
  - 三语图库页静态文案。
  - 看板娘页面提示加入 `gallery`。
- `content.js`
  - 新增图库默认数据。
  - 新增图库归一化函数。
  - 新增首页图库预览、图库页、相册详情页、lightbox 渲染。
  - 新增 editor 图库管理逻辑。
- `style.css`
  - 新增首页图库预览、图库首页、相册卡片、瀑布流、lightbox、editor 图库管理样式。
- `assets/gallery/.gitkeep`
  - 新增真实图片目录保留文件。

## Task 1: 建立图库模块回归测试

**Files:**
- Create: `tests/gallery-module.test.js`

- [ ] **Step 1: 写出失败测试**

创建 `tests/gallery-module.test.js`，内容如下：

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => {
  const target = path.join(root, file);
  return fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
};
const count = (source, token) => (source.match(new RegExp(token, 'g')) || []).length;

const publicPages = [
  'index.html',
  'profile.html',
  'about.html',
  'works.html',
  'music.html',
  'articles.html',
  'article-detail.html',
  'contact.html',
  'gallery.html',
  'gallery-detail.html'
];

test('public pages expose a gallery navigation entry', () => {
  for (const page of publicPages) {
    const html = read(page);
    assert.match(html, /href="\.\/gallery\.html"[^>]*data-i18n="nav\.gallery"/, `${page} should link to gallery.html`);
  }
});

test('gallery shell pages provide dynamic render targets', () => {
  const gallery = read('gallery.html');
  const detail = read('gallery-detail.html');

  assert.match(gallery, /<body[^>]*data-title-key="gallery\.pageTitle"[^>]*data-page="gallery"/);
  assert.match(gallery, /id="gallery-featured-collage"/);
  assert.match(gallery, /id="gallery-albums"/);
  assert.match(gallery, /<script src="\.\/content\.js"><\/script>/);

  assert.match(detail, /<body[^>]*data-title-key="galleryDetail\.pageTitle"[^>]*data-page="gallery-detail"/);
  assert.match(detail, /id="gallery-detail-hero"/);
  assert.match(detail, /id="gallery-masonry"/);
  assert.match(detail, /<script src="\.\/content\.js"><\/script>/);
});

test('homepage exposes a featured gallery preview section', () => {
  const index = read('index.html');
  assert.match(index, /class="section gallery-preview-section reveal"/);
  assert.match(index, /id="home-gallery-preview"/);
  assert.match(index, /data-i18n="home\.galleryPreviewTitle"/);
  assert.match(index, /href="\.\/gallery\.html"[^>]*data-i18n="home\.galleryPreviewAction"/);
});

test('script translations include gallery copy in all languages', () => {
  const script = read('script.js');
  for (const token of [
    'galleryPreviewBadge:',
    'galleryPreviewTitle:',
    'galleryPreviewDesc:',
    'galleryPreviewAction:',
    'galleryDetail:'
  ]) {
    assert.equal(count(script, token), 3, `expected ${token} in zh-CN, ja, en`);
  }
  assert.equal((script.match(/nav:\s*\{[^}]*gallery:/g) || []).length, 3, 'expected nav.gallery in all languages');
  assert.match(script, /gallery: \['这里会慢慢收集 Asa 喜欢的图片和生成画面。'\]/);
  assert.match(script, /gallery: \['ここには Asa の好きな画像や生成したビジュアルが少しずつ集まります。'\]/);
  assert.match(script, /gallery: \['This is where Asa keeps favorite images and generated visuals\.'\]/);
});

test('content script defines gallery data, renderers, lightbox, and editor persistence', () => {
  const content = read('content.js');
  assert.match(content, /gallery:\s*\{\s*albums:/);
  assert.match(content, /const normalizeGallery =/);
  assert.match(content, /const renderHomeGalleryPreview =/);
  assert.match(content, /const renderGalleryPage =/);
  assert.match(content, /const renderGalleryDetailPage =/);
  assert.match(content, /const openGalleryLightbox =/);
  assert.match(content, /const fillGalleryAlbumForm =/);
  assert.match(content, /document\.getElementById\('gallery-save'\)/);
  assert.match(content, /renderGalleryPage\(siteContent\)/);
});

test('editor exposes gallery management controls', () => {
  const editor = read('editor.html');
  for (const id of [
    'gallery-album-select',
    'gallery-new-album',
    'gallery-delete-album',
    'gallery-album-title-zh',
    'gallery-album-title-ja',
    'gallery-album-title-en',
    'gallery-album-cover',
    'gallery-image-list',
    'gallery-image-src',
    'gallery-image-file',
    'gallery-add-image',
    'gallery-save'
  ]) {
    assert.match(editor, new RegExp(`id="${id}"`), `missing #${id}`);
  }
});

test('gallery styles cover preview, collage, albums, masonry, lightbox, and editor', () => {
  const css = read('style.css');
  for (const selector of [
    '.gallery-preview-section',
    '.home-gallery-grid',
    '.gallery-hero-grid',
    '.gallery-collage',
    '.gallery-albums-grid',
    '.gallery-album-card',
    '.gallery-masonry',
    '.gallery-lightbox',
    '.gallery-editor-grid',
    '.gallery-image-list'
  ]) {
    assert.match(css, new RegExp(selector.replace('.', '\\.')), `missing ${selector}`);
  }
});
```

- [ ] **Step 2: 运行测试，确认当前实现失败**

Run:

```bash
node --test tests/gallery-module.test.js
```

Expected: FAIL，至少包含这些失败之一：

- `gallery.html should link to gallery.html`
- `The input did not match /id="gallery-featured-collage"/`
- `expected galleryPreviewTitle: in zh-CN, ja, en`
- `missing #gallery-album-select`

- [ ] **Step 3: Review checkpoint**

Run:

```bash
git diff -- tests/gallery-module.test.js
```

Expected: 只看到新增测试文件。不要提交，除非用户明确要求。

## Task 2: 创建图库页面骨架并接入导航与首页预览容器

**Files:**
- Create: `gallery.html`
- Create: `gallery-detail.html`
- Create: `assets/gallery/.gitkeep`
- Modify: `index.html`
- Modify: `profile.html`
- Modify: `about.html`
- Modify: `works.html`
- Modify: `music.html`
- Modify: `articles.html`
- Modify: `article-detail.html`
- Modify: `contact.html`
- Modify: `editor.html`

- [ ] **Step 1: 运行导航和页面骨架测试，确认失败点**

Run:

```bash
node --test tests/gallery-module.test.js
```

Expected: FAIL，当前缺少 `gallery.html`、`gallery-detail.html`、图库导航和首页预览区。

- [ ] **Step 2: 创建 `gallery.html`**

Create `gallery.html`:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>图库</title>
  <meta name="description" content="Asa 的图片收藏与生成图图库。" />
  <link rel="stylesheet" href="./style.css" />
</head>
<body data-title-key="gallery.pageTitle" data-page="gallery">
  <div class="bg-orbs" aria-hidden="true"><div class="orb one"></div><div class="orb two"></div><div class="orb three"></div></div>
  <div class="sakura-layer" aria-hidden="true"></div>
  <div class="star-layer" aria-hidden="true"></div>

  <header class="site-header">
    <div class="nav-wrap">
      <a class="brand" href="./index.html"><div class="brand-mark">A</div><div class="brand-text"><strong data-i18n="brand.name">Asa</strong><span data-i18n="brand.tagline">爱看番也爱敲代码的蓝色系社恐 i 人</span></div></a>
      <div class="lang-switcher"><button class="lang-btn active" type="button" data-lang="zh-CN">简体</button><button class="lang-btn" type="button" data-lang="ja">日本語</button><button class="lang-btn" type="button" data-lang="en">EN</button></div>
      <button class="menu-toggle" type="button" aria-label="切换导航菜单" aria-expanded="false"><span></span><span></span><span></span></button>
      <nav class="nav-links">
        <a href="./index.html" data-i18n="nav.home">首页</a>
        <a href="./profile.html" data-i18n="nav.profile">角色档案</a>
        <a href="./about.html" data-i18n="nav.about">关于我</a>
        <a href="./works.html" data-i18n="nav.works">作品</a>
        <a href="./music.html" data-i18n="nav.music">音乐</a>
        <a class="active" href="./gallery.html" data-i18n="nav.gallery">图库</a>
        <a href="./articles.html" data-i18n="nav.articles">文章</a>
        <a href="./contact.html" data-i18n="nav.contact">联系</a>
      </nav>
    </div>
  </header>

  <main>
    <section class="page-hero gallery-hero reveal">
      <div class="gallery-hero-grid">
        <div class="page-intro">
          <span class="section-badge" data-i18n="gallery.badge">Gallery</span>
          <h1 data-i18n-html="gallery.title">图库<span>和我收集的画面碎片</span></h1>
          <p data-i18n="gallery.desc">这里会放我收集的图片、生成的图片，以及那些很像蓝色番剧分镜的视觉灵感。</p>
        </div>
        <div class="gallery-collage" id="gallery-featured-collage" aria-label="精选图库拼贴"></div>
      </div>
    </section>

    <section class="section reveal">
      <div class="section-head">
        <div>
          <span class="section-badge" data-i18n="gallery.albumsBadge">Albums</span>
          <h2 class="section-title" data-i18n="gallery.albumsTitle">按系列慢慢浏览</h2>
          <p class="section-desc" data-i18n="gallery.albumsDesc">每个系列都像一小格视觉专题，可以从封面进入详情。</p>
        </div>
      </div>
      <div class="gallery-albums-grid" id="gallery-albums"></div>
    </section>
  </main>

  <script src="./assets/vendor/oh-my-live2d.min.js"></script>
  <script src="./script.js"></script>
  <script src="./content.js"></script>
</body>
</html>
```

- [ ] **Step 3: 创建 `gallery-detail.html`**

Create `gallery-detail.html`:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>图库详情</title>
  <meta name="description" content="Asa 的图库系列详情页。" />
  <link rel="stylesheet" href="./style.css" />
</head>
<body data-title-key="galleryDetail.pageTitle" data-page="gallery-detail">
  <div class="bg-orbs" aria-hidden="true"><div class="orb one"></div><div class="orb two"></div><div class="orb three"></div></div>
  <div class="sakura-layer" aria-hidden="true"></div>
  <div class="star-layer" aria-hidden="true"></div>

  <header class="site-header">
    <div class="nav-wrap">
      <a class="brand" href="./index.html"><div class="brand-mark">A</div><div class="brand-text"><strong data-i18n="brand.name">Asa</strong><span data-i18n="brand.tagline">爱看番也爱敲代码的蓝色系社恐 i 人</span></div></a>
      <div class="lang-switcher"><button class="lang-btn active" type="button" data-lang="zh-CN">简体</button><button class="lang-btn" type="button" data-lang="ja">日本語</button><button class="lang-btn" type="button" data-lang="en">EN</button></div>
      <button class="menu-toggle" type="button" aria-label="切换导航菜单" aria-expanded="false"><span></span><span></span><span></span></button>
      <nav class="nav-links">
        <a href="./index.html" data-i18n="nav.home">首页</a>
        <a href="./profile.html" data-i18n="nav.profile">角色档案</a>
        <a href="./about.html" data-i18n="nav.about">关于我</a>
        <a href="./works.html" data-i18n="nav.works">作品</a>
        <a href="./music.html" data-i18n="nav.music">音乐</a>
        <a class="active" href="./gallery.html" data-i18n="nav.gallery">图库</a>
        <a href="./articles.html" data-i18n="nav.articles">文章</a>
        <a href="./contact.html" data-i18n="nav.contact">联系</a>
      </nav>
    </div>
  </header>

  <main>
    <section class="page-hero reveal">
      <div class="page-intro" id="gallery-detail-hero"></div>
    </section>

    <section class="section reveal">
      <div class="gallery-masonry" id="gallery-masonry"></div>
    </section>
  </main>

  <script src="./assets/vendor/oh-my-live2d.min.js"></script>
  <script src="./script.js"></script>
  <script src="./content.js"></script>
</body>
</html>
```

- [ ] **Step 4: 预留图片目录**

Create `assets/gallery/.gitkeep` as an empty file.

- [ ] **Step 5: 更新所有公开页面的导航**

In each file below, add the gallery link after the music link and before articles:

- `index.html`
- `profile.html`
- `about.html`
- `works.html`
- `music.html`
- `articles.html`
- `article-detail.html`
- `contact.html`

Use this exact link on non-gallery pages:

```html
<a href="./gallery.html" data-i18n="nav.gallery">图库</a>
```

For `gallery.html` and `gallery-detail.html`, keep this active link:

```html
<a class="active" href="./gallery.html" data-i18n="nav.gallery">图库</a>
```

- [ ] **Step 6: 更新 `editor.html` 导航**

In `editor.html`, replace the current nav links with:

```html
<nav class="nav-links">
  <a href="./index.html">首页</a>
  <a href="./gallery.html">图库</a>
  <a href="./articles.html">文章</a>
  <a href="./about.html">关于我</a>
  <a href="./contact.html">联系</a>
</nav>
```

- [ ] **Step 7: 在首页加入图库精选预览区**

In `index.html`, insert this section after the existing quick-grid section and before `</main>`:

```html
<section class="section gallery-preview-section reveal">
  <div class="section-head">
    <div>
      <span class="section-badge" data-i18n="home.galleryPreviewBadge">Gallery</span>
      <h2 class="section-title" data-i18n="home.galleryPreviewTitle">我收集的画面碎片</h2>
      <p class="section-desc" data-i18n="home.galleryPreviewDesc">把喜欢的图片和生成出来的画面，按系列慢慢收进这个蓝色图库里。</p>
    </div>
    <a class="mini-link" href="./gallery.html" data-i18n="home.galleryPreviewAction">进入图库</a>
  </div>
  <div class="home-gallery-grid" id="home-gallery-preview"></div>
</section>
```

- [ ] **Step 8: 运行测试，确认 HTML 相关断言通过**

Run:

```bash
node --test tests/gallery-module.test.js
```

Expected: 仍然 FAIL，因为 `script.js`、`content.js`、`style.css` 尚未实现；但这些断言应通过：

- `public pages expose a gallery navigation entry`
- `gallery shell pages provide dynamic render targets`
- `homepage exposes a featured gallery preview section`

- [ ] **Step 9: Review checkpoint**

Run:

```bash
git diff -- gallery.html gallery-detail.html index.html profile.html about.html works.html music.html articles.html article-detail.html contact.html editor.html assets/gallery/.gitkeep
```

Expected: 只看到页面骨架、导航入口、首页图库预览容器和 `.gitkeep`。

## Task 3: 补齐静态三语文案与看板娘页面感知

**Files:**
- Modify: `script.js`

- [ ] **Step 1: 运行翻译测试，确认失败点**

Run:

```bash
node --test tests/gallery-module.test.js
```

Expected: FAIL，包含 `expected galleryPreviewTitle: in zh-CN, ja, en` 或 `expected galleryDetail: in zh-CN, ja, en`。

- [ ] **Step 2: 给三套 `nav` 增加图库入口**

In `script.js`, update each `nav` object.

Chinese:

```js
nav: { home: '首页', profile: '角色档案', about: '关于我', works: '作品', music: '音乐', gallery: '图库', articles: '文章', contact: '联系' },
```

Japanese:

```js
nav: { home: 'ホーム', profile: 'キャラ設定', about: '私について', works: '作品', music: '音楽', gallery: 'ギャラリー', articles: '記事', contact: '連絡先' },
```

English:

```js
nav: { home: 'Home', profile: 'Profile', about: 'About', works: 'Works', music: 'Music', gallery: 'Gallery', articles: 'Articles', contact: 'Contact' },
```

- [ ] **Step 3: 给三套 `home` 增加首页图库预览文案**

Add these keys inside the Chinese `home` object:

```js
galleryPreviewBadge: 'Gallery',
galleryPreviewTitle: '我收集的画面碎片',
galleryPreviewDesc: '把喜欢的图片和生成出来的画面，按系列慢慢收进这个蓝色图库里。',
galleryPreviewAction: '进入图库',
```

Add these keys inside the Japanese `home` object:

```js
galleryPreviewBadge: 'Gallery',
galleryPreviewTitle: '集めた画面のかけら',
galleryPreviewDesc: '好きな画像や生成したビジュアルを、シリーズごとに青いギャラリーへ少しずつしまっていきます。',
galleryPreviewAction: 'ギャラリーへ',
```

Add these keys inside the English `home` object:

```js
galleryPreviewBadge: 'Gallery',
galleryPreviewTitle: 'Collected visual fragments',
galleryPreviewDesc: 'A blue gallery for favorite images, generated visuals, and small scenes collected by series.',
galleryPreviewAction: 'Open gallery',
```

- [ ] **Step 4: 给三套语言增加图库页和详情页文案对象**

Add this object beside the Chinese `home`, `profile`, `about`, etc. objects:

```js
gallery: {
  pageTitle: '图库',
  badge: 'Gallery',
  title: '图库<span>和我收集的画面碎片</span>',
  desc: '这里会放我收集的图片、生成的图片，以及那些很像蓝色番剧分镜的视觉灵感。',
  albumsBadge: 'Albums',
  albumsTitle: '按系列慢慢浏览',
  albumsDesc: '每个系列都像一小格视觉专题，可以从封面进入详情。'
},
galleryDetail: {
  pageTitle: '图库详情'
},
```

Add this object beside the Japanese language page objects:

```js
gallery: {
  pageTitle: 'ギャラリー',
  badge: 'Gallery',
  title: 'ギャラリー<span>と集めた画面のかけら</span>',
  desc: '好きな画像、生成したビジュアル、青いアニメのカットみたいなインスピレーションを置いていく場所です。',
  albumsBadge: 'Albums',
  albumsTitle: 'シリーズごとに見る',
  albumsDesc: 'それぞれのシリーズは小さなビジュアル特集のように、カバーから詳細へ進めます。'
},
galleryDetail: {
  pageTitle: 'ギャラリー詳細'
},
```

Add this object beside the English language page objects:

```js
gallery: {
  pageTitle: 'Gallery',
  badge: 'Gallery',
  title: 'Gallery<span>and collected visual fragments</span>',
  desc: 'A place for collected images, generated visuals, and blue anime-like frames that feel worth keeping.',
  albumsBadge: 'Albums',
  albumsTitle: 'Browse by series',
  albumsDesc: 'Each series works like a small visual exhibit, with a cover leading into the detail view.'
},
galleryDetail: {
  pageTitle: 'Gallery Detail'
},
```

- [ ] **Step 5: 给看板娘页面提示加入 gallery**

Inside each `mascot.pages` object in `script.js`, add `gallery` after `music` or before `articles`.

Chinese:

```js
gallery: ['这里会慢慢收集 Asa 喜欢的图片和生成画面。'],
```

Japanese:

```js
gallery: ['ここには Asa の好きな画像や生成したビジュアルが少しずつ集まります。'],
```

English:

```js
gallery: ['This is where Asa keeps favorite images and generated visuals.'],
```

- [ ] **Step 6: 运行测试，确认翻译相关断言通过**

Run:

```bash
node --test tests/gallery-module.test.js
```

Expected: 仍然 FAIL，因为 `content.js` 和 `style.css` 尚未实现；`script translations include gallery copy in all languages` 应通过。

- [ ] **Step 7: Review checkpoint**

Run:

```bash
git diff -- script.js
```

Expected: 只看到 `nav.gallery`、首页图库文案、图库页文案、详情页标题、看板娘 gallery 提示。

## Task 4: 实现图库默认数据、前台渲染和纯大图 lightbox

**Files:**
- Modify: `content.js`

- [ ] **Step 1: 运行内容渲染测试，确认失败点**

Run:

```bash
node --test tests/gallery-module.test.js
```

Expected: FAIL，包含 `The input did not match /const normalizeGallery =/` 或 `The input did not match /const renderGalleryPage =/`。

- [ ] **Step 2: 在 `DEFAULT_CONTENT` 中加入默认图库数据**

In `content.js`, add `gallery` to `DEFAULT_CONTENT` after `articles`.

Use this exact object shape:

```js
gallery: {
  albums: [
    {
      id: 'blue-night-frames',
      title: {
        'zh-CN': '蓝色夜景分镜',
        ja: '青い夜景のカット',
        en: 'Blue night frames'
      },
      description: {
        'zh-CN': '收集那些像番剧片段一样安静发光的蓝色画面。',
        ja: 'アニメのワンカットみたいに静かに光る青い画面を集めています。',
        en: 'Quiet blue visuals that feel like frames from an anime opening.'
      },
      mood: {
        'zh-CN': 'Blue hour archive',
        ja: 'Blue hour archive',
        en: 'Blue hour archive'
      },
      cover: './brand-avatar.jpg',
      accent: '#84c7ff',
      featured: true,
      images: [
        { src: './brand-avatar.jpg' },
        { src: '', tone: 'blue' },
        { src: '', tone: 'mint' },
        { src: '', tone: 'violet' }
      ]
    },
    {
      id: 'generated-dreams',
      title: {
        'zh-CN': '生成图梦境',
        ja: '生成ビジュアルの夢',
        en: 'Generated dreams'
      },
      description: {
        'zh-CN': '给以后生成出来的图片留一个像梦境展厅一样的位置。',
        ja: 'これから生成したビジュアルを夢の展示室のように置いていく場所です。',
        en: 'A dreamlike room reserved for generated images.'
      },
      mood: {
        'zh-CN': 'AI visual room',
        ja: 'AI visual room',
        en: 'AI visual room'
      },
      cover: '',
      accent: '#88f4dc',
      featured: true,
      images: [
        { src: '', tone: 'mint' },
        { src: '', tone: 'amber' },
        { src: '', tone: 'blue' }
      ]
    },
    {
      id: 'inspiration-board',
      title: {
        'zh-CN': '灵感收藏板',
        ja: 'インスピレーションボード',
        en: 'Inspiration board'
      },
      description: {
        'zh-CN': '暂时存放一些以后可能会变成页面氛围的视觉参考。',
        ja: 'いつかページの空気感になりそうなビジュアルの参考を置いておきます。',
        en: 'Visual references that may turn into future page moods.'
      },
      mood: {
        'zh-CN': 'Mood fragments',
        ja: 'Mood fragments',
        en: 'Mood fragments'
      },
      cover: '',
      accent: '#ffc98a',
      featured: false,
      images: [
        { src: '', tone: 'violet' },
        { src: '', tone: 'blue' },
        { src: '', tone: 'amber' }
      ]
    }
  ]
}
```

- [ ] **Step 3: 加入图库归一化与文本辅助函数**

Insert this block after `normalizeArticles` and before `normalizeContent`:

```js
  const createGalleryAlbumId = () => `album-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const createGalleryImageId = () => `image-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const normalizeLocalizedText = (value, fallback = {}) => {
    if (typeof value === 'string') {
      return { 'zh-CN': value, ja: value, en: value };
    }
    const source = value && typeof value === 'object' ? value : {};
    const fallbackObject = typeof fallback === 'string'
      ? { 'zh-CN': fallback, ja: fallback, en: fallback }
      : fallback;
    return {
      'zh-CN': normalizeString(source['zh-CN'], fallbackObject?.['zh-CN'] || ''),
      ja: normalizeString(source.ja, fallbackObject?.ja || fallbackObject?.['zh-CN'] || ''),
      en: normalizeString(source.en, fallbackObject?.en || fallbackObject?.['zh-CN'] || '')
    };
  };

  const getLocalizedGalleryText = (value) => {
    if (typeof value === 'string') return value;
    if (!value || typeof value !== 'object') return '';
    const lang = getCurrentLang();
    return normalizeString(value[lang], value['zh-CN'] || value.en || value.ja || '');
  };

  const normalizeGalleryImages = (value, fallback = []) => {
    const source = Array.isArray(value) ? value : fallback;
    return source.map((image, index) => ({
      id: normalizeString(image?.id, `gallery-image-${index + 1}`).trim() || `gallery-image-${index + 1}`,
      src: normalizeString(image?.src, ''),
      tone: normalizeString(image?.tone, ['blue', 'mint', 'violet', 'amber'][index % 4])
    }));
  };

  const normalizeGalleryAlbums = (value, fallback = []) => {
    const source = Array.isArray(value) ? value : fallback;
    return source.map((album, index) => {
      const fallbackAlbum = fallback[index] || {};
      return {
        id: normalizeString(album?.id, fallbackAlbum.id || `gallery-album-${index + 1}`).trim() || `gallery-album-${index + 1}`,
        title: normalizeLocalizedText(album?.title, fallbackAlbum.title || { 'zh-CN': `相册 ${index + 1}`, ja: `アルバム ${index + 1}`, en: `Album ${index + 1}` }),
        description: normalizeLocalizedText(album?.description, fallbackAlbum.description || { 'zh-CN': '', ja: '', en: '' }),
        mood: normalizeLocalizedText(album?.mood, fallbackAlbum.mood || { 'zh-CN': '', ja: '', en: '' }),
        cover: normalizeString(album?.cover, fallbackAlbum.cover || ''),
        accent: normalizeString(album?.accent, fallbackAlbum.accent || '#84c7ff'),
        featured: Boolean(album?.featured ?? fallbackAlbum.featured ?? false),
        images: normalizeGalleryImages(album?.images, fallbackAlbum.images || [])
      };
    }).filter((album) => getLocalizedGalleryText(album.title) || album.images.length);
  };

  const normalizeGallery = (value, fallback) => ({
    albums: normalizeGalleryAlbums(value?.albums, fallback.albums)
  });
```

- [ ] **Step 4: 让 `normalizeContent` 合并图库数据**

Inside `normalizeContent`, after article normalization, add:

```js
    if (value.gallery && typeof value.gallery === 'object') {
      base.gallery = normalizeGallery(value.gallery, base.gallery);
    }
```

- [ ] **Step 5: 加入图库渲染辅助函数**

Insert this block after `renderTagList` and before `parseArticleSections`:

```js
  const GALLERY_EMPTY_IMAGE = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0" y1="0" x2="1" y2="1"%3E%3Cstop stop-color="%2307101f"/%3E%3Cstop offset="0.55" stop-color="%231f5f9f"/%3E%3Cstop offset="1" stop-color="%2384c7ff"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="1200" height="900" fill="url(%23g)"/%3E%3Ccircle cx="910" cy="170" r="90" fill="%23dfe8ff" opacity="0.72"/%3E%3Cpath d="M0 680 C260 590 420 760 700 640 S1020 520 1200 590 V900 H0Z" fill="%2307101f" opacity="0.55"/%3E%3C/svg%3E';

  const getGalleryUiText = () => ({
    'zh-CN': {
      viewAlbum: '进入系列',
      backToGallery: '返回图库',
      imageCount: '张图片',
      emptyGallery: '图库还没有内容',
      emptyGalleryDesc: '可以先去 editor.html 新增相册和图片。',
      missingAlbum: '没有找到这个系列',
      missingAlbumDesc: '它可能还没创建，或者链接里的 id 已经变化。',
      emptyAlbum: '这个系列还没有图片',
      closeImage: '关闭大图'
    },
    ja: {
      viewAlbum: 'シリーズへ',
      backToGallery: 'ギャラリーへ戻る',
      imageCount: '枚の画像',
      emptyGallery: 'ギャラリーはまだ空です',
      emptyGalleryDesc: 'editor.html からアルバムと画像を追加できます。',
      missingAlbum: 'このシリーズが見つかりません',
      missingAlbumDesc: 'まだ作成されていないか、リンクの id が変わった可能性があります。',
      emptyAlbum: 'このシリーズにはまだ画像がありません',
      closeImage: '画像を閉じる'
    },
    en: {
      viewAlbum: 'Open series',
      backToGallery: 'Back to gallery',
      imageCount: 'images',
      emptyGallery: 'The gallery is empty',
      emptyGalleryDesc: 'Open editor.html to add albums and images.',
      missingAlbum: 'Series not found',
      missingAlbumDesc: 'It may not exist yet, or the id in the link has changed.',
      emptyAlbum: 'This series has no images yet',
      closeImage: 'Close image'
    }
  }[getCurrentLang()] || {});

  const getGalleryAlbums = (siteContent) => Array.isArray(siteContent?.gallery?.albums) ? siteContent.gallery.albums : [];
  const getAlbumCover = (album) => album.cover || album.images.find((image) => image.src)?.src || '';

  const renderGalleryVisual = (image, className = 'gallery-visual') => {
    const src = normalizeString(image?.src, '');
    const tone = normalizeString(image?.tone, 'blue');
    if (src) return `<img class="${className}" src="${escapeHtml(src)}" alt="" loading="lazy" />`;
    return `<div class="${className} gallery-gradient tone-${escapeHtml(tone)}" aria-hidden="true"></div>`;
  };

  const renderGalleryCover = (album, className = 'gallery-visual') => {
    const src = getAlbumCover(album);
    if (src) return `<img class="${className}" src="${escapeHtml(src)}" alt="" loading="lazy" />`;
    return `<div class="${className} gallery-gradient tone-blue" aria-hidden="true"></div>`;
  };

  const getFeaturedGalleryImages = (albums) => {
    const featuredAlbums = albums.filter((album) => album.featured);
    const sourceAlbums = featuredAlbums.length ? featuredAlbums : albums;
    return sourceAlbums.flatMap((album) => album.images.map((image) => ({ ...image, album }))).slice(0, 5);
  };

  const openGalleryLightbox = (src) => {
    if (!src) return;
    const ui = getGalleryUiText();
    let lightbox = document.querySelector('.gallery-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'gallery-lightbox';
      lightbox.innerHTML = '<button class="gallery-lightbox-close" type="button"></button><img class="gallery-lightbox-image" alt="" />';
      document.body.appendChild(lightbox);
      lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox || event.target.classList.contains('gallery-lightbox-close')) {
          lightbox.classList.remove('open');
        }
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') lightbox.classList.remove('open');
      });
    }
    lightbox.querySelector('.gallery-lightbox-close').textContent = ui.closeImage;
    lightbox.querySelector('.gallery-lightbox-image').src = src;
    lightbox.classList.add('open');
  };
```

- [ ] **Step 6: 加入首页预览、图库页、详情页渲染函数**

Insert this block before `renderArticlesPage`:

```js
  const renderHomeGalleryPreview = (siteContent) => {
    const container = document.getElementById('home-gallery-preview');
    if (!container) return;
    const ui = getGalleryUiText();
    const albums = getGalleryAlbums(siteContent);
    const cards = albums.filter((album) => album.featured).slice(0, 3);
    if (!cards.length) {
      container.innerHTML = `<article class="gallery-album-card reveal show"><h3>${escapeHtml(ui.emptyGallery)}</h3><p>${escapeHtml(ui.emptyGalleryDesc)}</p></article>`;
      attachGlowEffect(container);
      return;
    }

    container.innerHTML = cards.map((album) => `
      <a class="gallery-album-card home-gallery-card reveal show" href="./gallery-detail.html?id=${encodeURIComponent(album.id)}" style="--album-accent:${escapeHtml(album.accent)}">
        <div class="gallery-album-cover">${renderGalleryCover(album)}</div>
        <div class="gallery-album-body">
          <span class="section-badge">${escapeHtml(getLocalizedGalleryText(album.mood))}</span>
          <h3>${escapeHtml(getLocalizedGalleryText(album.title))}</h3>
          <p>${escapeHtml(getLocalizedGalleryText(album.description))}</p>
        </div>
      </a>
    `).join('');
    attachGlowEffect(container);
  };

  const renderGalleryPage = (siteContent) => {
    const collage = document.getElementById('gallery-featured-collage');
    const albumsContainer = document.getElementById('gallery-albums');
    if (!collage || !albumsContainer) return;
    const ui = getGalleryUiText();
    const albums = getGalleryAlbums(siteContent);
    const featuredImages = getFeaturedGalleryImages(albums);

    collage.innerHTML = featuredImages.length
      ? featuredImages.map((item, index) => `<a class="gallery-collage-item item-${index + 1}" href="./gallery-detail.html?id=${encodeURIComponent(item.album.id)}">${renderGalleryVisual(item)}</a>`).join('')
      : `<div class="gallery-empty-card"><h3>${escapeHtml(ui.emptyGallery)}</h3><p>${escapeHtml(ui.emptyGalleryDesc)}</p></div>`;

    albumsContainer.innerHTML = albums.length
      ? albums.map((album) => `
        <a class="gallery-album-card reveal show" href="./gallery-detail.html?id=${encodeURIComponent(album.id)}" style="--album-accent:${escapeHtml(album.accent)}">
          <div class="gallery-album-cover">${renderGalleryCover(album)}</div>
          <div class="gallery-album-body">
            <span class="section-badge">${escapeHtml(getLocalizedGalleryText(album.mood))}</span>
            <h3>${escapeHtml(getLocalizedGalleryText(album.title))}</h3>
            <p>${escapeHtml(getLocalizedGalleryText(album.description))}</p>
            <span class="mini-link">${album.images.length} ${escapeHtml(ui.imageCount)} · ${escapeHtml(ui.viewAlbum)}</span>
          </div>
        </a>
      `).join('')
      : `<article class="gallery-empty-card"><h3>${escapeHtml(ui.emptyGallery)}</h3><p>${escapeHtml(ui.emptyGalleryDesc)}</p></article>`;

    attachGlowEffect(document);
  };

  const renderGalleryDetailPage = (siteContent) => {
    const hero = document.getElementById('gallery-detail-hero');
    const masonry = document.getElementById('gallery-masonry');
    if (!hero || !masonry) return;
    const ui = getGalleryUiText();
    const params = new URLSearchParams(window.location.search);
    const album = getGalleryAlbums(siteContent).find((item) => item.id === params.get('id'));

    if (!album) {
      hero.innerHTML = `
        <span class="section-badge">Gallery</span>
        <h1>${escapeHtml(ui.missingAlbum)}</h1>
        <p>${escapeHtml(ui.missingAlbumDesc)}</p>
        <a class="mini-link" href="./gallery.html">${escapeHtml(ui.backToGallery)}</a>
      `;
      masonry.innerHTML = '';
      return;
    }

    document.title = `${getLocalizedGalleryText(album.title)} · ${ui.backToGallery}`;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', getLocalizedGalleryText(album.description));

    hero.innerHTML = `
      <span class="section-badge">${escapeHtml(getLocalizedGalleryText(album.mood))}</span>
      <h1>${escapeHtml(getLocalizedGalleryText(album.title))}<span>${album.images.length} ${escapeHtml(ui.imageCount)}</span></h1>
      <p>${escapeHtml(getLocalizedGalleryText(album.description))}</p>
      <a class="mini-link" href="./gallery.html">${escapeHtml(ui.backToGallery)}</a>
    `;

    masonry.innerHTML = album.images.length
      ? album.images.map((image) => {
        const src = normalizeString(image.src, '');
        const visual = renderGalleryVisual(image, 'gallery-masonry-visual');
        return src
          ? `<button class="gallery-masonry-item reveal show" type="button" data-gallery-src="${escapeHtml(src)}">${visual}</button>`
          : `<div class="gallery-masonry-item reveal show">${visual}</div>`;
      }).join('')
      : `<article class="gallery-empty-card"><h3>${escapeHtml(ui.emptyAlbum)}</h3><p>${escapeHtml(ui.emptyGalleryDesc)}</p></article>`;

    masonry.querySelectorAll('[data-gallery-src]').forEach((button) => {
      button.addEventListener('click', () => openGalleryLightbox(button.dataset.gallerySrc));
    });
    attachGlowEffect(document);
  };
```

- [ ] **Step 7: 接入总渲染函数**

In `renderAllDynamicContent`, add these calls after `renderArticleDetailPage(siteContent);`:

```js
    renderHomeGalleryPreview(siteContent);
    renderGalleryPage(siteContent);
    renderGalleryDetailPage(siteContent);
```

- [ ] **Step 8: 运行测试，确认 content 相关断言通过**

Run:

```bash
node --test tests/gallery-module.test.js
```

Expected: 仍然 FAIL，因为 editor 控件和 CSS 尚未完成；`content script defines gallery data, renderers, lightbox, and editor persistence` 应只剩 editor 相关断言未通过，或在下一任务前仍整体失败。

- [ ] **Step 9: Review checkpoint**

Run:

```bash
git diff -- content.js
```

Expected: 看到图库数据、归一化、前台渲染、lightbox 和总渲染函数调用。

## Task 5: 实现 editor 图库管理

**Files:**
- Modify: `editor.html`
- Modify: `content.js`

- [ ] **Step 1: 运行 editor 测试，确认失败点**

Run:

```bash
node --test tests/gallery-module.test.js
```

Expected: FAIL，包含 `missing #gallery-album-select` 或 `The input did not match /const fillGalleryAlbumForm =/`。

- [ ] **Step 2: 在 `editor.html` 中加入图库管理卡片**

Inside `<div id="editor-app" class="editor-stack is-hidden">`, insert this card after the article management card and before “关于我” card:

```html
<article class="card reveal show">
  <div class="editor-toolbar editor-toolbar-split">
    <div>
      <h3>图库管理</h3>
      <p class="helper-text">这里可以维护图库系列和图片。上传图片会保存为当前浏览器里的 data URL；如果图片很多，建议把文件放进 <code>assets/gallery/</code> 后填写路径。</p>
    </div>
    <div class="editor-toolbar compact-toolbar">
      <select id="gallery-album-select"></select>
      <button class="button secondary small" type="button" id="gallery-new-album">新增相册</button>
      <button class="button secondary small" type="button" id="gallery-delete-album">删除相册</button>
    </div>
  </div>

  <div class="gallery-editor-grid">
    <div class="field-group"><label for="gallery-album-title-zh">相册标题 · 中文</label><input id="gallery-album-title-zh" type="text" /></div>
    <div class="field-group"><label for="gallery-album-title-ja">相册标题 · 日文</label><input id="gallery-album-title-ja" type="text" /></div>
    <div class="field-group"><label for="gallery-album-title-en">相册标题 · 英文</label><input id="gallery-album-title-en" type="text" /></div>
    <div class="field-group"><label for="gallery-album-desc-zh">相册描述 · 中文</label><textarea id="gallery-album-desc-zh" rows="4"></textarea></div>
    <div class="field-group"><label for="gallery-album-desc-ja">相册描述 · 日文</label><textarea id="gallery-album-desc-ja" rows="4"></textarea></div>
    <div class="field-group"><label for="gallery-album-desc-en">相册描述 · 英文</label><textarea id="gallery-album-desc-en" rows="4"></textarea></div>
    <div class="field-group"><label for="gallery-album-mood-zh">短标语 · 中文</label><input id="gallery-album-mood-zh" type="text" /></div>
    <div class="field-group"><label for="gallery-album-mood-ja">短标语 · 日文</label><input id="gallery-album-mood-ja" type="text" /></div>
    <div class="field-group"><label for="gallery-album-mood-en">短标语 · 英文</label><input id="gallery-album-mood-en" type="text" /></div>
    <div class="field-group"><label for="gallery-album-cover">封面图片地址</label><input id="gallery-album-cover" type="text" placeholder="例如：./assets/gallery/cover.jpg" /></div>
    <div class="field-group"><label for="gallery-album-accent">强调色</label><input id="gallery-album-accent" type="text" placeholder="#84c7ff" /></div>
    <label class="field-check"><input id="gallery-album-featured" type="checkbox" /> 首页精选展示</label>
  </div>

  <div class="field-group">
    <label>当前相册图片</label>
    <div class="gallery-image-list" id="gallery-image-list"></div>
  </div>

  <div class="field-grid two">
    <div class="field-group">
      <label for="gallery-image-src">新增图片地址</label>
      <input id="gallery-image-src" type="text" placeholder="例如：./assets/gallery/image-01.jpg" />
    </div>
    <div class="field-group">
      <label for="gallery-image-file">上传图片到当前浏览器</label>
      <input id="gallery-image-file" type="file" accept="image/*" />
    </div>
  </div>

  <div class="editor-toolbar">
    <button class="button secondary small" type="button" id="gallery-add-image">新增图片</button>
    <button class="button primary small" type="button" id="gallery-save">保存图库</button>
  </div>
</article>
```

- [ ] **Step 3: 在 `initEditorPage` 内增加图库状态变量与 DOM 引用**

In `initEditorPage`, after `let selectedArticleId = ...`, add:

```js
    let selectedGalleryAlbumId = siteContent.gallery?.albums?.[0]?.id || null;
```

After `const aboutAvatarFile = ...`, add:

```js
    const galleryAlbumSelect = document.getElementById('gallery-album-select');
    const galleryImageFile = document.getElementById('gallery-image-file');
```

- [ ] **Step 4: 在 `initEditorPage` 内加入图库表单填充函数**

Insert after `fillContactForm`:

```js
    const getSelectedGalleryAlbum = () => siteContent.gallery.albums.find((album) => album.id === selectedGalleryAlbumId);

    const fillGalleryAlbumSelect = () => {
      if (!galleryAlbumSelect) return;
      if (!siteContent.gallery.albums.length) {
        galleryAlbumSelect.innerHTML = '<option value="">暂无相册</option>';
        galleryAlbumSelect.disabled = true;
        selectedGalleryAlbumId = null;
        return;
      }
      galleryAlbumSelect.disabled = false;
      if (!siteContent.gallery.albums.some((album) => album.id === selectedGalleryAlbumId)) {
        selectedGalleryAlbumId = siteContent.gallery.albums[0].id;
      }
      galleryAlbumSelect.innerHTML = siteContent.gallery.albums.map((album) => `
        <option value="${escapeHtml(album.id)}">${escapeHtml(getLocalizedGalleryText(album.title) || album.id)}</option>
      `).join('');
      galleryAlbumSelect.value = selectedGalleryAlbumId;
    };

    const fillGalleryImageList = () => {
      const list = document.getElementById('gallery-image-list');
      if (!list) return;
      const album = getSelectedGalleryAlbum();
      if (!album || !album.images.length) {
        list.innerHTML = '<p class="helper-text">当前相册还没有图片。</p>';
        return;
      }
      list.innerHTML = album.images.map((image, index) => `
        <div class="gallery-image-row" data-image-index="${index}">
          ${image.src ? `<img src="${escapeHtml(image.src)}" alt="" />` : '<span class="gallery-image-swatch"></span>'}
          <input type="text" value="${escapeHtml(image.src)}" aria-label="图片地址 ${index + 1}" />
          <button class="button secondary small" type="button" data-remove-image="${index}">删除</button>
        </div>
      `).join('');
      list.querySelectorAll('.gallery-image-row input').forEach((input, index) => {
        input.addEventListener('input', () => {
          const current = getSelectedGalleryAlbum();
          if (current?.images[index]) current.images[index].src = input.value.trim();
        });
      });
      list.querySelectorAll('[data-remove-image]').forEach((button) => {
        button.addEventListener('click', () => {
          const current = getSelectedGalleryAlbum();
          if (!current) return;
          current.images.splice(Number(button.dataset.removeImage), 1);
          siteContent = saveContent(siteContent);
          fillGalleryAlbumForm();
          showFeedback('已删除图库图片。');
        });
      });
    };

    const fillGalleryAlbumForm = () => {
      fillGalleryAlbumSelect();
      const album = getSelectedGalleryAlbum();
      const setValue = (id, value) => {
        const node = document.getElementById(id);
        if (node) node.value = value || '';
      };
      if (!album) {
        ['gallery-album-title-zh', 'gallery-album-title-ja', 'gallery-album-title-en', 'gallery-album-desc-zh', 'gallery-album-desc-ja', 'gallery-album-desc-en', 'gallery-album-mood-zh', 'gallery-album-mood-ja', 'gallery-album-mood-en', 'gallery-album-cover', 'gallery-album-accent'].forEach((id) => setValue(id, ''));
        const featured = document.getElementById('gallery-album-featured');
        if (featured) featured.checked = false;
        fillGalleryImageList();
        return;
      }
      setValue('gallery-album-title-zh', album.title['zh-CN']);
      setValue('gallery-album-title-ja', album.title.ja);
      setValue('gallery-album-title-en', album.title.en);
      setValue('gallery-album-desc-zh', album.description['zh-CN']);
      setValue('gallery-album-desc-ja', album.description.ja);
      setValue('gallery-album-desc-en', album.description.en);
      setValue('gallery-album-mood-zh', album.mood['zh-CN']);
      setValue('gallery-album-mood-ja', album.mood.ja);
      setValue('gallery-album-mood-en', album.mood.en);
      setValue('gallery-album-cover', album.cover);
      setValue('gallery-album-accent', album.accent);
      const featured = document.getElementById('gallery-album-featured');
      if (featured) featured.checked = album.featured;
      fillGalleryImageList();
    };
```

- [ ] **Step 5: 把图库表单加入 `fillAllForms` 和 `unlockEditor`**

In `fillAllForms`, add after `fillContactForm();`:

```js
      fillGalleryAlbumForm();
```

In `unlockEditor`, after `selectedArticleId = ...`, add:

```js
      selectedGalleryAlbumId = siteContent.gallery?.albums?.[0]?.id || selectedGalleryAlbumId;
```

- [ ] **Step 6: 加入保存图库表单的函数与事件**

Insert before `renderAuth();` inside `initEditorPage`:

```js
    const persistGalleryAlbum = () => {
      const album = getSelectedGalleryAlbum();
      if (!album) {
        showFeedback('当前没有可保存的图库相册。', true);
        return;
      }
      album.title = {
        'zh-CN': document.getElementById('gallery-album-title-zh').value.trim() || '未命名相册',
        ja: document.getElementById('gallery-album-title-ja').value.trim() || document.getElementById('gallery-album-title-zh').value.trim() || '未命名相册',
        en: document.getElementById('gallery-album-title-en').value.trim() || document.getElementById('gallery-album-title-zh').value.trim() || 'Untitled album'
      };
      album.description = {
        'zh-CN': document.getElementById('gallery-album-desc-zh').value.trim(),
        ja: document.getElementById('gallery-album-desc-ja').value.trim(),
        en: document.getElementById('gallery-album-desc-en').value.trim()
      };
      album.mood = {
        'zh-CN': document.getElementById('gallery-album-mood-zh').value.trim(),
        ja: document.getElementById('gallery-album-mood-ja').value.trim(),
        en: document.getElementById('gallery-album-mood-en').value.trim()
      };
      album.cover = document.getElementById('gallery-album-cover').value.trim();
      album.accent = document.getElementById('gallery-album-accent').value.trim() || '#84c7ff';
      album.featured = document.getElementById('gallery-album-featured').checked;
      siteContent = saveContent(siteContent);
      fillGalleryAlbumForm();
    };

    galleryAlbumSelect?.addEventListener('change', () => {
      selectedGalleryAlbumId = galleryAlbumSelect.value;
      fillGalleryAlbumForm();
      showFeedback('已切换当前图库相册。');
    });

    document.getElementById('gallery-new-album')?.addEventListener('click', () => {
      const newAlbum = {
        id: createGalleryAlbumId(),
        title: { 'zh-CN': '新的图库相册', ja: '新しいギャラリーアルバム', en: 'New gallery album' },
        description: { 'zh-CN': '这里写这个系列的说明。', ja: 'このシリーズの説明を書きます。', en: 'Write a short description for this series.' },
        mood: { 'zh-CN': 'New visual series', ja: 'New visual series', en: 'New visual series' },
        cover: '',
        accent: '#84c7ff',
        featured: false,
        images: []
      };
      siteContent.gallery.albums.unshift(newAlbum);
      selectedGalleryAlbumId = newAlbum.id;
      siteContent = saveContent(siteContent);
      fillGalleryAlbumForm();
      showFeedback('已新增图库相册。');
    });

    document.getElementById('gallery-delete-album')?.addEventListener('click', () => {
      if (!selectedGalleryAlbumId) {
        showFeedback('当前没有可删除的图库相册。', true);
        return;
      }
      siteContent.gallery.albums = siteContent.gallery.albums.filter((album) => album.id !== selectedGalleryAlbumId);
      selectedGalleryAlbumId = siteContent.gallery.albums[0]?.id || null;
      siteContent = saveContent(siteContent);
      fillGalleryAlbumForm();
      showFeedback('已删除图库相册。');
    });

    document.getElementById('gallery-add-image')?.addEventListener('click', () => {
      const album = getSelectedGalleryAlbum();
      const srcInput = document.getElementById('gallery-image-src');
      if (!album) {
        showFeedback('请先新增一个图库相册。', true);
        return;
      }
      const src = srcInput.value.trim();
      if (!src) {
        showFeedback('请先填写图片地址。', true);
        return;
      }
      album.images.push({ id: createGalleryImageId(), src, tone: 'blue' });
      srcInput.value = '';
      siteContent = saveContent(siteContent);
      fillGalleryAlbumForm();
      showFeedback('已新增图库图片。');
    });

    galleryImageFile?.addEventListener('change', () => {
      const album = getSelectedGalleryAlbum();
      const file = galleryImageFile.files?.[0];
      if (!album || !file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          album.images.push({ id: createGalleryImageId(), src: reader.result, tone: 'blue' });
          siteContent = saveContent(siteContent);
          galleryImageFile.value = '';
          fillGalleryAlbumForm();
          showFeedback('上传图片已保存到当前浏览器。');
        }
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('gallery-save')?.addEventListener('click', () => {
      persistGalleryAlbum();
      showFeedback('图库内容已保存。');
    });
```

- [ ] **Step 7: 运行测试，确认 editor 相关断言通过**

Run:

```bash
node --test tests/gallery-module.test.js
```

Expected: 仍然 FAIL，因为 CSS 尚未完成；`editor exposes gallery management controls` 应通过。

- [ ] **Step 8: Review checkpoint**

Run:

```bash
git diff -- editor.html content.js
```

Expected: 看到 editor 图库卡片、图库表单填充、相册/图片新增删除保存和文件上传 data URL 逻辑。

## Task 6: 添加图库视觉、瀑布流、lightbox 和 editor 样式

**Files:**
- Modify: `style.css`

- [ ] **Step 1: 运行样式测试，确认失败点**

Run:

```bash
node --test tests/gallery-module.test.js
```

Expected: FAIL，包含 `missing .gallery-preview-section` 或其他图库选择器缺失。

- [ ] **Step 2: 在 `style.css` 详情页样式前加入图库样式**

Insert this block before the existing detail page styles around `.detail-layout`:

```css
.gallery-preview-section {
  padding-top: 46px;
}

.home-gallery-grid,
.gallery-albums-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.gallery-hero-grid {
  width: var(--container);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(320px, 1.1fr);
  gap: 28px;
  align-items: center;
}

.gallery-collage {
  min-height: 430px;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr 0.8fr;
  grid-template-rows: 1fr 1fr;
  gap: 14px;
}

.gallery-collage-item,
.gallery-empty-card,
.gallery-album-card,
.gallery-masonry-item {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(142, 189, 255, 0.18);
  background: rgba(8, 16, 32, 0.58);
  box-shadow: var(--shadow);
  backdrop-filter: blur(18px);
}

.gallery-collage-item {
  min-height: 160px;
  border-radius: 30px;
}

.gallery-collage-item.item-1 {
  grid-row: span 2;
}

.gallery-collage-item.item-4 {
  grid-column: span 2;
}

.gallery-visual,
.gallery-masonry-visual {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.gallery-gradient {
  min-height: 180px;
  background:
    radial-gradient(circle at 24% 18%, rgba(255,255,255,0.28), transparent 28%),
    linear-gradient(135deg, rgba(18, 31, 65, 0.98), rgba(84, 150, 230, 0.88));
}

.gallery-gradient.tone-mint {
  background:
    radial-gradient(circle at 74% 22%, rgba(255,255,255,0.3), transparent 26%),
    linear-gradient(135deg, rgba(8, 34, 54, 0.98), rgba(136, 244, 220, 0.78));
}

.gallery-gradient.tone-violet {
  background:
    radial-gradient(circle at 18% 72%, rgba(255,255,255,0.24), transparent 28%),
    linear-gradient(135deg, rgba(20, 28, 70, 0.98), rgba(125, 135, 255, 0.84));
}

.gallery-gradient.tone-amber {
  background:
    radial-gradient(circle at 72% 26%, rgba(255,255,255,0.24), transparent 30%),
    linear-gradient(135deg, rgba(18, 31, 65, 0.98), rgba(255, 201, 138, 0.82));
}

.gallery-album-card {
  min-height: 100%;
  border-radius: var(--radius-lg);
  color: inherit;
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.gallery-album-card::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 0%), color-mix(in srgb, var(--album-accent, #84c7ff) 28%, transparent), transparent 42%);
  opacity: 0;
  transition: opacity 180ms ease;
}

.gallery-album-card:hover {
  transform: translateY(-6px);
  border-color: color-mix(in srgb, var(--album-accent, #84c7ff) 54%, transparent);
  box-shadow: var(--shadow-hover);
}

.gallery-album-card:hover::before {
  opacity: 1;
}

.gallery-album-cover {
  height: 210px;
  overflow: hidden;
}

.gallery-album-body {
  position: relative;
  z-index: 1;
  padding: 22px;
}

.gallery-album-body h3 {
  margin: 12px 0 10px;
  color: var(--title);
  font-size: 22px;
}

.gallery-album-body p {
  margin: 0 0 16px;
  color: var(--text-soft);
  line-height: 1.8;
}

.gallery-empty-card {
  grid-column: 1 / -1;
  border-radius: var(--radius-lg);
  padding: 28px;
}

.gallery-masonry {
  width: var(--container);
  margin: 0 auto;
  columns: 3 260px;
  column-gap: 18px;
}

.gallery-masonry-item {
  width: 100%;
  min-height: 220px;
  margin: 0 0 18px;
  padding: 0;
  border-radius: 24px;
  break-inside: avoid;
  cursor: zoom-in;
}

button.gallery-masonry-item {
  display: block;
  border: 1px solid rgba(142, 189, 255, 0.18);
}

.gallery-masonry-visual {
  min-height: 240px;
}

.gallery-lightbox {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 28px;
  background: rgba(2, 7, 18, 0.86);
  backdrop-filter: blur(14px);
}

.gallery-lightbox.open {
  display: flex;
}

.gallery-lightbox-image {
  max-width: min(96vw, 1280px);
  max-height: 88vh;
  border-radius: 22px;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.56);
}

.gallery-lightbox-close {
  position: absolute;
  top: 22px;
  right: 22px;
  border: 1px solid rgba(142, 189, 255, 0.28);
  border-radius: 999px;
  padding: 10px 16px;
  color: var(--title);
  background: rgba(8, 16, 32, 0.72);
  cursor: pointer;
}

.gallery-editor-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.field-check {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-soft);
}

.gallery-image-list {
  display: grid;
  gap: 12px;
}

.gallery-image-row {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border: 1px solid rgba(142, 189, 255, 0.14);
  border-radius: 16px;
  background: rgba(255,255,255,0.04);
}

.gallery-image-row img,
.gallery-image-swatch {
  width: 72px;
  height: 54px;
  border-radius: 12px;
  object-fit: cover;
}

.gallery-image-swatch {
  display: block;
  background: linear-gradient(135deg, rgba(132,199,255,0.7), rgba(125,135,255,0.72));
}
```

- [ ] **Step 3: 增加响应式规则**

Inside the existing `@media (max-width: 1080px)` block, add:

```css
  .gallery-hero-grid {
    grid-template-columns: 1fr;
  }

  .home-gallery-grid,
  .gallery-albums-grid,
  .gallery-editor-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
```

Inside the existing `@media (max-width: 760px)` block, add:

```css
  .home-gallery-grid,
  .gallery-albums-grid,
  .gallery-editor-grid {
    grid-template-columns: 1fr;
  }

  .gallery-collage {
    min-height: auto;
    grid-template-columns: 1fr 1fr;
  }

  .gallery-collage-item,
  .gallery-collage-item.item-1,
  .gallery-collage-item.item-4 {
    grid-column: auto;
    grid-row: auto;
    min-height: 160px;
  }

  .gallery-masonry {
    columns: 1;
  }

  .gallery-image-row {
    grid-template-columns: 56px minmax(0, 1fr);
  }

  .gallery-image-row .button {
    grid-column: 1 / -1;
  }
```

- [ ] **Step 4: 让 glow 效果覆盖图库卡片**

In `script.js`, extend `glowCards` selector to include `.gallery-album-card` and `.gallery-empty-card`:

```js
const glowCards = document.querySelectorAll('.card, .hero-point, .scene-card, .portrait-card, .panel-card, .work-card, .article-card, .music-player, .music-side, .footer-card, .quick-card, .gallery-album-card, .gallery-empty-card');
```

In `content.js`, extend the selector inside `attachGlowEffect` the same way:

```js
root.querySelectorAll('.card, .hero-point, .scene-card, .portrait-card, .panel-card, .work-card, .article-card, .music-player, .music-side, .footer-card, .quick-card, .detail-nav-card, .detail-body-card, .detail-cover-card, .contact-card, .gallery-album-card, .gallery-empty-card').forEach((card) => {
```

- [ ] **Step 5: 运行测试，确认全部通过**

Run:

```bash
node --test tests/gallery-module.test.js
```

Expected: PASS，输出包含：

```text
# pass 7
# fail 0
```

- [ ] **Step 6: Review checkpoint**

Run:

```bash
git diff -- style.css script.js content.js
```

Expected: 看到图库样式、响应式规则、图库卡片 glow selector。

## Task 7: 浏览器级验收与收尾检查

**Files:**
- Verify: `index.html`
- Verify: `gallery.html`
- Verify: `gallery-detail.html`
- Verify: `editor.html`
- Verify: `script.js`
- Verify: `content.js`
- Verify: `style.css`

- [ ] **Step 1: 运行完整测试**

Run:

```bash
node --test tests/gallery-module.test.js
```

Expected: PASS，输出包含：

```text
# pass 7
# fail 0
```

- [ ] **Step 2: 启动本地静态服务**

Run:

```bash
python -m http.server 4173
```

Expected: terminal displays a serving message for port `4173`.

- [ ] **Step 3: 手动验收公开页面**

Open these pages in the browser:

```text
http://localhost:4173/index.html
http://localhost:4173/gallery.html
http://localhost:4173/gallery-detail.html?id=blue-night-frames
http://localhost:4173/gallery-detail.html?id=generated-dreams
http://localhost:4173/gallery-detail.html?id=missing-album
```

Expected:

- `index.html` shows the featured gallery section and links to `gallery.html`.
- `gallery.html` shows hero collage and album cards.
- `gallery-detail.html?id=blue-night-frames` shows a masonry image list.
- `gallery-detail.html?id=generated-dreams` shows a masonry image list.
- `gallery-detail.html?id=missing-album` shows the missing album empty state and a back link.
- Clicking a real image opens a full-screen lightbox with only the image and close button.
- Clicking the overlay, the close button, or pressing `Esc` closes the lightbox.

- [ ] **Step 4: 手动验收三语切换**

On `gallery.html` and `index.html`, click:

```text
简体
日本語
EN
```

Expected:

- Navigation changes to the selected language.
- `图库 / ギャラリー / Gallery` appears correctly.
- Home gallery preview text changes language.
- Gallery page hero and album text change language.

- [ ] **Step 5: 手动验收 editor 图库管理**

Open:

```text
http://localhost:4173/editor.html
```

If editor asks for access code, create one or enter the existing local code. Then:

1. Click `新增相册`.
2. Fill Chinese, Japanese, English title fields.
3. Fill the cover path with `./brand-avatar.jpg`.
4. Check `首页精选展示`.
5. Fill `新增图片地址` with `./brand-avatar.jpg`.
6. Click `新增图片`.
7. Click `保存图库`.
8. Refresh `gallery.html`.

Expected:

- New album appears in editor select.
- New album appears on `gallery.html` after refresh.
- New album appears in home preview if it is featured.
- Album detail page opens with the new image.

- [ ] **Step 6: Stop the local server**

Press `Ctrl+C` in the terminal running `python -m http.server 4173`.

Expected: server process stops.

- [ ] **Step 7: Final diff review**

Run:

```bash
git status --short
git diff -- tests/gallery-module.test.js gallery.html gallery-detail.html index.html profile.html about.html works.html music.html articles.html article-detail.html contact.html editor.html script.js content.js style.css assets/gallery/.gitkeep
```

Expected:

- Modified files match this plan.
- No generated `.superpowers/` visual-companion files are included in the feature diff.
- No unrelated `.claude/` or worktree files are staged.
- Do not commit unless the user explicitly asks for a commit.
