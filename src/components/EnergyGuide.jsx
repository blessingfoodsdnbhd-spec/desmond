import { useEffect, useState } from 'react'
import { CRYSTAL_MAP, ELEMENTS } from '../data/crystals.js'
import { Bead } from './Bead.jsx'
import { Modal } from './Modal.jsx'
import { useLang, localizeCrystal, ELEMENT_I18N } from '../i18n.jsx'
import { SparkleIcon } from './icons.jsx'

// 按能量功效分组的图鉴（对照实拍美图）
// 每项：珠子 id + 三个关键词（中/英）
const GROUPS = [
  {
    zh: '招财旺运', en: 'Wealth & Fortune',
    items: [
      { id: 'citrine', zh: ['财富', '自信', '成功'], en: ['Wealth', 'Confidence', 'Success'] },
      { id: 'green-phantom', zh: ['事业', '招财', '机遇'], en: ['Career', 'Wealth', 'Opportunity'] },
      { id: 'tiger-eye', zh: ['勇气', '决断', '保护'], en: ['Courage', 'Decision', 'Protection'] },
    ],
  },
  {
    zh: '爱情桃花', en: 'Love & Romance',
    items: [
      { id: 'rose', zh: ['爱情', '人缘', '温柔'], en: ['Love', 'Charm', 'Gentle'] },
      { id: 'strawberry', zh: ['恋爱', '甜蜜', '吸引'], en: ['Romance', 'Sweet', 'Attraction'] },
      { id: 'moonstone', zh: ['女性', '魅力', '守护'], en: ['Feminine', 'Charm', 'Guard'] },
    ],
  },
  {
    zh: '健康平衡', en: 'Health & Balance',
    items: [
      { id: 'clear', zh: ['净化', '平衡', '能量'], en: ['Purify', 'Balance', 'Energy'] },
      { id: 'aquamarine', zh: ['勇气', '沟通', '平静'], en: ['Courage', 'Communicate', 'Calm'] },
      { id: 'amethyst', zh: ['智慧', '平静', '守护'], en: ['Wisdom', 'Calm', 'Guard'] },
    ],
  },
  {
    zh: '辟邪守护', en: 'Protection',
    items: [
      { id: 'obsidian', zh: ['保护', '辟邪', '能量'], en: ['Protect', 'Ward', 'Energy'] },
      { id: 'clear', zh: ['净化', '平衡', '能量'], en: ['Purify', 'Balance', 'Energy'] },
      { id: 'lapis', zh: ['智慧', '真理', '守护'], en: ['Wisdom', 'Truth', 'Guard'] },
    ],
  },
  {
    zh: '智慧专注', en: 'Wisdom & Focus',
    items: [
      { id: 'amethyst', zh: ['专注', '灵性', '智慧'], en: ['Focus', 'Spirit', 'Wisdom'] },
      { id: 'lapis', zh: ['专注', '洞察', '判断'], en: ['Focus', 'Insight', 'Judgement'] },
      { id: 'clear', zh: ['专注', '清晰', '记忆'], en: ['Focus', 'Clarity', 'Memory'] },
    ],
  },
  {
    zh: '事业贵人', en: 'Career & Mentors',
    items: [
      { id: 'green-phantom', zh: ['事业', '贵人', '机遇'], en: ['Career', 'Mentor', 'Opportunity'] },
      { id: 'tiger-eye', zh: ['自信', '执行', '领导力'], en: ['Confidence', 'Execution', 'Leadership'] },
      { id: 'lapis', zh: ['贵人', '人缘', '沟通'], en: ['Mentor', 'Charm', 'Communicate'] },
    ],
  },
]

// 单颗珠子（真实照片优先），带柔和落影，仿实拍摆放在绸缎上
function GuideBead({ crystal, size = 78, onPick }) {
  const c = crystal
  return (
    <button
      onClick={() => onPick?.(c.id)}
      className="group flex flex-col items-center focus:outline-none"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="relative grid place-items-center" style={{ width: size, height: size + 8 }}>
        {/* 地面柔影 */}
        <span
          className="absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-black/25 blur-[5px] dark:bg-black/50"
          style={{ width: size * 0.72, height: size * 0.16, top: size * 0.82 }}
        />
        {c.photo ? (
          <img
            src={c.photo}
            alt={c.name}
            draggable={false}
            style={{ width: size, height: size, filter: 'drop-shadow(0 5px 8px rgba(70,45,20,0.3))' }}
            className="rounded-full object-cover transition-transform duration-300 group-hover:-translate-y-0.5 group-active:scale-95"
          />
        ) : (
          <Bead crystal={c} size={size} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
        )}
      </div>
      <div className="mt-2 text-center">
        <div className="font-serif text-[15px] font-semibold tracking-wide text-[#5a4632] dark:text-amber-100/90">
          {c.name}
        </div>
      </div>
    </button>
  )
}

