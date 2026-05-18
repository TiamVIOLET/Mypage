# Homepage Premium Anime Terminal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把首页从普通 landing page 重构成 A1「Premium Anime Terminal」角色主界面，同时保留蓝色夜景、列车路线和角色设定。

**Architecture:** 保留现有静态多页面结构和多语言机制，只重写 `index.html` 的首页结构、在 `style.css` 中新增隔离的 terminal 首页样式，并在 `script.js` 中调整首页翻译文案与首页专属交互守卫。测试使用 Node 24 自带的 `node:test`，通过静态断言保证首页结构、翻译键、样式选择器和交互守卫不会回退成旧的卡片官网方案。

**Tech Stack:** HTML, CSS, Vanilla JavaScript, Node.js 24 `node:test`, `node:assert/strict`

---

## File map

- `index.html`
  - 首页唯一需要改结构的文件。
  - 负责 terminal 顶栏、角色档案主面板、路线导航面板、子系统入口和 terminal footer。
- `style.css`
  - 新增只作用于首页的新类：terminal bar、dossier panel、route panel、subsystem deck、footer。
  - 保留其他页面现有样式，不做全局重构。
- `script.js`
  - 更新三套语言下的首页文案。
  - 为首页增加 `isHomePage` 守卫，关闭樱花和鼠标星星等装饰特效，改用 terminal 面板高亮逻辑。
- `tests/homepage-premium-terminal.test.js`
  - Node 原生回归测试。
  - 校验首页结构、翻译键、CSS 选择器、响应式规则、首页交互守卫。

## Task 1: 重写首页终端结构与多语言文案

**Files:**
- Create: `tests/homepage-premium-terminal.test.js`
- Modify: `index.html:9-181`
- Modify: `script.js:98-177`
- Modify: `script.js:203-333`

- [ ] **Step 1: 写出首页结构与翻译的失败测试**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const count = (source, token) => (source.match(new RegExp(token, 'g')) || []).length;

test('homepage terminal shell replaces the old landing grid', () => {
  const index = read('index.html');
  assert.match(index, /<body[^>]*data-page="home"/);
  assert.match(index, /class="nav-wrap terminal-bar"/);
  assert.match(index, /class="terminal-shell"/);
  assert.match(index, /class="terminal-hero reveal"/);
  assert.match(index, /class="dossier-panel terminal-panel reveal"/);
  assert.match(index, /class="route-panel terminal-panel reveal"/);
  assert.match(index, /class="subsystem-grid"/);
  assert.match(index, /class="terminal-footer-card"/);
  assert.doesNotMatch(index, /class="quick-grid"/);
});

test('translations expose terminal home copy in all three locales', () => {
  const script = read('script.js');
  for (const key of ['barLabel', 'barId', 'statusLabel', 'statusValue', 'dossierLabel', 'build', 'noteLabel', 'routeLabel', 'subsystemsLabel']) {
    assert.equal(count(script, `${key}:`), 3, `expected ${key} in zh-CN, ja, en`);
  }
});
```

- [ ] **Step 2: 运行测试，确认当前实现失败**

Run:
```bash
node --test tests/homepage-premium-terminal.test.js
```

Expected: FAIL，至少出现以下一种错误：
- `The input did not match /data-page="home"/`
- `The input did not match /class="terminal-shell"/`
- `expected barLabel in zh-CN, ja, en`

- [ ] **Step 3: 用最小改动写出 terminal 首页骨架和新首页文案**

把 `body` 改成带首页标记：

```html
<body data-title-key="pageTitle" data-page="home">
```

把 `index.html` 的头部、首页主体和页脚替换成下面这段结构（保留脚本引用不变）：

```html
<header class="site-header">
  <div class="nav-wrap terminal-bar">
    <a class="brand terminal-brand" href="./index.html" aria-label="返回首页">
      <div class="brand-mark">A</div>
      <div class="brand-text">
        <span class="terminal-label" data-i18n="home.barLabel">TERMINAL ID</span>
        <strong data-i18n="home.barId">ASA // HOME</strong>
      </div>
    </a>

    <div class="lang-switcher" aria-label="Language switcher">
      <button class="lang-btn active" type="button" data-lang="zh-CN">简体</button>
      <button class="lang-btn" type="button" data-lang="ja">日本語</button>
      <button class="lang-btn" type="button" data-lang="en">EN</button>
    </div>

    <button class="menu-toggle" type="button" aria-label="切换导航菜单" aria-expanded="false">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <nav class="nav-links terminal-links">
      <a class="active" href="./index.html"><span class="terminal-link-code">01</span><span data-i18n="nav.home">首页</span></a>
      <a href="./profile.html"><span class="terminal-link-code">02</span><span data-i18n="nav.profile">角色档案</span></a>
      <a href="./about.html"><span class="terminal-link-code">03</span><span data-i18n="nav.about">关于我</span></a>
      <a href="./works.html"><span class="terminal-link-code">04</span><span data-i18n="nav.works">作品</span></a>
      <a href="./articles.html"><span class="terminal-link-code">05</span><span data-i18n="nav.articles">文章</span></a>
      <a href="./music.html"><span class="terminal-link-code">06</span><span data-i18n="nav.music">音乐</span></a>
      <a href="./contact.html"><span class="terminal-link-code">07</span><span data-i18n="nav.contact">联系</span></a>
    </nav>

    <div class="terminal-status">
      <span class="terminal-label" data-i18n="home.statusLabel">STATUS</span>
      <strong data-i18n="home.statusValue">ONLINE</strong>
    </div>
  </div>
