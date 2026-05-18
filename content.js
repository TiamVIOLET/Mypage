(() => {
  const CONTENT_STORAGE_KEY = 'mypage-content-v1';
  const AUTH_HASH_STORAGE_KEY = 'mypage-editor-hash-v1';
  const AUTH_SESSION_STORAGE_KEY = 'mypage-editor-session-v1';
  const ARTICLE_DATA_URL = './assets/data/articles.json';

  let generatedArticles = null;

  const DEFAULT_CONTENT = {
    about: {
      avatar: '',
      title: '我是 Asa，一个爱看番也爱敲代码的社恐 i 人',
      intro: '如果一定要用一句话形容我，那大概就是：喜欢动漫、喜欢蓝色、喜欢夜景、喜欢一个人安静写代码的人。比起热热闹闹地介绍自己，我更习惯把喜欢的东西慢慢塞进页面里。所以这个站点里的很多情绪，其实都很像我本人——慢热、安静，但会在细节里偷偷发光。',
      quote: '“我不太擅长大声表达自己，所以就让页面替我说话吧。”',
      tags: ['Anime', 'Coding', 'Blue Night', 'Train Scene', 'Introvert'],
      sideTitle: '我的偏爱清单',
      sideIntro: '我会被很多日漫里的画面轻易戳到：黄昏时的电车、放学后的天桥、夜里发蓝的天空、街灯刚亮起来的瞬间、耳机里刚好响起的片头曲，还有那种看起来安静、其实情绪很多的角色。',
      stats: [
        { label: '喜欢的颜色', value: '蓝色，越接近夜空越喜欢' },
        { label: '日常状态', value: '慢热社恐 i 人，熟了以后会话多一点' },
        { label: '最容易心动的元素', value: '电车、夜景、耳机、风、片头曲' },
        { label: '写页面时最在意的东西', value: '气氛、节奏感，还有“像不像一格分镜”' }
      ]
    },
    contact: {
      cardTitle: '联系 Asa',
      intro: '如果你也喜欢动漫、代码、蓝色夜景，或者只是刚好路过这里，也欢迎慢慢来找我。虽然我不太擅长特别热闹地社交，但如果聊喜欢的作品、页面设计或者代码，我会认真回应。',
      email: 'hello@example.com',
      social: 'GitHub / X / Bilibili / 小红书',
      cooperation: '个人主页、后端页面、动漫风氛围设计',
      statusTitle: '我现在的小站状态',
      statusText: '这个站点现在已经是多页面结构了，每一页都像我自己的小设定分支。对我来说，它不是单纯放信息的地方，而是一个可以把“我喜欢什么、我在想什么、我会怎么表达”慢慢整理出来的小空间。',
      statusTags: ['Asa', 'Anime Mood', 'Blue Theme', 'Backend', 'Introvert'],
      roadmapTitle: '我还想慢慢加上的东西',
      roadmapText: '后面我还想继续往这个站里塞更多属于我的东西，比如更完整的追番偏好、真正的作品详情、更多文章记录，也许还有一个安静的小留言角落。',
      roadmapStats: [
        { label: '最想补完的模块', value: '时间轴 / 相册 / 留言页' },
        { label: '内容方向', value: '真实作品 / 追番碎碎念 / 编程记录' },
        { label: '页面气氛', value: '蓝色、夜景、列车、安静的番剧感' },
        { label: '未来部署', value: 'GitHub Pages / Vercel / Netlify' }
      ],
      noteTitle: '如果你想更了解我',
      noteText: '那就从我的文章和作品页开始看吧。那里会比“自我介绍”更像我，因为我真正的表达方式，一直都不是把话直接说满，而是把情绪藏进页面和文字里。',
      noteSteps: ['先看角色档案', '再逛作品页和文章页', '最后如果想聊，再慢慢来找我']
    },
    articles: [
      {
        id: 'article-1',
        category: '追番感想 / 设计随笔',
        date: '2026.04',
        title: '为什么我做页面时，总会忍不住想起日漫里的蓝色黄昏',
        summary: '对我来说，很多页面的灵感其实不是来自“网页设计趋势”，而是来自动漫里那些黄昏、电车和安静夜空的镜头。',
        body: `## 一、我会先想到画面，而不是功能\n每次我准备做一个页面的时候，脑子里先出现的往往不是排版，而是某种画面。可能是电车快进站时的风，也可能是蓝色傍晚下亮起来的第一盏路灯。对我来说，那些日漫镜头的情绪会比功能说明更早一步出现。\n\n## 二、蓝色对我来说一直很特别\n我真的很喜欢蓝色。不是很亮很跳的那种，而是偏夜空、偏空气感、看起来有点安静的蓝。它会让我想到放学后的街道、耳机里的 BGM，还有那种“今天已经快结束了，但情绪还没结束”的时刻。\n\n## 三、我喜欢页面里有一点番剧感\n我不太喜欢页面只是很直白地摆信息。我更喜欢它像一小段番剧情绪：先给气氛，再给内容，再慢慢展开细节。哪怕只是一个小卡片，我也会想它是不是能像分镜一样被记住。\n\n## 四、这大概也是我在表达自己\n我本身就不是特别外放的人，所以很多时候，我的表达欲都会跑到页面里去。那些蓝色、夜景、列车、风和安静的发光感，其实也都很像我自己。`
      },
      {
        id: 'article-2',
        category: '后端记录',
        date: '2026.03',
        title: '我为什么会喜欢把后端页面写得像一张动漫分镜',
        summary: '比起单纯把内容堆出来，我更喜欢让页面像有镜头语言一样慢慢展开。',
        body: `## 一、我写页面的时候，会想“这一幕先给谁看”\n这可能是我受动漫影响很深的地方。做页面时，我会不自觉地想：用户第一眼应该先看到什么？是标题、是一块光、还是一段会让情绪先落下来的留白？这种想法很像在排镜头。\n\n## 二、动效对我来说不是炫技，是呼吸\n我喜欢的动效一般都不会太吵。比起大幅度的夸张变化，我更偏爱轻一点、柔一点、像空气在动一样的效果。这样页面会更像“有情绪的画面”，而不是“很用力的展示”。\n\n## 三、动漫感和后端其实并不冲突\n很多人会觉得动漫感是视觉风格，后端是实现层。但对我来说，它们本来就是能放在一起的。CSS 可以画出气氛，交互可以写出节奏，页面也完全可以像一段温柔的片头。\n\n## 四、也许这就是我最喜欢后端的原因\n因为它不只是写功能。它还能让我把自己喜欢的光、颜色、镜头感和情绪都一点点拼进去。每做完一个页面，我都会觉得像是又画完了一张属于自己的分镜稿。`
      },
      {
        id: 'article-3',
        category: '碎碎念 / 创作记录',
        date: '2026.02',
        title: '一个社恐 i 人，到底为什么还要认真做个人主页',
        summary: '也许正因为我不太擅长当面表达，所以才更想认真做一个能替我说话的页面。',
        body: `## 一、我其实不太会直接介绍自己\n如果突然让我很正式地说“你好，我是谁，我喜欢什么”，我大概率会卡住。不是没有想法，而是我一直都比较慢热，也不习惯一下子把自己摊开。\n\n## 二、但页面会替我说一些我说不出口的话\n我发现，只要把喜欢的颜色、喜欢的画面、喜欢的表达方式都放进页面里，它就会慢慢变成“很像我”的东西。哪怕我没有说很多，人还是能从这些细节里感受到我的性格。\n\n## 三、所以个人主页对我来说不是简历，而是表达\n我不太想把它做得像一张只讲信息的表格。我更想让它像一个属于我自己的小空间：安静、蓝色、带一点番剧感，也带一点社恐 i 人特有的慢吞吞。\n\n## 四、如果你能从这里记住一点 Asa 的感觉，那就够了\n不一定非要很强烈，也不一定非要很热闹。只要有人看完以后，会觉得“这个人好像很喜欢蓝色、很喜欢动漫、很认真，也有点可爱”，那我就会觉得这个页面写得值得。`
      }
    ],
    gallery: {
      albums: [
        {
          id: 'collected-visuals',
          title: {
            'zh-CN': '好看的图收藏',
            ja: 'お気に入り画像コレクション',
            en: 'Beautiful image collection'
          },
          description: {
            'zh-CN': '从桌面“好看的图”里整理进来的图片，先放在这里慢慢浏览。',
            ja: 'デスクトップの「好看的图」からまとめた画像を、ここでゆっくり眺められるようにしました。',
            en: 'Images collected from the desktop folder, gathered here for slow browsing.'
          },
          mood: {
            'zh-CN': 'Local visual archive',
            ja: 'Local visual archive',
            en: 'Local visual archive'
          },
          cover: './assets/gallery/gallery-01.png',
          accent: '#84c7ff',
          featured: true,
          images: [
            { src: './assets/gallery/gallery-01.png' },
            { src: './assets/gallery/gallery-02.png' },
            { src: './assets/gallery/gallery-03.png' },
            { src: './assets/gallery/gallery-04.png' },
            { src: './assets/gallery/gallery-05.png' },
            { src: './assets/gallery/gallery-06.png' },
            { src: './assets/gallery/gallery-07.png' }
          ]
        }
      ]
    }
  };

  const LOCALIZED_DEFAULT_CONTENT = {
    ja: {
      about: {
        avatar: '',
        title: '私は Asa。アニメもコードも好きな、少し人見知りな i 人です。',
        intro: '一言で言えば、アニメが好きで、青が好きで、夜景が好きで、一人で静かにコードを書くのが好きな人です。にぎやかに自分を説明するより、好きなものを少しずつページに入れていく方が私らしいと思っています。このサイトにある空気感も、実はかなり私そのものです。ゆっくりで静かだけど、細部ではちゃんと光っていたい。',
        quote: '「うまく大きな声では話せないから、ページに少しずつ代わりに話してもらえばいい。」',
        tags: ['Anime', 'Coding', 'Blue Night', 'Train Scene', 'Introvert'],
        sideTitle: '好きなものリスト',
        sideIntro: '夕方の電車、放課後の歩道橋、夜に青くなる空、街灯がつく瞬間、イヤホンから流れる OP、そして静かそうに見えて感情をたくさん抱えているキャラ。そんなものにすぐ心を持っていかれます。',
        stats: [
          { label: '好きな色', value: '青。夜空に近いほど好き' },
          { label: '普段の状態', value: '人見知りの i 人。仲良くなると少し話せる' },
          { label: '弱い要素', value: '電車、夜景、イヤホン、風、OP' },
          { label: 'ページで大事にすること', value: '空気感、テンポ、“カットっぽさ”' }
        ]
      },
      contact: {
        cardTitle: 'Asa に連絡する',
        intro: 'アニメ、コード、青い夜景が好きな人も、たまたまここを通りかかった人も、ゆっくり声をかけてください。にぎやかなやり取りは少し苦手ですが、好きな作品やページづくり、コードの話ならちゃんと返事をしたいと思っています。',
        email: 'hello@example.com',
        social: 'GitHub / X / Bilibili / 小红书',
        cooperation: '個人サイト、バックエンドページ、アニメ風ムードデザイン',
        statusTitle: '今のサイトの状態',
        statusText: 'このサイトはいま複数ページ構成になっていて、それぞれが私の小さな設定分岐みたいなものです。情報を置くだけの場所ではなく、「何が好きか、何を考えているか、どう表現したいか」を少しずつ整理していくための静かな場所です。',
        statusTags: ['Asa', 'Anime Mood', 'Blue Theme', 'Backend', 'Introvert'],
        roadmapTitle: 'これからゆっくり足したいもの',
        roadmapText: 'これからは、追っている作品の好みをもっと詳しくまとめたり、本当の作品詳細を増やしたり、文章をもう少し書きためたり、静かなメッセージコーナーも作れたらいいなと思っています。',
        roadmapStats: [
          { label: '先に補完したいもの', value: 'タイムライン / ギャラリー / メッセージページ' },
          { label: '内容の方向', value: '作品 / アニメ感想 / コード記録' },
          { label: 'ページの空気感', value: '青、夜景、電車、静かなアニメ感' },
          { label: '今後の公開先', value: 'GitHub Pages / Vercel / Netlify' }
        ],
        noteTitle: 'もっと私を知りたいなら',
        noteText: 'まずは記事と作品ページから見てみてください。そこには「自己紹介」よりもずっと私らしいものがあります。私は最初から全部を言い切るより、気持ちをページと文章の中に少しずつ隠していく方が得意だからです。',
        noteSteps: ['まずはキャラ設定へ', '次に作品と記事をのぞく', '話したくなったら、そのあとでゆっくり']
      },
      articles: [
        {
          id: 'article-1',
          category: 'アニメ感想 / デザイン随筆',
          date: '2026.04',
          title: 'どうして私は青い黄昏のアニメカットをページに持ち込みたくなるのか',
          summary: 'ページの発想がどこから来るのか考えると、結局いつもアニメの黄昏や電車のカットに戻ってきます。',
          body: `## 1. まず機能より先に、画面が浮かぶ\nページを作ろうとするとき、私の頭に最初に出てくるのはレイアウトではなく、だいたい一枚の画面です。駅に入ってくる電車の風かもしれないし、青い夕方に灯る最初の街灯かもしれません。私にとっては、機能説明より先にアニメのカットみたいな感情が立ち上がります。\n\n## 2. 青はずっと特別な色\n私は本当に青が好きです。明るくて跳ねる青よりも、夜空や空気に近くて、少し静かな青が好きです。それを見ると、放課後の道や、イヤホンの中の BGM や、「今日はもう終わりかけているのに、気持ちだけまだ終わっていない」ような時間を思い出します。\n\n## 3. ページにも少しアニメっぽさがほしい\n私は、ただ情報をまっすぐ並べるだけのページがあまり得意ではありません。まず空気を見せて、それから内容を置いて、最後に細部をゆっくり開いていく。そんなふうに、小さなカードひとつでも絵コンテの一コマみたいに記憶に残ってほしいと思っています。\n\n## 4. たぶんこれも、自分の表現なんだと思う\n私はもともとあまり外向的ではないので、話したい気持ちの多くがページの中に流れ込みます。青、夜景、列車、風、静かな光。そういうものは、結局どれも少しずつ私自身に似ています。`
        },
        {
          id: 'article-2',
          category: 'バックエンド記録',
          date: '2026.03',
          title: 'どうして私はページをアニメの絵コンテみたいに書きたくなるのか',
          summary: 'ただ情報を並べるのではなく、カメラワークがあるみたいにページをゆっくり開いていくのが好きです。',
          body: `## 1. まず「この一幕を誰に見せるか」を考える\nこれはかなりアニメの影響だと思います。ページを作るとき、私は自然に「最初に何を見せるべきだろう」と考えます。タイトルなのか、光なのか、それとも感情を落ち着かせる余白なのか。そういう発想は、自分の中ではかなりカット割りに近いです。\n\n## 2. 動きは見せ場ではなく、呼吸\n私の好きな動きは、たいてい静かです。大きくて派手な変化よりも、少し軽くて、少し柔らかくて、空気が動くみたいなものを好みます。そうするとページは「頑張って見せるもの」ではなく、「感情のある画面」になります。\n\n## 3. アニメっぽさとバックエンドは両立できる\nアニメ感は見た目、バックエンドは実装、と分けて考えられがちですが、私の中では最初からつながっています。CSS で空気感を作れるし、インタラクションでテンポを書けるし、ページそのものをやさしい OP みたいに見せることもできます。\n\n## 4. それが、私がバックエンドを好きな理由\nバックエンドは、ただ機能を書く作業ではありません。好きな光や色、カメラみたいな見せ方、感情の流れまで、少しずつ混ぜ込めるところが好きです。ページをひとつ作り終えるたびに、自分だけの絵コンテを一枚描き終えたみたいな気持ちになります。`
        },
        {
          id: 'article-3',
          category: '独り言 / 制作記録',
          date: '2026.02',
          title: '人見知りの i 人が、それでも真剣に個人サイトを作る理由',
          summary: '直接うまく話せないからこそ、ページに代わりに語ってほしいと思っているのかもしれません。',
          body: `## 1. 実は自己紹介があまり得意じゃない\n急にきちんと「こんにちは、私は誰で、何が好きです」と言おうとすると、たぶん私は少し止まってしまいます。考えがないわけではなくて、ただ昔からスロースターターで、一気に自分を開くのがあまり得意ではありません。\n\n## 2. でも、ページなら言えないことを少し言ってくれる\n好きな色や、好きな画面や、好きな表現をページの中に置いていくと、それはだんだん「すごく自分っぽいもの」になっていきます。たくさん話さなくても、そういう細部から性格はちゃんと伝わる気がしています。\n\n## 3. だから私にとって個人サイトは履歴書ではなく、表現\n情報だけを並べた表みたいなものには、あまりしたくありません。静かで、青くて、少しアニメっぽくて、少しだけ人見知りらしい、そんな自分の小さな場所にしたいと思っています。\n\n## 4. ここで Asa の空気を少しでも覚えてもらえたら十分\n強くなくてもいいし、にぎやかでなくてもいい。ただ見終わったあとに「この人は青が好きで、アニメが好きで、ちゃんと作っていて、少しかわいいかもしれない」と思ってもらえたら、それだけでこのページを作った意味があると思えます。`
        }
      ]
    }
  };

  const UI_TEXT = {
    'zh-CN': {
      readMore: '阅读文章',
      backToArticles: '回到文章小手账',
      previousArticle: '上一篇',
      nextArticle: '下一篇',
      emptyArticleTitle: '这里还没有文章哦',
      emptyArticleDesc: '先打开 editor.html，就可以写下 Asa 的第一篇小记录啦。',
      emptyArticleMetaLabel: '内容管理',
      emptyArticleMetaStatus: '等待新增',
      openEditor: '打开内容管理页',
      contentEmpty: '正文还没补上',
      contentEmptyDesc: '打开 editor.html 后，就可以开始写新的内容啦。',
      articleDetailBadge: 'Article Detail',
      articleDetailSuffix: '文章详情',
      articleDetailEmptyHint: '先去新增内容',
      articleDetailBackHint: '先回到文章页看看吧。',
      articleDetailEditorHint: '直接去新增和编辑内容。',
      articleDetailListHint: '回到文章页继续看其他内容。',
      emailLabel: '邮箱',
      socialLabel: '社交平台',
      cooperationLabel: '合作方向',
      sendMail: '发送邮件',
      viewWorks: '看看作品',
      profileAvatarAlt: 'Asa 的头像'
    },
    ja: {
      readMore: '記事を読む',
      backToArticles: '記事一覧へ戻る',
      previousArticle: '前の記事',
      nextArticle: '次の記事',
      emptyArticleTitle: 'まだ記事がありません',
      emptyArticleDesc: 'editor.html を開いて、最初の記事を追加してください。',
      emptyArticleMetaLabel: 'コンテンツ管理',
      emptyArticleMetaStatus: '追加待ち',
      openEditor: '管理ページを開く',
      contentEmpty: '内容がありません',
      contentEmptyDesc: 'editor.html を開けば、最初の記事を書き始められます。',
      articleDetailBadge: '記事詳細',
      articleDetailSuffix: '記事詳細',
      articleDetailEmptyHint: 'まずは内容を追加しましょう',
      articleDetailBackHint: 'まずは記事一覧に戻ってみましょう。',
      articleDetailEditorHint: 'そのまま追加や編集に進めます。',
      articleDetailListHint: '記事一覧に戻って他の内容も見てみてください。',
      emailLabel: 'メール',
      socialLabel: 'SNS',
      cooperationLabel: '対応内容',
      sendMail: 'メール送信',
      viewWorks: '作品を見る',
      profileAvatarAlt: 'Asa のアバター'
    },
    en: {
      readMore: 'Read article',
      backToArticles: 'Back to articles',
      previousArticle: 'Previous article',
      nextArticle: 'Next article',
      emptyArticleTitle: 'No articles yet',
      emptyArticleDesc: 'Open editor.html to add your first article.',
      emptyArticleMetaLabel: 'Content manager',
      emptyArticleMetaStatus: 'Waiting for new content',
      openEditor: 'Open editor',
      contentEmpty: 'No content yet',
      contentEmptyDesc: 'Open editor.html and start writing your first article.',
      articleDetailBadge: 'Article Detail',
      articleDetailSuffix: 'Article Detail',
      articleDetailEmptyHint: 'Add content first',
      articleDetailBackHint: 'Go back to the article list first.',
      articleDetailEditorHint: 'Create or edit content directly here.',
      articleDetailListHint: 'Go back to the article list and keep reading.',
      emailLabel: 'Email',
      socialLabel: 'Social',
      cooperationLabel: 'Collaboration',
      sendMail: 'Send email',
      viewWorks: 'View works',
      profileAvatarAlt: 'Asa avatar'
    }
  };

  const getCurrentLang = () => window.__currentLang || 'zh-CN';
  const getUIText = () => UI_TEXT[getCurrentLang()] || UI_TEXT['zh-CN'];
  const getLocalizedDefaultContent = () => {
    const lang = getCurrentLang();
    const localized = LOCALIZED_DEFAULT_CONTENT[lang];
    if (!localized) return clone(DEFAULT_CONTENT);

    const base = clone(DEFAULT_CONTENT);

    if (localized.about && typeof localized.about === 'object') {
      base.about = {
        ...base.about,
        ...clone(localized.about),
        stats: Array.isArray(localized.about.stats) ? clone(localized.about.stats) : base.about.stats,
        tags: Array.isArray(localized.about.tags) ? clone(localized.about.tags) : base.about.tags
      };
    }

    if (localized.contact && typeof localized.contact === 'object') {
      base.contact = {
        ...base.contact,
        ...clone(localized.contact),
        roadmapStats: Array.isArray(localized.contact.roadmapStats) ? clone(localized.contact.roadmapStats) : base.contact.roadmapStats,
        statusTags: Array.isArray(localized.contact.statusTags) ? clone(localized.contact.statusTags) : base.contact.statusTags,
        noteSteps: Array.isArray(localized.contact.noteSteps) ? clone(localized.contact.noteSteps) : base.contact.noteSteps
      };
    }

    if (Array.isArray(localized.articles)) base.articles = clone(localized.articles);

    return base;
  };

  const getGeneratedArticlesForCurrentLang = () => {
    if (!Array.isArray(generatedArticles)) return null;
    const lang = getCurrentLang();
    return generatedArticles.map((article, index) => {
      const translations = article?.translations;
      const translation = translations?.[lang] || translations?.['zh-CN'];
      if (!translation) return null;
      const id = normalizeString(article.id || article.slug, `article-${index + 1}`).trim() || `article-${index + 1}`;
      return {
        id,
        category: normalizeString(translation.category, '未分类'),
        date: normalizeString(translation.date, ''),
        title: normalizeString(translation.title, `未命名文章 ${index + 1}`),
        summary: normalizeString(translation.summary, ''),
        body: normalizeString(translation.body, ''),
        sections: Array.isArray(translation.sections) ? translation.sections.map((section, sectionIndex) => ({
          title: normalizeString(section?.title, `正文 ${sectionIndex + 1}`),
          content: normalizeString(section?.content, '')
        })).filter((section) => section.title.trim() || section.content.trim()) : [],
        cover: normalizeString(translation.cover, ''),
        tags: normalizeTextList(translation.tags)
      };
    }).filter(Boolean);
  };

  const clone = (value) => JSON.parse(JSON.stringify(value));

  const normalizeString = (value, fallback = '') => typeof value === 'string' ? value : fallback;
  const normalizeTextList = (value) => Array.isArray(value)
    ? value.map((item) => normalizeString(item).trim()).filter(Boolean)
    : [];

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));

  const normalizeStats = (value, fallback) => fallback.map((item, index) => ({
    label: normalizeString(value?.[index]?.label, item.label),
    value: normalizeString(value?.[index]?.value, item.value)
  }));

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

  const normalizeContent = (value) => {
    const base = getLocalizedDefaultContent();
    if (!value || typeof value !== 'object') return base;

    if (value.about && typeof value.about === 'object') {
      base.about = {
        ...base.about,
        ...value.about,
        avatar: normalizeString(value.about.avatar, base.about.avatar),
        stats: normalizeStats(value.about.stats, base.about.stats)
      };
      if ('tags' in value.about) base.about.tags = normalizeTextList(value.about.tags);
    }

    if (value.contact && typeof value.contact === 'object') {
      base.contact = {
        ...base.contact,
        ...value.contact,
        roadmapStats: normalizeStats(value.contact.roadmapStats, base.contact.roadmapStats)
      };
      if ('statusTags' in value.contact) base.contact.statusTags = normalizeTextList(value.contact.statusTags);
      if ('noteSteps' in value.contact) base.contact.noteSteps = normalizeTextList(value.contact.noteSteps);
    }

    if (value.gallery && typeof value.gallery === 'object') {
      base.gallery = normalizeGallery(value.gallery, base.gallery);
    }

    return base;
  };

  const loadContent = () => {
    try {
      const raw = localStorage.getItem(CONTENT_STORAGE_KEY);
      const content = normalizeContent(raw ? JSON.parse(raw) : null);
      const articles = getGeneratedArticlesForCurrentLang();
      if (articles) content.articles = articles;
      return content;
    } catch {
      const content = getLocalizedDefaultContent();
      const articles = getGeneratedArticlesForCurrentLang();
      if (articles) content.articles = articles;
      return content;
    }
  };

  const saveContent = (content) => {
    const normalized = normalizeContent(content);
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  };

  const parseInlineList = (value) => String(value ?? '')
    .split(/[\n,，]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  const parseLineList = (value) => String(value ?? '')
    .split(/\n+/)
    .map((item) => item.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean);

  const attachGlowEffect = (root = document) => {
    root.querySelectorAll('.card, .hero-point, .scene-card, .portrait-card, .panel-card, .work-card, .article-card, .article-feature-card, .music-player, .music-side, .footer-card, .quick-card, .detail-nav-card, .detail-cover-card, .contact-card, .gallery-album-card, .gallery-empty-card').forEach((card) => {
      if (card.dataset.glowReady === '1') return;
      card.dataset.glowReady = '1';
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });
    });
  };

  const showRevealItems = (root = document) => {
    root.querySelectorAll('.reveal').forEach((node) => node.classList.add('show'));
  };

  const renderParagraphs = (text) => String(text ?? '')
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `<p>${escapeHtml(item)}</p>`)
    .join('');

  const renderTagList = (items) => {
    const tags = Array.isArray(items) ? items : [];
    return tags.length
      ? `<div class="tag-list">${tags.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div>`
      : '';
  };

  const renderArticleMeta = (...items) => {
    const meta = items.map((item) => normalizeString(item).trim()).filter(Boolean);
    return meta.length
      ? `<div class="article-meta">${meta.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div>`
      : '';
  };

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

  const parseArticleSections = (body) => {
    const content = String(body ?? '').trim();
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

  const renderReadingContent = (sections) => `
    <article class="article-reading reveal show">
      ${sections.map((section) => `
        <section class="article-reading-section">
          <h2>${escapeHtml(section.title)}</h2>
          ${renderParagraphs(section.content)}
        </section>
      `).join('')}
    </article>
  `;

  const renderArticleFeatureVisual = (article, className = '') => `
    <div class="article-feature-visual ${className}">
      ${renderArticleCover(article, 'article-feature-cover')}
    </div>
  `;

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

  const renderArticlesPage = (siteContent) => {
    const container = document.getElementById('articles-list');
    if (!container) return;

    const ui = getUIText();

    if (!siteContent.articles.length) {
      container.innerHTML = `
        <article class="article-card reveal show">
          ${renderArticleMeta(ui.emptyArticleMetaLabel, ui.emptyArticleMetaStatus)}
          <h3>${escapeHtml(ui.emptyArticleTitle)}</h3>
          <p>${escapeHtml(ui.emptyArticleDesc)}</p>
          <div class="article-actions"><a class="mini-link" href="./editor.html">${escapeHtml(ui.openEditor)}</a></div>
        </article>
      `;
      attachGlowEffect(container);
      return;
    }

    container.innerHTML = siteContent.articles.map((article) => `
      <article class="article-feature-card reveal show">
        ${renderArticleCover(article, 'article-card-cover')}
        <div class="article-feature-body">
          ${renderArticleMeta(article.category, article.date)}
          <h3>${escapeHtml(article.title)}</h3>
          <p>${escapeHtml(article.summary)}</p>
          <div class="article-card-tags">${renderTagList(article.tags)}</div>
          <div class="article-actions"><a class="mini-link" href="./article-detail.html?id=${encodeURIComponent(article.id)}">${escapeHtml(ui.readMore)}</a></div>
        </div>
      </article>
    `).join('');

    attachGlowEffect(container);
    initArticleCoverFrames(container);
  };

  const renderProfileAvatar = (siteContent) => {
    const mount = document.getElementById('profile-avatar-mount');
    if (!mount) return;

    const avatar = siteContent.about?.avatar?.trim();
    if (avatar) {
      mount.innerHTML = `<img class="profile-avatar-image" src="${escapeHtml(avatar)}" alt="${escapeHtml(getUIText().profileAvatarAlt)}" />`;
      return;
    }

    mount.innerHTML = `
      <div class="avatar">
        <div class="avatar-shadow"></div><div class="hair-back"></div><div class="face"></div><div class="ear left"></div><div class="ear right"></div><div class="hair-front"></div><div class="hair-shine"></div><div class="brow left"></div><div class="brow right"></div><div class="eye left"></div><div class="eye right"></div><div class="nose"></div><div class="mouth"></div><div class="neck"></div><div class="shirt"></div><div class="jacket"></div><div class="collar left"></div><div class="collar right"></div><div class="tie"></div><div class="shoulder-glow"></div>
      </div>
    `;
  };

  const renderAboutPage = (siteContent) => {
    const container = document.getElementById('about-content');
    if (!container) return;

    const { about } = siteContent;
    container.innerHTML = `
      <article class="card reveal show">
        <h3>${escapeHtml(about.title)}</h3>
        ${renderParagraphs(about.intro)}
        <div class="quote-box">${escapeHtml(about.quote)}</div>
        ${renderTagList(about.tags)}
      </article>
      <article class="card reveal show">
        <h3>${escapeHtml(about.sideTitle)}</h3>
        ${renderParagraphs(about.sideIntro)}
        <div class="mini-stats">
          ${about.stats.map((item) => `
            <div class="stat"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>
          `).join('')}
        </div>
      </article>
    `;

    attachGlowEffect(container);
  };

  const renderContactPage = (siteContent) => {
    const container = document.getElementById('contact-content');
    if (!container) return;

    const ui = getUIText();
    const { contact } = siteContent;
    const email = contact.email.trim();
    const mailButton = email
      ? `<a class="mini-link" href="mailto:${encodeURIComponent(email)}">${escapeHtml(ui.sendMail)}</a>`
      : '';

    container.innerHTML = `
      <article class="contact-card reveal show">
        <h3>${escapeHtml(contact.cardTitle)}</h3>
        ${renderParagraphs(contact.intro)}
        <div class="contact-info-item"><span>${escapeHtml(ui.emailLabel)}</span><strong>${escapeHtml(contact.email)}</strong></div>
        <div class="contact-info-item"><span>${escapeHtml(ui.socialLabel)}</span><strong>${escapeHtml(contact.social)}</strong></div>
        <div class="contact-info-item"><span>${escapeHtml(ui.cooperationLabel)}</span><strong>${escapeHtml(contact.cooperation)}</strong></div>
        <div class="contact-actions">${mailButton}<a class="mini-link" href="./works.html">${escapeHtml(ui.viewWorks)}</a></div>
      </article>
      <article class="contact-card reveal show">
        <h3>${escapeHtml(contact.statusTitle)}</h3>
        ${renderParagraphs(contact.statusText)}
        ${renderTagList(contact.statusTags)}
      </article>
      <article class="contact-card reveal show">
        <h3>${escapeHtml(contact.roadmapTitle)}</h3>
        ${renderParagraphs(contact.roadmapText)}
        <div class="mini-stats">
          ${contact.roadmapStats.map((item) => `
            <div class="stat"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>
          `).join('')}
        </div>
      </article>
      <article class="contact-card reveal show">
        <h3>${escapeHtml(contact.noteTitle)}</h3>
        ${renderParagraphs(contact.noteText)}
        <ul class="contact-list">
          ${contact.noteSteps.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </article>
    `;

    attachGlowEffect(container);
  };

  const renderArticleDetailPage = (siteContent) => {
    const hero = document.getElementById('article-detail-hero');
    const content = document.getElementById('article-detail-content');
    const nav = document.getElementById('article-detail-nav');
    if (!hero || !content || !nav) return;

    const ui = getUIText();

    if (!siteContent.articles.length) {
      hero.innerHTML = `<span class="section-badge">${escapeHtml(ui.articleDetailBadge)}</span><h1>${escapeHtml(ui.emptyArticleTitle)}<span>${escapeHtml(ui.articleDetailEmptyHint)}</span></h1><p>${escapeHtml(ui.emptyArticleDesc)}</p>`;
      content.innerHTML = renderReadingContent([{ title: ui.contentEmpty, content: ui.contentEmptyDesc }]);
      nav.innerHTML = `<a class="detail-nav-card" href="./articles.html"><h3>${escapeHtml(ui.backToArticles)}</h3><p>${escapeHtml(ui.articleDetailBackHint)}</p></a><a class="detail-nav-card" href="./editor.html"><h3>${escapeHtml(ui.openEditor)}</h3><p>${escapeHtml(ui.articleDetailEditorHint)}</p></a>`;
      showRevealItems(document);
      attachGlowEffect(content);
      attachGlowEffect(nav);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const requestedId = params.get('id');
    const currentIndex = Math.max(0, siteContent.articles.findIndex((item) => item.id === requestedId));
    const article = siteContent.articles[currentIndex] || siteContent.articles[0];
    const sections = article.sections?.length ? article.sections : parseArticleSections(article.body);
    const previous = siteContent.articles[currentIndex - 1];
    const next = siteContent.articles[currentIndex + 1];

    hero.innerHTML = `
      <div class="article-detail-hero-grid">
        <div class="article-detail-copy">
          <span class="section-badge">${escapeHtml(ui.articleDetailBadge)}</span>
          <h1>${escapeHtml(article.title)}</h1>
          <p>${escapeHtml(article.summary)}</p>
          ${renderArticleMeta(article.category, article.date)}
          ${renderTagList(article.tags)}
          <div class="article-actions"><a class="mini-link" href="./articles.html">${escapeHtml(ui.backToArticles)}</a></div>
        </div>
        ${renderArticleCover(article, 'detail-article-cover')}
      </div>
    `;

    content.innerHTML = renderReadingContent(sections.length ? sections : [{ title: ui.contentEmpty, content: ui.contentEmptyDesc }]);

    const navCards = [];
    if (previous) {
      navCards.push(`<a class="detail-nav-card" href="./article-detail.html?id=${encodeURIComponent(previous.id)}"><h3>${escapeHtml(ui.previousArticle)}</h3><p>${escapeHtml(previous.title)}</p></a>`);
    }
    navCards.push(`<a class="detail-nav-card" href="./articles.html"><h3>${escapeHtml(ui.backToArticles)}</h3><p>${escapeHtml(ui.articleDetailListHint)}</p></a>`);
    if (next) {
      navCards.push(`<a class="detail-nav-card" href="./article-detail.html?id=${encodeURIComponent(next.id)}"><h3>${escapeHtml(ui.nextArticle)}</h3><p>${escapeHtml(next.title)}</p></a>`);
    }
    nav.innerHTML = navCards.join('');

    document.title = `${article.title} · ${ui.articleDetailSuffix}`;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', article.summary || article.title);

    showRevealItems(document);
    attachGlowEffect(content);
    attachGlowEffect(nav);
    initArticleCoverFrames(hero);
    initArticleCoverFrames(content);
  };

  const hashAccessCode = async (value) => {
    if (window.crypto?.subtle && window.TextEncoder) {
      const data = new TextEncoder().encode(value);
      const digest = await window.crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(digest)).map((item) => item.toString(16).padStart(2, '0')).join('');
    }

    return Array.from(String(value)).reduce((hash, char) => ((hash << 5) - hash) + char.charCodeAt(0), 0).toString(16);
  };

  const initEditorPage = () => {
    const authCard = document.getElementById('editor-auth');
    const editorApp = document.getElementById('editor-app');
    if (!authCard || !editorApp) return;

    document.title = '私密内容管理';
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', '本地私密内容管理页，用来修改关于我、图库与联系信息。');

    let siteContent = loadContent();
    let selectedGalleryAlbumId = siteContent.gallery?.albums?.[0]?.id || null;

    const feedback = document.getElementById('editor-feedback');
    const aboutAvatarUrl = document.getElementById('about-avatar-url');
    const aboutAvatarFile = document.getElementById('about-avatar-file');
    const galleryAlbumSelect = document.getElementById('gallery-album-select');
    const galleryImageFile = document.getElementById('gallery-image-file');

    const showFeedback = (message, isError = false) => {
      if (!feedback) return;
      feedback.textContent = message;
      feedback.classList.toggle('error-text', isError);
    };

    const lockEditor = () => {
      sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
      editorApp.classList.add('is-hidden');
      authCard.classList.remove('is-hidden');
      renderAuth();
    };

    const fillAboutForm = () => {
      const { about } = siteContent;
      if (aboutAvatarUrl) aboutAvatarUrl.value = about.avatar || '';
      if (aboutAvatarFile) aboutAvatarFile.value = '';
      document.getElementById('about-title').value = about.title;
      document.getElementById('about-intro').value = about.intro;
      document.getElementById('about-quote').value = about.quote;
      document.getElementById('about-tags').value = about.tags.join('，');
      document.getElementById('about-side-title').value = about.sideTitle;
      document.getElementById('about-side-intro').value = about.sideIntro;
      about.stats.forEach((item, index) => {
        document.getElementById(`about-stat-label-${index + 1}`).value = item.label;
        document.getElementById(`about-stat-value-${index + 1}`).value = item.value;
      });
    };

    const fillContactForm = () => {
      const { contact } = siteContent;
      document.getElementById('contact-card-title').value = contact.cardTitle;
      document.getElementById('contact-intro').value = contact.intro;
      document.getElementById('contact-email').value = contact.email;
      document.getElementById('contact-social').value = contact.social;
      document.getElementById('contact-cooperation').value = contact.cooperation;
      document.getElementById('contact-status-title').value = contact.statusTitle;
      document.getElementById('contact-status-text').value = contact.statusText;
      document.getElementById('contact-status-tags').value = contact.statusTags.join('，');
      document.getElementById('contact-roadmap-title').value = contact.roadmapTitle;
      document.getElementById('contact-roadmap-text').value = contact.roadmapText;
      document.getElementById('contact-note-title').value = contact.noteTitle;
      document.getElementById('contact-note-text').value = contact.noteText;
      document.getElementById('contact-note-steps').value = contact.noteSteps.join('\n');
      contact.roadmapStats.forEach((item, index) => {
        document.getElementById(`contact-roadmap-label-${index + 1}`).value = item.label;
        document.getElementById(`contact-roadmap-value-${index + 1}`).value = item.value;
      });
    };

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

    const fillAllForms = () => {
      fillAboutForm();
      fillContactForm();
      fillGalleryAlbumForm();
    };

    const unlockEditor = () => {
      authCard.classList.add('is-hidden');
      editorApp.classList.remove('is-hidden');
      siteContent = loadContent();
      selectedGalleryAlbumId = siteContent.gallery?.albums?.[0]?.id || selectedGalleryAlbumId;
      fillAllForms();
      showFeedback('保存后刷新前台页面，就能看到最新内容。');
    };

    const renderAuth = () => {
      const hasAccessCode = Boolean(localStorage.getItem(AUTH_HASH_STORAGE_KEY));
      const savedSession = sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY) === '1';
      if (savedSession && hasAccessCode) {
        unlockEditor();
        return;
      }

      authCard.innerHTML = hasAccessCode ? `
        <h3>输入访问码</h3>
        <p>当前内容管理页已开启本地访问保护。输入你的访问码后才能编辑内容。</p>
        <form id="editor-login-form" class="editor-form">
          <div class="field-group">
            <label for="editor-login-password">访问码</label>
            <input id="editor-login-password" type="password" placeholder="请输入访问码" autocomplete="current-password" />
          </div>
          <div class="editor-toolbar">
            <button class="button primary small" type="submit">进入管理页</button>
          </div>
          <p id="editor-auth-message" class="helper-text">提示：这是后端本地保护，内容只保存在当前浏览器。</p>
        </form>
      ` : `
        <h3>先创建一个访问码</h3>
        <p>这是一个纯后端的本地私密页面。访问码会保存在当前浏览器里，用来拦住别人直接打开编辑界面。</p>
        <form id="editor-setup-form" class="editor-form">
          <div class="field-grid two">
            <div class="field-group">
              <label for="editor-setup-password">新访问码</label>
              <input id="editor-setup-password" type="password" placeholder="至少 4 位" autocomplete="new-password" />
            </div>
            <div class="field-group">
              <label for="editor-setup-confirm">确认访问码</label>
              <input id="editor-setup-confirm" type="password" placeholder="再次输入访问码" autocomplete="new-password" />
            </div>
          </div>
          <div class="editor-toolbar">
            <button class="button primary small" type="submit">创建并进入管理页</button>
          </div>
          <p id="editor-auth-message" class="helper-text">说明：当前版本属于浏览器本地保护，不是服务端登录系统。</p>
        </form>
      `;

      const authMessage = document.getElementById('editor-auth-message');
      const loginForm = document.getElementById('editor-login-form');
      const setupForm = document.getElementById('editor-setup-form');

      if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          const password = document.getElementById('editor-login-password').value;
          const savedHash = localStorage.getItem(AUTH_HASH_STORAGE_KEY);
          if (!password) {
            authMessage.textContent = '请先输入访问码。';
            return;
          }

          const currentHash = await hashAccessCode(password);
          if (currentHash !== savedHash) {
            authMessage.textContent = '访问码不正确，请重试。';
            return;
          }

          sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, '1');
          unlockEditor();
        });
      }

      if (setupForm) {
        setupForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          const password = document.getElementById('editor-setup-password').value;
          const confirm = document.getElementById('editor-setup-confirm').value;
          if (password.trim().length < 4) {
            authMessage.textContent = '访问码至少需要 4 位。';
            return;
          }
          if (password !== confirm) {
            authMessage.textContent = '两次输入的访问码不一致。';
            return;
          }

          localStorage.setItem(AUTH_HASH_STORAGE_KEY, await hashAccessCode(password));
          sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, '1');
          unlockEditor();
        });
      }
    };

    document.getElementById('editor-lock')?.addEventListener('click', lockEditor);

    const persistAboutContent = () => {
      siteContent.about = {
        avatar: aboutAvatarUrl?.value.trim() || '',
        title: document.getElementById('about-title').value.trim(),
        intro: document.getElementById('about-intro').value.trim(),
        quote: document.getElementById('about-quote').value.trim(),
        tags: parseInlineList(document.getElementById('about-tags').value),
        sideTitle: document.getElementById('about-side-title').value.trim(),
        sideIntro: document.getElementById('about-side-intro').value.trim(),
        stats: [1, 2, 3, 4].map((index) => ({
          label: document.getElementById(`about-stat-label-${index}`).value.trim(),
          value: document.getElementById(`about-stat-value-${index}`).value.trim()
        }))
      };
      siteContent = saveContent(siteContent);
      fillAboutForm();
    };

    document.getElementById('about-save')?.addEventListener('click', () => {
      persistAboutContent();
      showFeedback('“关于我”内容已保存。');
    });

    aboutAvatarFile?.addEventListener('change', () => {
      const file = aboutAvatarFile.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string' && aboutAvatarUrl) {
          aboutAvatarUrl.value = reader.result;
          persistAboutContent();
          showFeedback('头像图片已保存。');
        }
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('contact-save')?.addEventListener('click', () => {
      siteContent.contact = {
        cardTitle: document.getElementById('contact-card-title').value.trim(),
        intro: document.getElementById('contact-intro').value.trim(),
        email: document.getElementById('contact-email').value.trim(),
        social: document.getElementById('contact-social').value.trim(),
        cooperation: document.getElementById('contact-cooperation').value.trim(),
        statusTitle: document.getElementById('contact-status-title').value.trim(),
        statusText: document.getElementById('contact-status-text').value.trim(),
        statusTags: parseInlineList(document.getElementById('contact-status-tags').value),
        roadmapTitle: document.getElementById('contact-roadmap-title').value.trim(),
        roadmapText: document.getElementById('contact-roadmap-text').value.trim(),
        roadmapStats: [1, 2, 3, 4].map((index) => ({
          label: document.getElementById(`contact-roadmap-label-${index}`).value.trim(),
          value: document.getElementById(`contact-roadmap-value-${index}`).value.trim()
        })),
        noteTitle: document.getElementById('contact-note-title').value.trim(),
        noteText: document.getElementById('contact-note-text').value.trim(),
        noteSteps: parseLineList(document.getElementById('contact-note-steps').value)
      };
      siteContent = saveContent(siteContent);
      fillContactForm();
      showFeedback('联系页内容已保存。');
    });

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

    renderAuth();
  };

  const renderAllDynamicContent = () => {
    const siteContent = loadContent();
    renderArticlesPage(siteContent);
    renderProfileAvatar(siteContent);
    renderAboutPage(siteContent);
    renderContactPage(siteContent);
    renderArticleDetailPage(siteContent);
    renderHomeGalleryPreview(siteContent);
    renderGalleryPage(siteContent);
    renderGalleryDetailPage(siteContent);
    showRevealItems(document);
  };

  const loadGeneratedArticles = async () => {
    try {
      const response = await fetch(ARTICLE_DATA_URL);
      if (!response.ok) return;
      const articles = await response.json();
      if (!Array.isArray(articles)) return;
      generatedArticles = articles;
      renderAllDynamicContent();
    } catch {}
  };

  window.__rerenderDynamicContent = renderAllDynamicContent;

  renderAllDynamicContent();
  loadGeneratedArticles();
  initEditorPage();

  window.addEventListener('storage', (event) => {
    if (event.key === CONTENT_STORAGE_KEY) renderAllDynamicContent();
  });
})();
