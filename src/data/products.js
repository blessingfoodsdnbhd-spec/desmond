// 臻选实拍 · 现货成品（真实产品照片 + 真实定价 RM）
// 与 DIY 自由设计分开：这些是可直接购买的现货成品。
import donglingImg from '../assets/products/dongling.webp'
import citrineImg from '../assets/products/citrine.webp'

export const PRODUCTS = [
  {
    id: 'dongling-aventurine',
    crystalId: 'aventurine', // 复用能量/五行介绍
    name: '东陵玉手链',
    name_en: 'Green Aventurine Bracelet',
    image: donglingImg,
    badge: '天然实拍',
    badge_en: 'Real Photo',
    // 尺寸 → 价格（RM）
    sizes: [
      { size: 8, price: 138 },
      { size: 10, price: 168 },
      { size: 12, price: 198 },
      { size: 14, price: 268 },
    ],
  },
  {
    id: 'citrine-real',
    crystalId: 'citrine', // 复用能量/五行介绍
    name: '黄水晶手链',
    name_en: 'Citrine Bracelet',
    image: citrineImg,
    badge: '天然实拍',
    badge_en: 'Real Photo',
    sizes: [
      { size: 8, price: 198 },
      { size: 10, price: 288 },
      { size: 12, price: 388 },
      { size: 14, price: 588 },
    ],
  },
]
