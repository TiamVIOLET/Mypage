# Article Cover Adaptive Display Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make article covers automatically choose the best display mode based on the loaded image ratio.

**Architecture:** Keep the existing article rendering entry point in `content.js`, but change cover markup to include a blurred backdrop image and a foreground image. Add a small initializer that reads each foreground image's natural dimensions after load and applies ratio classes consumed by CSS. CSS then switches between immersive `cover` for horizontal images and complete `contain` display for square/portrait images.

**Tech Stack:** Static HTML site, vanilla JavaScript, CSS, existing `content.js` dynamic rendering, existing `style.css` visual system.

---

## File Structure

- Modify `D:/projects/MyPage/content.js`
  - Update `renderArticleCover(article, className)` to output the new layered cover DOM.
  - Add `classifyArticleCoverFrame(frame)` and `initArticleCoverFrames(root)` near the article rendering helpers.
  - Call `initArticleCoverFrames(container)` after article list render and `initArticleCoverFrames(content)` after detail render.
- Modify `D:/projects/MyPage/style.css`
  - Replace the existing simple `.article-card-cover img, .detail-article-cover img` rules with layered cover styles.
  - Add ratio-specific rules for `.is-landscape`, `.is-wide`, `.is-square`, `.is-portrait`, and `.is-error`.
  - Preserve current card heights and detail cover height.
- Verification only
  - Run the available test/build commands from `package.json` if present.
  - Manually verify by reading generated DOM expectations and checking the CSS class behavior.

---

### Task 1: Inspect available verification commands

**Files:**
- Read: `D:/projects/MyPage/package.json`

- [ ] **Step 1: Read package scripts**

Run: use the Read tool on `D:/projects/MyPage/package.json`.

Expected: Identify available commands such as `npm test` or `npm run build:articles`.

- [ ] **Step 2: Record commands for later verification**

Use the commands discovered in Step 1 for Task 4. Do not add new dependencies or scripts for this UI-only change.

---

### Task 2: Add adaptive article cover markup and classification

**Files:**
- Modify: `D:/projects/MyPage/content.js:587-589`
- Modify: `D:/projects/MyPage/content.js:691-722`
- Modify: `D:/projects/MyPage/content.js:813-874`

- [ ] **Step 1: Replace `renderArticleCover`**

Find the existing function:

```js
  const renderArticleCover = (article, className) => article.cover
    ? `<div class="${className}"><img src="${escapeHtml(article.cover)}" alt="${escapeHtml(article.title)}" /></div>`
    : '';
```

Replace it with:

```js
  const renderArticleCover = (article, className) => {
    const cover = normalizeString(article.cover, '').trim();
    if (!cover) return '';

    return `
      <div class="${className} article-cover-frame is-loading">
        <img class="article-cover-backdrop" src="${escapeHtml(cover)}" alt="" aria-hidden="true" loading="lazy" />
        <img class="article-cover-image" src="${escapeHtml(cover)}" alt="${escapeHtml(article.title)}" loading="lazy" />
      </div>
    `;
  };
```

- [ ] **Step 2: Add ratio classification helpers after `renderArticleCover`**

Immediately after the new `renderArticleCover`, add:

```js
  const classifyArticleCoverFrame = (frame) => {
    const image = frame.querySelector('.article-cover-image');
    if (!image) return;

    const applyRatioClass = () => {
      frame.classList.remove('is-loading', 'is-landscape', 'is-wide', 'is-square', 'is-portrait', 'is-error');

      const width = image.naturalWidth;
      const height = image.naturalHeight;
      if (!width || !height) {
        frame.classList.add('is-error');
        return;
      }

      const ratio = width / height;
      if (ratio >= 2.15) {
        frame.classList.add('is-wide');
      } else if (ratio >= 1.22) {
        frame.classList.add('is-landscape');
      } else if (ratio >= 0.82) {
        frame.classList.add('is-square');
      } else {
        frame.classList.add('is-portrait');
      }
    };

    const markError = () => {
      frame.classList.remove('is-loading', 'is-landscape', 'is-wide', 'is-square', 'is-portrait');
      frame.classList.add('is-error');
    };

    if (image.complete) {
      if (image.naturalWidth && image.naturalHeight) {
        applyRatioClass();
      } else {
        markError();
      }
      return;
    }

    image.addEventListener('load', applyRatioClass, { once: true });
    image.addEventListener('error', markError, { once: true });
  };

  const initArticleCoverFrames = (root = document) => {
    root.querySelectorAll('.article-cover-frame').forEach(classifyArticleCoverFrame);
  };
```

- [ ] **Step 3: Initialize covers after article list render**

In `renderArticlesPage`, after the existing line:

```js
    attachGlowEffect(container);
```

add:

```js
    initArticleCoverFrames(container);
```

This applies to the non-empty article list path.

- [ ] **Step 4: Initialize covers after article detail render**

In `renderArticleDetailPage`, near the end after:

