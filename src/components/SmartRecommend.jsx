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
import {
  useLang,
  localizeCrystal,
  ELEMENT_I18N,
  ELEMENT_DESC_I18N,
  COLOR_I18N,
  ZODIAC_I18N,
  GOAL_I18N,
  BIRTH_THEME_I18N,
} from '../i18n.jsx'

const GOALS = [
  { key: 'wealth', label: '招财旺运', crystals: ['citrine', 'green-phantom', 'tiger-eye'] },
  { key: 'love', label: '爱情桃花', crystals: ['rose', 'strawberry', 'moonstone'] },
  { key: 'health', label: '健康平衡', crystals: ['clear', 'aquamarine', 'amethyst'] },
  { key: 'guard', label: '辟邪守护', crystals: ['obsidian', 'clear', 'lapis'] },
  { key: 'wisdom', label: '智慧专注', crystals: ['amethyst', 'lapis', 'clear'] },
  { key: 'career', label: '事业贵人', crystals: ['green-phantom', 'tiger-eye', 'lapis'] },
]

function CrystalRow({ ids, lang }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {ids.map((id) => (
        <div key={id} className="flex items-center gap-1">
          <Bead crystal={CRYSTAL_MAP[id]} size={24} />
          <span className="text-[12px] text-neutral-500 dark:text-neutral-400">{localizeCrystal(CRYSTAL_MAP[id], lang)?.name}</span>
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
  const { t, lang } = useLang()
  const [tab, setTab] = useState('ai')
  const [birthday, setBirthday] = useState('1998-08-15')

  const TABS = [
    { key: 'ai', label: t('smart.tab.ai') },
    { key: 'element', label: t('smart.tab.element') },
    { key: 'color', label: t('smart.tab.color') },
    { key: 'zodiac', label: t('smart.tab.zodiac') },
    { key: 'birthday', label: t('smart.tab.birthday') },
  ]

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
  const zName = (z) => (lang === 'zh' ? z.name : ZODIAC_I18N[z.key]?.name || z.name)
  const themeName = lang === 'zh' ? monthTheme.theme : BIRTH_THEME_I18N[bMonth]

  return (
    <Modal open={open} onClose={onClose} title={t('smart.title')} subtitle={t('smart.sub', count)} maxWidth="max-w-xl">
      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-2xl bg-black/5 p-1 dark:bg-white/5">
        {TABS.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={`flex-1 rounded-xl py-2 text-[13px] font-medium transition ${
              tab === tb.key ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {tab === 'ai' && (
        <div className="space-y-2.5">
          <p className="px-1 text-[13px] text-neutral-500 dark:text-neutral-400">{t('smart.aiHint')}</p>
          {GOALS.map((g) => (
            <OptionCard key={g.key} onClick={() => applyIds(g.crystals, `AI · ${lang === 'zh' ? g.label : GOAL_I18N[g.key]}`)}>
              <div className="min-w-0">
                <div className="font-medium text-neutral-900 dark:text-white">{lang === 'zh' ? g.label : GOAL_I18N[g.key]}</div>
                <div className="mt-1.5">
                  <CrystalRow ids={g.crystals} lang={lang} />
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-brand-500 px-3 py-1.5 text-[12px] font-medium text-white">{t('smart.generate')}</span>
            </OptionCard>
          ))}
        </div>
      )}

      {tab === 'element' && (
        <div className="space-y-2.5">
          <p className="px-1 text-[13px] text-neutral-500 dark:text-neutral-400">{t('smart.elementHint')}</p>
          {FIVE_ELEMENTS.map((el) => {
            const name = lang === 'zh' ? el.name : ELEMENT_I18N[el.key]
            const desc = lang === 'zh' ? el.desc : ELEMENT_DESC_I18N[el.key]
            return (
              <OptionCard key={el.key} accent={el.color} onClick={() => applyIds(el.crystals, `${t('smart.tab.element')} · ${name}`)}>
                <div className="flex items-center gap-3 min-w-0">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg font-semibold text-white" style={{ background: el.color }}>
                    {el.name}
                  </span>
                  <div className="min-w-0">
                    <div className="font-medium text-neutral-900 dark:text-white">{name} · {desc}</div>
                    <div className="mt-1"><CrystalRow ids={el.crystals} lang={lang} /></div>
                  </div>
                </div>
              </OptionCard>
            )
          })}
        </div>
      )}

      {tab === 'color' && (
        <div className="grid grid-cols-2 gap-2.5">
          {LUCKY_COLORS.map((c) => {
            const name = lang === 'zh' ? c.name : COLOR_I18N[c.key]?.name
            const meaning = lang === 'zh' ? c.meaning : COLOR_I18N[c.key]?.meaning
            return (
              <button
                key={c.key}
                onClick={() => applyIds(c.crystals, `${t('smart.tab.color')} · ${name}`)}
                className="flex flex-col gap-2 rounded-2xl border border-black/5 bg-white p-3.5 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-card-lg active:scale-[0.99] dark:border-white/5 dark:bg-neutral-800"
              >
                <span className="h-10 w-10 rounded-full" style={{ background: c.hex, boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.15)' }} />
                <div>
                  <div className="font-medium text-neutral-900 dark:text-white">{name}</div>
                  <div className="text-[12px] text-neutral-500 dark:text-neutral-400">{meaning}</div>
                </div>
                <CrystalRow ids={c.crystals} lang={lang} />
              </button>
            )
          })}
        </div>
      )}

      {tab === 'zodiac' && (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {ZODIACS.map((z) => (
            <button
              key={z.key}
              onClick={() => applyIds(z.crystals, `${zName(z)}`)}
              className="flex flex-col gap-1.5 rounded-2xl border border-black/5 bg-white p-3 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-card-lg active:scale-[0.99] dark:border-white/5 dark:bg-neutral-800"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{z.emoji}</span>
                <div>
                  <div className="text-[14px] font-medium text-neutral-900 dark:text-white">{zName(z)}</div>
                  <div className="text-[11px] text-neutral-400">{z.range}</div>
                </div>
              </div>
              <div className="flex gap-1">
                {z.crystals.map((id) => (
                  <Bead key={id} crystal={CRYSTAL_MAP[id]} size={22} />
                ))}
              </div>
              <p className="text-[11px] leading-snug text-neutral-500 dark:text-neutral-400">{lang === 'zh' ? z.note : ZODIAC_I18N[z.key]?.note}</p>
            </button>
          ))}
        </div>
      )}

      {tab === 'birthday' && (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block px-1 text-[13px] font-medium text-neutral-600 dark:text-neutral-300">{t('smart.birthday.input')}</label>
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
                <div className="text-[13px] text-neutral-500 dark:text-neutral-400">{t('smart.birthday.theme')}</div>
                <div className="text-lg font-semibold text-brand-700 dark:text-brand-300">{themeName}</div>
              </div>
              <div className="text-right">
                <div className="text-[13px] text-neutral-500 dark:text-neutral-400">{t('smart.birthday.zodiac')}</div>
                <div className="text-[15px] font-medium text-neutral-800 dark:text-white">{zForBirthday.emoji} {zName(zForBirthday)}</div>
              </div>
            </div>
            <div className="mt-3">
              <CrystalRow ids={monthTheme.crystals} lang={lang} />
            </div>
          </div>
          <button
            onClick={() => applyIds([...monthTheme.crystals, ...zForBirthday.crystals], `${t('smart.birthday.theme')} · ${themeName}`)}
            className="w-full rounded-2xl bg-brand-500 py-3.5 font-medium text-white shadow-glow transition hover:bg-brand-600 active:scale-[0.99]"
          >
            {t('smart.birthday.btn')}
          </button>
        </div>
      )}
    </Modal>
  )
}