</header>

<main class="terminal-shell">
  <section class="terminal-hero reveal">
    <div class="terminal-grid">
      <article class="dossier-panel terminal-panel reveal">
        <div class="dossier-head">
          <div>
            <span class="terminal-label" data-i18n="home.dossierLabel">PLAYER DOSSIER</span>
            <h1 data-i18n="brand.name">Asa</h1>
            <p class="dossier-build" data-i18n="home.build">Blue Hour Type · Introvert Build · Frontend Player</p>
          </div>
          <div class="dossier-badge" data-i18n="home.statusValue">ONLINE</div>
        </div>

        <div class="dossier-body">
          <div class="dossier-avatar" aria-hidden="true"></div>
          <div class="dossier-copy">
            <p class="dossier-intro" data-i18n="home.desc">与其说这是一个普通首页，不如说它更像进入 Asa 世界后的角色主界面。</p>
            <div class="dossier-stats">
              <div class="dossier-stat">
                <span class="terminal-label" data-i18n="home.moodLabel">MOOD</span>
                <strong data-i18n="home.moodValue">Blue Hour · Stable</strong>
              </div>
              <div class="dossier-stat">
                <span class="terminal-label" data-i18n="home.traitsLabel">TRAITS</span>
                <div class="trait-list">
                  <span data-i18n="home.traits1">Anime</span>
                  <span data-i18n="home.traits2">Code</span>
                  <span data-i18n="home.traits3">Night Train</span>
                </div>
              </div>
            </div>
            <div class="terminal-actions">
              <a class="terminal-button" href="./profile.html" data-i18n="home.button1">OPEN PROFILE</a>
              <a class="terminal-button secondary" href="./works.html" data-i18n="home.button2">VIEW WORKS</a>
            </div>
          </div>
        </div>

        <div class="system-note">
          <span class="terminal-label" data-i18n="home.noteLabel">SYSTEM NOTE</span>
          <p data-i18n="home.noteText">先建立角色，再引导用户进入作品、日志与音乐模块。</p>
        </div>
      </article>

      <aside class="route-panel terminal-panel reveal">
        <span class="terminal-label" data-i18n="home.routeLabel">ROUTE NAVIGATION</span>
        <h2 data-i18n="home.routeTitle">BLUE LINE</h2>
        <p data-i18n="home.routeDesc">把蓝色站线和夜景气氛变成真正可操作的导航主视觉。</p>
        <div class="route-map" aria-hidden="true">
          <div class="route-line"></div>
          <div class="route-stop s1 active"><span class="route-stop-dot"></span><span data-i18n="nav.home">首页</span></div>
          <div class="route-stop s2"><span class="route-stop-dot"></span><span data-i18n="nav.profile">角色档案</span></div>
          <div class="route-stop s3"><span class="route-stop-dot"></span><span data-i18n="nav.works">作品</span></div>
          <div class="route-stop s4"><span class="route-stop-dot"></span><span data-i18n="nav.articles">文章</span></div>
          <div class="route-stop s5"><span class="route-stop-dot"></span><span data-i18n="nav.music">音乐</span></div>
        </div>
      </aside>
    </div>
  </section>

  <section class="terminal-subsystems reveal">
    <div class="section-head">
      <div>
        <span class="terminal-label" data-i18n="home.subsystemsLabel">SUB SYSTEMS</span>
        <h2 class="section-title" data-i18n="home.mapTitle">进入 Asa 的其他模块</h2>
        <p class="section-desc" data-i18n="home.mapDesc">主入口优先展示作品、档案和日志，辅助入口负责音乐、联系和关于页面。</p>
      </div>
    </div>

    <div class="subsystem-grid">
      <a class="terminal-subsystem reveal" href="./profile.html"><span class="terminal-label" data-i18n="home.sub1Code">01</span><h3 data-i18n="home.sub1Title">Profile</h3><p data-i18n="home.sub1Desc">角色设定与状态总览。</p></a>
      <a class="terminal-subsystem reveal" href="./works.html"><span class="terminal-label" data-i18n="home.sub2Code">02</span><h3 data-i18n="home.sub2Title">Works</h3><p data-i18n="home.sub2Desc">代表页面和作品入口。</p></a>
      <a class="terminal-subsystem reveal" href="./articles.html"><span class="terminal-label" data-i18n="home.sub3Code">03</span><h3 data-i18n="home.sub3Title">Logs</h3><p data-i18n="home.sub3Desc">文章与制作记录。</p></a>
      <a class="terminal-subsystem reveal" href="./music.html"><span class="terminal-label" data-i18n="home.sub4Code">04</span><h3 data-i18n="home.sub4Title">Music</h3><p data-i18n="home.sub4Desc">BGM 模块与情绪入口。</p></a>
      <a class="terminal-subsystem reveal" href="./contact.html"><span class="terminal-label" data-i18n="home.sub5Code">05</span><h3 data-i18n="home.sub5Title">Contact</h3><p data-i18n="home.sub5Desc">联系和后续入口。</p></a>
    </div>
  </section>
