// 水晶珠数据（使用假数据 / mock data）
// 每颗珠子通过多层径向渐变模拟高清抛光水晶球，无需外部图片，导出时可完美复现。
//
// 字段说明：
//   id        唯一标识
//   name      名称
//   pinyin    英文名
//   category  能量分类标签（用于筛选）：popular 热门 / wealth 招财 / love 爱情 / health 健康 / guard 守护
//   element   五行：metal 金 / wood 木 / water 水 / fire 火 / earth 土
//   basePrice 8mm 基准单价（元）
//   density   密度 g/cm³（用于估算重量）
//   energy    能量介绍
//   keywords  关键词
//   gradient  渲染参数：{ light 高光, base 主色, deep 暗部, ring 边缘, sheen 冷光可选 }
//   photo     真实水晶照片（有则优先用照片渲染珠子）

// 真实水晶照片（从实拍美图裁切）
import pClear from '../assets/beads/clear.webp'
import pAmethyst from '../assets/beads/amethyst.webp'
import pRose from '../assets/beads/rose.webp'
import pCitrine from '../assets/beads/citrine.webp'
import pGreenPhantom from '../assets/beads/green-phantom.webp'
import pTigerEye from '../assets/beads/tiger-eye.webp'
import pObsidian from '../assets/beads/obsidian.webp'
import pMoonstone from '../assets/beads/moonstone.webp'
import pStrawberry from '../assets/beads/strawberry.webp'
import pAquamarine from '../assets/beads/aquamarine.webp'
import pLapis from '../assets/beads/lapis.webp'

export const SIZES = [8, 10, 12] // mm

// 尺寸对价格的系数（珠子越大越贵）
export const SIZE_PRICE_FACTOR = { 8: 1, 10: 1.5, 12: 2.2 }

export const CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'popular', label: '热门' },
  { key: 'wealth', label: '招财' },
  { key: 'love', label: '爱情' },
  { key: 'health', label: '健康' },
  { key: 'guard', label: '守护' },
]

export const ELEMENTS = {
  metal: { label: '金', color: '#c9a94e' },
  wood: { label: '木', color: '#4fb37e' },
  water: { label: '水', color: '#3b82c4' },
  fire: { label: '火', color: '#d1495b' },
  earth: { label: '土', color: '#b98b4e' },
}

