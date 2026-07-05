// 智能推荐引擎（假数据 / 规则化 mock）
import { CRYSTALS, CRYSTAL_MAP } from './crystals.js'

// 十二星座 → 推荐水晶
export const ZODIACS = [
  { key: 'aries', name: '白羊座', range: '3.21–4.19', emoji: '♈', crystals: ['garnet', 'citrine', 'clear'], note: '石榴石点燃行动力，黄水晶稳住冲劲。' },
  { key: 'taurus', name: '金牛座', range: '4.20–5.20', emoji: '♉', crystals: ['green-phantom', 'rose', 'citrine'], note: '绿幽灵聚正财，粉晶柔化固执。' },
  { key: 'gemini', name: '双子座', range: '5.21–6.21', emoji: '♊', crystals: ['aquamarine', 'citrine', 'clear'], note: '海蓝宝助沟通，白水晶定心神。' },
  { key: 'cancer', name: '巨蟹座', range: '6.22–7.22', emoji: '♋', crystals: ['moonstone', 'rose', 'aquamarine'], note: '月光石护情绪，粉晶暖人心。' },
  { key: 'leo', name: '狮子座', range: '7.23–8.22', emoji: '♌', crystals: ['citrine', 'tiger-eye', 'garnet'], note: '黄水晶聚光芒，虎眼石添王者气场。' },
  { key: 'virgo', name: '处女座', range: '8.23–9.22', emoji: '♍', crystals: ['clear', 'amethyst', 'green-phantom'], note: '白水晶净化，紫水晶安放思绪。' },
  { key: 'libra', name: '天秤座', range: '9.23–10.23', emoji: '♎', crystals: ['rose', 'aquamarine', 'moonstone'], note: '粉晶旺人缘，海蓝宝助权衡。' },
  { key: 'scorpio', name: '天蝎座', range: '10.24–11.22', emoji: '♏', crystals: ['obsidian', 'garnet', 'lapis'], note: '黑曜石守护磁场，石榴石添深情能量。' },
  { key: 'sagittarius', name: '射手座', range: '11.23–12.21', emoji: '♐', crystals: ['lapis', 'citrine', 'tiger-eye'], note: '青金石开智慧，虎眼石聚勇气。' },
  { key: 'capricorn', name: '摩羯座', range: '12.22–1.19', emoji: '♑', crystals: ['obsidian', 'green-phantom', 'tiger-eye'], note: '黑曜石稳心志，绿幽灵护事业。' },
  { key: 'aquarius', name: '水瓶座', range: '1.20–2.18', emoji: '♒', crystals: ['amethyst', 'aquamarine', 'lapis'], note: '紫水晶启灵感，海蓝宝助独立表达。' },
  { key: 'pisces', name: '双鱼座', range: '2.19–3.20', emoji: '♓', crystals: ['moonstone', 'amethyst', 'aquamarine'], note: '月光石添浪漫，紫水晶稳梦境。' },
]

// 五行搭配推荐
export const FIVE_ELEMENTS = [
  { key: 'metal', name: '金', color: '#c9a94e', desc: '主收敛、决断', crystals: ['clear', 'moonstone'] },
  { key: 'wood', name: '木', color: '#4fb37e', desc: '主生发、成长', crystals: ['green-phantom', 'aventurine'] },
  { key: 'water', name: '水', color: '#3b82c4', desc: '主流通、智慧', crystals: ['obsidian', 'aquamarine', 'lapis'] },
  { key: 'fire', name: '火', color: '#d1495b', desc: '主热情、活力', crystals: ['garnet', 'strawberry', 'red-agate', 'red-tiger-eye'] },
  { key: 'earth', name: '土', color: '#b98b4e', desc: '主稳固、财富', crystals: ['citrine', 'tiger-eye', 'rutilated', 'smoky'] },
]