</main>

<footer class="footer reveal">
  <div class="terminal-footer-card footer-card">
    <div>
      <span class="terminal-label" data-i18n="home.ftBadge">SYSTEM END NOTE</span>
      <h3 data-i18n="home.ftTitle">欢迎进入 Asa 的夜色终端</h3>
      <p data-i18n="home.ftDesc">首页负责建立角色主界面，其他页面继续展开作品、文章与音乐。</p>
    </div>
    <div>
      <h3 data-i18n="home.ftInfoTitle">KEYWORDS</h3>
      <p data-i18n="home.ftInfoDesc">anime / code / blue night / train line / introvert build</p>
      <p class="footer-note">© 2026 Asa · Premium Anime Terminal</p>
    </div>
  </div>
</footer>
```

把三套语言下的 `home` 文案替换成下面这三段：

```js
home: {
  barLabel: 'TERMINAL ID',
  barId: 'ASA // HOME',
  statusLabel: 'STATUS',
  statusValue: 'ONLINE',
  dossierLabel: 'PLAYER DOSSIER',
  title: 'Asa',
  build: 'Blue Hour Type · Introvert Build · Frontend Player',
  desc: '与其说这是一个普通首页，不如说它更像进入 Asa 世界后的角色主界面。',
  moodLabel: 'MOOD',
  moodValue: 'Blue Hour · Stable',
  traitsLabel: 'TRAITS',
  traits1: 'Anime',
  traits2: 'Code',
  traits3: 'Night Train',
  button1: 'OPEN PROFILE',
  button2: 'VIEW WORKS',
  noteLabel: 'SYSTEM NOTE',
  noteText: '先建立角色，再引导用户进入作品、日志与音乐模块。',
  routeLabel: 'ROUTE NAVIGATION',
  routeTitle: 'BLUE LINE',
  routeDesc: '把蓝色站线和夜景气氛变成真正可操作的导航主视觉。',
  mapTitle: '进入 Asa 的其他模块',
  mapDesc: '主入口优先展示作品、档案和日志，辅助入口负责音乐、联系和关于页面。',
  subsystemsLabel: 'SUB SYSTEMS',
  sub1Code: '01', sub1Title: 'Profile', sub1Desc: '角色设定与状态总览。',
  sub2Code: '02', sub2Title: 'Works', sub2Desc: '代表页面和作品入口。',
  sub3Code: '03', sub3Title: 'Logs', sub3Desc: '文章与制作记录。',
  sub4Code: '04', sub4Title: 'Music', sub4Desc: 'BGM 模块与情绪入口。',
  sub5Code: '05', sub5Title: 'Contact', sub5Desc: '联系和后续入口。',
  ftBadge: 'SYSTEM END NOTE',
  ftTitle: '欢迎进入 Asa 的夜色终端',
  ftDesc: '首页负责建立角色主界面，其他页面继续展开作品、文章与音乐。',
  ftInfoTitle: 'KEYWORDS',
  ftInfoDesc: 'anime / code / blue night / train line / introvert build'
}
```

```js
home: {
  barLabel: 'TERMINAL ID',
  barId: 'ASA // HOME',
  statusLabel: 'STATUS',
  statusValue: 'ONLINE',
  dossierLabel: 'PLAYER DOSSIER',
  title: 'Asa',
  build: 'Blue Hour Type · Introvert Build · Frontend Player',
  desc: 'これは普通のトップページというより、Asa の世界に入ったあと最初に見るキャラ端末です。',
  moodLabel: 'MOOD',
  moodValue: 'Blue Hour · Stable',
  traitsLabel: 'TRAITS',
  traits1: 'Anime',
  traits2: 'Code',
  traits3: 'Night Train',
  button1: 'OPEN PROFILE',
  button2: 'VIEW WORKS',
  noteLabel: 'SYSTEM NOTE',
  noteText: '先にキャラクターを見せて、そのあと作品・ログ・音楽へ案内します。',
  routeLabel: 'ROUTE NAVIGATION',
  routeTitle: 'BLUE LINE',
  routeDesc: '青い路線と夜景の空気を、そのまま操作できるナビゲーションに変えます。',
  mapTitle: 'Asa の他のモジュールへ',
  mapDesc: '主要入口はプロフィール・作品・ログ、補助入口は音楽・連絡先・自己紹介です。',
  subsystemsLabel: 'SUB SYSTEMS',
  sub1Code: '01', sub1Title: 'Profile', sub1Desc: 'キャラ設定と状態一覧。',
  sub2Code: '02', sub2Title: 'Works', sub2Desc: '代表ページと作品入口。',
  sub3Code: '03', sub3Title: 'Logs', sub3Desc: '記事と制作記録。',
  sub4Code: '04', sub4Title: 'Music', sub4Desc: 'BGM と気分の入口。',
  sub5Code: '05', sub5Title: 'Contact', sub5Desc: '連絡先と次の導線。',
  ftBadge: 'SYSTEM END NOTE',
  ftTitle: 'Asa の夜色ターミナルへようこそ',
  ftDesc: 'このページでキャラ主画面を作り、他ページで作品・記事・音楽を広げていきます。',
  ftInfoTitle: 'KEYWORDS',
  ftInfoDesc: 'anime / code / blue night / train line / introvert build'
}
```

```js
home: {
  barLabel: 'TERMINAL ID',
  barId: 'ASA // HOME',
  statusLabel: 'STATUS',
  statusValue: 'ONLINE',
  dossierLabel: 'PLAYER DOSSIER',
  title: 'Asa',
  build: 'Blue Hour Type · Introvert Build · Frontend Player',
  desc: 'This is no longer a standard hero section — it is the first character terminal screen inside Asa’s world.',
  moodLabel: 'MOOD',
  moodValue: 'Blue Hour · Stable',
  traitsLabel: 'TRAITS',
  traits1: 'Anime',
  traits2: 'Code',
  traits3: 'Night Train',
  button1: 'OPEN PROFILE',
  button2: 'VIEW WORKS',
  noteLabel: 'SYSTEM NOTE',
  noteText: 'Establish the character first, then route people into works, logs, and music.',
  routeLabel: 'ROUTE NAVIGATION',
  routeTitle: 'BLUE LINE',
  routeDesc: 'Turn the blue train-line mood into a navigable visual panel instead of a decorative illustration.',
  mapTitle: 'Enter Asa’s other modules',
  mapDesc: 'Primary entries focus on profile, works, and logs. Secondary entries cover music and contact.',
  subsystemsLabel: 'SUB SYSTEMS',
  sub1Code: '01', sub1Title: 'Profile', sub1Desc: 'Character settings and status overview.',
  sub2Code: '02', sub2Title: 'Works', sub2Desc: 'Featured pages and project entry points.',
  sub3Code: '03', sub3Title: 'Logs', sub3Desc: 'Articles and build notes.',
  sub4Code: '04', sub4Title: 'Music', sub4Desc: 'BGM module and mood entry.',
  sub5Code: '05', sub5Title: 'Contact', sub5Desc: 'Contact and follow-up entry.',
  ftBadge: 'SYSTEM END NOTE',
  ftTitle: 'Welcome to Asa’s night terminal',
  ftDesc: 'The homepage builds the character main screen; the inner pages keep unfolding works, writing, and music.',
  ftInfoTitle: 'KEYWORDS',
  ftInfoDesc: 'anime / code / blue night / train line / introvert build'
}
```

- [ ] **Step 4: 重新运行测试，确认结构和翻译通过**

Run:
```bash
node --test tests/homepage-premium-terminal.test.js
```

Expected: PASS，输出 2 passed / 0 failed。

- [ ] **Step 5: 提交这一批改动**

```bash
git add tests/homepage-premium-terminal.test.js index.html script.js
git commit -m "feat: replace homepage hero with terminal shell"
```

### Task 2: 为首页新增 Premium Anime Terminal 样式体系

**Files:**
- Modify: `tests/homepage-premium-terminal.test.js`
- Modify: `style.css:200-390`
- Modify: `style.css:1819-1917`

- [ ] **Step 1: 给测试文件加上首页 terminal 样式断言**

在 `tests/homepage-premium-terminal.test.js` 末尾追加这段测试：

```js
test('homepage premium terminal styles exist and stack responsively', () => {
  const style = read('style.css');
  for (const selector of ['.terminal-shell', '.terminal-bar', '.terminal-grid', '.terminal-panel', '.dossier-panel', '.route-panel', '.subsystem-grid', '.terminal-subsystem', '.terminal-footer-card']) {
    assert.match(style, new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\{'));
  }
  assert.match(style, /@media \(max-width: 1080px\)[\s\S]*\.terminal-grid\s*\{\s*grid-template-columns: 1fr;/);
  assert.match(style, /@media \(max-width: 760px\)[\s\S]*\.subsystem-grid\s*\{\s*grid-template-columns: 1fr;/);
});
```

- [ ] **Step 2: 运行测试，确认样式测试失败**

Run:
```bash
node --test tests/homepage-premium-terminal.test.js
```

Expected: FAIL，报错类似：
- `The input did not match /\.terminal-shell\s*\{/`
- `The input did not match responsive rule`

- [ ] **Step 3: 在 `style.css` 中添加首页 terminal 专属样式**

把下面这段样式插入到导航和首页区域附近（不要删除其他页面样式，只新增首页类）：

```css
.terminal-shell {
  display: grid;
  gap: 42px;
  padding-top: 56px;
}

.terminal-bar {
  gap: 16px;
  padding: 14px 16px;
  border-radius: 22px;
  border: 1px solid rgba(155, 205, 255, 0.18);
  background: linear-gradient(180deg, rgba(7, 13, 24, 0.9), rgba(11, 20, 36, 0.82));
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(10px);
}

.terminal-brand .brand-mark {
  border-radius: 16px;
  box-shadow: 0 0 0 1px rgba(176, 214, 255, 0.2), 0 12px 22px rgba(0, 0, 0, 0.22);
}

.terminal-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(218, 232, 255, 0.64);
}

.terminal-status {
  margin-left: auto;
  min-width: 132px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(176, 214, 255, 0.16);
  background: rgba(255, 255, 255, 0.03);
  text-align: right;
}

.terminal-status strong {
  display: block;
  margin-top: 6px;
  color: var(--title);
  font-size: 16px;
}

.terminal-links a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 14px;
  padding: 10px 12px;
}

.terminal-link-code {
  display: inline-flex;
  min-width: 24px;
  font-size: 11px;
  letter-spacing: 0.16em;
  color: rgba(218, 232, 255, 0.54);
}

.terminal-hero {
  min-height: calc(100vh - 140px);
  display: grid;
  align-content: center;
}

.terminal-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
  gap: 24px;
  align-items: stretch;
}

.terminal-panel,
.terminal-subsystem,
.terminal-footer-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(176, 214, 255, 0.18);
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(8, 14, 26, 0.42), rgba(8, 14, 26, 0.72));
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
}