```js
    attachGlowEffect(content);
    attachGlowEffect(nav);
```

add:

```js
    initArticleCoverFrames(content);
```

- [ ] **Step 5: Check for duplicate initialization calls**

Ensure `initArticleCoverFrames(container)` appears once in `renderArticlesPage` after rendering article cards, and `initArticleCoverFrames(content)` appears once in `renderArticleDetailPage` after rendering detail content.

---

### Task 3: Add layered adaptive cover styles

**Files:**
- Modify: `D:/projects/MyPage/style.css:1245-1272`

- [ ] **Step 1: Replace existing article cover image rules**

Find the existing block:

```css
.article-card-cover,
.detail-article-cover {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(10, 18, 34, 0.72);
}

.article-card-cover {
  height: 180px;
  margin-bottom: 18px;
  border-radius: 20px;
}

.detail-article-cover {
  grid-column: 1 / -1;
  height: min(46vw, 360px);
  border-radius: 24px;
}

.article-card-cover img,
.detail-article-cover img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  background: rgba(4, 9, 18, 0.42);
}
```

Replace it with:

```css
.article-card-cover,
.detail-article-cover {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
  background:
    radial-gradient(circle at 24% 18%, rgba(132, 199, 255, 0.18), transparent 34%),
    linear-gradient(135deg, rgba(5, 11, 24, 0.92), rgba(14, 30, 58, 0.82));
}

.article-card-cover {
  height: 180px;
  margin-bottom: 18px;
  border-radius: 20px;
}

.detail-article-cover {
  grid-column: 1 / -1;
  height: min(46vw, 360px);
  border-radius: 24px;
}

.article-cover-frame::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.08), transparent 38%, rgba(5, 10, 20, 0.18)),
    radial-gradient(circle at 76% 18%, rgba(255, 201, 138, 0.16), transparent 30%);
}

.article-cover-backdrop,
.article-cover-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.article-cover-backdrop {
  object-fit: cover;
  transform: scale(1.14);
  filter: blur(18px) saturate(1.12);
  opacity: 0;
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.article-cover-image {
  z-index: 1;
  object-fit: contain;
  background: transparent;
  transition: transform 0.3s ease, opacity 0.24s ease;
}

.article-cover-frame.is-loading .article-cover-image {
  opacity: 0;
}

.article-cover-frame.is-landscape .article-cover-image,
.article-cover-frame.is-wide .article-cover-image {
  object-fit: cover;
}

.article-cover-frame.is-square .article-cover-backdrop,
.article-cover-frame.is-portrait .article-cover-backdrop {
  opacity: 0.42;
}

.article-cover-frame.is-square .article-cover-image {
  object-fit: contain;
  transform: scale(0.96);
}

.article-cover-frame.is-portrait .article-cover-image {
  object-fit: contain;
  transform: scale(0.92);
}

.article-cover-frame.is-wide .article-cover-image {
  object-position: center;
}

.article-cover-frame.is-error .article-cover-backdrop,
.article-cover-frame.is-error .article-cover-image {
  display: none;
}
```

- [ ] **Step 2: Preserve hover compatibility**

No extra hover selector is needed. The existing `.article-card:hover` card lift remains responsible for interaction. Do not add per-image hover zoom, because it can make portrait covers feel cropped.

---

### Task 4: Verify behavior

**Files:**
- Read: `D:/projects/MyPage/package.json`
- Run commands discovered in Task 1.

- [ ] **Step 1: Run article data build if available**

If `package.json` includes `build:articles`, run:

```bash
npm run build:articles
```

Expected: Command exits successfully and `assets/data/articles.json` is regenerated or remains valid.

- [ ] **Step 2: Run tests if available**

If `package.json` includes `test`, run:

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 3: Verify JavaScript syntax with Node if no tests exist**

If no test script exists, run:

```bash
node --check content.js
```

Expected: No syntax errors.

- [ ] **Step 4: Verify expected CSS hooks exist**

Use the Grep tool to confirm these selectors exist in `D:/projects/MyPage/style.css`:

```text
.article-cover-frame.is-landscape .article-cover-image
.article-cover-frame.is-portrait .article-cover-image
.article-cover-frame.is-error .article-cover-image
```

Expected: All selectors are present.

- [ ] **Step 5: Verify expected JS hooks exist**

Use the Grep tool to confirm these identifiers exist in `D:/projects/MyPage/content.js`:

```text
classifyArticleCoverFrame
initArticleCoverFrames(container)
initArticleCoverFrames(content)
```

Expected: All identifiers are present.

---

## Self-Review

- Spec coverage: The plan covers adaptive DOM structure, ratio detection, CSS display modes, article list, article detail, loading failure, and verification.
- Placeholder scan: No placeholders, deferred implementation notes, or unspecified tests remain.
- Type consistency: The plan consistently uses `article-cover-frame`, `article-cover-backdrop`, `article-cover-image`, `classifyArticleCoverFrame`, and `initArticleCoverFrames`.
