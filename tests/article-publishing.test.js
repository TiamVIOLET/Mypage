import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('AI Chef Mate article is published in Chinese, Japanese, and English without dates', () => {
  const articleDir = path.join(root, 'content', 'articles', 'ai-personalized-diet-nutrition-system');

  for (const lang of ['zh-CN', 'ja', 'en']) {
    const file = path.join(articleDir, `${lang}.md`);
    assert.ok(fs.existsSync(file), `${lang}.md should exist`);
    const source = fs.readFileSync(file, 'utf8');
    assert.match(source, /^---\n[\s\S]*title:/, `${lang}.md should have front matter title`);
    assert.match(source, /category: /, `${lang}.md should have category`);
    assert.match(source, /summary: /, `${lang}.md should have summary`);
    assert.match(source, /cover: \.\/assets\/gallery\/gallery-01\.png/, `${lang}.md should use the AI Chef Mate cover`);
    assert.match(source, /## /, `${lang}.md should have section headings`);
    assert.doesNotMatch(source, /^date:/m, `${lang}.md should not have a date field`);
  }
});

test('AI programming system article is published in Chinese, Japanese, and English without project names', () => {
  const articleDir = path.join(root, 'content', 'articles', 'ai-programming-system-overview');

  for (const lang of ['zh-CN', 'ja', 'en']) {
    const file = path.join(articleDir, `${lang}.md`);
    assert.ok(fs.existsSync(file), `${lang}.md should exist`);
    const source = fs.readFileSync(file, 'utf8');
    assert.match(source, /^---\n[\s\S]*title:/, `${lang}.md should have front matter title`);
    assert.match(source, /category: /, `${lang}.md should have category`);
    assert.match(source, /summary: /, `${lang}.md should have summary`);
    assert.match(source, /cover: \.\/assets\/gallery\/gallery-06\.png/, `${lang}.md should use the programming system cover`);
    assert.match(source, /## /, `${lang}.md should have section headings`);
    assert.doesNotMatch(source, /kook/i, `${lang}.md should not contain the original project name`);
  }
});

test('article build output contains six multilingual markdown articles', () => {
  const articles = JSON.parse(read('assets/data/articles.json'));

  assert.equal(articles.length, 6);
  assert.ok(articles.some((article) => article.id === 'ai-girlfriend-project-introduction'));
  assert.ok(articles.some((article) => article.id === 'ai-personalized-diet-nutrition-system'));
  assert.ok(articles.some((article) => article.id === 'ai-programming-system-overview'));
  for (const article of articles) {
    assert.ok(article.id, 'article should have an id');
    assert.ok(article.translations?.['zh-CN'], `${article.id} should have zh-CN translation`);
    assert.ok(article.translations?.ja, `${article.id} should have ja translation`);
    assert.ok(article.translations?.en, `${article.id} should have en translation`);
    assert.ok(article.translations['zh-CN'].sections.length >= 1, `${article.id} should have sections`);
  }
});

test('AI Chef Mate generated article keeps empty dates and complete sections', () => {
  const articles = JSON.parse(read('assets/data/articles.json'));
  const article = articles.find((item) => item.id === 'ai-personalized-diet-nutrition-system');

  assert.ok(article, 'AI Chef Mate article should be generated');
  for (const lang of ['zh-CN', 'ja', 'en']) {
    const translation = article.translations?.[lang];
    assert.ok(translation, `${lang} translation should exist`);
    assert.equal(translation.date, '', `${lang} date should be empty`);
    assert.match(translation.summary, /AI Chef Mate/, `${lang} summary should mention AI Chef Mate`);
    assert.ok(translation.sections.length >= 7, `${lang} should have complete sections`);
  }
});

test('article list read buttons use direct reading labels in every language', () => {
  const content = read('content.js');

  assert.match(content, /readMore: '阅读文章'/);
  assert.match(content, /readMore: '記事を読む'/);
  assert.match(content, /readMore: 'Read article'/);
});

test('content script loads generated article JSON and rerenders after it arrives', () => {
  const content = read('content.js');

  assert.match(content, /const ARTICLE_DATA_URL = '\.\/assets\/data\/articles\.json'/);
  assert.match(content, /let generatedArticles = null/);
  assert.match(content, /fetch\(ARTICLE_DATA_URL\)/);
  assert.match(content, /renderAllDynamicContent\(\)/);
});

test('content script maps generated article translations with language fallback', () => {
  const content = read('content.js');

  assert.match(content, /const getGeneratedArticlesForCurrentLang =/);
  assert.match(content, /translations\?\.\[lang\] \|\| translations\?\.\['zh-CN'\]/);
  assert.match(content, /sections: Array\.isArray\(translation\.sections\)/);
  assert.match(content, /cover: normalizeString\(translation\.cover/);
  assert.match(content, /tags: normalizeTextList\(translation\.tags\)/);
});

test('article pages render non-empty metadata and skip empty date spans', () => {
  const content = read('content.js');

  assert.match(content, /const renderArticleMeta = \(\.\.\.items\) => \{/);
  assert.match(content, /\.filter\(Boolean\)/);
  assert.match(content, /renderArticleMeta\(ui\.emptyArticleMetaLabel, ui\.emptyArticleMetaStatus\)/);
  assert.match(content, /renderArticleMeta\(article\.category, article\.date\)/);
  assert.doesNotMatch(content, /<span>\$\{escapeHtml\(article\.date\)\}<\/span>/);
});

test('article pages render adaptive covers and tags from article data', () => {
  const content = read('content.js');
  const css = read('style.css');

  assert.match(content, /renderArticleCover\(article, 'article-card-cover'\)/);
  assert.match(content, /renderTagList\(article\.tags\)/);
  assert.match(content, /renderArticleCover\(article, 'detail-article-cover'\)/);
  assert.match(content, /article\.sections/);

  for (const token of [
    'article-cover-frame is-loading',
    'article-cover-backdrop',
    'article-cover-image',
    'const classifyArticleCoverFrame =',
    'const initArticleCoverFrames =',
    'initArticleCoverFrames(container)',
    'initArticleCoverFrames(content)'
  ]) {
    assert.match(content, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing ${token}`);
  }

  for (const selector of [
    '.article-card-cover',
    '.article-card-tags',
    '.detail-article-cover',
    '.article-cover-frame.is-landscape .article-cover-image',
    '.article-cover-frame.is-wide .article-cover-image',
    '.article-cover-frame.is-square .article-cover-backdrop',
    '.article-cover-frame.is-portrait .article-cover-image',
    '.article-card-cover.article-cover-frame.is-portrait .article-cover-image',
    '.detail-article-cover.article-cover-frame.is-portrait .article-cover-image',
    '.article-cover-frame.is-error .article-cover-image'
  ]) {
    assert.match(css, new RegExp(selector.replace(/\./g, '\\.')), `missing ${selector}`);
  }

  assert.match(css, /\.article-card-cover\.article-cover-frame\.is-portrait \.article-cover-image \{[\s\S]*height: 116%;[\s\S]*object-fit: cover/);
  assert.match(css, /\.detail-article-cover\.article-cover-frame\.is-portrait \.article-cover-image \{[\s\S]*height: 106%;[\s\S]*object-fit: cover/);
  assert.doesNotMatch(css, /\.article-cover-frame\.is-portrait \.article-cover-image \{[\s\S]*transform: scale\(0\.92\)/);
});

test('tag list renderer tolerates articles without tags before JSON loads', () => {
  const content = read('content.js');

  assert.match(content, /const renderTagList = \(items\) => \{\s*const tags = Array\.isArray\(items\) \? items : \[\];/);
});

test('content script ignores legacy localStorage article edits', () => {
  const content = read('content.js');

  assert.doesNotMatch(content, /if \('articles' in value\)/);
  assert.doesNotMatch(content, /base\.articles = normalizeArticles\(value\.articles/);
});

test('editor no longer exposes local article editing controls', () => {
  const editor = read('editor.html');
  const content = read('content.js');

  for (const id of [
    'article-select',
    'article-new',
    'article-title',
    'article-category',
    'article-date',
    'article-summary',
    'article-body',
    'article-save'
  ]) {
    assert.doesNotMatch(editor, new RegExp(`id="${id}"`), `editor should not include #${id}`);
    assert.doesNotMatch(content, new RegExp(`getElementById\\('${id}'\\)`), `content.js should not query #${id}`);
  }

  assert.match(editor, /content\/articles\/&lt;slug&gt;\/&lt;lang&gt;\.md/);
  assert.match(editor, /npm run build:articles/);
});
