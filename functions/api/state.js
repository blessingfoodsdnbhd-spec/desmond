import { json, db } from './_lib.js'

const J = (s, f) => { try { return s ? JSON.parse(s) : f } catch { return f } }

function productOut(r) {
  return {
    id: r.id, name: r.name, name_en: r.name_en, image: r.image,
    badge: r.badge, badge_en: r.badge_en, element: r.element,
    keywords: J(r.keywords, []), energy: r.energy, energy_en: r.energy_en,
    sizes: J(r.sizes, []), crystalId: r.crystal_id, stock: r.stock,
    hidden: !!r.hidden, custom: true,
  }
}
function beadOut(r) {
  return {
    id: r.id, name: r.name, name_en: r.name_en, pinyin: r.name_en || r.name, photo: r.photo,
    category: J(r.category, ['popular']), element: r.element, basePrice: r.base_price,
    density: r.density, keywords: J(r.keywords, []), energy: r.energy, energy_en: r.energy_en,
    gradient: J(r.gradient, null), stock: r.stock, hidden: !!r.hidden, custom: true,
  }
}

// 公共：网站启动时拉取云端商品/珠子/覆盖/设置
export async function onRequestGet({ env }) {
  const d = db(env)
  try {
    const [prods, beads, ovr, setts] = await Promise.all([
      d.prepare('SELECT * FROM products ORDER BY sort ASC, updated_at DESC').all(),
      d.prepare('SELECT * FROM beads ORDER BY updated_at DESC').all(),
      d.prepare('SELECT * FROM overrides').all(),
      d.prepare('SELECT * FROM settings').all(),
    ])
    const settings = {}
    for (const s of setts.results || []) if (s.key !== 'admin_pass') settings[s.key] = s.value
    const beadEdits = {}, beadHidden = [], productEdits = {}, productHidden = []
    for (const o of ovr.results || []) {
      if (o.scope === 'bead') { if (o.patch) beadEdits[o.ref_id] = J(o.patch, {}); if (o.hidden) beadHidden.push(o.ref_id) }
      else { if (o.patch) productEdits[o.ref_id] = J(o.patch, {}); if (o.hidden) productHidden.push(o.ref_id) }
    }
    return json({
      ok: true,
      products: (prods.results || []).map(productOut),
      beads: (beads.results || []).map(beadOut),
      beadEdits, beadHidden, productEdits, productHidden,
      settings,
    })
  } catch (e) {
    return json({ ok: false, error: String(e) }, 500)
  }
}
