const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT_DIR, 'content', 'articles');
const OUTPUT_FILE = path.join(ROOT_DIR, 'assets', 'data', 'articles.json');
const LANGS = ['zh-CN', 'ja', 'en'];
const REQUIRED_FIELDS = ['title', 'category', 'summary'];

const readDirectories = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
};

const parseScalar = (value) => value.trim().replace(/^['"]|['"]$/g, '');

const parseFrontMatter = (filePath) => {
  const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${filePath} 缺少 front matter。`);

  const data = {};
  const lines = match[1].split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) continue;
    const matched = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!matched) throw new Error(`${filePath} front matter 第 ${index + 1} 行格式错误。`);

    const [, key, rawValue] = matched;
    if (rawValue.trim()) {
      data[key] = parseScalar(rawValue);
      continue;
    }

    const list = [];
    while (lines[index + 1]?.match(/^\s+-\s+/)) {
      index += 1;
      list.push(parseScalar(lines[index].replace(/^\s+-\s+/, '')));
    }
    data[key] = list;
  }

  if ('tags' in data && !Array.isArray(data.tags)) {
    throw new Error(`${filePath} 的 tags 必须是数组。`);
  }

  return { meta: data, body: match[2].trim() };
};

const parseSections = (body) => {
  const content = String(body || '').trim();
  if (!content) return [];

  return content
    .split(/\n(?=##\s*)/)
    .map((chunk, index) => {
      const text = chunk.trim();
      if (!text) return null;
      const matched = text.match(/^##\s*(.+?)(?:\n+|$)([\s\S]*)$/);
      if (matched) {
        return {
          title: matched[1].trim() || `正文 ${index + 1}`,
          content: matched[2].trim()
        };
      }
      return {
        title: `正文 ${index + 1}`,
        content: text
      };
    })
    .filter(Boolean);
};

const buildTranslation = (filePath, isPrimary) => {
  const { meta, body } = parseFrontMatter(filePath);
  if (isPrimary) {
    const missing = REQUIRED_FIELDS.filter((field) => !String(meta[field] || '').trim());
    if (missing.length) throw new Error(`${filePath} 缺少必填字段：${missing.join(', ')}`);
  }

  return {
    title: String(meta.title || '').trim(),
    date: String(meta.date || '').trim(),
    category: String(meta.category || '').trim(),
    summary: String(meta.summary || '').trim(),
    tags: Array.isArray(meta.tags) ? meta.tags.filter(Boolean) : [],
    cover: String(meta.cover || '').trim(),
    body,
    sections: parseSections(body)
  };
};

const articles = readDirectories(ARTICLES_DIR).map((slug) => {
  const articleDir = path.join(ARTICLES_DIR, slug);
  const primaryFile = path.join(articleDir, 'zh-CN.md');
  if (!fs.existsSync(primaryFile)) {
    console.warn(`跳过 ${slug}：缺少 zh-CN.md。`);
    return null;
  }

  const translations = {};
  LANGS.forEach((lang) => {
    const filePath = path.join(articleDir, `${lang}.md`);
    if (fs.existsSync(filePath)) translations[lang] = buildTranslation(filePath, lang === 'zh-CN');
  });

  return { id: slug, slug, translations };
}).filter(Boolean);

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(articles, null, 2)}\n`, 'utf8');
console.log(`Generated ${path.relative(ROOT_DIR, OUTPUT_FILE)} with ${articles.length} articles.`);
