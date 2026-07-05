import { createContext, useContext, useEffect, useState } from 'react'

// 货币：马来西亚令吉 RM / Malaysian Ringgit
export const CURRENCY = 'RM'
export function money(n) {
  return `${CURRENCY}${Math.round(n)}`
}

// ---- UI 文案字典 ----
const DICT = {
  zh: {
    'brand.name': '阿发水晶阁',
    'brand.full': '阿发水晶阁 · AH HUAT CRYSTAL PAVILION',
    'brand.tagline': '专属定制 · 水晶能量手链',
    'brand.footer': '阿发水晶阁 · 用心传递每一份能量',

    'nav.home': '首页',
    'nav.design': '设计',
    'nav.discover': '发现',
    'nav.order': '订单',
    'nav.me': '我的',

    'header.home.title': '阿发水晶阁',
    'header.home.sub': '水晶手链 DIY · Crystal Bracelet DIY',
    'header.design.title': '自由设计',
    'header.design.sub': '选择水晶 · 设计搭配',
    'header.discover.title': '发现',
    'header.discover.sub': '水晶能量图鉴',
    'header.order.title': '订单',
    'header.order.sub': '我的定制记录',
    'header.me.title': '我的',
    'header.me.sub': '阿发水晶阁 会员',
    'header.save': '保存设计',

    'home.heroTitle1': '设计专属你的',
    'home.heroTitle2': '水晶能量手链',
    'home.heroSub': '选择水晶 · 设计搭配 · 制作专属',
    'home.start': '开始设计',
    'feat.design': '自由设计',
    'feat.design.d': '自由搭配水晶',
    'feat.ai': 'AI 推荐',
    'feat.ai.d': '智能搭配建议',
    'feat.energy': '能量解读',
    'feat.energy.d': '解读水晶能量',
    'feat.order': '一键下单',
    'feat.order.d': '定制专属手链',
    'home.popular': '热门推荐',
    'home.more': '更多',
    'home.ai.title': 'AI 智能搭配推荐',
    'home.ai.sub': '告诉我们你的需求，AI 为你推荐最合适的水晶组合',
    'home.ai.btn': '开始智能推荐',
    'home.know': '水晶知识',
    'home.know.title': '不同水晶的能量与功效',
    'home.know.desc': '了解各种水晶的独特能量，选择最适合你的水晶伙伴，让能量伴你左右。',
    'home.know.read': '1234 人已阅读',

    'step.choose': '选择水晶',
    'step.arrange': '设计搭配',
    'step.finish': '完成设计',
    'design.size': '选择珠径',
    'design.search': '搜索水晶 · 名称或功效',
    'design.noResult': '没有找到匹配的水晶',
    'design.energyRead': '能量解读',
    'design.preview': '手链预览',
    'design.selectedN': '已选择 {0} 颗水晶',
    'rail.clear': '清空',
    'rail.undo': '撤销',
    'rail.redo': '重做',
    'rail.random': '随机',
    'design.selected': '已选中',
    'design.delete': '删除',
    'stat.length': '周长',
    'stat.weight': '重量',
    'stat.count': '颗数',
    'unit.cm': 'cm',
    'unit.g': 'g',
    'unit.pcs': '颗',
    'design.wrist': '手围',
    'design.aiRec': 'AI 推荐 {0} 颗（{1}mm）',
    'design.stillNeed': '，还差 {0} 颗',
    'design.autoFill': '自动补齐',
    'design.reached': '已达到推荐颗数',
    'design.filled': '已自动补齐 {0} 颗',
    'design.smart': '智能搭配',
    'design.finish': '完成设计',
    'design.addFirst': '先添加水晶吧',
    'design.added': '已添加 {0} · {1}mm',
    'design.randomToast': '随机搭配 ✨',
    'design.strip': '点击左侧水晶加入手链，长按拖拽可调整顺序',
    'design.addToBracelet': '加入手链',
    'design.unitPrice': '当前 {0}mm 单价',
    'design.element': '五行',
    'design.noBeads': '未添加水晶',
    'design.selN': '已选 {0} 颗',
    'design.done': '完成',
    'design.emptyRing': '空手链 · 去添加水晶吧',

    'smart.title': '智能搭配推荐',
    'smart.sub': '将为你生成约 {0} 颗的手链方案',
    'smart.tab.ai': 'AI 推荐',
    'smart.tab.element': '五行',
    'smart.tab.color': '幸运色',
    'smart.tab.zodiac': '星座',
    'smart.tab.birthday': '生日',
    'smart.aiHint': '告诉我们你的心愿，AI 为你推荐最合适的水晶组合 ✨',
    'smart.generate': '生成',
    'smart.elementHint': '依五行属性平衡能量，选择你想加强的一行。',
    'smart.birthday.input': '输入你的生日',
    'smart.birthday.theme': '生日能量主题',
    'smart.birthday.zodiac': '本命星座',
    'smart.birthday.btn': '生成我的生日能量手链',

    'export.title': '生成成品图',
    'export.sub': '保存、分享或导出你的专属手链',
    'export.tab.product': '产品图',
    'export.tab.share': '分享图',
    'export.png': '保存 PNG',
    'export.share': '分享图片',
    'export.pdf': '导出 PDF',
    'export.pdf.busy': '导出中…',
    'export.generating': '生成中…',
    'export.savedPng': '已保存 PNG 到下载',
    'export.savedShare': '分享图已保存',
    'export.savedPdf': '已导出 PDF',
    'export.failed': '导出失败，请重试',
    'export.shareTitle': '我的水晶能量手链',
    'export.shareText': '来看看我设计的专属手链 ✨',
    'export.img.length': '周长',
    'export.img.weight': '约',
    'export.img.wrist': '手围',
    'export.img.empty': '空手链 · 去添加水晶吧',
    'export.img.qr': '长按识别 · 定制你的专属能量手链',

    'discover.cta': '去设计我的手链',
    'discover.element': '五行',
    'order.empty.title': '还没有订单',
    'order.empty.desc': '设计一条专属你的水晶能量手链，开启定制之旅。',
    'order.empty.btn': '立即设计',
    'me.member': '阿发水晶阁会员',
    'me.member.sub': '定制你的专属能量',
    'me.dark': '深色模式',
    'me.dark.sub': '跟随心情自由切换',
    'me.row.designs': '我的设计',
    'me.row.designs.v': '3 条草稿',
    'me.row.fav': '收藏水晶',
    'me.row.fav.v': '8 种',
    'me.row.profile': '能量档案',
    'me.row.profile.v': '已完善',
    'me.row.about': '关于阿发水晶阁',
    'me.row.about.v': 'v1.0.0',
  },
  en: {
    'brand.name': 'AH HUAT CRYSTAL PAVILION',
    'brand.full': 'AH HUAT CRYSTAL PAVILION',
    'brand.tagline': 'Custom Made · Crystal Energy Bracelet',
    'brand.footer': 'AH HUAT CRYSTAL PAVILION · crafted energy in every bead',

    'nav.home': 'Home',
    'nav.design': 'Design',
    'nav.discover': 'Discover',
    'nav.order': 'Orders',
    'nav.me': 'Me',

    'header.home.title': 'AH HUAT CRYSTAL PAVILION',
    'header.home.sub': 'Crystal Bracelet DIY',
    'header.design.title': 'Free Design',
    'header.design.sub': 'Pick crystals · Arrange',
    'header.discover.title': 'Discover',
    'header.discover.sub': 'Crystal Energy Guide',
    'header.order.title': 'Orders',
    'header.order.sub': 'My custom records',
    'header.me.title': 'Me',
    'header.me.sub': 'AH HUAT Member',
    'header.save': 'Save',

    'home.heroTitle1': 'Design your own',
    'home.heroTitle2': 'Crystal Energy Bracelet',
    'home.heroSub': 'Choose · Arrange · Craft yours',
    'home.start': 'Start Designing',
    'feat.design': 'Free Design',
    'feat.design.d': 'Mix crystals freely',
    'feat.ai': 'AI Picks',
    'feat.ai.d': 'Smart suggestions',
    'feat.energy': 'Energy',
    'feat.energy.d': 'Decode crystal energy',
    'feat.order': 'Order',
    'feat.order.d': 'Custom bracelet',
    'home.popular': 'Popular',
    'home.more': 'More',
    'home.ai.title': 'AI Smart Matching',
    'home.ai.sub': 'Tell us your wish — AI recommends the best crystal combo for you',
    'home.ai.btn': 'Start AI Matching',
    'home.know': 'Crystal Knowledge',
    'home.know.title': 'Energies & effects of crystals',
    'home.know.desc': 'Learn the unique energy of each crystal and choose the partner that suits you best.',
    'home.know.read': '1,234 reads',

    'step.choose': 'Choose',
    'step.arrange': 'Arrange',
    'step.finish': 'Finish',
    'design.size': 'Bead size',
    'design.search': 'Search crystals · name or effect',
    'design.noResult': 'No matching crystals',
    'design.energyRead': 'Energy',
    'design.preview': 'Bracelet Preview',
    'design.selectedN': '{0} crystals selected',
    'rail.clear': 'Clear',
    'rail.undo': 'Undo',
    'rail.redo': 'Redo',
    'rail.random': 'Random',
    'design.selected': 'Selected',
    'design.delete': 'Delete',
    'stat.length': 'Length',
    'stat.weight': 'Weight',
    'stat.count': 'Beads',
    'unit.cm': 'cm',
    'unit.g': 'g',
    'unit.pcs': 'pcs',
    'design.wrist': 'Wrist',
    'design.aiRec': 'AI suggests {0} beads ({1}mm)',
    'design.stillNeed': ', {0} more',
    'design.autoFill': 'Auto-fill',
    'design.reached': 'Recommended count reached',
    'design.filled': 'Auto-filled {0} beads',
    'design.smart': 'Smart Match',
    'design.finish': 'Finish',
    'design.addFirst': 'Add crystals first',
    'design.added': 'Added {0} · {1}mm',
    'design.randomToast': 'Random mix ✨',
    'design.strip': 'Tap a crystal on the left to add; drag to reorder',
    'design.addToBracelet': 'Add to bracelet',
    'design.unitPrice': 'Unit price ({0}mm)',
    'design.element': 'Element',
    'design.noBeads': 'No crystals yet',
    'design.selN': '{0} selected',
    'design.done': 'Done',
    'design.emptyRing': 'Empty · add some crystals',

    'smart.title': 'Smart Recommendation',
    'smart.sub': "We'll generate about {0} beads",
    'smart.tab.ai': 'AI',
    'smart.tab.element': 'Elements',
    'smart.tab.color': 'Colors',
    'smart.tab.zodiac': 'Zodiac',
    'smart.tab.birthday': 'Birthday',
    'smart.aiHint': 'Tell us your wish — AI matches the best crystals for you ✨',
    'smart.generate': 'Generate',
    'smart.elementHint': 'Balance your energy by the Five Elements — pick one to strengthen.',
    'smart.birthday.input': 'Enter your birthday',
    'smart.birthday.theme': 'Birthday energy theme',
    'smart.birthday.zodiac': 'Your zodiac',
    'smart.birthday.btn': 'Generate my birthday bracelet',

    'export.title': 'Product Image',
    'export.sub': 'Save, share or export your bracelet',
    'export.tab.product': 'Product',
    'export.tab.share': 'Share',
    'export.png': 'Save PNG',
    'export.share': 'Share',
    'export.pdf': 'Export PDF',
    'export.pdf.busy': 'Exporting…',
    'export.generating': 'Generating…',
    'export.savedPng': 'PNG saved to downloads',
    'export.savedShare': 'Share image saved',
    'export.savedPdf': 'PDF exported',
    'export.failed': 'Export failed, try again',
    'export.shareTitle': 'My Crystal Energy Bracelet',
    'export.shareText': 'Check out the bracelet I designed ✨',
    'export.img.length': 'Length',
    'export.img.weight': '~',
    'export.img.wrist': 'Wrist',
    'export.img.empty': 'Empty · add some crystals',
    'export.img.qr': 'Scan to customise your own energy bracelet',

    'discover.cta': 'Design my bracelet',
    'discover.element': 'Element',
    'order.empty.title': 'No orders yet',
    'order.empty.desc': 'Design a crystal energy bracelet made just for you.',
    'order.empty.btn': 'Design now',
    'me.member': 'AH HUAT Member',
    'me.member.sub': 'Customise your own energy',
    'me.dark': 'Dark Mode',
    'me.dark.sub': 'Switch freely with your mood',
    'me.row.designs': 'My Designs',
    'me.row.designs.v': '3 drafts',
    'me.row.fav': 'Saved Crystals',
    'me.row.fav.v': '8 kinds',
    'me.row.profile': 'Energy Profile',
    'me.row.profile.v': 'Complete',
    'me.row.about': 'About',
    'me.row.about.v': 'v1.0.0',
  },
}