// 幸运颜色 → 对应水晶
export const LUCKY_COLORS = [
  { key: 'green', name: '幸运绿', hex: '#4fb37e', meaning: '生机 · 财运', crystals: ['green-phantom', 'aquamarine'] },
  { key: 'purple', name: '智慧紫', hex: '#9a6fd6', meaning: '灵性 · 贵人', crystals: ['amethyst', 'lapis'] },
  { key: 'pink', name: '桃花粉', hex: '#f3aec4', meaning: '爱情 · 人缘', crystals: ['rose', 'strawberry'] },
  { key: 'gold', name: '招财金', hex: '#f4cd66', meaning: '财富 · 成功', crystals: ['citrine', 'tiger-eye', 'rutilated'] },
  { key: 'red', name: '旺运红', hex: '#c0392b', meaning: '活力 · 热情', crystals: ['red-agate', 'red-tiger-eye', 'garnet'] },
  { key: 'white', name: '净化白', hex: '#eef1f4', meaning: '平衡 · 清明', crystals: ['clear', 'moonstone'] },
  { key: 'black', name: '守护黑', hex: '#26262b', meaning: '辟邪 · 稳定', crystals: ['obsidian'] },
]

// 生日能量：按月份给出主题与推荐（诞生石灵感）
export const BIRTH_MONTHS = [
  { m: 1, theme: '坚韧启航', crystals: ['garnet', 'clear'] },
  { m: 2, theme: '灵性觉醒', crystals: ['amethyst', 'moonstone'] },
  { m: 3, theme: '沟通新生', crystals: ['aquamarine', 'green-phantom'] },
  { m: 4, theme: '纯净无畏', crystals: ['clear', 'garnet'] },
  { m: 5, theme: '生发丰盛', crystals: ['green-phantom', 'citrine'] },
  { m: 6, theme: '温柔直觉', crystals: ['moonstone', 'rose'] },
  { m: 7, theme: '热烈守护', crystals: ['garnet', 'obsidian'] },
  { m: 8, theme: '光芒自信', crystals: ['citrine', 'tiger-eye'] },
  { m: 9, theme: '智慧真理', crystals: ['lapis', 'amethyst'] },
  { m: 10, theme: '平衡人缘', crystals: ['rose', 'aquamarine'] },
  { m: 11, theme: '深邃财富', crystals: ['citrine', 'tiger-eye'] },
  { m: 12, theme: '通透安宁', crystals: ['aquamarine', 'lapis', 'clear'] },
]

// 预设成品（首页热门推荐）
export const PRESETS = [
  {
    id: 'wealth-1',
    name: '招财进宝',
    price: 168,
    tags: ['黄水晶', '绿幽灵', '虎眼石'],
    pattern: ['citrine', 'green-phantom', 'tiger-eye', 'citrine', 'clear', 'green-phantom', 'tiger-eye', 'citrine'],
  },
  {
    id: 'love-1',
    name: '爱情守护',
    price: 168,
    tags: ['粉水晶', '草莓晶', '月光石'],
    pattern: ['rose', 'strawberry', 'moonstone', 'rose', 'clear', 'strawberry', 'moonstone', 'rose'],
  },
  {
    id: 'peace-1',
    name: '平安喜乐',
    price: 168,
    tags: ['黑曜石', '白水晶', '紫水晶'],
    pattern: ['obsidian', 'clear', 'amethyst', 'obsidian', 'clear', 'amethyst', 'obsidian', 'clear'],
  },
]

export function zodiacByDate(month, day) {
  const cut = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22]
  const idx = day < cut[month - 1] ? (month + 10) % 12 : (month + 11) % 12
  return ZODIACS[idx]
}

// 把一组水晶 id 扩展为完整手链图案（交替 + 白水晶点缀）
export function buildPatternFromCrystals(ids, count) {
  const valid = ids.filter((id) => CRYSTAL_MAP[id])
  if (valid.length === 0) return []
  const pattern = []
  for (let i = 0; i < count; i++) {
    // 每 4 颗插入一颗主石之外的白水晶做呼吸感
    if (i % 4 === 3 && !valid.includes('clear')) {
      pattern.push('clear')
    } else {
      pattern.push(valid[i % valid.length])
    }
  }
  return pattern
}

export function randomPattern(count) {
  const pool = CRYSTALS.map((c) => c.id)
  // 选 2–3 种主石随机搭配
  const kinds = 2 + Math.floor(pseudo() * 2)
  const chosen = []
  for (let i = 0; i < kinds; i++) {
    chosen.push(pool[Math.floor(pseudo() * pool.length)])
  }
  return buildPatternFromCrystals(chosen, count)
}

// 轻量伪随机（避免直接 Math.random 以便必要时可复现，这里仍用 Math.random 播种）
function pseudo() {
  return Math.random()
}
