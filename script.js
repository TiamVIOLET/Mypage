const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const langButtons = Array.from(document.querySelectorAll('.lang-btn'));
const body = document.body;

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
if (sakuraLayer) {
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

const glowCards = document.querySelectorAll('.card, .hero-point, .scene-card, .portrait-card, .panel-card, .work-card, .article-card, .music-player, .music-side, .footer-card, .quick-card');
glowCards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });
revealItems.forEach((item) => revealObserver.observe(item));

const translations = {
  'zh-CN': {
    pageTitle: 'Asa 的蓝色系二次元小站',
    pageDescription: 'Asa 的个人小站：动漫、编程、蓝色夜景，还有一点慢热社恐 i 人的心情。',
    brand: { name: 'Asa', tagline: '爱看番也爱敲代码的蓝色系社恐 i 人' },
    nav: { home: '首页', profile: '角色档案', about: '关于我', works: '作品', music: '音乐', articles: '文章', contact: '联系' },
    common: {
      homeIntroBadge: 'Blue anime mood',
      detail: '去看详情', preview: '项目预览', browse: '浏览作品', read: '继续往下看', top: '回到顶部', playMusic: '播放音乐', viewSetting: '看看设定', enterPage: '进入页面',
      musicPlay: '播放 BGM', musicPause: '暂停 BGM', musicRestart: '重新开始', musicVolume: '音量',
      musicMiniPlayer: '悬浮音乐', previousTrack: '上一首', nextTrack: '下一首', openMusicPage: '打开音乐页',
      projectConcept: '项目概念', visualFocus: '视觉重点', useCases: '适合的使用场景', projectTypeLabel: '项目类型', keywordsLabel: '关键词', visualMoodLabel: '画面气质', recommendedUsageLabel: '推荐用途', previousWork: '上一篇作品', nextWork: '下一页作品', backToWorks: '返回作品展台'
    },
    home: {
      title: '我是 Asa，<span>一个爱看番也爱敲代码的社恐 i 人。</span>',
      desc: '现实里的我其实很慢热，也不太擅长热闹地开场白。所以我把喜欢的蓝色夜景、电车、耳机、星光和一点点番剧感，都慢慢写进这个小站里。与其说它是在介绍我，不如说它更像一本属于我的设定集。',
      button1: '先看我的角色档案', button2: '看看我最近在做什么',
      p1t: '我喜欢的东西', p1d: '动漫、蓝色夜景、列车进站前的风、耳机里的片头曲，还有那种安安静静却会发光的画面。',
      p2t: '我写代码的方式', p2d: '我很喜欢把页面写得像番剧分镜，哪怕只是一个按钮，也想让它看起来像会被记住的小细节。',
      p3t: '我想留下的感觉', p3d: '不是很吵闹，也不是很张扬，而是那种会让人停一下、然后觉得“这个人好像有点可爱”的氛围。',
      sceneChip: 'OPENING SCENE · ASA', sceneTitle: "Asa's Mood", sceneDesc: '如果现实里的我不太敢先开口，那就让这个页面先替我说一句“你好”。', stationTitle: '蓝色小站 · Asa', station1: '下一站：角色档案 / 作品 / 音乐 / 文章', station2: 'Slow introvert line',
      mapBadge: 'My map', mapTitle: '如果你想更快认识我', mapDesc: '下面这些页面就像我的不同侧面：有设定、有碎碎念、有作品，也有我藏在蓝色夜景里的情绪。',
      c1t: '角色档案', c1d: '这里像角色卡，能看到我的设定、状态、偏爱属性，还有一点点隐藏技能。',
      c2t: '关于我', c2d: '会写我喜欢的番、喜欢的蓝色，还有那些不太会当面讲出来的小心思。',
      c3t: '作品展示', c3d: '我把做过的页面和正在慢慢养成的企划都放在这里，像一格格自己的分镜本。',
      c4t: '音乐播放器', c4d: '写代码或者发呆的时候，我很需要这种像片头曲一样的 BGM 来陪我。',
      c5t: '文章小手账', c5d: '这里是我的做站笔记、追番联想和一些有点中二、但我很认真的记录。',
      c6t: '联系小卡片', c6d: '如果你也喜欢动漫、蓝色夜景或者代码，可以从这里慢慢找到我。',
      ftBadge: 'Asa', ftTitle: '谢谢你路过我的蓝色小宇宙', ftDesc: '如果你能从这里感受到一点番剧感、一点夜风感，或者一点属于 Asa 的慢热心情，那它就已经完成了自己的任务。', ftInfoTitle: '我的关键词', ftInfoDesc: '动漫 / 编程 / 蓝色 / 电车 / 夜景 / 社恐 i 人 / 片头曲脑袋'
    },
    profile: {
      badge: 'Character archive', title: 'Asa 的角色档案<span>与蓝色系设定板</span>', desc: '如果把我写成日漫里的角色，大概就是那种平时安静、总戴着耳机、喜欢蓝色夜景和电车、看起来很好相处但很难主动开口的类型。',
      tag1: 'MAIN CHARACTER · ASA', tag2: 'BLUE HOUR / AFTER SCHOOL', name: 'Asa',
      meta1L: '角色属性', meta1V: '爱看番也爱敲代码的社恐 i 人', meta2L: '关键词', meta2V: '蓝色、夜景、电车、耳机、代码', meta3L: '隐藏属性', meta3V: '慢热、宅、细节控、很容易被 ED 戳中',
      worldTitle: '我的世界观小设定', worldDesc: '如果把我的日常拍成一集偏安静的番外，大概就是放学后或忙完一天以后，戴着耳机走在蓝色晚空下面，然后回家继续追番、写代码、改页面的那种节奏。',
      w1l: '舞台', w1v: '雨后城市、电车站台、安静房间和发光屏幕', w2l: '时间', w2v: '傍晚到深夜，是我最喜欢的时段', w3l: '主色', w3v: '蓝色系，最好再带一点冷冷的光', w4l: '情绪', w4v: '安静、慢热、有点距离感，但很认真',
      statusTitle: 'Asa 今日状态', statusDesc: '这一块就像主角状态栏，能看到我最近在想什么、偏爱什么，以及脑内常驻的小情绪。',
      s1l: '当前主线', s1v: '把喜欢的东西都慢慢写进自己的页面里', s2l: '常用技能', s2v: '前端实现 / 氛围塑造 / 一个人默默打磨细节', s3l: '隐藏加成', s3v: '看到高质量片头、蓝色夜景和电车镜头会直接心动暴击',
      skillTitle: '技能树', skillDesc: '我的技能点大概都点在了“页面氛围感”和“把喜欢的番剧感偷偷塞进设计里”。',
      k1d: '我很喜欢把页面写得干净又细腻，像把一张静态画面慢慢修到刚刚好。', k2d: '我会本能地去捕捉那种日漫里常见的蓝色夜空、风、灯光和电车感。', k3d: '我偏爱轻一点、柔一点的动效，不想太吵，但希望每个细节都有呼吸感。', k4d: '比起热闹地表达，我更喜欢让页面替我慢慢说话，这也是我最习惯的自我介绍方式。'
    },
    about: {
      badge: 'About me', title: '关于我<span>与一些不太会当面说的话</span>', desc: '如果现实里的我不太擅长主动介绍自己，那这里就是最适合让我慢慢开口的地方。',
      mainTitle: '我是 Asa，一个爱看番也爱敲代码的社恐 i 人', mainDesc: '如果一定要用一句话形容我，那大概就是：喜欢动漫、喜欢蓝色、喜欢夜景、喜欢一个人安静写代码的人。比起热热闹闹地介绍自己，我更习惯把喜欢的东西慢慢塞进页面里。所以这个站点里的很多情绪，其实都很像我本人——慢热、安静，但会在细节里偷偷发光。', quote: '“我不太擅长大声表达自己，所以就让页面替我说话吧。”',
      sideTitle: '我的偏爱清单', sideDesc: '我会被很多日漫里的画面轻易戳到：黄昏时的电车、放学后的天桥、夜里发蓝的天空、街灯刚亮起来的瞬间、耳机里刚好响起的片头曲，还有那种看起来安静、其实情绪很多的角色。',
      a1l: '喜欢的颜色', a1v: '蓝色，越接近夜空越喜欢', a2l: '日常状态', a2v: '慢热社恐 i 人，熟了以后会话多一点', a3l: '最容易心动的元素', a3v: '电车、夜景、耳机、风、片头曲', a4l: '写页面时最在意的东西', a4v: '气氛、节奏感，还有“像不像一格分镜”'
    },
    works: {
      badge: 'Portfolio', title: '我做的页面<span>和一些想留住的气氛</span>', desc: '这些作品不只是功能练习，更像是我把喜欢的番剧感、蓝色夜景和代码整理成页面之后留下来的小分镜。',
      c1label: 'Project 01 · Twilight Platform', c1m1: '个人站', c1m2: '黄昏电车', c1t: '我心里的黄昏站台首页', c1d: '这是我很想留下来的那种画面：晚霞还没完全退掉，列车快要进站，整个页面像番剧片头一样安静地亮着。', c1a2: '相关手记',
      c2label: 'Project 02 · After Rain Bridge', c2m1: '情绪专题', c2m2: '雨后城市', c2t: '雨后天桥的蓝色心事', c2d: '我很喜欢雨刚停下来的城市，所以做了这一页：有玻璃反光、路灯、潮湿空气，也有那种说不出来的安静感。',
      c3label: 'Project 03 · Last Train Seaside', c3m1: '故事页', c3m2: '海边终电', c3t: '海边末班列车小剧场', c3d: '这一页更像我脑内的小动画镜头：海风、晚霞、轨道和即将离站的感觉，组合起来就是我最喜欢的那种故事氛围。', c3a2: '配上片头曲'
    },
    music: {
      badge: 'Opening theme', title: '我的 BGM 页面<span>和一点片头曲脑补</span>', desc: '我看番的时候总会特别记片头和片尾，所以写页面的时候，也很想给自己的小站留一段属于 Asa 的 BGM 氛围。',
      note: '这里会播放 assets/music 目录里的本地 mp3，切歌、循环和音量都按当前列表工作。', sideTitle: '我喜欢一边听一边发呆', sideDesc: '不管是写代码、改页面，还是单纯放空，我都很需要一段能把情绪慢慢托起来的 BGM。最好是那种一响起来，脑子里就自动出现夜空、电车和蓝色灯光的旋律。',
      lyric1: '“我总觉得，傍晚的风和片头曲前奏是同一种东西。”', lyric2: '“耳机一戴上，现实的声音就会退远一点，我自己的世界也会亮起来一点。”', lyric3: '“如果一个页面也有 BGM，那它大概就更像一集属于我的番外了。”'
    },
    articles: {
      badge: 'Articles', title: '我的文章小手账<span>和一些认真碎碎念</span>', desc: '这里会放我关于动漫、页面、代码和情绪的小记录。很多话我现实里不太会说，但我会写下来。',
      c1m1: '追番感想 / 设计随笔', c1t: '为什么我做页面时，总会忍不住想起日漫里的蓝色黄昏', c1d: '对我来说，很多页面的灵感其实不是来自“网页设计趋势”，而是来自动漫里那些黄昏、电车和安静夜空的镜头。',
      c2m1: '前端记录', c2t: '我为什么会喜欢把前端页面写得像一张动漫分镜', c2d: '比起单纯把内容堆出来，我更喜欢让页面像有镜头语言一样慢慢展开。',
      c3m1: '碎碎念 / 创作记录', c3t: '一个社恐 i 人，到底为什么还要认真做个人主页', c3d: '也许正因为我不太擅长当面表达，所以才更想认真做一个能替我说话的页面。'
    },
    contact: {
      badge: 'Contact', title: '联系我<span>和一些补充说明</span>', desc: '如果你也喜欢动漫、代码、蓝色夜景或者电车镜头，可以从这里慢慢找到我。',
      s1t: '我现在的小站状态', s1d: '这个站点现在已经是多页面结构了，每一页都像我自己的小设定分支。对我来说，它不是单纯放信息的地方，而是一个可以把“我喜欢什么、我在想什么、我会怎么表达”慢慢整理出来的小空间。',
      s2t: '我还想慢慢加上的东西', s2d: '后面我还想继续往这个站里塞更多属于我的东西，比如更完整的追番偏好、真正的作品详情、更多文章记录，也许还有一个安静的小留言角落。',
      st1l: '最想补完的模块', st1v: '时间轴 / 相册 / 留言页', st2l: '内容方向', st2v: '真实作品 / 追番碎碎念 / 编程记录', st3l: '页面气氛', st3v: '蓝色、夜景、列车、安静的番剧感', st4l: '未来部署', st4v: 'GitHub Pages / Vercel / Netlify'
    },
    detailWorks: {
      p1Title: '我心里的黄昏站台首页', p1Desc: '这是我很想留下来的那种画面：晚霞还没完全退掉，列车快要进站，整个页面像番剧片头一样安静地亮着。',
      p2Title: '雨后天桥的蓝色心事', p2Desc: '我很喜欢雨刚停下来的城市，所以做了这一页：有玻璃反光、路灯、潮湿空气，也有那种说不出来的安静感。',
      p3Title: '海边末班列车小剧场', p3Desc: '这一页更像我脑内的小动画镜头：海风、晚霞、轨道和即将离站的感觉，组合起来就是我最喜欢的那种故事氛围。'
    },
    detailArticles: {
      a1Title: '为什么我做页面时，总会忍不住想起日漫里的蓝色黄昏', a1Desc: '对我来说，很多页面的灵感其实不是来自“网页设计趋势”，而是来自动漫里那些黄昏、电车和安静夜空的镜头。',
      a2Title: '我为什么会喜欢把前端页面写得像一张动漫分镜', a2Desc: '比起单纯把内容堆出来，我更喜欢让页面像有镜头语言一样慢慢展开。',
      a3Title: '一个社恐 i 人，到底为什么还要认真做个人主页', a3Desc: '也许正因为我不太擅长当面表达，所以才更想认真做一个能替我说话的页面。'
    },
    tracks: [
      { title: 'more than words', subtitle: '羊文学', chip: 'more than words' }
    ],
    alerts: { webAudioUnsupported: '当前浏览器不支持 Web Audio API。', audioLoadFailed: '本地音频加载失败。请把 mp3 放到 assets/music 目录，或修改 script.js 里的歌曲路径。' }
  },
  ja: {
    pageTitle: 'アニメとコーディングが好きな Asa の個人サイト',
    pageDescription: 'Asa の個人サイト。アニメ、コーディング、青い夜景、そして少し内向的な気分をまとめた場所。',
    brand: { name: 'Asa', tagline: 'アニメもコードも好きな青系の内向型' },
    nav: { home: 'ホーム', profile: 'キャラ設定', about: '私について', works: '作品', music: '音楽', articles: '記事', contact: '連絡先' },
    common: {
      homeIntroBadge: '青いアニメムード', detail: '詳細を見る', preview: 'プレビュー', browse: '作品を見る', read: '続きを読む', top: 'トップへ戻る', playMusic: '音楽を再生', viewSetting: '設定を見る', enterPage: 'ページへ',
      musicPlay: 'BGM を再生', musicPause: 'BGM を停止', musicRestart: '最初から', musicVolume: '音量',
      musicMiniPlayer: 'フローティング音楽', previousTrack: '前の曲', nextTrack: '次の曲', openMusicPage: '音楽ページを開く',
      projectConcept: 'コンセプト', visualFocus: 'ビジュアルのポイント', useCases: '向いている使い方', projectTypeLabel: 'プロジェクトタイプ', keywordsLabel: 'キーワード', visualMoodLabel: '画面の空気感', recommendedUsageLabel: 'おすすめ用途', previousWork: '前の作品', nextWork: '次の作品', backToWorks: '作品一覧へ戻る'
    },
    home: {
      title: '私は Asa。<span>アニメもコードも好きな、少し人見知りな i 人です。</span>',
      desc: '現実の私はかなりスロースターターで、にぎやかな自己紹介は少し苦手です。だからこそ、好きな青い夜景、電車、イヤホン、星の光、そして少しアニメっぽい空気をこのサイトにゆっくり詰め込みました。これは自己紹介というより、私の設定集みたいなものです。',
      button1: 'キャラ設定を見る', button2: '最近作ったものを見る',
      p1t: '好きなもの', p1d: 'アニメ、青い夜景、電車が来る前の風、イヤホンの中の OP、そして静かに光る画面。',
      p2t: 'コードを書くときの感覚', p2d: 'ページをただ組むのではなく、アニメのカットみたいに見せたいと思っています。',
      p3t: '残したい雰囲気', p3d: 'うるさくなく、目立ちすぎず、でも少しだけ「この人かわいいかも」と思ってもらえる空気。',
      sceneChip: 'オープニングシーン · ASA', sceneTitle: 'Asa のムード', sceneDesc: '現実の私が先に話しかけられないなら、このページに先に「こんにちは」と言ってもらおうと思いました。', stationTitle: '青い小さな駅 · Asa', station1: '次の駅：プロフィール / 作品 / 音楽 / 記事', station2: 'ゆっくり内向線',
      mapBadge: 'マイマップ', mapTitle: 'もっと私を知りたいなら', mapDesc: '下のページたちは、私のいろんな側面みたいなものです。設定も、作品も、気持ちも、少しずつここに置いてあります。',
      c1t: 'キャラ設定', c1d: '私の設定、状態、好きなもの、隠しスキルまで見られます。',
      c2t: '私について', c2d: '好きなアニメや青色、口では言いにくい小さな気持ちを書いています。',
      c3t: '作品', c3d: '作ったページや育てている企画を、自分だけの絵コンテみたいに並べています。',
      c4t: '音楽', c4d: 'コードを書くときも、ぼーっとするときも、OP みたいな BGM が必要です。',
      c5t: '記事', c5d: 'サイト制作の記録やアニメからの連想、少しだけ中二っぽい真面目なメモもここにあります。',
      c6t: '連絡先', c6d: 'アニメ、青い夜景、コードが好きなら、ここからゆっくり見つけてください。',
      ftBadge: 'Asa', ftTitle: '青い小宇宙に来てくれてありがとう', ftDesc: 'ここから少しでもアニメっぽさや夜風の感じ、あるいは Asa のゆっくりした気持ちが伝わったなら、それだけで十分です。', ftInfoTitle: 'キーワード', ftInfoDesc: 'アニメ / コーディング / 青 / 電車 / 夜景 / 内向型 / OP 脳'
    },
    profile: {
      badge: 'キャラクターアーカイブ', title: 'Asa のキャラ設定<span>と青い設定ボード</span>', desc: 'もし私が日常系アニメのキャラだったら、たぶん静かで、いつもイヤホンをしていて、青い夜景と電車が好きで、話しかけやすそうなのに自分からはなかなか話せないタイプだと思います。',
      tag1: 'MAIN CHARACTER · ASA', tag2: 'BLUE HOUR / AFTER SCHOOL', name: 'Asa',
      meta1L: '属性', meta1V: 'アニメもコードも好きな内向型', meta2L: 'キーワード', meta2V: '青、夜景、電車、イヤホン、コード', meta3L: '隠し属性', meta3V: 'スロースターター、オタク、細部好き、ED に弱い',
      worldTitle: '私の小さな世界観', worldDesc: 'もし私の日常が静かな番外編になるなら、たぶん夕方や夜にイヤホンをして青い空の下を歩き、そのあと家でアニメを見たりコードを書いたりする、そんなテンポです。',
      w1l: '舞台', w1v: '雨上がりの街、電車のホーム、静かな部屋、光る画面', w2l: '時間', w2v: '夕方から深夜までが一番好き', w3l: '色', w3v: '青系、特に夜空に近い色', w4l: '感情', w4v: '静か、ゆっくり、少し距離感、でも真面目',
      statusTitle: '今日の Asa', statusDesc: 'ここは主人公のステータス欄みたいなもの。最近考えていることや、好きなものが見えます。',
      s1l: '現在のメインクエスト', s1v: '好きなものをページの中に少しずつ書き込むこと', s2l: 'よく使うスキル', s2v: 'フロントエンド実装 / 雰囲気づくり / 一人で細部を整えること', s3l: '隠し補正', s3v: '良い OP、青い夜景、電車のカットを見るとすぐに心が動く',
      skillTitle: 'スキルツリー', skillDesc: '私のスキルポイントは、たぶん“空気感のあるページ”と“好きなアニメっぽさをそっと入れること”に振られています。',
      k1d: 'ページをきれいに、細かく整える作業がすごく好きです。', k2d: 'アニメに出てくる青い空、風、光、電車の感じを自然に拾ってしまいます。', k3d: '派手な動きより、呼吸するような柔らかい動きを好みます。', k4d: '自分で多くを話すより、ページに少しずつ語ってもらう方が得意です。'
    },
    about: {
      badge: '私について', title: '私について<span>と、口では言いにくいこと</span>', desc: '現実の私が自己紹介をうまくできないなら、ここがその代わりになります。',
      mainTitle: '私は Asa。アニメもコードも好きな、少し人見知りな i 人です。', mainDesc: '一言で言えば、アニメが好きで、青が好きで、夜景が好きで、一人で静かにコードを書くのが好きな人です。にぎやかに自分を説明するよりも、好きなものをページに少しずつ入れていく方が、私らしいと感じます。このサイトの雰囲気そのものが、かなり私に近いです。', quote: '「自分でうまく話せないなら、ページに少しずつ代わりに話してもらえばいい。」',
      sideTitle: '好きなものリスト', sideDesc: '夕方の電車、放課後の歩道橋、夜に青くなる空、街灯がつく瞬間、イヤホンから流れる OP、そして静かそうなのに感情をたくさん抱えているキャラ。そんなものにすぐ心を持っていかれます。',
      a1l: '好きな色', a1v: '青。夜空に近いほど好き', a2l: '普段の状態', a2v: '人見知りの i 人、仲良くなると少し話せる', a3l: '弱い要素', a3v: '電車、夜景、イヤホン、風、OP', a4l: 'ページで大事にすること', a4v: '空気感、テンポ、“カットっぽさ”'
    },
    works: {
      badge: 'ポートフォリオ', title: '作ったページ<span>と残しておきたい空気</span>', desc: 'ここにある作品は、機能の練習だけではなく、私の好きな青い夜景やアニメっぽさをページにした小さなカット集です。',
      c1label: 'Project 01 · Twilight Platform', c1m1: '個人サイト', c1m2: '夕方の電車', c1t: '私の中の黄昏ホーム', c1d: '夕焼けが消えきる前、列車が来る直前の静かな空気を残したかったページです。', c1a2: '関連メモ',
      c2label: 'Project 02 · After Rain Bridge', c2m1: '感情特集', c2m2: '雨上がりの街', c2t: '雨上がりの歩道橋の青い気持ち', c2d: 'ガラスの反射、街灯、湿った空気。そんな“雨が止んだ直後の街”が好きで作りました。',
      c3label: 'Project 03 · Last Train Seaside', c3m1: '物語ページ', c3m2: '海辺の終電', c3t: '海辺の終電ミニシアター', c3d: '海風、夕焼け、レール、出発の気配。私の好きな“物語が始まりそうな感じ”を集めたページです。', c3a2: 'BGM と一緒に'
    },
    music: {
      badge: 'オープニングテーマ', title: '私の BGM ページ<span>と OP の妄想</span>', desc: '私はアニメを見るとき、OP と ED をかなり大事にするので、自分のサイトにもそういう空気を置きたくなります。',
      note: 'ここでは assets/music に入れたローカル mp3 を再生します。切り替え、ループ、音量もこのプレイヤーで操作できます。', sideTitle: '音を流しながらぼーっとするのが好き', sideDesc: 'コードを書くときも、ページを直すときも、少し何もしたくないときも、感情をゆっくり支えてくれる BGM が必要です。青い夜、電車、街灯が思い浮かぶような旋律が理想です。',
      lyric1: '「夕方の風と OP の前奏は、たぶん同じ種類のものだと思う。」', lyric2: '「イヤホンをつけると、現実の音が少し遠くなって、自分の世界が少し近くなる。」', lyric3: '「もしページにも BGM があるなら、それはたぶん私の番外編になる。」'
    },
    articles: {
      badge: '記事', title: '私の記事メモ<span>と、ちゃんとした独り言</span>', desc: 'アニメ、ページ、コード、気持ちについての小さな記録を置いています。口では言いにくいことほど、ここに書くことが多いです。',
      c1m1: 'アニメ感想 / デザイン随筆', c1t: 'どうして私は青い黄昏のアニメカットをページに持ち込みたくなるのか', c1d: '私のページの発想は、トレンドよりも、アニメの黄昏や電車のカットから来ていることが多いです。',
      c2m1: 'フロントエンド記録', c2t: 'どうして私はページをアニメの絵コンテみたいに書きたくなるのか', c2d: '情報を並べるだけではなく、カメラワークみたいに見せたいといつも思っています。',
      c3m1: '独り言 / 制作記録', c3t: '人見知りの i 人が、それでも真剣に個人サイトを作る理由', c3d: '直接うまく話せないからこそ、ページに代わりに語ってほしいと思っているのかもしれません。'
    },
    contact: {
      badge: '連絡先', title: '連絡先<span>と補足メモ</span>', desc: 'アニメ、コード、青い夜景や電車のシーンが好きなら、ここからゆっくり見つけてください。',
      s1t: '今のサイト状態', s1d: 'このサイトは今、多ページ構成になっていて、それぞれが私の小さな設定分岐のようになっています。情報置き場というより、“私の好きなものと考え方を少しずつ見せる場所”です。',
      s2t: 'この先ゆっくり足したいもの', s2d: 'もっと追っている作品の話、ちゃんとした作品詳細、記事の追加、静かなメッセージ欄などを少しずつ足していきたいです。',
      st1l: '補完したい項目', st1v: 'タイムライン / ギャラリー / メッセージ', st2l: '内容の方向', st2v: '作品 / アニメ感想 / コード記録', st3l: '雰囲気', st3v: '青、夜景、電車、静かなアニメ感', st4l: '公開先', st4v: 'GitHub Pages / Vercel / Netlify'
    },
    detailWorks: {
      p1Title: '私の中の黄昏ホーム', p1Desc: '夕焼けが消えきる前、列車が来る直前の静かな空気を残したかったページです。',
      p2Title: '雨上がりの歩道橋の青い気持ち', p2Desc: 'ガラスの反射、街灯、湿った空気。そんな“雨が止んだ直後の街”が好きで作りました。',
      p3Title: '海辺の終電ミニシアター', p3Desc: '海風、夕焼け、レール、出発の気配。私の好きな“物語が始まりそうな感じ”を集めたページです。'
    },
    detailArticles: {
      a1Title: 'どうして私は青い黄昏のアニメカットをページに持ち込みたくなるのか', a1Desc: 'ページの発想がどこから来るのか考えると、結局いつもアニメの黄昏や電車のカットに戻ってきます。',
      a2Title: 'どうして私はページをアニメの絵コンテみたいに書きたくなるのか', a2Desc: 'ただ情報を並べるだけではなく、見せる順番や空気感まで含めてページを作りたくなる理由について書いています。',
      a3Title: '人見知りの i 人が、それでも真剣に個人サイトを作る理由', a3Desc: '直接言いにくいことほど、ページの中なら少しずつ形にできる気がする。その感覚についての記録です。'
    },
    tracks: [
      { title: 'more than words', subtitle: '羊文学', chip: 'more than words' }
    ],
    alerts: { webAudioUnsupported: 'Your browser does not support the Web Audio API.', audioLoadFailed: 'Local audio could not be loaded. Put your mp3 files in assets/music or update the track paths in script.js.' }
  },
  en: {
    pageTitle: 'Asa — anime, code, and blue nights',
    pageDescription: 'Asa’s personal site about anime, coding, blue nightscapes, and the quiet feelings of an introverted i-person.',
    brand: { name: 'Asa', tagline: 'An introverted blue-themed anime and coding lover' },
    nav: { home: 'Home', profile: 'Profile', about: 'About', works: 'Works', music: 'Music', articles: 'Articles', contact: 'Contact' },
    common: {
      homeIntroBadge: 'Blue anime mood', detail: 'View details', preview: 'Preview', browse: 'Browse work', read: 'Read more', top: 'Back to top', playMusic: 'Play music', viewSetting: 'View setting', enterPage: 'Open page',
      musicPlay: 'Play BGM', musicPause: 'Pause BGM', musicRestart: 'Restart', musicVolume: 'Volume',
      musicMiniPlayer: 'Floating music', previousTrack: 'Previous track', nextTrack: 'Next track', openMusicPage: 'Open music page',
      projectConcept: 'Concept', visualFocus: 'Visual focus', useCases: 'Best use cases', projectTypeLabel: 'Project type', keywordsLabel: 'Keywords', visualMoodLabel: 'Visual mood', recommendedUsageLabel: 'Recommended use', previousWork: 'Previous work', nextWork: 'Next work', backToWorks: 'Back to works'
    },
    home: {
      title: 'I’m Asa, <span>an introverted i-person who loves anime and coding.</span>',
      desc: 'In real life I am slow to warm up and not very good at loud introductions. So I put the things I love — blue night skies, trains, earphones, tiny lights, and a little anime mood — into this site instead. It feels less like a profile page and more like my own character setting book.',
      button1: 'Open my profile', button2: 'See what I make',
      p1t: 'Things I love', p1d: 'Anime, blue nightscapes, the wind before a train arrives, opening themes in earphones, and quiet glowing scenes.',
      p2t: 'How I write code', p2d: 'I like building pages the way anime frames unfold — slowly, gently, and with small memorable details.',
      p3t: 'What I want to leave behind', p3d: 'Not something loud or flashy — just a feeling that makes people pause and think, “this person is kind of cute.”',
      sceneChip: 'OPENING SCENE · ASA', sceneTitle: "Asa's Mood", sceneDesc: 'If I am too shy to speak first in real life, maybe this page can say hello for me.', stationTitle: 'Blue little station · Asa', station1: 'Next stop: Profile / Works / Music / Articles', station2: 'Slow introvert line',
      mapBadge: 'My map', mapTitle: 'If you want to know me faster', mapDesc: 'These pages are like different sides of me — settings, thoughts, works, and feelings hidden inside blue night scenes.',
      c1t: 'Profile', c1d: 'A character card version of me, with preferences, status, and hidden skills.',
      c2t: 'About', c2d: 'The anime I like, the blue I love, and the thoughts I rarely say out loud.',
      c3t: 'Works', c3d: 'Pages and projects I made, arranged like my own storyboard notebook.',
      c4t: 'Music', c4d: 'When I code or drift off, I need BGM that feels like an opening theme.',
      c5t: 'Articles', c5d: 'My notes about anime, making sites, code, and a few serious little monologues.',
      c6t: 'Contact', c6d: 'If you also like anime, blue nightscapes, or code, you can find me here slowly.',
      ftBadge: 'Asa', ftTitle: 'Thanks for visiting my little blue universe', ftDesc: 'If this place lets you feel even a little anime mood, a little night breeze, or a little bit of Asa, then it has done its job.', ftInfoTitle: 'Keywords', ftInfoDesc: 'anime / coding / blue / trains / night / introvert / opening-theme brain'
    },
    profile: {
      badge: 'Character archive', title: 'Asa’s Profile <span>& Blue Setting Board</span>', desc: 'If I were a character in a slice-of-life anime, I would probably be the quiet one with earphones, a love for blue nights and trains, and a hard time speaking first.',
      tag1: 'MAIN CHARACTER · ASA', tag2: 'BLUE HOUR / AFTER SCHOOL', name: 'Asa',
      meta1L: 'Type', meta1V: 'An introvert who loves anime and code', meta2L: 'Keywords', meta2V: 'blue, night, trains, earphones, code', meta3L: 'Hidden traits', meta3V: 'slow to warm up, detail-focused, weak to ED scenes',
      worldTitle: 'My little worldbuilding panel', worldDesc: 'If my everyday life were an anime side episode, it would probably be evenings, earphones, blue skies, trains, and then going home to watch anime and quietly write code.',
      w1l: 'Stage', w1v: 'Rainy city streets, train platforms, a quiet room, and a glowing screen', w2l: 'Time', w2v: 'From evening to late night — my favorite hours', w3l: 'Color', w3v: 'Blue, especially the kind that feels like night sky', w4l: 'Emotion', w4v: 'Quiet, slow, distant at first, but sincere',
      statusTitle: 'Today’s Asa', statusDesc: 'This is like my status bar — what I am thinking about, what I like, and what emotional weather I carry around.',
      s1l: 'Current main quest', s1v: 'Slowly writing everything I love into my own pages', s2l: 'Common abilities', s2v: 'Frontend implementation / atmosphere building / refining details alone', s3l: 'Hidden bonus', s3v: 'Instant emotional damage from good OPs, blue nights, and train shots',
      skillTitle: 'Skill Tree', skillDesc: 'Most of my points are probably invested in “page atmosphere” and “quiet anime-like storytelling.”',
      k1d: 'I love polishing pages until they feel clean, soft, and exactly right.', k2d: 'I naturally pick up blue skies, wind, lights, and train moods from anime scenes.', k3d: 'I prefer lighter motion — not loud effects, but breathing space.', k4d: 'Instead of talking a lot myself, I let pages speak for me little by little.'
    },
    about: {
      badge: 'About me', title: 'About Me <span>& Things I Rarely Say Out Loud</span>', desc: 'If I am not good at introducing myself directly, this page can do it for me.',
      mainTitle: 'I’m Asa — an introverted person who loves anime and code.', mainDesc: 'If I had to describe myself simply: I love anime, I love blue, I love nightscapes, and I love quietly writing code on my own. I am much better at putting my feelings into pages than explaining myself loudly. That is why this site feels very close to me.', quote: '“If I cannot say it well in person, maybe a page can say it for me.”',
      sideTitle: 'Things I am weak to', sideDesc: 'Twilight trains, overpasses after school, blue night skies, the first streetlight, an opening theme in earphones, and characters who look quiet but carry too many feelings.',
      a1l: 'Favorite color', a1v: 'Blue — the closer to night sky, the better', a2l: 'Default mode', a2v: 'Introverted i-person, a little easier once I get comfortable', a3l: 'Things that hit me instantly', a3v: 'trains, nightscapes, earphones, wind, opening themes', a4l: 'What matters in pages', a4v: 'atmosphere, pacing, and whether it feels like a scene'
    },
    works: {
      badge: 'Portfolio', title: 'The pages I make <span>and the moods I want to keep</span>', desc: 'These works are not just exercises. They are small scenes made from my love of anime atmosphere, blue nights, and code.',
      c1label: 'Project 01 · Twilight Platform', c1m1: 'Personal site', c1m2: 'Twilight train', c1t: 'The twilight platform in my head', c1d: 'A page built from that moment before the train arrives, while the sunset is still fading.', c1a2: 'Related notes',
      c2label: 'Project 02 · After Rain Bridge', c2m1: 'Mood feature', c2m2: 'City after rain', c2t: 'The blue feeling of an after-rain bridge', c2d: 'I love cities right after rain, so I made a page filled with reflections, lamps, and damp air.',
      c3label: 'Project 03 · Last Train Seaside', c3m1: 'Story page', c3m2: 'Seaside last train', c3t: 'A tiny last-train-by-the-sea theater', c3d: 'Sea breeze, rails, sunset, and the feeling that a story is about to leave the station.', c3a2: 'With BGM'
    },
    music: {
      badge: 'Opening theme', title: 'My BGM Page <span>& a little opening-theme imagination</span>', desc: 'I care a lot about anime openings and endings, so I wanted my own site to have that kind of mood too.',
      note: 'This player reads local mp3 files from assets/music, with track switching, looping, and volume control.', sideTitle: 'I like listening and drifting off', sideDesc: 'Whether I am coding, fixing a page, or doing nothing, I need music that can gently hold up my feelings. Ideally it sounds like blue night, trains, and lights.',
      lyric1: '“I think the evening wind and the first seconds of an opening theme are the same kind of thing.”', lyric2: '“When I put on my earphones, the sound of reality moves a little farther away.”', lyric3: '“If a page has BGM too, maybe it becomes an extra episode of me.”'
    },
    articles: {
      badge: 'Articles', title: 'My Notes <span>& the monologues I take seriously</span>', desc: 'This is where I leave small records about anime, websites, code, and feelings. The things I cannot say easily usually end up here.',
      c1m1: 'Anime thoughts / design essay', c1t: 'Why blue anime twilight always slips into my pages', c1d: 'A lot of my visual ideas come less from trends and more from anime scenes with trains, dusk, and blue skies.',
      c2m1: 'Frontend notes', c2t: 'Why I want pages to feel like anime storyboards', c2d: 'I care less about dumping information and more about how a page unfolds like a scene.',
      c3m1: 'Monologue / creation log', c3t: 'Why an introverted i-person still takes a personal site seriously', c3d: 'Maybe because I cannot always speak directly, I want a page to speak for me instead.'
    },
    contact: {
      badge: 'Contact', title: 'Contact <span>& a few extra notes</span>', desc: 'If you like anime, code, blue nightscapes, or train scenes too, you can find me here slowly.',
      s1t: 'Current site state', s1d: 'This site is now multi-page, and each page feels like one branch of my own settings. It is not only where I put information — it is where I slowly organize what I like and how I express myself.',
      s2t: 'Things I still want to add', s2d: 'More anime preferences, fuller work details, more writing, and maybe a quiet message corner one day.',
      st1l: 'Most wanted modules', st1v: 'timeline / gallery / message page', st2l: 'Content direction', st2v: 'works / anime notes / coding logs', st3l: 'Mood', st3v: 'blue, trains, quiet anime energy', st4l: 'Deployment', st4v: 'GitHub Pages / Vercel / Netlify'
    },
    detailWorks: {
      p1Title: 'The twilight platform in my head', p1Desc: 'A page built from that moment before the train arrives, while the sunset is still fading.',
      p2Title: 'The blue feeling of an after-rain bridge', p2Desc: 'A page made from reflections, lamps, and the quiet air of the city after rain.',
      p3Title: 'A tiny last-train-by-the-sea theater', p3Desc: 'Sea breeze, rails, sunset, and the feeling that a story is about to leave the station.'
    },
    detailArticles: {
      a1Title: 'Why blue anime twilight always slips into my pages', a1Desc: 'Whenever I trace my visual ideas back far enough, I end up at anime scenes with trains and blue dusk.',
      a2Title: 'Why I want pages to feel like anime storyboards', a2Desc: 'This is about why pacing, framing, and atmosphere matter to me as much as structure.',
      a3Title: 'Why an introverted i-person still takes a personal site seriously', a3Desc: 'Sometimes a page can say what I cannot say directly, and that may be exactly why I keep building one.'
    },
    tracks: [
      { title: 'more than words', subtitle: 'Hitsujibungaku', chip: 'more than words' }
    ],
    alerts: { webAudioUnsupported: 'Your browser does not support the Web Audio API.', audioLoadFailed: 'Local audio could not be loaded. Put your mp3 files in assets/music or update the track paths in script.js.' }
  }
};