export const CRYSTALS = [
  {
    id: 'clear',
    photo: pClear,
    name: '白水晶',
    pinyin: 'Clear Quartz',
    category: ['popular', 'health', 'guard'],
    element: 'metal',
    basePrice: 12,
    density: 2.65,
    keywords: ['净化', '平衡'],
    energy:
      '水晶之王，能量纯净通透。净化磁场、平衡身心，放大其他水晶的能量，是万能的基础灵石。',
    gradient: { light: '#ffffff', base: '#f2f5f8', deep: '#cdd6de', ring: '#aeb9c4' },
  },
  {
    id: 'amethyst',
    photo: pAmethyst,
    name: '紫水晶',
    pinyin: 'Amethyst',
    category: ['popular', 'health', 'guard'],
    element: 'fire',
    basePrice: 16,
    density: 2.63,
    keywords: ['智慧', '平静'],
    energy:
      '灵性之石，安定心神、开启智慧。有助专注与睡眠，化解焦躁，带来平和清明的思绪。',
    gradient: { light: '#e9d7ff', base: '#9a6fd6', deep: '#5f3b9c', ring: '#4a2c7d' },
  },
  {
    id: 'rose',
    photo: pRose,
    name: '粉水晶',
    pinyin: 'Rose Quartz',
    category: ['popular', 'love'],
    element: 'fire',
    basePrice: 16,
    density: 2.65,
    keywords: ['爱情', '温柔'],
    energy:
      '爱情之石，散发温柔的粉色能量。增进人缘桃花、修复关系，让心变得柔软而有安全感。',
    gradient: { light: '#ffeaf1', base: '#f3aec4', deep: '#d97b9c', ring: '#c26483' },
  },
  {
    id: 'citrine',
    photo: pCitrine,
    name: '黄水晶',
    pinyin: 'Citrine',
    category: ['popular', 'wealth'],
    element: 'earth',
    basePrice: 18,
    density: 2.65,
    keywords: ['财富', '成功'],
    energy:
      '财富之石，象征偏财与信心。凝聚正向能量，助事业顺遂、决策果断，带来富足与喜悦。',
    gradient: { light: '#fff3cf', base: '#f4cd66', deep: '#d59f2e', ring: '#b9841f' },
  },
  {
    id: 'green-phantom',
    photo: pGreenPhantom,
    name: '绿幽灵',
    pinyin: 'Green Phantom',
    category: ['popular', 'wealth'],
    element: 'wood',
    basePrice: 22,
    density: 2.62,
    keywords: ['招财', '事业'],
    energy:
      '正财之石，聚财纳福。助力事业发展、贵人相助，将努力沉淀为长久稳定的财富。',
    gradient: { light: '#e6f5df', base: '#7fb96a', deep: '#3f7d3a', ring: '#2f5f2c' },
  },
  {
    id: 'tiger-eye',
    photo: pTigerEye,
    name: '虎眼石',
    pinyin: 'Tiger Eye',
    category: ['wealth', 'guard'],
    element: 'earth',
    basePrice: 18,
    density: 2.68,
    keywords: ['勇气', '自信'],
    energy:
      '勇气之石，闪耀虎眼光泽。增强气场与决断力，辟邪挡煞，助你在关键时刻沉稳果敢。',
    gradient: { light: '#f4dcae', base: '#c68a3c', deep: '#7d4f1e', ring: '#5c3a16' },
  },
  {
    id: 'obsidian',
    photo: pObsidian,
    name: '黑曜石',
    pinyin: 'Obsidian',
    category: ['guard', 'health'],
    element: 'water',
    basePrice: 15,
    density: 2.55,
    keywords: ['保护', '辟邪'],
    energy:
      '守护之石，吸纳负能量。稳定情绪、化解压力，形成强大的防护磁场，宜戴于左进右出的右手。',
    gradient: { light: '#5b5b63', base: '#26262b', deep: '#101013', ring: '#050506' },
  },
  {
    id: 'moonstone',
    photo: pMoonstone,
    name: '月光石',
    pinyin: 'Moonstone',
    category: ['love', 'health'],
    element: 'metal',
    basePrice: 20,
    density: 2.61,
    keywords: ['直觉', '灵感'],
    energy:
      '恋人之石，温柔如月华。提升直觉与灵感，安抚情绪起伏，招来美好姻缘与温暖人缘。',
    gradient: { light: '#ffffff', base: '#e2e8f2', deep: '#b7c3d6', ring: '#9aa8c0', sheen: '#cfe4ff' },
  },
  {
    id: 'strawberry',
    photo: pStrawberry,
    name: '草莓晶',
    pinyin: 'Strawberry Quartz',
    category: ['love', 'popular'],
    element: 'fire',
    basePrice: 18,
    density: 2.66,
    keywords: ['爱情', '人缘'],
    energy:
      '甜蜜之石，内含草莓般的金红针。旺盛桃花人缘，提升魅力与亲和力，让爱意自然流动。',
    gradient: { light: '#ffe0e6', base: '#e57b8e', deep: '#b8465c', ring: '#96384a' },
  },
  {
    id: 'aquamarine',
    photo: pAquamarine,
    name: '海蓝宝',
    pinyin: 'Aquamarine',
    category: ['health', 'popular'],
    element: 'water',
    basePrice: 20,
    density: 2.72,
    keywords: ['沟通', '真达'],
    energy:
      '沟通之石，宁静如海。舒缓喉轮、助力表达，让沟通更真诚顺畅，抚平内心的紧张不安。',
    gradient: { light: '#e0f7fb', base: '#8fd3e0', deep: '#4a9fb5', ring: '#377d92' },
  },
  {
    id: 'garnet',
    name: '石榴石',
    pinyin: 'Garnet',
    category: ['health', 'love'],
    element: 'fire',
    basePrice: 18,
    density: 3.9,
    keywords: ['活力', '能量'],
    energy:
      '活力之石，深红如榴。补充气血能量、促进循环，提升女性魅力与再生力，越戴越透亮。',
    gradient: { light: '#f4b8b0', base: '#a51f2a', deep: '#611016', ring: '#440b0f' },
  },
  {
    id: 'lapis',
    photo: pLapis,
    name: '青金石',
    pinyin: 'Lapis Lazuli',
    category: ['guard', 'health'],
    element: 'water',
    basePrice: 22,
    density: 2.8,
    keywords: ['智慧', '真理'],
    energy:
      '智慧之石，帝王之蓝缀金斑。开启灵性视野、增强洞察，护佑平安，助你看清真相与方向。',
    gradient: { light: '#7fa8e6', base: '#274b9c', deep: '#152a63', ring: '#0e1c45', sheen: '#e7c65a' },
  },
  {
    id: 'rutilated',
    name: '金发晶',
    pinyin: 'Golden Rutilated Quartz',
    category: ['wealth', 'popular'],
    element: 'earth',
    basePrice: 28,
    density: 2.66,
    keywords: ['招财', '强运'],
    energy:
      '晶王之石，内蕴金色发丝。能量强大，聚正偏财、旺事业气场，助你决断果敢、贵人运旺。',
    gradient: { light: '#fff6d8', base: '#e6c778', deep: '#b58f34', ring: '#8f6c22', sheen: '#ffe9a3' },
  },
  {
    id: 'red-agate',
    name: '红玛瑙',
    pinyin: 'Red Agate',
    category: ['health', 'guard'],
    element: 'fire',
    basePrice: 14,
    density: 2.6,
    keywords: ['活力', '安神'],
    energy:
      '安神之石，温润红光。补气活血、安定情绪，增强行动力与勇气，护佑平安、驱散负能量。',
    gradient: { light: '#f6b9a2', base: '#b5442f', deep: '#75211a', ring: '#551410' },
  },
  {
    id: 'aventurine',
    name: '东陵玉',
    pinyin: 'Green Aventurine',
    category: ['wealth', 'health'],
    element: 'wood',
    basePrice: 14,
    density: 2.64,
    keywords: ['好运', '事业'],
    energy:
      '好运之石，温和的机遇能量。招偏财、旺事业人缘，舒缓压力、平衡心轮，带来乐观与新契机。',
    gradient: { light: '#d8ecd0', base: '#5fa06a', deep: '#356e3f', ring: '#264f2d', sheen: '#cfeecb' },
  },
  {
    id: 'smoky',
    name: '茶晶',
    pinyin: 'Smoky Quartz',
    category: ['guard', 'health'],
    element: 'earth',
    basePrice: 15,
    density: 2.65,
    keywords: ['稳定', '安神'],
    energy:
      '接地之石，沉稳茶褐。稳固海底轮、化解杂念与压力，辟邪安神，让心神踏实、脚步坚定。',
    gradient: { light: '#c8b6a2', base: '#6b5442', deep: '#3a2c22', ring: '#261c15' },
  },
  {
    id: 'red-tiger-eye',
    name: '红虎眼',
    pinyin: 'Red Tiger Eye',
    category: ['wealth', 'health', 'guard'],
    element: 'fire',
    basePrice: 20,
    density: 2.68,
    keywords: ['活力', '勇气'],
    energy:
      '热情之石，红润虎眼光泽。点燃活力与行动力，激发自信与斗志，助你在挑战中主动出击。',
    gradient: { light: '#eaa07a', base: '#9c3b22', deep: '#5c2012', ring: '#41160c', sheen: '#ffcf8a' },
  },
]

// 金属隔珠（点缀）
export const SPACER = {
  id: 'spacer',
  name: '银隔珠',
  pinyin: 'Silver Spacer',
  isSpacer: true,
  element: 'metal',
  basePrice: 3,
  density: 8.9,
  keywords: ['点缀'],
  energy: '925 银隔珠，点缀于水晶之间，增添层次与光泽。',
  gradient: { light: '#ffffff', base: '#d7dde3', deep: '#9aa2ab', ring: '#7d858e' },
}

export const CRYSTAL_MAP = Object.fromEntries([...CRYSTALS, SPACER].map((c) => [c.id, c]))

// 单颗珠子价格：基准价 × 尺寸系数
export function beadPrice(crystal, size) {
  return Math.round(crystal.basePrice * (SIZE_PRICE_FACTOR[size] ?? 1))
}

// 单颗珠子重量（克）：球体体积 × 密度
export function beadWeight(crystal, size) {
  const r = size / 2 / 10 // cm
  const volume = (4 / 3) * Math.PI * r * r * r // cm³
  return volume * crystal.density // g
}
