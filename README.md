# 灵感石 · 水晶手链 DIY (Stone Lab)

一个 Apple 风格的高品质**水晶能量手链 DIY** 网页应用，使用 **React + Tailwind CSS** 构建。
纯前端、使用假数据，无需后端即可运行。

![tech](https://img.shields.io/badge/React-18-61dafb) ![tech](https://img.shields.io/badge/Tailwind-3-38bdf8) ![tech](https://img.shields.io/badge/Vite-5-646cff)

## ✨ 功能特性

- **Apple 风格首页**：白色极简、毛玻璃质感、渐变高级感，支持深色模式与响应式。
- **自由 DIY 水晶手链**
  - 左侧按分类浏览水晶珠（全部 / 热门 / 招财 / 爱情 / 健康 / 守护）。
  - 12 种水晶（含紫水晶、白水晶、黄水晶、粉晶、黑曜石、青金石、海蓝宝、绿幽灵、月光石、虎眼石等），
    每种含**高清珠体渲染**、名称、尺寸（6/8/10/12mm）、价格、能量介绍。
  - 中间**圆形手链预览**，点击水晶即可加入。
- **编辑能力**
  - 点击手链上的珠子可**删除**。
  - 底部珠链支持**拖拽调整顺序**（含触摸）。
  - **撤销 / 重做 / 清空**。
  - **自动计算**周长、价格、重量、颗数。
- **智能推荐**
  - 输入**手围（13–22cm）**，AI 自动推荐所需颗数。
  - 一键**自动补齐**手链直至完整圆形。
  - **随机搭配**按钮。
  - **五行搭配** · **幸运颜色** · **十二星座** · **生日能量** 推荐。
- **成品输出**
  - 生成**产品图 / 分享图**（基于 Canvas 高清绘制）。
  - **保存 PNG** · **系统分享** · **导出 PDF**。
- **体验**：流畅动画、响应式布局、移动端适配、深色模式（跟随系统并可切换）。

## 🚀 快速开始

```bash
npm install      # 安装依赖
npm run dev      # 本地开发（http://localhost:5173）
npm run build    # 生产构建，输出到 dist/
npm run preview  # 预览生产构建
```

## 🧱 项目结构

```
src/
├─ App.jsx                     # 应用外壳：导航、深色模式、页面路由
├─ index.css                   # Tailwind 指令 + Apple 风格基础样式
├─ data/
│  ├─ crystals.js              # 水晶假数据、价格/重量计算
│  └─ recommendations.js       # 五行/幸运色/星座/生日/预设/随机 推荐引擎
├─ utils/
│  ├─ bracelet.js              # 手链汇总、手围推荐、圆环布局计算
│  └─ render.js                # Canvas 珠体渲染 + PNG/分享图/PDF 导出
└─ components/
   ├─ Home.jsx                 # Apple 风格首页
   ├─ Designer.jsx             # DIY 设计主页面
   ├─ BraceletRing.jsx         # 交互式圆形手链预览 (SVG)
   ├─ Bead.jsx                 # 单颗抛光水晶珠 (SVG)
   ├─ SortableBeadStrip.jsx    # 可拖拽排序珠链
   ├─ SmartRecommend.jsx       # 智能搭配面板
   ├─ ExportSheet.jsx          # 成品图 / 导出面板
   ├─ Modal.jsx                # 通用底部弹窗
   └─ icons.jsx                # 线性图标集
```

## 🎨 设计说明

- 所有水晶珠均通过**多层径向渐变**在 SVG / Canvas 中实时绘制，模拟抛光宝石球，
  无需任何外部图片资源，导出的产品图与页面预览效果完全一致。
- 数据均为**演示用假数据**，能量、五行、星座等描述仅供趣味参考。

> 灵感石 · Stone Lab — 用心传递每一份能量。