.terminal-panel::before,
.terminal-subsystem::before,
.terminal-footer-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 18px;
  right: 18px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(188, 223, 255, 0.84), transparent);
  opacity: 0.7;
}

.dossier-panel,
.route-panel,
.terminal-footer-card {
  padding: 28px;
}

.dossier-panel {
  display: grid;
  gap: 22px;
}

.dossier-head {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
}

.dossier-head h1 {
  margin: 10px 0 0;
  font-size: clamp(3rem, 6vw, 4.6rem);
  line-height: 0.98;
  letter-spacing: 0.04em;
}

.dossier-build {
  margin-top: 10px;
  font-size: 13px;
  letter-spacing: 0.12em;
  color: rgba(223, 232, 255, 0.74);
}

.dossier-badge {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(176, 214, 255, 0.18);
  background: rgba(255, 255, 255, 0.03);
  color: var(--title);
  font-size: 12px;
}

.dossier-body {
  display: grid;
  grid-template-columns: 136px 1fr;
  gap: 20px;
  align-items: center;
}

.dossier-avatar {
  height: 170px;
  border-radius: 24px;
  border: 1px solid rgba(176, 214, 255, 0.18);
  background:
    radial-gradient(circle at 50% 24%, rgba(155, 215, 255, 0.18), transparent 38%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
}

.dossier-copy,
.dossier-stats {
  display: grid;
  gap: 14px;
}

.dossier-intro,
.system-note p,
.route-panel p,
.terminal-subsystem p {
  margin: 0;
  line-height: 1.86;
  color: rgba(223, 232, 255, 0.78);
}

.dossier-stat {
  display: grid;
  gap: 8px;
}

.trait-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.trait-list span {
  padding: 5px 10px;
  border-radius: 999px;
  border: 1px solid rgba(176, 214, 255, 0.18);
  background: rgba(255, 255, 255, 0.03);
  color: var(--title);
  font-size: 12px;
}

.terminal-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.terminal-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 172px;
  padding: 14px 18px;
  border-radius: 16px;
  border: 1px solid rgba(176, 214, 255, 0.2);
  background: linear-gradient(135deg, rgba(155, 215, 255, 0.98), rgba(124, 161, 255, 0.92));
  color: #07101a;
  font-weight: 700;
  letter-spacing: 0.08em;
  transition: border-color 0.24s ease, transform 0.24s ease, box-shadow 0.24s ease;
}

