import { useState } from 'react'
import { Modal } from './Modal.jsx'
import { Bead } from './Bead.jsx'
import { CRYSTAL_MAP } from '../data/crystals.js'
import {
  FIVE_ELEMENTS,
  LUCKY_COLORS,
  ZODIACS,
  BIRTH_MONTHS,
  zodiacByDate,
  buildPatternFromCrystals,
} from '../data/recommendations.js'

const TABS = [
  { key: 'ai', label: 'AI 推荐' },
  { key: 'element', label: '五行' },
  { key: 'color', label: '幸运色' },
  { key: 'zodiac', label: '星座' },
  { key: 'birthday', label: '生日' },
]

const GOALS = [
  { key: 'wealth', label: '招财旺运', crystals: ['citrine', 'green-phantom', 'tiger-eye'] },
  { key: 'love', label: '爱情桃花', crystals: ['rose', 'strawberry', 'moonstone'] },
  { key: 'health', label: '健康平衡', crystals: ['clear', 'aquamarine', 'amethyst'] },
  { key: 'guard', label: '辟邪守护', crystals: ['obsidian', 'clear', 'lapis'] },
  { key: 'wisdom', label: '智慧专注', crystals: ['amethyst', 'lapis', 'clear'] },
  { key: 'career', label: '事业贵人', crystals: ['green-phantom', 'tiger-eye', 'lapis'] },
]

function CrystalRow({ ids }) {
  return (
    <div className="flex items-center gap-1.5">
      {ids.map((id) => (
        <div key={id} className="flex items-center gap-1">
          <Bead crystal={CRYSTAL_MAP[id]} size={24} />
          <span className="text-[12px] text-neutral-500 dark:text-neutral-400">{CRYSTAL_MAP[id]?.name}</span>
        </div>
      ))}
    </div>
  )
}

function OptionCard({ children, onClick, accent }) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-black/5 bg-white p-3.5 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-card-lg active:scale-[0.99] dark:border-white/5 dark:bg-neutral-800"
      style={accent ? { boxShadow: `inset 3px 0 0 ${accent}` } : undefined}
    >
      {children}
    </button>
  )
}