const getByPath = (obj, path) => path.split('.').reduce((acc, key) => acc && acc[key], obj);

const applyTranslations = (lang) => {
  const dict = translations[lang] || translations['zh-CN'];
  document.documentElement.lang = lang === 'zh-CN' ? 'zh-CN' : lang;
  body.classList.remove('lang-zh', 'lang-ja', 'lang-en');
  body.classList.add(lang === 'ja' ? 'lang-ja' : lang === 'en' ? 'lang-en' : 'lang-zh');
  document.title = document.body.dataset.titleKey ? getByPath(dict, document.body.dataset.titleKey) || dict.pageTitle : dict.pageTitle;
  const descMeta = document.querySelector('meta[name="description"]');
  if (descMeta) descMeta.setAttribute('content', dict.pageDescription);

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.getAttribute('data-i18n');
    const value = getByPath(dict, key);
    if (value !== undefined) node.textContent = value;
  });

  document.querySelectorAll('[data-i18n-html]').forEach((node) => {
    const key = node.getAttribute('data-i18n-html');
    const value = getByPath(dict, key);
    if (value !== undefined) node.innerHTML = value;
  });

  langButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.lang === lang));

  try {
    localStorage.setItem('mypage-lang', lang);
  } catch {}

  window.__currentLang = lang;
  if (typeof window.__updateTrackInfo === 'function') window.__updateTrackInfo();
  if (typeof window.__updatePlayLabel === 'function') window.__updatePlayLabel();
  if (typeof window.__rerenderDynamicContent === 'function') window.__rerenderDynamicContent();
};

