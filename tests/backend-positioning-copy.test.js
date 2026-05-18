import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const displayFiles = [
  'index.html',
  'profile.html',
  'about.html',
  'works.html',
  'articles.html',
  'contact.html',
  'content.js',
  'script.js'
];

test('site display copy uses backend development positioning instead of frontend positioning', () => {
  const displayCopy = displayFiles.map(read).join('\n');

  for (const token of [
    '前端',
    'Frontend',
    'フロントエンド'
  ]) {
    assert.doesNotMatch(displayCopy, new RegExp(token), `display copy should not contain ${token}`);
  }

  for (const token of [
    '后端',
    'Backend',
    'バックエンド'
  ]) {
    assert.match(displayCopy, new RegExp(token), `display copy should contain ${token}`);
  }
});

test('generated and uploaded articles are outside the backend positioning rewrite', () => {
  const generatedArticles = read('assets/data/articles.json');

  assert.match(generatedArticles, /AI Chef Mate/);
  assert.match(generatedArticles, /ai-programming-system-overview/);
});