.terminal-button.secondary {
  background: rgba(255, 255, 255, 0.03);
  color: var(--title);
}

.route-panel {
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 14px;
}

.route-panel h2 {
  margin: 0;
  font-size: 28px;
  letter-spacing: 0.08em;
}

.route-map {
  position: relative;
  min-height: 320px;
  border-radius: 20px;
  border: 1px solid rgba(176, 214, 255, 0.14);
  background:
    radial-gradient(circle at 76% 14%, rgba(255, 209, 157, 0.12), transparent 14%),
    radial-gradient(circle at 22% 24%, rgba(155, 215, 255, 0.1), transparent 18%),
    linear-gradient(180deg, rgba(6, 12, 22, 0.28), rgba(6, 12, 22, 0.62));
}

.route-line {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 76px;
  height: 2px;
  background: rgba(155, 215, 255, 0.28);
}

.route-stop {
  position: absolute;
  bottom: 58px;
  transform: translateX(-50%);
  display: grid;
  justify-items: center;
  gap: 8px;
  color: rgba(232, 240, 255, 0.78);
  font-size: 11px;
  letter-spacing: 0.12em;
}

.route-stop-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(188, 223, 255, 0.4);
  background: rgba(255, 255, 255, 0.08);
}

.route-stop.active .route-stop-dot {
  background: linear-gradient(135deg, #9bd7ff, #9cf0ea);
  box-shadow: 0 0 12px rgba(155, 215, 255, 0.48);
  animation: route-pulse 2.4s ease-in-out infinite;
}

.route-stop.s1 { left: 10%; }
.route-stop.s2 { left: 30%; }
.route-stop.s3 { left: 50%; }
.route-stop.s4 { left: 70%; }
.route-stop.s5 { left: 90%; }

.terminal-subsystems .section-head {
  margin-bottom: 20px;
}

.subsystem-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
}