// ---- 水晶英文数据（名称沿用 pinyin） ----
export const CRYSTAL_I18N = {
  clear: { keywords: ['Purify', 'Balance'], energy: 'King of crystals — pure and clear. Cleanses your field, balances body and mind, and amplifies the energy of other stones.' },
  amethyst: { keywords: ['Wisdom', 'Calm'], energy: 'Stone of spirit. Calms the mind, sharpens focus and sleep, dissolves anxiety and brings serene clarity.' },
  rose: { keywords: ['Love', 'Gentle'], energy: 'Stone of love with a tender pink glow. Boosts relationships and charm, softening the heart with warmth and security.' },
  citrine: { keywords: ['Wealth', 'Success'], energy: 'Stone of wealth and confidence. Gathers positive energy for smooth careers and decisive action, bringing abundance and joy.' },
  'green-phantom': { keywords: ['Wealth', 'Career'], energy: 'Stone of steady wealth. Fuels career growth and helpful mentors, turning effort into lasting fortune.' },
  'tiger-eye': { keywords: ['Courage', 'Confidence'], energy: 'Stone of courage with a shimmering eye. Strengthens aura and decisiveness, wards off negativity, keeps you calm and bold.' },
  obsidian: { keywords: ['Protect', 'Ward'], energy: 'Stone of protection. Absorbs negative energy, steadies emotions and forms a strong shield — best worn on the right hand.' },
  moonstone: { keywords: ['Intuition', 'Inspire'], energy: "Lovers' stone, gentle as moonlight. Heightens intuition and inspiration, soothes moods and draws warm connections." },
  strawberry: { keywords: ['Love', 'Charm'], energy: 'Sweet stone with golden-red needles. Boosts romance and charm, letting affection flow naturally.' },
  aquamarine: { keywords: ['Communicate', 'Truth'], energy: 'Stone of communication, calm as the sea. Opens the throat chakra for sincere, easy expression and eases inner tension.' },
  garnet: { keywords: ['Vitality', 'Energy'], energy: 'Stone of vitality, deep pomegranate red. Replenishes energy and circulation, enhancing charm and regeneration.' },
  lapis: { keywords: ['Wisdom', 'Truth'], energy: 'Stone of wisdom, royal blue flecked with gold. Opens spiritual vision and insight, guarding you and revealing truth.' },
  rutilated: { keywords: ['Wealth', 'Power'], energy: 'King of quartz, threaded with golden rutile. Powerful energy that gathers wealth, strengthens your career aura and draws helpful mentors.' },
  'red-agate': { keywords: ['Vitality', 'Calm'], energy: 'Stone of calm with a warm red glow. Nourishes blood and energy, steadies emotions, boosts courage and wards off negativity.' },
  aventurine: { keywords: ['Luck', 'Career'], energy: 'Stone of luck and gentle opportunity. Attracts fortune and good relations, eases stress and balances the heart with fresh optimism.' },
  smoky: { keywords: ['Grounding', 'Calm'], energy: 'Grounding stone in calm smoky brown. Anchors the root chakra, clears stress and clutter, wards off negativity and steadies the mind.' },
  'red-tiger-eye': { keywords: ['Vitality', 'Courage'], energy: 'Stone of passion with a red tiger sheen. Ignites vitality and drive, sparks confidence and resolve to take on any challenge.' },
  spacer: { keywords: ['Accent'], energy: '925 silver spacer, set between crystals to add depth and shine.' },
}