export function EnergyGuide({ onStart }) {
  const { t, lang } = useLang()
  const [detailId, setDetailId] = useState(null)
  const detail = detailId ? localizeCrystal(CRYSTAL_MAP[detailId], lang) : null

  // 进入图鉴时始终从最上面开始（标题/解说）
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  return (
    <div className="relative min-h-full pb-28">
      {/* 绸缎质感背景 */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(120% 60% at 20% 0%, #fbf6ec 0%, #f3ecdf 45%, #ece1cf 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 dark:opacity-0"
        style={{
          background:
            'repeating-linear-gradient(115deg, rgba(255,255,255,0.35) 0px, rgba(255,255,255,0) 40px, rgba(180,150,110,0.08) 90px, rgba(255,255,255,0.3) 140px)',
        }}
      />
      {/* 深色模式绸缎 */}
      <div
        className="absolute inset-0 -z-10 hidden dark:block"
        style={{ background: 'radial-gradient(120% 60% at 20% 0%, #221b15 0%, #191410 55%, #120e0b 100%)' }}
      />

      <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6">
        {/* 标题 */}
        <div className="text-center">
          <h2 className="font-serif text-[26px] font-bold tracking-[0.06em] text-[#6b503a] dark:text-amber-100">
            {lang === 'zh' ? '能量水晶珠宝 · 真实美图' : 'Energy Crystals · Real Photos'}
          </h2>
          <p className="mt-1.5 font-serif text-[13px] tracking-wide text-[#9a866c] dark:text-amber-200/60">
            {lang === 'zh' ? '天然水晶 · 每一颗都有独特能量' : 'Natural crystals · unique energy in every bead'}
          </p>
          <div className="mx-auto mt-3 h-px w-16 bg-gradient-to-r from-transparent via-[#c9ad82] to-transparent" />
        </div>

        {/* 分组 */}
        <div className="mt-5 space-y-3">
          {GROUPS.map((g) => (
            <section
              key={g.zh}
              className="rounded-3xl border border-[#e3d3b6]/60 bg-white/45 p-4 shadow-[0_2px_16px_rgba(150,120,70,0.10)] backdrop-blur-sm dark:border-amber-200/10 dark:bg-white/5 sm:p-5"
            >
              {/* 分类标签 */}
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[#c9ad82] dark:text-amber-300/70">◆</span>
                <h3 className="font-serif text-[18px] font-bold tracking-[0.12em] text-[#6b503a] dark:text-amber-100">
                  {lang === 'zh' ? g.zh : g.en}
                </h3>
                <span className="ml-1 text-[#c9ad82] dark:text-amber-300/70">◆</span>
              </div>
              {/* 三颗珠子 */}
              <div className="grid grid-cols-3 gap-2">
                {g.items.map((it, idx) => {
                  const c = localizeCrystal(CRYSTAL_MAP[it.id], lang)
                  const kw = lang === 'zh' ? it.zh : it.en
                  return (
                    <div key={g.zh + it.id + idx} className="flex flex-col items-center">
                      <GuideBead crystal={c} onPick={(id) => setDetailId(id)} />
                      <div className="mt-1 text-center text-[11px] leading-relaxed text-[#9a866c] dark:text-amber-200/55">
                        {kw.join(' · ')}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        {/* 结尾 */}
        <p className="mt-6 text-center font-serif text-[13px] tracking-[0.16em] text-[#9a866c] dark:text-amber-200/50">
          {lang === 'zh' ? '天然水晶 · 能量之美 · 伴你每一天' : 'Natural crystals · beauty of energy · every day with you'}
        </p>

        <button
          onClick={() => onStart?.()}
          className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#b98b4e] to-[#8a6a3a] py-3.5 font-medium text-white shadow-[0_6px_20px_rgba(150,110,50,0.35)] transition hover:brightness-105 active:scale-[0.99]"
        >
          <SparkleIcon size={18} /> {t('discover.cta')}
        </button>
      </div>

      {/* 单颗水晶 · 照片 + 能量解释 */}
      <Modal open={!!detail} onClose={() => setDetailId(null)} maxWidth="max-w-md" center>
        {detail && (
          <div className="text-center">
            <div className="relative mx-auto grid h-40 w-40 place-items-center">
              <span className="absolute left-1/2 top-[80%] h-6 w-24 -translate-x-1/2 rounded-[50%] bg-black/25 blur-[6px] dark:bg-black/50" />
              {detail.photo ? (
                <img
                  src={detail.photo}
                  alt={detail.name}
                  className="h-40 w-40 rounded-full object-cover"
                  style={{ filter: 'drop-shadow(0 8px 14px rgba(60,40,20,0.32))' }}
                />
              ) : (
                <Bead crystal={detail} size={160} />
              )}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{detail.name}</h3>
              <span className="text-[12px] text-neutral-400">{detail.pinyin}</span>
            </div>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="rounded-full px-2 py-0.5 text-[11px] font-medium text-white" style={{ background: ELEMENTS[detail.element]?.color }}>
                {t('discover.element')}·{lang === 'zh' ? ELEMENTS[detail.element]?.label : ELEMENT_I18N[detail.element]}
              </span>
              {detail.keywords?.map((k) => (
                <span key={k} className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-medium text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">{k}</span>
              ))}
            </div>
            <p className="mt-4 text-left text-[14px] leading-relaxed text-neutral-600 dark:text-neutral-300">{detail.energy}</p>
            <button
              onClick={() => { const id = detailId; setDetailId(null); onStart?.([id]) }}
              className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-brand-500 py-3.5 font-medium text-white shadow-glow transition hover:bg-brand-600 active:scale-[0.99]"
            >
              <SparkleIcon size={18} /> {t('discover.cta')}
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}
