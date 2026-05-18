import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('profile skill tree presents backend development abilities', () => {
  const html = read('profile.html');
  const script = read('script.js');

  for (const token of [
    'Backend Development',
    'Java &amp; PHP',
    'Python &amp; AI',
    'Microservices &amp; Distributed Systems'
  ]) {
    assert.match(html, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `profile.html should include ${token}`);
  }

  assert.match(html, /92 \/ 100/);
  assert.match(html, /90 \/ 100/);
  assert.match(html, /88 \/ 100/);
  assert.match(html, /86 \/ 100/);
  assert.match(script, /主要技能点在后端开发/);
  assert.match(script, /熟悉用 Java 和 PHP 构建业务服务/);
  assert.match(script, /会用 Python 处理自动化、数据与 AI 相关能力/);
  assert.match(script, /理解微服务与分布式系统的拆分、通信和稳定性设计/);
  assert.doesNotMatch(script, /页面氛围感/);
  assert.doesNotMatch(script, /Backend Mood Sense/);
});
