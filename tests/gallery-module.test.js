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

test('default gallery uses real images copied into assets/gallery', () => {
  const content = read('content.js');
  const assetsDir = path.join(root, 'assets', 'gallery');
  const expectedImages = [
    'gallery-01.png',
    'gallery-02.png',
    'gallery-03.png',
    'gallery-04.png',
    'gallery-05.png',
    'gallery-06.png',
    'gallery-07.png'
  ];

  for (const image of expectedImages) {
    assert.ok(fs.existsSync(path.join(assetsDir, image)), `${image} should exist in assets/gallery`);
    assert.match(content, new RegExp(`\\./assets/gallery/${image}`), `${image} should be referenced by default gallery data`);
  }
  assert.doesNotMatch(content, /src: '', tone:/, 'default gallery should not use gradient placeholders');
  assert.doesNotMatch(content, /cover: '\.\/brand-avatar\.jpg'/, 'default gallery should not use the old brand avatar as the cover');
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
