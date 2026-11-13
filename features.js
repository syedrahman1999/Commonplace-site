/**
 * Artificience 4.2 — guided tour, feedback focus, version history, writing insights,
 * peer review exchange, and academic export templates (APA 7, MLA 9, Chicago) plus RTF and LaTeX.
 * Everything runs on this computer; peer review travels as a file you send and receive.
 */
'use strict';
(function () {
  const A = () => window.__ai;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => A().escapeHTML(s);
  const RE = () => window.RichEditor;
  const toast = (m, ms) => A().showToast(m, ms);
  const nowIso = () => new Date().toISOString();
  const timeLabel = (iso) => { const d = new Date(iso); return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) + ' · ' + d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); };
  const plain = (md) => String(md || '').replace(/^\s*#{1,3}\s+/gm, '').replace(/^\s*(?:[-*•]|\d+[.)])\s+/gm, '').replace(/^\s*>\s?/gm, '').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/(^|[^*])\*([^*\n]+)\*/g, '$1$2').replace(/!\[image\]/g, '').replace(/^\|.*\|$/gm, '');
  const countWords = (t) => (t.trim() ? t.trim().split(/\s+/).length : 0);

  // ───────────────────────── Profile fields & feedback focus ─────────────────────────
  function initProfileFields() {
    const p = A().state.profile;
    [['prof-name', 'name'], ['prof-institution', 'institution'], ['prof-instructor', 'instructor'], ['prof-course', 'course']].forEach(([id, k]) => { const el = $(id); if (el) el.value = p[k] || ''; });
    $('btn-save-profile')?.addEventListener('click', () => {
      [['prof-name', 'name'], ['prof-institution', 'institution'], ['prof-instructor', 'instructor'], ['prof-course', 'course']].forEach(([id, k]) => { p[k] = $(id).value.trim(); });
      A().persistProfile();
    });
  }
  function focusLabel() { const f = A().state.settings.focus || []; return f.length ? (f.length === 1 ? f[0] : `${f.length} areas`) : 'All areas'; }
  function setFocus(list) {
    A().state.settings.focus = list;
    A().persistSettings();
    $('btn-focus').textContent = `Focus: ${focusLabel()} ▾`;
    renderFocusChips();
  }
  function renderFocusChips() {
    const box = $('cfg-focus'); if (!box) return;
    const f = A().state.settings.focus || [];
    box.innerHTML = Object.keys(A().FOCUS_AREAS).map(k => `<button type="button" class="ledger-chip ${f.includes(k) ? 'active' : ''}" data-focus="${esc(k)}">${esc(k)}</button>`).join('');
    box.querySelectorAll('[data-focus]').forEach(b => b.addEventListener('click', () => { const cur = new Set(A().state.settings.focus || []); cur.has(b.dataset.focus) ? cur.delete(b.dataset.focus) : cur.add(b.dataset.focus); setFocus([...cur]); }));
  }
  function focusMenu(anchor) {
    const f = new Set(A().state.settings.focus || []);
    const pop = RE().popover(anchor || $('btn-focus'), `<div class="focus-pop"><div class="focus-head">Concentrate feedback on</div>${Object.keys(A().FOCUS_AREAS).map(k => `<label class="focus-row"><input type="checkbox" value="${esc(k)}" ${f.has(k) ? 'checked' : ''}> ${esc(k)}</label>`).join('')}<div class="focus-actions"><button class="btn-mini ghost" id="focus-all">All areas</button><button class="btn-mini" id="focus-done">Done</button></div><p class="field-hint">Applies to appraisals and suggested revisions.</p></div>`, 'rt-palette');
    const r = (anchor || $('btn-focus')).getBoundingClientRect();
    pop.style.top = Math.max(8, r.top - pop.offsetHeight - 6) + 'px';
    pop.querySelectorAll('input').forEach(i => i.addEventListener('change', () => setFocus([...pop.querySelectorAll('input:checked')].map(x => x.value))));
    pop.querySelector('#focus-all').addEventListener('click', () => { setFocus([]); RE().closeMenus(); });
    pop.querySelector('#focus-done').addEventListener('click', () => RE().closeMenus());
  }

  // ───────────────────────── Guided tour & sample paper ─────────────────────────
  const TOUR = [
    { el: null, title: 'Welcome to Artificience', text: 'A quick tour of the main features, about a minute. You can replay it anytime from Help → Take the guided tour.', sample: true },
    { el: '#editor-dropzone', title: 'Your page', text: 'Write here, or drop a PDF, Word file or text file onto the page to import it. It saves on this computer as you type.' },
    { el: '#rt-toolbar-host', title: 'Menus and formatting', text: 'Like Word or Google Docs: File, Edit, View, Insert, Format, Tools and Help, plus fonts, sizes, styles, alignment, spacing, lists, tables and images.' },
    { el: '.rubric-mini-selector', title: 'Choose the lens', text: 'The rubric the evaluator grades against: honors capstone, AAC&U, graduate thesis, Danielson, UDL, Toulmin and more.' },
    { el: '#btn-focus', title: 'Focus the feedback', text: 'Narrow the evaluator to argument, evidence, structure, style, clarity or grammar, or leave it on all areas.' },
    { el: '#btn-appraise', title: 'Run an appraisal', text: 'An honest rubric grade, criterion by criterion, with strengths and concerns. Each concern links to the exact passage.' },
    { el: '#btn-revise-inline', title: 'Suggest revisions', text: 'Each proposed change appears in your paper with ✓ Keep or ✕ Reject, and a reason. To revise one passage, highlight it and choose Revise selection.' },
    { el: '.panel-tabs', title: 'The evaluator panel', text: 'Appraisal, Revisions, Documents (reports, memos, abstracts, cover letters…), Insights (readability and progress charts) and Peers (send your paper to a classmate and import their feedback).' },
    { el: '#btn-export-popover', title: 'Export', text: 'PDF, Word, Markdown, text, web page, Rich Text or LaTeX, or with APA 7, MLA 9 or Chicago title pages and headers.' },
    { el: '#btn-engine-status', title: 'Connect the AI', text: 'Add your API key in Settings (gpt-4o-mini is economical), or use a free local Ollama model. Writing, importing and exporting work without it.' }
  ];
  let tourIdx = 0;
  function tour(start = 0) {
    tourIdx = start; RE().closeMenus();
    let layer = $('tour-layer');
    if (!layer) { layer = document.createElement('div'); layer.id = 'tour-layer'; layer.innerHTML = '<div class="tour-spot"></div><div class="tour-card"></div>'; document.body.appendChild(layer); }
    layer.classList.remove('hidden');
    drawTour();
  }
  function endTour() { $('tour-layer')?.classList.add('hidden'); try { localStorage.setItem('artificience_tour_42', '1'); } catch {} }
  function drawTour() {
    const step = TOUR[tourIdx], layer = $('tour-layer'), spot = layer.querySelector('.tour-spot'), card = layer.querySelector('.tour-card');
    const el = step.el ? document.querySelector(step.el) : null;
    if (el && el.offsetParent !== null) {
      const r = el.getBoundingClientRect(), pad = 6;
      Object.assign(spot.style, { display: 'block', top: r.top - pad + 'px', left: r.left - pad + 'px', width: r.width + pad * 2 + 'px', height: Math.min(r.height, window.innerHeight - 40) + pad * 2 + 'px' });
      layer.classList.remove('centered');
    } else { spot.style.display = 'none'; layer.classList.add('centered'); }
    card.innerHTML = `<div class="tour-count">${tourIdx + 1} of ${TOUR.length}</div><h3>${esc(step.title)}</h3><p>${esc(step.text)}</p>
      <div class="tour-actions">${step.sample ? '<button class="btn-mini ghost" id="tour-sample">Open a sample paper</button>' : ''}<span class="tour-spacer"></span>
      <button class="btn-mini ghost" id="tour-skip">${tourIdx === TOUR.length - 1 ? 'Close' : 'Skip tour'}</button>${tourIdx > 0 ? '<button class="btn-mini ghost" id="tour-back">Back</button>' : ''}<button class="btn-mini" id="tour-next">${tourIdx === TOUR.length - 1 ? 'Finish' : 'Next'}</button></div>`;
    // place the card beside the highlighted element
    const cw = 340; card.style.width = cw + 'px';
    if (el && spot.style.display !== 'none') {
      const r = el.getBoundingClientRect();
      let top = r.bottom + 14, left = Math.min(Math.max(12, r.left), window.innerWidth - cw - 12);
      if (top + 200 > window.innerHeight) top = Math.max(12, r.top - 210);
      if (r.height > window.innerHeight * 0.5) { top = Math.max(12, r.top + 40); left = Math.min(r.right - cw - 24, window.innerWidth - cw - 12); }
      Object.assign(card.style, { top: top + 'px', left: left + 'px', transform: 'none' });
    } else Object.assign(card.style, { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
    card.querySelector('#tour-next').onclick = () => { if (tourIdx >= TOUR.length - 1) endTour(); else { tourIdx++; drawTour(); } };
    card.querySelector('#tour-back')?.addEventListener('click', () => { tourIdx--; drawTour(); });
    card.querySelector('#tour-skip').onclick = endTour;
    card.querySelector('#tour-sample')?.addEventListener('click', async () => { await samplePaper(); tourIdx++; drawTour(); });
  }
  const SAMPLE = `<h1 class="doc-title">Translanguaging in the Secondary Classroom</h1><p class="doc-subtitle">A sample paper for practicing with Artificience</p><h2>Introduction</h2><p>Many high schools still treat English as the only legitimate language of learning. This paper argues that translanguaging, the practice of letting students draw on their full linguistic repertoire, is not a crutch but a resource for academic thinking. Teachers should allow it more.</p><p>Research shows that multilingual students understand complex texts better when they can discuss them in more than one language. Some teachers worry that this will slow down English acquisition. This worry is very understandable but it is wrong.</p><h2>Classroom Evidence</h2><p>In one eleventh-grade class, students annotated <em>The Great Gatsby</em> in Bengali and English before writing an English analysis. Their essays used more textual evidence than the previous unit. The teacher noted that quieter students participated more.</p><p>This shows translanguaging works. Schools should adopt it everywhere.</p><h2>Conclusion</h2><p>Translanguaging is good for students. It respects who they are and it helps them learn.</p>`;
  async function samplePaper() {
    if (A().state.review) { toast('Apply or cancel the open revision review first.'); return; }
    await A().newPaper('Sample — Translanguaging in the Secondary Classroom', '');
    RE().setHtml(SAMPLE); A().handleEditorInput(); await A().persistDocument();
    toast('Sample paper opened. Try Run Appraisal, then Suggest Scholarly Revisions.', 4500);
  }

  // ───────────────────────── Version history ─────────────────────────
  const AUTO_EVERY = 10 * 60 * 1000, AUTO_KEEP = 30;
  let lastAutoCheck = 0;
  async function autoVersion() {
    const st = A().state; if (!st.content.trim() || Date.now() - lastAutoCheck < 60000) return;
    lastAutoCheck = Date.now();
    const all = (await A().dbGetAll('versions')).filter(v => v.docId === st.currentDocId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const latest = all[0];
    if (latest && (Date.now() - new Date(latest.createdAt).getTime() < AUTO_EVERY || latest.content === st.content)) return;
    await A().dbSave('versions', { id: 'ver_' + Date.now(), docId: st.currentDocId, title: st.title, content: st.content, html: RE().getHtml(), docStyle: RE().getDocStyle(), createdAt: nowIso(), note: 'Autosaved', auto: true });
    const autos = all.filter(v => v.auto);
    for (const old of autos.slice(AUTO_KEEP - 1)) await A().dbDelete('versions', old.id);
  }
  function saveNamedVersion() {
    const st = A().state;
    A().showInfo('Save a named version', `<div class="form-group"><label for="ver-name">Version name</label><input type="text" id="ver-name" placeholder="e.g. Draft sent to Dr. Lastname" /></div><button class="btn-modal-primary" id="ver-save">Save version</button>`, () => {
      $('ver-name').focus();
      const go = async () => { await A().dbSave('versions', { id: 'ver_' + Date.now(), docId: st.currentDocId, title: st.title, content: st.content, html: RE().getHtml(), docStyle: RE().getDocStyle(), createdAt: nowIso(), note: $('ver-name').value.trim() || 'Named version', named: true }); A().closeInfo(); toast('Version saved. See File → Version history.'); };
      $('ver-save').onclick = go; $('ver-name').onkeydown = (e) => { if (e.key === 'Enter') go(); };
    });
  }
  // Word-level comparison (longest common subsequence over words)
  function wordDiff(a, b) {
    const x = a.split(/(\s+)/), y = b.split(/(\s+)/);
    if (x.length * y.length > 9e6) return null;
    const n = x.length, m = y.length, L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = x[i] === y[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    let i = 0, j = 0, out = '', added = 0, removed = 0;
    while (i < n || j < m) {
      if (i < n && j < m && x[i] === y[j]) { out += esc(x[i]).replace(/\n/g, '<br>'); i++; j++; }
      else if (j < m && (i >= n || L[i][j + 1] >= L[i + 1][j])) { if (y[j].trim()) added++; out += `<ins class="diff-ins">${esc(y[j]).replace(/\n/g, '<br>')}</ins>`; j++; }
      else { if (x[i].trim()) removed++; out += `<del class="diff-del">${esc(x[i]).replace(/\n/g, '<br>')}</del>`; i++; }
    }
    return { html: out.replace(/<\/ins><ins class="diff-ins">/g, '').replace(/<\/del><del class="diff-del">/g, ''), added, removed };
  }
  async function versions() {
    const st = A().state;
    const list = (await A().dbGetAll('versions')).filter(v => v.docId === st.currentDocId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const row = (v, i) => {
      const w = countWords(plain(v.content)), older = list[i + 1], dw = older ? w - countWords(plain(older.content)) : null;
      return `<div class="ver-row"><div class="ver-info"><strong>${esc(v.note || 'Version')}</strong><small>${timeLabel(v.createdAt)} · ${w.toLocaleString()} words${dw !== null ? ` · ${dw >= 0 ? '+' : ''}${dw}` : ''}</small></div>
        <div class="ver-actions"><button class="btn-download" data-vp="${v.id}">Preview</button><button class="btn-download" data-vc="${v.id}">Compare</button><button class="btn-adopt" data-vr="${v.id}">Restore</button><button class="btn-download" data-vw="${v.id}">Word</button><button class="btn-download danger" data-vd="${v.id}">✕</button></div></div>`;
    };
    A().showInfo('Version history', `<p class="field-hint">Versions are saved automatically every 10 minutes while you write, before revisions are applied, and whenever you choose Save a named version.</p>
      <div class="ver-row current"><div class="ver-info"><strong>Current version</strong><small>${countWords(plain(st.content)).toLocaleString()} words</small></div><div class="ver-actions"><button class="btn-adopt" id="ver-new">Save as named version</button></div></div>
      <div class="ver-list">${list.length ? list.map(row).join('') : '<div class="empty-state">No earlier versions yet.</div>'}</div>`, (body) => {
      const find = (id) => list.find(v => v.id === id);
      $('ver-new').onclick = () => { A().closeInfo(); saveNamedVersion(); };
      body.querySelectorAll('[data-vp]').forEach(b => b.onclick = () => { const v = find(b.dataset.vp); A().showInfo(`Preview — ${v.note}`, `<div class="doc-preview">${v.html || RE().fromMarkdown(v.content)}</div><div class="doc-modal-actions"><button class="btn-modal-secondary" id="ver-back">← All versions</button><button class="btn-modal-primary" id="ver-restore1">Restore this version</button></div>`, () => { $('ver-back').onclick = versions; $('ver-restore1').onclick = () => restore(v); }); });
      body.querySelectorAll('[data-vc]').forEach(b => b.onclick = () => {
        const v = find(b.dataset.vc), d = wordDiff(plain(v.content), plain(st.content));
        A().showInfo(`Compare — ${v.note} → current`, d ? `<p class="field-hint"><span class="diff-ins">+${d.added} words added</span> · <span class="diff-del">−${d.removed} words removed</span> since this version.</p><div class="doc-preview compare-view">${d.html}</div><div class="doc-modal-actions"><button class="btn-modal-secondary" id="ver-back">← All versions</button></div>` : '<p>These versions are too long to compare word by word.</p>', () => { $('ver-back') && ($('ver-back').onclick = versions); });
      });
      body.querySelectorAll('[data-vr]').forEach(b => b.onclick = () => restore(find(b.dataset.vr)));
      body.querySelectorAll('[data-vw]').forEach(b => b.onclick = async () => { const v = find(b.dataset.vw); const cur = RE().getHtml(), style = RE().getDocStyle(); RE().setHtml(v.html || RE().fromMarkdown(v.content), v.docStyle); try { A().downloadBlob(await RE().toDocx(st.title || 'Paper'), A().safeName(`${st.title || 'Paper'} — ${v.note}`) + '.docx'); } finally { RE().setHtml(cur, style); } });
      body.querySelectorAll('[data-vd]').forEach(b => b.onclick = async () => { if (confirm('Delete this version?')) { await A().dbDelete('versions', b.dataset.vd); versions(); } });
    });
  }
  async function restore(v) {
    const st = A().state;
    if (st.review) { toast('Apply or cancel the open revision review first.'); return; }
    if (!confirm(`Restore “${v.note}” from ${timeLabel(v.createdAt)}? Your current text is saved as a version first.`)) return;
    await A().dbSave('versions', { id: 'ver_' + Date.now(), docId: st.currentDocId, title: st.title, content: st.content, html: RE().getHtml(), docStyle: RE().getDocStyle(), createdAt: nowIso(), note: 'Before restoring' });
    RE().setHtml(v.html || RE().fromMarkdown(v.content), v.docStyle); A().handleEditorInput(); A().closeInfo();
    toast('Version restored.');
  }

  // ───────────────────────── Writing insights ─────────────────────────
  const HEDGES = ['perhaps', 'maybe', 'might', 'possibly', 'somewhat', 'seems', 'appears', 'arguably', 'likely', 'suggests'];
  const INTENSIFIERS = ['very', 'really', 'extremely', 'clearly', 'obviously', 'totally', 'absolutely', 'definitely', 'truly', 'quite'];
  const TRANSITIONS = ['however', 'therefore', 'moreover', 'furthermore', 'consequently', 'thus', 'nevertheless', 'similarly', 'in contrast', 'for example', 'for instance', 'in addition', 'as a result', 'meanwhile', 'conversely', 'accordingly', 'yet', 'hence'];
  function syllables(w) {
    w = w.toLowerCase().replace(/[^a-z]/g, ''); if (!w) return 0; if (w.length <= 3) return 1;
    w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
    const m = w.match(/[aeiouy]{1,2}/g); return Math.max(1, m ? m.length : 1);
  }
  function analyze(md) {
    const paras = String(md || '').split(/\n{2,}/).map(s => s.trim()).filter(s => s && !/^#{1,3}\s/.test(s) && !/^\|/.test(s) && s !== '---' && s !== '![image]').map(plain).map(s => s.trim()).filter(Boolean);
    const sentences = [];
    paras.forEach((p, pi) => (p.match(/[^.!?…]+(?:[.!?…]+["”’)\]]*|$)/g) || []).map(s => s.trim()).filter(s => countWords(s) > 0).forEach(s => sentences.push({ text: s, words: countWords(s), para: pi })));
    const allWords = paras.join(' ').match(/[A-Za-z\u00C0-\u024F'’-]+/g) || [];
    const W = allWords.length, S = Math.max(1, sentences.length), syl = allWords.reduce((n, w) => n + syllables(w), 0);
    const flesch = W ? 206.835 - 1.015 * (W / S) - 84.6 * (syl / W) : 0;
    const grade = W ? 0.39 * (W / S) + 11.8 * (syl / W) - 15.59 : 0;
    const lower = allWords.map(w => w.toLowerCase().replace(/[’']/g, "'"));
    let ttr = 0, win = 0; for (let i = 0; i + 100 <= lower.length; i += 50) { ttr += new Set(lower.slice(i, i + 100)).size / 100; win++; }
    const text = paras.join(' ');
    const passive = sentences.filter(s => /\b(am|is|are|was|were|be|been|being)\s+(?:\w+ly\s+)?\w+(?:ed|en|wn|ght)\b/i.test(s.text));
    const countList = (list) => list.map(h => [h, (text.toLowerCase().match(new RegExp('\\b' + h.replace(/ /g, '\\s+') + '\\b', 'g')) || []).length]).filter(x => x[1]).sort((a, b) => b[1] - a[1]);
    const openers = {}; sentences.forEach(s => { const f = (s.text.match(/^[“"‘(]*([A-Za-z']+)/) || [])[1]; if (f) { const k = f.toLowerCase(); openers[k] = (openers[k] || 0) + 1; } });
    const citations = (text.match(/\([A-Z][A-Za-z'’-]+(?:\s(?:&|and)\s[A-Z][A-Za-z'’-]+|\set al\.)?,?\s\d{4}[a-z]?(?:,\s?(?:p|pp)\.\s?\d+(?:[–-]\d+)?)?\)|\(\d{4}\)|\[\d+(?:[,–-]\d+)*\]|\[citation needed[^\]]*\]/g) || []).length;
    return {
      words: W, sentences: sentences.length, paragraphs: paras.length, flesch, grade, avgSentence: W / S,
      longSentences: sentences.filter(s => s.words > 30), shortSentences: sentences.filter(s => s.words < 6), sentenceList: sentences,
      paraLengths: paras.map(countWords), passive, diversity: win ? ttr / win : (lower.length ? new Set(lower).size / lower.length : 0),
      hedges: countList(HEDGES), intensifiers: countList(INTENSIFIERS), transitions: countList(TRANSITIONS),
      openers: Object.entries(openers).filter(x => x[1] >= 3).sort((a, b) => b[1] - a[1]).slice(0, 4), citations,
      firstPerson: (text.match(/\b(I|me|my|mine|we|our|us)\b/g) || []).length
    };
  }
  const readLabel = (f) => f >= 60 ? 'plain' : f >= 50 ? 'fairly difficult' : f >= 30 ? 'academic' : 'very dense';
  function barChart(values, { w = 330, h = 70, color = '#c99a38', hi = () => false, hiColor = '#9a3412', data = '' } = {}) {
    if (!values.length) return '<div class="empty-state">Nothing to chart yet.</div>';
    const max = Math.max(...values, 1), bw = Math.max(1, Math.min(14, (w - values.length) / values.length));
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" width="100%" height="${h}" preserveAspectRatio="none">${values.map((v, i) => `<rect ${data ? `data-${data}="${i}"` : ''} x="${i * (bw + 1)}" y="${h - (v / max) * (h - 4)}" width="${bw}" height="${(v / max) * (h - 4)}" fill="${hi(v, i) ? hiColor : color}" rx="1"><title>${v} words</title></rect>`).join('')}</svg>`;
  }
  function lineChart(points, { w = 330, h = 90, color = '#634a10', min = null, max = null, label = (v) => v } = {}) {
    if (points.length < 2) return '<div class="empty-state small">Appears after two or more data points.</div>';
    const vs = points.map(p => p.v), lo = min ?? Math.min(...vs), hi = max ?? Math.max(...vs), span = hi - lo || 1, pad = 10;
    const xy = points.map((p, i) => [pad + (i / (points.length - 1)) * (w - pad * 2), h - pad - ((p.v - lo) / span) * (h - pad * 2)]);
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" width="100%" height="${h}"><polyline fill="none" stroke="${color}" stroke-width="2" points="${xy.map(p => p.join(',')).join(' ')}"/>${xy.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#fff" stroke="${color}" stroke-width="2"><title>${esc(points[i].t)}: ${label(points[i].v)}</title></circle>`).join('')}<text x="${pad}" y="${h - 1}" class="chart-label">${esc(points[0].t)}</text><text x="${w - pad}" y="${h - 1}" text-anchor="end" class="chart-label">${esc(points[points.length - 1].t)}</text></svg>`;
  }
  async function renderInsights() {
    const st = A().state, body = $('insights-body'); if (!body) return;
    const m = analyze(st.content);
    if (!m.words) { body.innerHTML = '<div class="empty-state">Write or import a paper to see readability, sentence rhythm and progress over time. No AI is used for insights.</div>'; return; }
    const versions = (await A().dbGetAll('versions')).filter(v => v.docId === st.currentDocId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const short = (iso) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const series = [...versions.map(v => ({ t: short(v.createdAt), md: v.content })), { t: 'Now', md: st.content }].map(x => ({ t: x.t, a: analyze(x.md) }));
    const scores = [...st.appraisals].reverse().map(a => ({ t: short(a.at), v: Math.round(a.result.score) }));
    const tile = (label, value, note) => `<div class="ins-tile"><span>${label}</span><strong>${value}</strong>${note ? `<small>${note}</small>` : ''}</div>`;
    const pct = (n) => m.sentences ? Math.round((n / m.sentences) * 100) + '%' : '0%';
    const chips = (list) => list.length ? list.slice(0, 6).map(([w, n]) => `<span class="ins-chip">${esc(w)} <b>${n}</b></span>`).join('') : '<span class="field-hint">none</span>';
    body.innerHTML = `
      <div class="ins-section"><h4>At a glance</h4><div class="ins-grid">
        ${tile('Words', m.words.toLocaleString())}${tile('Sentences', m.sentences)}${tile('Paragraphs', m.paragraphs)}
        ${tile('Reading ease', Math.round(m.flesch), readLabel(m.flesch))}${tile('Grade level', m.grade.toFixed(1), 'Flesch–Kincaid')}${tile('Avg. sentence', m.avgSentence.toFixed(1), 'words')}
        ${tile('Long sentences', pct(m.longSentences.length), 'over 30 words')}${tile('Passive voice', pct(m.passive.length), 'of sentences')}${tile('Vocabulary range', Math.round(m.diversity * 100) + '%', 'distinct words per 100')}
      </div><p class="field-hint">Academic prose usually reads at 30–50 on reading ease. These are guides, not grades.</p></div>
      <div class="ins-section"><h4>Sentence rhythm</h4><p class="field-hint">Each bar is one sentence. Rust bars run over 30 words; click one to find it in your paper.</p>${barChart(m.sentenceList.slice(0, 400).map(s => s.words), { hi: (v) => v > 30, data: 'sent' })}</div>
      <div class="ins-section"><h4>Paragraph lengths</h4>${barChart(m.paraLengths, { color: '#8c8e99', hi: (v) => v > 220 || v < 40, hiColor: '#c99a38', data: 'para' })}<p class="field-hint">Gold marks paragraphs under 40 or over 220 words.</p></div>
      <div class="ins-section"><h4>Word habits</h4>
        <div class="ins-row"><span>Hedges</span><div>${chips(m.hedges)}</div></div>
        <div class="ins-row"><span>Intensifiers</span><div>${chips(m.intensifiers)}</div></div>
        <div class="ins-row"><span>Transitions</span><div>${chips(m.transitions)}</div></div>
        <div class="ins-row"><span>Repeated openers</span><div>${m.openers.length ? m.openers.map(([w, n]) => `<span class="ins-chip">${esc(w)}… <b>${n}</b></span>`).join('') : '<span class="field-hint">none</span>'}</div></div>
        <div class="ins-row"><span>Citations found</span><div><span class="ins-chip"><b>${m.citations}</b></span></div></div>
        <div class="ins-row"><span>First person</span><div><span class="ins-chip"><b>${m.firstPerson}</b></span></div></div>
      </div>
      ${m.longSentences.length ? `<div class="ins-section"><h4>Longest sentences</h4>${m.longSentences.sort((a, b) => b.words - a.words).slice(0, 4).map(s => `<button class="quote-link ins-quote" data-q="${esc(s.text.slice(0, 120))}">${s.words} words — “${esc(s.text.slice(0, 90))}…”</button>`).join('')}</div>` : ''}
      <div class="ins-section"><h4>Progress over time</h4>
        <div class="ins-chart-label">Appraisal score</div>${lineChart(scores, { min: Math.min(60, ...scores.map(p => p.v)), max: 100 })}
        <div class="ins-chart-label">Word count</div>${lineChart(series.map(x => ({ t: x.t, v: x.a.words })), { color: '#15803d', label: (v) => v.toLocaleString() })}
        <div class="ins-chart-label">Reading ease</div>${lineChart(series.map(x => ({ t: x.t, v: Math.round(x.a.flesch) })), { color: '#c99a38' })}
        <p class="field-hint">Built from your saved versions and appraisals of this paper.</p></div>
      <div class="artifact-actions"><button class="btn-download" id="ins-doc">Save insights as a document</button></div>`;
    body.querySelectorAll('[data-sent]').forEach(r => r.addEventListener('click', () => { const s = m.sentenceList[+r.dataset.sent]; if (s) reveal(s.text); }));
    body.querySelectorAll('[data-para]').forEach(r => r.addEventListener('click', () => { const t = String(st.content).split(/\n{2,}/).map(plain).map(x => x.trim()).filter(x => x && !/^#/.test(x))[+r.dataset.para]; if (t) reveal(t.slice(0, 80)); }));
    body.querySelectorAll('.ins-quote').forEach(b => b.addEventListener('click', () => reveal(b.dataset.q)));
    $('ins-doc').onclick = async () => {
      const md = `## At a glance\n\n| Measure | Value |\n| --- | --- |\n| Words | ${m.words} |\n| Sentences | ${m.sentences} |\n| Paragraphs | ${m.paragraphs} |\n| Reading ease | ${Math.round(m.flesch)} (${readLabel(m.flesch)}) |\n| Flesch–Kincaid grade | ${m.grade.toFixed(1)} |\n| Average sentence | ${m.avgSentence.toFixed(1)} words |\n| Sentences over 30 words | ${m.longSentences.length} |\n| Passive-voice sentences | ${m.passive.length} |\n| Citations found | ${m.citations} |\n\n## Word habits\n\n- Hedges: ${m.hedges.map(([w, n]) => `${w} (${n})`).join(', ') || 'none'}\n- Intensifiers: ${m.intensifiers.map(([w, n]) => `${w} (${n})`).join(', ') || 'none'}\n- Transitions: ${m.transitions.map(([w, n]) => `${w} (${n})`).join(', ') || 'none'}\n\n## Longest sentences\n\n${m.longSentences.slice(0, 5).map(s => `- (${s.words} words) ${s.text}`).join('\n') || 'None over 30 words.'}`;
      const a = await A().saveArtifact({ title: `${st.title || 'Untitled Paper'} — writing insights`, kind: 'insights', content: md });
      A().openDocModal(a);
    };
  }
  function reveal(text) { if (A().state.review) { toast('Close the revision review to jump to passages.'); return; } if (!RE().reveal(text)) toast('Couldn’t find that passage on the page.'); }

  // ───────────────────────── Peer review exchange ─────────────────────────
  const criteriaFor = (lens) => { const r = A().RUBRIC_LENSES[lens] || ''; const m = /criteria:\s*(.*)$/i.exec(r); return m ? m[1].split(';').map(s => s.replace(/\.$/, '').trim()).filter(Boolean) : ['Argument', 'Evidence', 'Organization', 'Style']; };
  const SCALE = ['', 'Beginning', 'Developing', 'Proficient', 'Strong', 'Exemplary'];
  function sendForReview() {
    const st = A().state;
    if (!st.content.trim()) { toast('Write or import a paper first.'); return; }
    A().showInfo('Send for peer review', `
      <p class="about-text">Artificience makes a review file. Send it to a classmate or colleague by email or message. They open it in their own Artificience (Import), comment on passages, score each criterion and send their review file back. Import that file here and their feedback appears in the Peers tab.</p>
      <div class="form-group"><label for="pr-name">Your name (shown to the reviewer)</label><input type="text" id="pr-name" value="${esc(st.profile.name || '')}" /></div>
      <div class="form-group"><label for="pr-q">Questions for your reviewer (one per line, optional)</label><textarea id="pr-q" rows="3" placeholder="Is my thesis clear by the end of the first page?\nWhere does the argument lose you?"></textarea></div>
      <p class="field-hint">They’ll score against: ${esc((A().LENS_NAMES()[st.activeFramework] || st.activeFramework))}.</p>
      <button class="btn-modal-primary" id="pr-make">Create review file</button>`, () => {
      $('pr-make').onclick = async () => {
        const req = { type: 'artificience-peer-request', version: 1, id: 'req_' + Date.now().toString(36), title: st.title || 'Untitled Paper', author: $('pr-name').value.trim(), lens: st.activeFramework, lensName: A().LENS_NAMES()[st.activeFramework] || '', questions: $('pr-q').value.split('\n').map(x => x.trim()).filter(Boolean), html: RE().getHtml(), docStyle: RE().getDocStyle(), content: st.content, createdAt: nowIso() };
        st.peer = st.peer && st.peer.role !== 'reviewer' ? st.peer : { role: 'author', requests: [], responses: [] };
        st.peer.requests.push({ id: req.id, createdAt: req.createdAt }); await A().persistDocument();
        A().downloadBlob(new Blob([JSON.stringify(req)], { type: 'application/json' }), A().safeName(`${req.title} — for peer review`) + '.json');
        A().closeInfo(); renderPeers(); toast('Review file downloaded. Send it to your reviewer.', 4000);
      };
    });
  }
  async function importPeer(data) {
    const st = A().state;
    if (data.type === 'artificience-peer-request') {
      if (!confirm(`Open “${data.title}”${data.author ? ` by ${data.author}` : ''} for peer review?`)) return;
      await A().newPaper(`Review — ${data.title}`, '');
      RE().setHtml(data.html || RE().fromMarkdown(data.content), data.docStyle);
      A().handleEditorInput();
      st.peer = { role: 'reviewer', request: { ...data, html: undefined }, comments: [], scores: {}, answers: {}, overall: '', reviewer: st.profile.name || '' };
      await A().persistDocument(); onPaperOpened(); A().selectTab('peers');
      toast('Opened for review. Select passages to comment, then score and send your review back.', 5000);
      return;
    }
    if (data.type === 'artificience-peer-response') {
      const docs = await A().dbGetAll('manuscripts');
      const owner = docs.find(d => d.peer?.requests?.some(r => r.id === data.requestId));
      if (owner && owner.id !== st.currentDocId) { await A().persistDocument(); A().applyRecord(owner); }
      else if (!owner && !confirm(`This review is for “${data.title}”. Attach it to the paper that’s open now?`)) return;
      st.peer = st.peer && st.peer.role !== 'reviewer' ? st.peer : { role: 'author', requests: [], responses: [] };
      st.peer.responses = (st.peer.responses || []).filter(r => r.id !== data.id).concat([data]);
      await A().persistDocument(); onPaperOpened(); A().selectTab('peers');
      toast(`Feedback from ${data.reviewer || 'your reviewer'} imported.`);
    }
  }
  function onPaperOpened() {
    const st = A().state, reviewer = st.peer?.role === 'reviewer';
    const page = $('manuscript-editor');
    page.contentEditable = reviewer ? 'false' : 'true';
    document.body.classList.toggle('peer-reviewing', reviewer);
    const badge = $('peers-badge'), n = st.peer?.responses?.length || 0;
    if (badge) { badge.textContent = reviewer ? '•' : n ? String(n) : ''; badge.classList.toggle('hidden', !reviewer && !n); }
    renderPeers();
    if (!$('view-insights').classList.contains('hidden')) renderInsights();
  }
  function renderPeers() {
    const st = A().state, body = $('peers-body'); if (!body) return;
    const p = st.peer;
    if (p?.role === 'reviewer') return renderReviewerForm(body, p);
    const responses = p?.responses || [];
    body.innerHTML = `
      <div class="doc-create"><div class="doc-create-head">Peer review</div>
        <p class="about-text">Send this paper to a classmate, colleague or mentor. They review it in their own copy of Artificience and send a review file back.</p>
        <div class="artifact-actions"><button class="btn-adopt" id="peer-send">Send for peer review…</button><label class="btn-download" for="omnibox-file-import">Import a review file…</label></div>
        ${p?.requests?.length ? `<p class="field-hint">${p.requests.length} review file${p.requests.length === 1 ? '' : 's'} sent · ${responses.length} received</p>` : ''}
      </div>
      ${responses.length ? responses.map((r, i) => `
        <div class="eval-card peer-card">
          <div class="eval-card-header"><span class="eval-lens-tag">✦ ${esc(r.reviewer || 'Reviewer')}</span><span class="eval-scholar-tag">${A().fmtDate(r.createdAt)}</span></div>
          <div class="eval-card-body">
            ${Object.keys(r.scores || {}).length ? `<table class="wc-table">${Object.entries(r.scores).map(([k, v]) => `<tr><td>${esc(k)}</td><td>${v ? `${v}/5 · ${SCALE[v]}` : '—'}</td></tr>`).join('')}</table>` : ''}
            ${r.overall ? `<div class="appraisal-section"><h4>Overall</h4><p>${esc(r.overall)}</p></div>` : ''}
            ${Object.keys(r.answers || {}).length ? `<div class="appraisal-section"><h4>Your questions</h4>${Object.entries(r.answers).map(([q, a]) => `<p><strong>${esc(q)}</strong><br>${esc(a || '—')}</p>`).join('')}</div>` : ''}
            ${(r.comments || []).length ? `<div class="appraisal-section"><h4>Comments on passages (${r.comments.length})</h4>${r.comments.map(c => `<div class="concern"><button class="quote-link" data-q="${esc(c.quote)}">“${esc(c.quote.slice(0, 90))}${c.quote.length > 90 ? '…' : ''}”</button><p>${esc(c.note)}</p></div>`).join('')}</div>` : ''}
            <div class="artifact-actions"><button class="btn-adopt" data-peerrev="${i}">✦ Turn into revisions</button><button class="btn-download" data-peerdoc="${i}">Save as document</button><button class="btn-download danger" data-peerdel="${i}">✕</button></div>
          </div></div>`).join('') : '<div class="empty-state">No peer feedback yet. Feedback you import appears here, with each comment linked to its passage.</div>'}`;
    $('peer-send').onclick = sendForReview;
    body.querySelectorAll('[data-q]').forEach(b => b.addEventListener('click', () => reveal(b.dataset.q)));
    body.querySelectorAll('[data-peerrev]').forEach(b => b.addEventListener('click', () => { const r = responses[+b.dataset.peerrev]; A().runRevisions({ focus: `Address this peer reviewer's feedback (${r.reviewer || 'reviewer'}): ${r.overall || ''} ${(r.comments || []).map(c => `On “${c.quote.slice(0, 120)}”: ${c.note}`).join(' | ')}`.slice(0, 3500) }); }));
    body.querySelectorAll('[data-peerdoc]').forEach(b => b.addEventListener('click', async () => { const r = responses[+b.dataset.peerdoc]; const a = await A().saveArtifact({ title: `${st.title || 'Paper'} — peer review by ${r.reviewer || 'reviewer'}`, kind: 'peer', content: peerMarkdown(r) }); A().openDocModal(a); }));
    body.querySelectorAll('[data-peerdel]').forEach(b => b.addEventListener('click', async () => { if (!confirm('Remove this peer review?')) return; p.responses.splice(+b.dataset.peerdel, 1); await A().persistDocument(); onPaperOpened(); }));
  }
  function peerMarkdown(r) {
    return `Reviewer: ${r.reviewer || '—'} · ${A().fmtDate(r.createdAt)}${r.lensName ? ` · Lens: ${r.lensName}` : ''}\n\n` +
      (Object.keys(r.scores || {}).length ? `## Scores\n\n| Criterion | Score |\n| --- | --- |\n${Object.entries(r.scores).map(([k, v]) => `| ${k} | ${v ? `${v}/5 (${SCALE[v]})` : '—'} |`).join('\n')}\n\n` : '') +
      (r.overall ? `## Overall\n\n${r.overall}\n\n` : '') +
      (Object.keys(r.answers || {}).length ? `## Questions\n\n${Object.entries(r.answers).map(([q, a]) => `**${q}**\n\n${a || '—'}`).join('\n\n')}\n\n` : '') +
      ((r.comments || []).length ? `## Comments\n\n${r.comments.map(c => `- “${c.quote}” — ${c.note}`).join('\n')}` : '');
  }
  function renderReviewerForm(body, p) {
    const req = p.request, crit = criteriaFor(req.lens);
    body.innerHTML = `
      <div class="doc-create peer-banner"><div class="doc-create-head">You’re reviewing</div>
        <p class="about-text"><strong>${esc(req.title)}</strong>${req.author ? ` by ${esc(req.author)}` : ''}. The paper is read-only. Select any passage on the page, then choose <em>Comment on selection</em>.</p></div>
      <div class="form-group"><label for="rv-name">Your name</label><input type="text" id="rv-name" value="${esc(p.reviewer || '')}" /></div>
      <div class="appraisal-section"><h4>Comments (${p.comments.length})</h4>
        <button class="btn-adopt" id="rv-comment">+ Comment on selection</button>
        ${p.comments.map((c, i) => `<div class="concern"><button class="quote-link" data-q="${esc(c.quote)}">“${esc(c.quote.slice(0, 80))}${c.quote.length > 80 ? '…' : ''}”</button><p>${esc(c.note)}</p><button class="btn-mini ghost" data-rvdel="${i}">Remove</button></div>`).join('') || '<p class="field-hint">No comments yet.</p>'}</div>
      <div class="appraisal-section"><h4>Scores${req.lensName ? ` · ${esc(req.lensName)}` : ''}</h4>
        ${crit.map(c => `<div class="rv-score"><span>${esc(c)}</span><select data-crit="${esc(c)}"><option value="">—</option>${[1, 2, 3, 4, 5].map(v => `<option value="${v}" ${+p.scores[c] === v ? 'selected' : ''}>${v} · ${SCALE[v]}</option>`).join('')}</select></div>`).join('')}</div>
      ${(req.questions || []).length ? `<div class="appraisal-section"><h4>The author asks</h4>${req.questions.map((q, i) => `<div class="form-group"><label>${esc(q)}</label><textarea rows="2" data-ans="${i}">${esc(p.answers[q] || '')}</textarea></div>`).join('')}</div>` : ''}
      <div class="form-group"><label for="rv-overall">Overall feedback</label><textarea id="rv-overall" rows="4" placeholder="What works, what would most improve the paper…">${esc(p.overall || '')}</textarea></div>
      <div class="artifact-actions"><button class="btn-adopt" id="rv-send">Create review file to send back</button></div>`;
    const save = () => A().persistDocument();
    $('rv-name').oninput = (e) => { p.reviewer = e.target.value; save(); };
    $('rv-overall').oninput = (e) => { p.overall = e.target.value; save(); };
    body.querySelectorAll('[data-crit]').forEach(s => s.onchange = () => { p.scores[s.dataset.crit] = +s.value || 0; save(); });
    body.querySelectorAll('[data-ans]').forEach(t => t.oninput = () => { p.answers[req.questions[+t.dataset.ans]] = t.value; save(); });
    body.querySelectorAll('[data-q]').forEach(b => b.addEventListener('click', () => reveal(b.dataset.q)));
    body.querySelectorAll('[data-rvdel]').forEach(b => b.onclick = () => { p.comments.splice(+b.dataset.rvdel, 1); save(); renderPeers(); });
    $('rv-comment').addEventListener('mousedown', (e) => e.preventDefault());
    $('rv-comment').onclick = () => {
      const quote = RE().selectedText().trim();
      if (!quote) { toast('Select a passage on the page first.'); return; }
      A().showInfo('Comment on this passage', `<p class="ledger-before">${esc(quote.slice(0, 400))}</p><div class="form-group"><textarea id="rv-note" rows="4" placeholder="Your comment"></textarea></div><button class="btn-modal-primary" id="rv-add">Add comment</button>`, () => {
        $('rv-note').focus();
        $('rv-add').onclick = () => { const note = $('rv-note').value.trim(); if (!note) return; p.comments.push({ quote: quote.slice(0, 600), note, at: nowIso() }); save(); A().closeInfo(); renderPeers(); };
      });
    };
    $('rv-send').onclick = () => {
      if (!p.comments.length && !p.overall.trim() && !Object.values(p.scores).some(Boolean)) { toast('Add at least a comment, a score or overall feedback first.'); return; }
      const res = { type: 'artificience-peer-response', version: 1, id: 'res_' + Date.now().toString(36), requestId: req.id, title: req.title, reviewer: p.reviewer || 'Reviewer', lensName: req.lensName, comments: p.comments, scores: p.scores, answers: p.answers, overall: p.overall, createdAt: nowIso() };
      A().downloadBlob(new Blob([JSON.stringify(res)], { type: 'application/json' }), A().safeName(`${req.title} — review by ${res.reviewer}`) + '.json');
      toast('Review file downloaded. Send it back to the author.', 4000);
    };
  }

  // ───────────────────────── Export: academic templates, RTF, LaTeX ─────────────────────────
  function templateExport() {
    const st = A().state, p = st.profile;
    if (st.review) { toast('Apply or cancel the open revision review first.'); return; }
    const today = new Date().toISOString().slice(0, 10);
    A().showInfo('Download with academic formatting', `
      <div class="tpl-options">
        ${[['apa', 'APA 7 student paper', 'Title page; page numbers top right; bold centered title on page 2'], ['mla', 'MLA 9', 'Name, instructor, course and date block; centered title; “Surname 1” header'], ['chicago', 'Chicago (notes-bibliography)', 'Title page; page numbers centered at the bottom']].map(([v, l, d], i) => `<label class="radio-card tpl-card ${i === 0 ? 'checked' : ''}"><input type="radio" name="tpl" value="${v}" ${i === 0 ? 'checked' : ''}><span><strong>${l}</strong><small>${d}</small></span></label>`).join('')}
      </div>
      <div class="form-row-2"><div class="form-group"><label>Your name</label><input id="tpl-name" value="${esc(p.name || '')}" /></div><div class="form-group"><label>Institution</label><input id="tpl-inst" value="${esc(p.institution || '')}" /></div></div>
      <div class="form-row-2"><div class="form-group"><label>Course</label><input id="tpl-course" value="${esc(p.course || '')}" /></div><div class="form-group"><label>Instructor</label><input id="tpl-instr" value="${esc(p.instructor || '')}" /></div></div>
      <div class="form-row-2"><div class="form-group"><label>Date</label><input type="date" id="tpl-date" value="${today}" /></div><div class="form-group"><label>Title</label><input id="tpl-title" value="${esc(RE().ownTitle() || st.title || '')}" /></div></div>
      <p class="field-hint">Body text is set in Times New Roman 12 pt, double-spaced, with 1 in margins and first-line indents. Your details are remembered for next time.</p>
      <div class="modal-actions-row"><button class="btn-modal-primary" id="tpl-word">Download Word (.docx)</button><button class="btn-modal-secondary" id="tpl-pdf">PDF (print dialog)</button></div>`, () => {
      document.querySelectorAll('.tpl-card input').forEach(r => r.onchange = () => document.querySelectorAll('.tpl-card').forEach(c => c.classList.toggle('checked', c.querySelector('input').checked)));
      const read = () => {
        Object.assign(p, { name: $('tpl-name').value.trim(), institution: $('tpl-inst').value.trim(), course: $('tpl-course').value.trim(), instructor: $('tpl-instr').value.trim() });
        A().persistProfile();
        initProfileFields();
        return { template: document.querySelector('.tpl-card input:checked').value, meta: { name: p.name, institution: p.institution, course: p.course, instructor: p.instructor, date: $('tpl-date').value + 'T12:00:00' }, title: $('tpl-title').value.trim() || st.title || 'Untitled Paper' };
      };
      $('tpl-word').onclick = async () => { const o = read(); try { A().downloadBlob(await RE().toDocx(o.title, null, o), A().safeName(`${o.title} (${o.template.toUpperCase()})`) + '.docx'); toast('Downloaded formatted Word document.'); A().closeInfo(); } catch (e) { toast('Export failed: ' + e.message, 5000); } };
      $('tpl-pdf').onclick = () => { const o = read(); A().printHtml(RE().toPrintHtml(o.title, o)); A().closeInfo(); toast('Choose “Save as PDF” in the print dialog.', 4000); };
    });
  }
  const rtfEsc = (t) => String(t).replace(/\\/g, '\\\\').replace(/\{/g, '\\{').replace(/\}/g, '\\}').replace(/[^\x00-\x7f]/g, (c) => { const code = c.charCodeAt(0); return `\\u${code > 32767 ? code - 65536 : code}?`; });
  const rtfInline = (t) => rtfEsc(t).replace(/\*\*([^*]+)\*\*/g, '{\\b $1}').replace(/(^|[^*])\*([^*\n]+)\*/g, '$1{\\i $2}').replace(/\n/g, '\\line ');
  function exportRtf() {
    const st = A().state; if (st.review) { toast('Apply or cancel the open revision review first.'); return; }
    const own = RE().ownTitle(), title = own || st.title || 'Untitled Paper';
    const blocks = window.__artificience.mdToBlocks(st.content).filter((b, i) => !(i === 0 && own && /^h[12]$/.test(b.type) && b.text.trim() === own));
    let body = `{\\pard\\qc\\sl480\\slmult1\\b\\fs32 ${rtfEsc(title)}\\par}\n`;
    for (const b of blocks) {
      if (/^h[1-3]$/.test(b.type)) body += `{\\pard\\sb240\\sa120\\b\\fs${b.type === 'h3' ? 24 : 28} ${rtfInline(b.text)}\\par}\n`;
      else if (b.type === 'ul' || b.type === 'ol') body += `{\\pard\\li720\\fi-360\\sl480\\slmult1 ${b.type === 'ul' ? '\\bullet' : '-'}\\tab ${rtfInline(b.text)}\\par}\n`;
      else if (b.type === 'quote') body += `{\\pard\\li720\\ri720\\sl480\\slmult1 ${rtfInline(b.text)}\\par}\n`;
      else if (b.type === 'hr') body += `{\\pard\\qc * * *\\par}\n`;
      else if (b.type === 'table') body += b.rows.map(r => `{\\pard ${r.map(rtfInline).join('\\tab ')}\\par}`).join('\n') + '\n';
      else body += `{\\pard\\fi720\\sl480\\slmult1 ${rtfInline(b.text)}\\par}\n`;
    }
    const rtf = `{\\rtf1\\ansi\\ansicpg1252\\deff0{\\fonttbl{\\f0 Times New Roman;}}\\paperw12240\\paperh15840\\margl1440\\margr1440\\margt1440\\margb1440\\f0\\fs24\n${body}}`;
    A().downloadBlob(new Blob([rtf], { type: 'application/rtf' }), A().safeName(title) + '.rtf'); toast('Downloaded Rich Text file.');
  }
  const texEsc = (t) => String(t).replace(/\\/g, '\\textbackslash{}').replace(/([&%$#_{}])/g, '\\$1').replace(/~/g, '\\textasciitilde{}').replace(/\^/g, '\\textasciicircum{}').replace(/“/g, '``').replace(/”/g, "''").replace(/‘/g, '`').replace(/’/g, "'").replace(/—/g, '---').replace(/–/g, '--');
  const texInline = (t) => texEsc(t).replace(/\*\*([^*]+)\*\*/g, '\\textbf{$1}').replace(/(^|[^*])\*([^*\n]+)\*/g, '$1\\emph{$2}').replace(/\n/g, '\\\\\n');
  function exportTex() {
    const st = A().state; if (st.review) { toast('Apply or cancel the open revision review first.'); return; }
    const own = RE().ownTitle(), title = own || st.title || 'Untitled Paper';
    const blocks = window.__artificience.mdToBlocks(st.content).filter((b, i) => !(i === 0 && own && /^h[12]$/.test(b.type) && b.text.trim() === own)), p = st.profile;
    let body = '', list = null;
    const close = () => { if (list) { body += `\\end{${list}}\n`; list = null; } };
    for (const b of blocks) {
      const want = b.type === 'ul' ? 'itemize' : b.type === 'ol' ? 'enumerate' : null;
      if (want !== list) close();
      if (want) { if (!list) { body += `\\begin{${want}}\n`; list = want; } body += `  \\item ${texInline(b.text)}\n`; continue; }
      if (b.type === 'h1' || b.type === 'h2') body += `\\section*{${texInline(b.text)}}\n\n`;
      else if (b.type === 'h3') body += `\\subsection*{${texInline(b.text)}}\n\n`;
      else if (b.type === 'quote') body += `\\begin{quote}\n${texInline(b.text)}\n\\end{quote}\n\n`;
      else if (b.type === 'hr') body += `\\begin{center}* * *\\end{center}\n\n`;
      else if (b.type === 'table') body += `\\begin{tabular}{${'l'.repeat(b.rows[0].length)}}\n${b.rows.map(r => r.map(texInline).join(' & ') + ' \\\\').join('\n')}\n\\end{tabular}\n\n`;
      else body += `${texInline(b.text)}\n\n`;
    }
    close();
    const tex = `\\documentclass[12pt,letterpaper]{article}\n\\usepackage[T1]{fontenc}\n\\usepackage[utf8]{inputenc}\n\\usepackage{mathptmx}\n\\usepackage[margin=1in]{geometry}\n\\usepackage{setspace}\n\\doublespacing\n\\title{${texEsc(title)}}\n\\author{${texEsc(p.name || '')}}\n\\date{${texEsc(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))}}\n\\begin{document}\n\\maketitle\n\n${body}\\end{document}\n`;
    A().downloadBlob(new Blob([tex], { type: 'application/x-tex' }), A().safeName(title) + '.tex'); toast('Downloaded LaTeX file.');
  }

  // ───────────────────────── Wiring ─────────────────────────
  function onTab(name) { if (name === 'insights') renderInsights(); if (name === 'peers') renderPeers(); }
  function init() {
    initProfileFields(); renderFocusChips();
    $('btn-focus').textContent = `Focus: ${focusLabel()} ▾`;
    $('btn-focus').addEventListener('click', (e) => { e.stopPropagation(); focusMenu($('btn-focus')); });
    window.addEventListener('resize', () => { if (!$('tour-layer')?.classList.contains('hidden')) drawTour(); });
    let seen = false; try { seen = !!localStorage.getItem('artificience_tour_42'); } catch {}
    if (!seen) setTimeout(() => tour(0), 900);
  }
  function refreshSettings() { initProfileFields(); renderFocusChips(); $('btn-focus').textContent = `Focus: ${focusLabel()} ▾`; }
  window.Features = { refreshSettings, init, tour, samplePaper, focusMenu, autoVersion, saveNamedVersion, versions, analyze, renderInsights, sendForReview, importPeer, onPaperOpened, onTab, templateExport, exportRtf, exportTex, wordDiff };
  window.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));
})();