export const CATEGORY_I18N = { all: 'All', popular: 'Popular', wealth: 'Wealth', love: 'Love', health: 'Health', guard: 'Guard' }
export const ELEMENT_I18N = { metal: 'Metal', wood: 'Wood', water: 'Water', fire: 'Fire', earth: 'Earth' }

// 星座 / 五行 / 幸运色 / 生日 英文
export const ZODIAC_I18N = {
  aries: { name: 'Aries', note: 'Garnet ignites drive, citrine steadies the fire.' },
  taurus: { name: 'Taurus', note: 'Green phantom gathers wealth, rose softens stubbornness.' },
  gemini: { name: 'Gemini', note: 'Aquamarine aids talk, clear quartz settles the mind.' },
  cancer: { name: 'Cancer', note: 'Moonstone guards moods, rose warms the heart.' },
  leo: { name: 'Leo', note: 'Citrine gathers light, tiger eye adds regal aura.' },
  virgo: { name: 'Virgo', note: 'Clear quartz purifies, amethyst settles the thoughts.' },
  libra: { name: 'Libra', note: 'Rose boosts charm, aquamarine aids balance.' },
  scorpio: { name: 'Scorpio', note: 'Obsidian guards your field, garnet adds deep energy.' },
  sagittarius: { name: 'Sagittarius', note: 'Lapis opens wisdom, tiger eye gathers courage.' },
  capricorn: { name: 'Capricorn', note: 'Obsidian steadies will, green phantom guards career.' },
  aquarius: { name: 'Aquarius', note: 'Amethyst sparks ideas, aquamarine aids expression.' },
  pisces: { name: 'Pisces', note: 'Moonstone adds romance, amethyst steadies dreams.' },
}
export const ELEMENT_DESC_I18N = {
  metal: 'Restraint · Decision',
  wood: 'Growth · Rising',
  water: 'Flow · Wisdom',
  fire: 'Passion · Vitality',
  earth: 'Stability · Wealth',
}
export const COLOR_I18N = {
  green: { name: 'Lucky Green', meaning: 'Vitality · Wealth' },
  purple: { name: 'Wisdom Purple', meaning: 'Spirit · Mentors' },
  pink: { name: 'Peach Pink', meaning: 'Love · Charm' },
  gold: { name: 'Fortune Gold', meaning: 'Wealth · Success' },
  red: { name: 'Lucky Red', meaning: 'Vitality · Passion' },
  white: { name: 'Pure White', meaning: 'Balance · Clarity' },
  black: { name: 'Guard Black', meaning: 'Ward · Stability' },
}
export const GOAL_I18N = {
  wealth: 'Wealth & Fortune',
  love: 'Love & Romance',
  health: 'Health & Balance',
  guard: 'Protection',
  wisdom: 'Wisdom & Focus',
  career: 'Career & Mentors',
}
export const BIRTH_THEME_I18N = {
  1: 'Resilient Start', 2: 'Spiritual Awakening', 3: 'New Communication', 4: 'Pure & Fearless',
  5: 'Growth & Abundance', 6: 'Gentle Intuition', 7: 'Fierce Protection', 8: 'Radiant Confidence',
  9: 'Wisdom & Truth', 10: 'Balance & Charm', 11: 'Deep Wealth', 12: 'Clarity & Peace',
}
export const PRESET_I18N = {
  'wealth-1': { name: 'Fortune Bringer' },
  'love-1': { name: 'Love Guardian' },
  'peace-1': { name: 'Peace & Joy' },
}

// ---- Context ----
const LangCtx = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('sl-lang')
    if (saved) return saved
    return (navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en'
  })
  useEffect(() => {
    localStorage.setItem('sl-lang', lang)
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  }, [lang])

  const t = (key, ...args) => {
    let s = DICT[lang][key] ?? DICT.zh[key] ?? key
    args.forEach((a, i) => {
      s = s.replace(`{${i}}`, a)
    })
    return s
  }

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>
}

export function useLang() {
  return useContext(LangCtx)
}

// 本地化一个水晶对象的展示字段
export function localizeCrystal(crystal, lang) {
  if (!crystal) return crystal
  if (lang === 'zh') return crystal
  const en = CRYSTAL_I18N[crystal.id]
  if (!en) return crystal
  return { ...crystal, name: crystal.pinyin || crystal.name, keywords: en.keywords, energy: en.energy }
}