export function SmartRecommend({ open, onClose, count, onApply }) {
  const [tab, setTab] = useState('ai')
  const [birthday, setBirthday] = useState('1998-08-15')

  const applyIds = (ids, label) => {
    onApply(buildPatternFromCrystals(ids, count), label)
    onClose()
  }

  const bd = new Date(birthday + 'T00:00:00')
  const validBd = !isNaN(bd.getTime())
  const bMonth = validBd ? bd.getMonth() + 1 : 8
  const bDay = validBd ? bd.getDate() : 15
  const zForBirthday = zodiacByDate(bMonth, bDay)
  const monthTheme = BIRTH_MONTHS[bMonth - 1]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="智能搭配推荐"
      subtitle={`将为你生成约 ${count} 颗的手链方案`}
      maxWidth="max-w-xl"
    >
      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-2xl bg-black/5 p-1 dark:bg-white/5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-xl py-2 text-[13px] font-medium transition ${
              tab === t.key
                ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white'
                : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'ai' && (
        <div className="space-y-2.5">
          <p className="px-1 text-[13px] text-neutral-500 dark:text-neutral-400">
            告诉我们你的心愿，AI 为你推荐最合适的水晶组合 ✨
          </p>
          {GOALS.map((g) => (
            <OptionCard key={g.key} onClick={() => applyIds(g.crystals, `AI · ${g.label}`)}>
              <div className="min-w-0">
                <div className="font-medium text-neutral-900 dark:text-white">{g.label}</div>
                <div className="mt-1.5">
                  <CrystalRow ids={g.crystals} />
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-brand-500 px-3 py-1.5 text-[12px] font-medium text-white">生成</span>
            </OptionCard>
          ))}
        </div>
      )}

      {tab === 'element' && (
        <div className="space-y-2.5">
          <p className="px-1 text-[13px] text-neutral-500 dark:text-neutral-400">依五行属性平衡能量，选择你想加强的一行。</p>
          {FIVE_ELEMENTS.map((el) => (
            <OptionCard key={el.key} accent={el.color} onClick={() => applyIds(el.crystals, `五行 · ${el.name}`)}>
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg font-semibold text-white"
                  style={{ background: el.color }}
                >
                  {el.name}
                </span>
                <div className="min-w-0">
                  <div className="font-medium text-neutral-900 dark:text-white">{el.name} · {el.desc}</div>
                  <div className="mt-1"><CrystalRow ids={el.crystals} /></div>
                </div>
              </div>
            </OptionCard>
          ))}
        </div>
      )}

      {tab === 'color' && (
        <div className="grid grid-cols-2 gap-2.5">
          {LUCKY_COLORS.map((c) => (
            <button
              key={c.key}
              onClick={() => applyIds(c.crystals, `幸运色 · ${c.name}`)}
              className="flex flex-col gap-2 rounded-2xl border border-black/5 bg-white p-3.5 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-card-lg active:scale-[0.99] dark:border-white/5 dark:bg-neutral-800"
            >
              <span className="h-10 w-10 rounded-full shadow-inner" style={{ background: c.hex, boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.15)' }} />
              <div>
                <div className="font-medium text-neutral-900 dark:text-white">{c.name}</div>
                <div className="text-[12px] text-neutral-500 dark:text-neutral-400">{c.meaning}</div>
              </div>
              <CrystalRow ids={c.crystals} />
            </button>
          ))}
        </div>
      )}

      {tab === 'zodiac' && (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {ZODIACS.map((z) => (
            <button
              key={z.key}
              onClick={() => applyIds(z.crystals, `${z.name} 本命`)}
              className="flex flex-col gap-1.5 rounded-2xl border border-black/5 bg-white p-3 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-card-lg active:scale-[0.99] dark:border-white/5 dark:bg-neutral-800"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{z.emoji}</span>
                <div>
                  <div className="text-[14px] font-medium text-neutral-900 dark:text-white">{z.name}</div>
                  <div className="text-[11px] text-neutral-400">{z.range}</div>
                </div>
              </div>
              <div className="flex gap-1">
                {z.crystals.map((id) => (
                  <Bead key={id} crystal={CRYSTAL_MAP[id]} size={22} />
                ))}
              </div>
              <p className="text-[11px] leading-snug text-neutral-500 dark:text-neutral-400">{z.note}</p>
            </button>
          ))}
        </div>
      )}

      {tab === 'birthday' && (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block px-1 text-[13px] font-medium text-neutral-600 dark:text-neutral-300">输入你的生日</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[15px] text-neutral-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-white/10 dark:bg-neutral-800 dark:text-white dark:focus:ring-brand-900"
            />
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-white p-4 dark:from-brand-900/30 dark:to-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] text-neutral-500 dark:text-neutral-400">生日能量主题</div>
                <div className="text-lg font-semibold text-brand-700 dark:text-brand-300">{monthTheme.theme}</div>
              </div>
              <div className="text-right">
                <div className="text-[13px] text-neutral-500 dark:text-neutral-400">本命星座</div>
                <div className="text-[15px] font-medium text-neutral-800 dark:text-white">{zForBirthday.emoji} {zForBirthday.name}</div>
              </div>
            </div>
            <div className="mt-3">
              <CrystalRow ids={monthTheme.crystals} />
            </div>
          </div>
          <button
            onClick={() => applyIds([...monthTheme.crystals, ...zForBirthday.crystals], `生日能量 · ${monthTheme.theme}`)}
            className="w-full rounded-2xl bg-brand-500 py-3.5 font-medium text-white shadow-glow transition hover:bg-brand-600 active:scale-[0.99]"
          >
            生成我的生日能量手链
          </button>
        </div>
      )}
    </Modal>
  )
}