.terminal-subsystem {
  padding: 22px 18px;
  transition: border-color 0.24s ease, transform 0.24s ease, box-shadow 0.24s ease;
}

.terminal-subsystem h3,
.terminal-footer-card h3 {
  margin: 10px 0 10px;
  color: var(--title);
}

.terminal-footer-card {
  width: var(--container);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 0.86fr;
  gap: 22px;
}

@keyframes route-pulse {
  0%, 100% { transform: scale(0.84); opacity: 0.82; }
  50% { transform: scale(1.18); opacity: 1; }
}

@media (max-width: 1080px) {
  .terminal-grid {
    grid-template-columns: 1fr;
  }

  .subsystem-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .terminal-footer-card {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .terminal-bar {
    border-radius: 18px;
    padding: 12px;
  }

  .terminal-status {
    order: 3;
    width: 100%;
    margin-left: 0;
    text-align: left;
  }

  .dossier-body {
    grid-template-columns: 1fr;
  }

  .terminal-actions {
    flex-direction: column;
  }

  .terminal-button {
    width: 100%;
  }

  .subsystem-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: 重新运行测试，确认样式层通过**

Run:
```bash
node --test tests/homepage-premium-terminal.test.js
```

Expected: PASS，输出 3 passed / 0 failed。

- [ ] **Step 5: 提交样式层改动**

```bash
git add tests/homepage-premium-terminal.test.js style.css
git commit -m "style: add premium anime terminal homepage styles"
```

### Task 3: 收敛首页特效并切换到 terminal 交互

**Files:**
- Modify: `tests/homepage-premium-terminal.test.js`
- Modify: `script.js:20-96`

- [ ] **Step 1: 为首页交互守卫追加失败测试**

在 `tests/homepage-premium-terminal.test.js` 末尾追加：

```js
test('homepage script uses terminal-specific interaction guards', () => {
  const script = read('script.js');
  assert.match(script, /const isHomePage = body\.dataset\.page === 'home';/);
  assert.match(script, /if \(sakuraLayer && !isHomePage\)/);
  assert.match(script, /if \(starLayer && !isHomePage\)/);
  assert.match(script, /const glowSelector = isHomePage/);
  assert.match(script, /'\.terminal-panel, \.terminal-subsystem, \.terminal-footer-card, \.terminal-button'/);
});
```

- [ ] **Step 2: 运行测试，确认首页交互测试失败**

Run:
```bash
node --test tests/homepage-premium-terminal.test.js
```

Expected: FAIL，报错至少包含以下之一：
- `The input did not match /const isHomePage = body.dataset.page === 'home';/`
- `The input did not match /if (starLayer && !isHomePage)/`

- [ ] **Step 3: 在 `script.js` 中改成首页专属交互守卫**

把文件开头的装饰特效与 glow 逻辑替换为：

```js
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const langButtons = Array.from(document.querySelectorAll('.lang-btn'));
const body = document.body;
const isHomePage = body.dataset.page === 'home';

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
    });
  });
}

const sakuraLayer = document.querySelector('.sakura-layer');
if (sakuraLayer && !isHomePage) {
  const petalCount = window.innerWidth < 768 ? 10 : 16;
  for (let i = 0; i < petalCount; i += 1) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.style.setProperty('--left', `${Math.random() * 100}%`);
    petal.style.setProperty('--size', `${12 + Math.random() * 12}px`);
    petal.style.setProperty('--duration', `${10 + Math.random() * 8}s`);
    petal.style.setProperty('--delay', `${Math.random() * -18}s`);
    sakuraLayer.appendChild(petal);
  }
}

const starLayer = document.querySelector('.star-layer');
let lastStarTime = 0;
const starColors = [
  ['rgba(255,255,255,0.98)', 'rgba(132,199,255,0.96)', 'rgba(132,199,255,0.9)'],
  ['rgba(255,255,255,0.98)', 'rgba(255,201,138,0.96)', 'rgba(255,201,138,0.88)'],
  ['rgba(255,255,255,0.98)', 'rgba(125,135,255,0.96)', 'rgba(125,135,255,0.88)']
];

const createStar = (x, y, scale = 1) => {
  if (!starLayer) return;
  const star = document.createElement('span');
  const color = starColors[Math.floor(Math.random() * starColors.length)];
  star.className = 'mouse-star';
  star.style.left = `${x}px`;
  star.style.top = `${y}px`;
  star.style.setProperty('--star-1', color[0]);
  star.style.setProperty('--star-2', color[1]);
  star.style.setProperty('--star-glow', color[2]);
  star.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${Math.random() * 90}deg)`;
  starLayer.appendChild(star);
  setTimeout(() => star.remove(), 900);
};

if (starLayer && !isHomePage) {
  window.addEventListener('mousemove', (event) => {
    const now = performance.now();
    if (now - lastStarTime < 38) return;
    lastStarTime = now;
    createStar(event.clientX, event.clientY, 0.72 + Math.random() * 0.52);
  });

  window.addEventListener('click', (event) => {
    for (let i = 0; i < 8; i += 1) {
      const angle = (Math.PI * 2 * i) / 8;
      const distance = 12 + Math.random() * 18;
      createStar(
        event.clientX + Math.cos(angle) * distance,
        event.clientY + Math.sin(angle) * distance,
        0.84 + Math.random() * 0.44
      );
    }
  });
}

const defaultGlowSelector = '.card, .hero-point, .scene-card, .portrait-card, .panel-card, .work-card, .article-card, .music-player, .music-side, .footer-card, .quick-card';
const glowSelector = isHomePage
  ? '.terminal-panel, .terminal-subsystem, .terminal-footer-card, .terminal-button'
  : defaultGlowSelector;

const glowCards = document.querySelectorAll(glowSelector);
glowCards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});
```

- [ ] **Step 4: 运行回归测试和脚本语法检查**

Run:
```bash
node --test tests/homepage-premium-terminal.test.js && node --check script.js
```

Expected:
- `node --test` 输出 4 passed / 0 failed
- `node --check script.js` 无输出并返回 0

- [ ] **Step 5: 提交交互层改动**

```bash
git add tests/homepage-premium-terminal.test.js script.js
git commit -m "refactor: tune homepage interactions for terminal ui"
```

### Task 4: 做最终验收并确认视觉目标达成

**Files:**
- Modify if needed: `index.html`
- Modify if needed: `style.css`
- Modify if needed: `script.js`
- Test: `tests/homepage-premium-terminal.test.js`

- [ ] **Step 1: 启动一个零依赖本地静态服务进行人工验收**

Run:
```bash
node --input-type=module -e "import { createServer } from 'node:http'; import { createReadStream, existsSync } from 'node:fs'; import { extname, join } from 'node:path'; const root = process.cwd(); const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json; charset=utf-8', '.mp3': 'audio/mpeg' }; createServer((req, res) => { const raw = req.url === '/' ? '/index.html' : req.url.split('?')[0]; const file = join(root, raw.replace(/^\//, '')); if (!existsSync(file)) { res.statusCode = 404; res.end('Not found'); return; } res.setHeader('content-type', types[extname(file)] || 'text/plain; charset=utf-8'); createReadStream(file).pipe(res); }).listen(4173, () => console.log('http://localhost:4173'));"
```

Expected:
```text
http://localhost:4173
```

- [ ] **Step 2: 按下面的首页验收清单逐项确认**

Manual checklist:
- 首页首屏第一眼是“角色主界面”，不是 landing page
- 左侧 dossier panel 是第一视觉焦点
- 右侧 route panel 是第二视觉焦点
- 页面已经移除旧的六宫格卡片入口气质
- 高亮是局部精确点亮，而不是满屏发光
- 首页没有樱花飘落和鼠标星星
- 导航条像 terminal bar，不像胶囊官网导航
- 手机宽度下（DevTools 390px）布局顺序为：角色面板 → 路线面板 → 子系统入口
- 日语和英文切换后，首页终端文案都能正确更新

- [ ] **Step 3: 跑最后一次自动回归**

Run:
```bash
node --test tests/homepage-premium-terminal.test.js && node --check script.js
```

Expected: 全部通过，无语法错误。

- [ ] **Step 4: 如果人工验收需要小修，立即补上并重新验证**

如果需要小修，优先只改以下位置：

```txt
index.html      仅改首页 terminal 结构
style.css       仅改 .terminal-*、.dossier-*、.route-*、.subsystem-*、.terminal-footer-* 相关选择器
script.js       仅改 isHomePage 守卫或翻译键
```

修完后重复：

```bash
node --test tests/homepage-premium-terminal.test.js && node --check script.js
```

Expected: 继续通过。

- [ ] **Step 5: 提交最终验收版本**

```bash
git add index.html style.css script.js tests/homepage-premium-terminal.test.js
git commit -m "feat: launch premium anime terminal homepage"
```

## Self-review

### Spec coverage

- 顶部 terminal bar：Task 1 + Task 2
- 左侧角色主面板：Task 1 + Task 2
- 右侧路线导航主视觉：Task 1 + Task 2
- 底部子系统入口替换旧六宫格：Task 1 + Task 2
- terminal footer：Task 1 + Task 2
- 更二次元、更高级但不后台：Task 2 + Task 4 人工验收
- 首页交互从装饰特效改为 terminal 反馈：Task 3
- 移动端成立：Task 2 + Task 4

结论：spec 无遗漏。

### Placeholder scan

- 没有占位词，也没有“后续再补”这类未定义执行内容
- 每个任务都给出了具体文件、代码、命令和预期结果

### Type consistency

整份计划统一使用以下类名和变量名：
- `data-page="home"`
- `terminal-shell`
- `terminal-bar`
- `terminal-panel`
- `dossier-panel`
- `route-panel`
- `subsystem-grid`
- `terminal-footer-card`
- `isHomePage`
- `glowSelector`

后续执行时不要改名，否则会让测试和实现脱节。