langButtons.forEach((btn) => {
  btn.addEventListener('click', () => applyTranslations(btn.dataset.lang));
});

const detectBrowserLang = () => {
  const browserLang = (navigator.languages && navigator.languages[0]) || navigator.language || 'zh-CN';
  const normalized = browserLang.toLowerCase();
  if (normalized.startsWith('ja')) return 'ja';
  if (normalized.startsWith('en')) return 'en';
  if (normalized.startsWith('zh')) return 'zh-CN';
  return 'en';
};

const savedLang = (() => {
  try { return localStorage.getItem('mypage-lang'); } catch { return null; }
})();
const initialLang = savedLang && translations[savedLang] ? savedLang : detectBrowserLang();
applyTranslations(initialLang);

const MUSIC_STORAGE_KEY = 'mypage-music-state-v1';
const MUSIC_TRACKS = [
  { src: './assets/music/more-than-words-hitujibungaku.mp3' }
];

const getDict = () => translations[window.__currentLang] || translations['zh-CN'];
const formatTime = (seconds) => {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const m = String(Math.floor(safe / 60)).padStart(2, '0');
  const s = String(safe % 60).padStart(2, '0');
  return `${m}:${s}`;
};
const clampTrackIndex = (value) => {
  const safe = Number(value);
  if (!Number.isInteger(safe) || safe < 0 || safe >= MUSIC_TRACKS.length) return 0;
  return safe;
};
const loadMusicState = () => {
  try {
    const raw = localStorage.getItem(MUSIC_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return {
      currentTrackIndex: clampTrackIndex(parsed?.currentTrackIndex),
      volume: Math.min(1, Math.max(0, Number(parsed?.volume ?? 0.58) || 0.58)),
      currentTime: Math.max(0, Number(parsed?.currentTime ?? 0) || 0),
      isPlaying: Boolean(parsed?.isPlaying),
      updatedAt: Math.max(0, Number(parsed?.updatedAt ?? 0) || 0)
    };
  } catch {
    return { currentTrackIndex: 0, volume: 0.58, currentTime: 0, isPlaying: false, updatedAt: 0 };
  }
};
const saveMusicState = (state) => {
  try {
    localStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify({
      currentTrackIndex: clampTrackIndex(state.currentTrackIndex),
      volume: Math.min(1, Math.max(0, Number(state.volume ?? 0.58) || 0.58)),
      currentTime: Math.max(0, Number(state.currentTime ?? 0) || 0),
      isPlaying: Boolean(state.isPlaying),
      updatedAt: Number(state.updatedAt ?? Date.now()) || Date.now()
    }));
  } catch {}
};

const createFloatingMusicOrb = () => {
  const container = document.createElement('div');
  container.className = 'music-orb';
  container.innerHTML = `
    <button class="music-orb-toggle" type="button" aria-expanded="false">
      <span class="music-orb-pulse"></span>
      <span class="music-orb-icon">♪</span>
    </button>
    <div class="music-orb-panel is-hidden">
      <div class="music-orb-head">
        <strong class="music-orb-title"></strong>
        <span class="music-orb-subtitle"></span>
      </div>
      <div class="music-orb-progress"><span class="music-orb-progress-fill"></span></div>
      <div class="music-orb-time"><span class="music-orb-current">00:00</span><span class="music-orb-total">00:00</span></div>
      <div class="music-orb-actions">
        <button class="mini-link music-orb-prev" type="button"></button>
        <button class="mini-link music-orb-play" type="button"></button>
        <button class="mini-link music-orb-next" type="button"></button>
      </div>
      <div class="music-orb-volume-wrap">
        <label class="music-orb-volume-label" for="music-orb-volume"></label>
        <input class="music-orb-volume" id="music-orb-volume" type="range" min="0" max="100" value="58" />
      </div>
      <a class="mini-link music-orb-link" href="./music.html"></a>
    </div>
  `;
  document.body.appendChild(container);
  return {
    container,
    toggle: container.querySelector('.music-orb-toggle'),
    panel: container.querySelector('.music-orb-panel'),
    title: container.querySelector('.music-orb-title'),
    subtitle: container.querySelector('.music-orb-subtitle'),
    progressFill: container.querySelector('.music-orb-progress-fill'),
    currentTime: container.querySelector('.music-orb-current'),
    totalTime: container.querySelector('.music-orb-total'),
    prev: container.querySelector('.music-orb-prev'),
    play: container.querySelector('.music-orb-play'),
    next: container.querySelector('.music-orb-next'),
    volume: container.querySelector('.music-orb-volume'),
    volumeLabel: container.querySelector('.music-orb-volume-label'),
    link: container.querySelector('.music-orb-link')
  };
};

const playerCard = document.getElementById('music-player-card');
const floatingOrb = createFloatingMusicOrb();

(() => {
  const playToggle = document.getElementById('play-toggle');
  const restartTrack = document.getElementById('restart-track');
  const volumeInput = document.getElementById('volume');
  const trackTitle = document.getElementById('track-title');
  const trackSubtitle = document.getElementById('track-subtitle');
  const progressFill = document.getElementById('progress-fill');
  const currentTimeEl = document.getElementById('current-time');
  const totalTimeEl = document.getElementById('total-time');
  const trackButtons = Array.from(document.querySelectorAll('.track-chip'));
  const audio = new Audio();
  const savedState = loadMusicState();
  const musicState = {
    currentTrackIndex: savedState.currentTrackIndex,
    isPlaying: false,
    volume: savedState.volume,
    currentTime: savedState.currentTime,
    wasPlayingBeforeHide: false,
    hydratedFromStorage: false
  };

  audio.preload = 'metadata';
  audio.loop = true;
  audio.volume = musicState.volume;

  const syncState = () => {
    saveMusicState({
      currentTrackIndex: musicState.currentTrackIndex,
      volume: audio.volume,
      currentTime: audio.currentTime,
      isPlaying: musicState.isPlaying,
      updatedAt: Date.now()
    });
  };

  const setPlayingUI = (isPlaying) => {
    musicState.isPlaying = isPlaying;
    if (playerCard) playerCard.classList.toggle('playing', isPlaying);
    floatingOrb.container.classList.toggle('playing', isPlaying);
    updatePlayLabel();
    syncState();
  };

  const updateTrackInfo = () => {
    const dict = getDict();
    const text = dict.tracks[musicState.currentTrackIndex];
    if (trackTitle) trackTitle.textContent = text.title;
    if (trackSubtitle) trackSubtitle.textContent = text.subtitle;
    floatingOrb.title.textContent = text.title;
    floatingOrb.subtitle.textContent = text.subtitle;
    trackButtons.forEach((button, index) => {
      button.classList.toggle('active', index === musicState.currentTrackIndex);
      button.textContent = dict.tracks[index].chip;
    });
  };

  const updatePlayLabel = () => {
    const dict = getDict();
    if (playToggle) playToggle.textContent = musicState.isPlaying ? dict.common.musicPause : dict.common.musicPlay;
    if (restartTrack) restartTrack.textContent = dict.common.musicRestart;
    if (volumeInput) {
      const volumeLabel = document.querySelector('label[for="volume"]');
      if (volumeLabel) volumeLabel.textContent = dict.common.musicVolume;
    }
    floatingOrb.play.textContent = musicState.isPlaying ? dict.common.musicPause : dict.common.musicPlay;
    floatingOrb.prev.textContent = dict.common.previousTrack;
    floatingOrb.next.textContent = dict.common.nextTrack;
    floatingOrb.volumeLabel.textContent = dict.common.musicVolume;
    floatingOrb.link.textContent = dict.common.openMusicPage;
    floatingOrb.toggle.setAttribute('aria-label', dict.common.musicMiniPlayer);
  };

  const updateProgress = () => {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    if (progressFill) progressFill.style.width = duration > 0 ? `${(current / duration) * 100}%` : '0%';
    if (currentTimeEl) currentTimeEl.textContent = formatTime(current);
    if (totalTimeEl) totalTimeEl.textContent = formatTime(duration);
    floatingOrb.progressFill.style.width = duration > 0 ? `${(current / duration) * 100}%` : '0%';
    floatingOrb.currentTime.textContent = formatTime(current);
    floatingOrb.totalTime.textContent = formatTime(duration);
    musicState.currentTime = current;
    syncState();
  };

  const setVolume = (volume, shouldSync = true) => {
    const safe = Math.min(1, Math.max(0, Number(volume) || 0));
    audio.volume = safe;
    musicState.volume = safe;
    if (volumeInput) volumeInput.value = String(Math.round(safe * 100));
    floatingOrb.volume.value = String(Math.round(safe * 100));
    if (shouldSync) syncState();
  };

  const applyTrack = (index, options = {}) => {
    const { autoplay = false, resumeTime = 0, preservePlayingState = false } = options;
    musicState.currentTrackIndex = clampTrackIndex(index);
    audio.src = MUSIC_TRACKS[musicState.currentTrackIndex].src;
    audio.load();
    updateTrackInfo();
    updateProgress();

    const setInitialTime = () => {
      if (resumeTime > 0) {
        try { audio.currentTime = resumeTime; } catch {}
      }
    };

    audio.addEventListener('loadedmetadata', setInitialTime, { once: true });

    if (autoplay) {
      audio.play().then(() => {
        setPlayingUI(true);
      }).catch(() => {
        setPlayingUI(false);
        alert(getDict().alerts.audioLoadFailed);
      });
    } else if (!preservePlayingState) {
      setPlayingUI(false);
    }
    syncState();
  };

  const getProjectedTime = (state, duration = Number.isFinite(audio.duration) ? audio.duration : 0) => {
    const base = Math.max(0, Number(state.currentTime ?? 0) || 0);
    if (!state.isPlaying) return base;
    const elapsed = Math.max(0, (Date.now() - (Number(state.updatedAt ?? 0) || 0)) / 1000);
    if (duration > 0) return (base + elapsed) % duration;
    return base + elapsed;
  };

  const playCurrent = async () => {
    if (!audio.src) applyTrack(musicState.currentTrackIndex, { autoplay: false, resumeTime: musicState.currentTime });
    try {
      await audio.play();
      setPlayingUI(true);
    } catch {
      setPlayingUI(false);
      alert(getDict().alerts.audioLoadFailed);
    }
  };

  const pauseCurrent = () => {
    audio.pause();
    setPlayingUI(false);
  };

  const switchTrack = (index, keepPlaying = musicState.isPlaying) => {
    applyTrack(index, { autoplay: keepPlaying, resumeTime: 0 });
  };

  const switchRelativeTrack = (direction) => {
    const nextIndex = (musicState.currentTrackIndex + direction + MUSIC_TRACKS.length) % MUSIC_TRACKS.length;
    switchTrack(nextIndex, musicState.isPlaying);
  };

  window.__updateTrackInfo = updateTrackInfo;
  window.__updatePlayLabel = updatePlayLabel;

  playToggle?.addEventListener('click', () => {
    if (musicState.isPlaying) pauseCurrent();
    else playCurrent();
  });

  restartTrack?.addEventListener('click', async () => {
    if (!audio.src) applyTrack(musicState.currentTrackIndex, { autoplay: false, resumeTime: 0 });
    audio.currentTime = 0;
    await playCurrent();
    updateProgress();
  });

  volumeInput?.addEventListener('input', () => {
    setVolume(Number(volumeInput.value) / 100);
  });

  trackButtons.forEach((button, index) => {
    button.addEventListener('click', () => switchTrack(index, musicState.isPlaying));
  });

  floatingOrb.toggle.addEventListener('click', () => {
    const expanded = floatingOrb.toggle.getAttribute('aria-expanded') === 'true';
    floatingOrb.toggle.setAttribute('aria-expanded', String(!expanded));
    floatingOrb.panel.classList.toggle('is-hidden', expanded);
  });

  floatingOrb.play.addEventListener('click', () => {
    if (musicState.isPlaying) pauseCurrent();
    else playCurrent();
  });
  floatingOrb.prev.addEventListener('click', () => switchRelativeTrack(-1));
  floatingOrb.next.addEventListener('click', () => switchRelativeTrack(1));
  floatingOrb.volume.addEventListener('input', () => {
    setVolume(Number(floatingOrb.volume.value) / 100);
  });

  audio.addEventListener('loadedmetadata', updateProgress);
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('play', () => setPlayingUI(true));
  audio.addEventListener('pause', () => setPlayingUI(false));
  audio.addEventListener('ended', () => setPlayingUI(false));
  audio.addEventListener('error', () => {
    setPlayingUI(false);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      musicState.wasPlayingBeforeHide = musicState.isPlaying;
      syncState();
      return;
    }

    const latestState = loadMusicState();
    const projectedTime = getProjectedTime(latestState, audio.duration);
    if (latestState.currentTrackIndex !== musicState.currentTrackIndex) {
      applyTrack(latestState.currentTrackIndex, { autoplay: false, resumeTime: projectedTime, preservePlayingState: true });
    } else if (Math.abs((audio.currentTime || 0) - projectedTime) > 0.6) {
      try { audio.currentTime = projectedTime; } catch {}
    }
    setVolume(latestState.volume, false);
    if (latestState.isPlaying && audio.paused) playCurrent();
    else updateProgress();
  });

  window.addEventListener('storage', (event) => {
    if (event.key !== MUSIC_STORAGE_KEY) return;
    const latestState = loadMusicState();
    const projectedTime = getProjectedTime(latestState, audio.duration);
    if (latestState.currentTrackIndex !== musicState.currentTrackIndex) {
      applyTrack(latestState.currentTrackIndex, { autoplay: false, resumeTime: projectedTime, preservePlayingState: true });
    }
    setVolume(latestState.volume, false);
  });

  setVolume(musicState.volume, false);
  applyTrack(musicState.currentTrackIndex, { autoplay: false, resumeTime: getProjectedTime(savedState), preservePlayingState: true });
  if (savedState.isPlaying && !musicState.hydratedFromStorage) {
    musicState.hydratedFromStorage = true;
    playCurrent();
  }
  updateTrackInfo();
  updatePlayLabel();
  updateProgress();
})();
