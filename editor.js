/**
 * Artificience — Word/Docs-style page editor
 * A rich-text page (contenteditable) with a menu bar (File, Edit, View, Insert, Format, Tools, Help),
 * a formatting toolbar, 20 fonts, styles, colors, alignment, spacing, lists, tables, images,
 * find & replace, zoom and a status bar. It converts the page to Markdown for the evaluator and
 * back, and writes faithful Word (.docx) and print/PDF output from the page's own formatting.
 */
'use strict';
(function () {
  // Fonts installed on macOS (and mostly Windows), with fallbacks so a paper never renders blank.
  const FONTS = [
    ['Times New Roman', "'Times New Roman', Times, serif"],
    ['Georgia', 'Georgia, serif'],
    ['Garamond', "Garamond, 'EB Garamond', 'Hoefler Text', 'Times New Roman', serif"],
    ['Baskerville', "Baskerville, 'Libre Baskerville', 'Times New Roman', serif"],
    ['Palatino', "Palatino, 'Palatino Linotype', 'Book Antiqua', serif"],
    ['Hoefler Text', "'Hoefler Text', Garamond, Georgia, serif"],
    ['Charter', "Charter, 'Bitstream Charter', Georgia, serif"],
    ['Iowan Old Style', "'Iowan Old Style', Palatino, Georgia, serif"],
    ['Cambria', 'Cambria, Georgia, serif'],
    ['Didot', "Didot, 'Bodoni 72', 'Times New Roman', serif"],
    ['Calibri', "Calibri, Carlito, 'Helvetica Neue', Arial, sans-serif"],
    ['Arial', 'Arial, Helvetica, sans-serif'],
    ['Helvetica Neue', "'Helvetica Neue', Helvetica, Arial, sans-serif"],
    ['Avenir Next', "'Avenir Next', Avenir, 'Helvetica Neue', sans-serif"],
    ['Gill Sans', "'Gill Sans', 'Gill Sans MT', Calibri, sans-serif"],
    ['Optima', "Optima, Candara, 'Helvetica Neue', sans-serif"],
    ['Futura', "Futura, 'Century Gothic', 'Helvetica Neue', sans-serif"],
    ['Verdana', 'Verdana, Geneva, sans-serif'],
    ['Courier New', "'Courier New', Courier, monospace"],
    ['Menlo', 'Menlo, Consolas, monospace']
  ];
  const SIZES = [8, 9, 10, 10.5, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];
  const STYLES = [['p', 'Normal text'], ['title', 'Title'], ['subtitle', 'Subtitle'], ['h1', 'Heading 1'], ['h2', 'Heading 2'], ['h3', 'Heading 3'], ['blockquote', 'Block quote']];
  const COLORS = ['#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#ffffff', '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff', '#634a10', '#c99a38', '#15803d', '#1e3a8a', '#7c2d12', '#4c1d95', '#831843', '#134e4a'];
  const HIGHLIGHTS = ['transparent', '#fff59d', '#ffe0b2', '#c8e6c9', '#b3e5fc', '#e1bee7', '#ffcdd2', '#f5f5f5', '#fcf8ee'];
  const SPECIAL = ['—', '–', '“', '”', '‘', '’', '…', '§', '¶', '†', '‡', '•', '°', '±', '×', '÷', '≈', '≠', '≤', '≥', '→', '←', '©', '®', '™', 'é', 'è', 'ü', 'ñ', 'ç', 'ā', 'ī', 'ū', 'ḥ', 'ṣ', 'ʿ', 'ʾ', 'α', 'β', 'λ', 'π', 'Σ'];
  const DEFAULT_DOC = { font: 'Times New Roman', size: 12, line: 2, indent: true, spacingAfter: 0 };

  let page, host, savedRange = null, zoom = 1, onChange = () => {}, docStyle = { ...DEFAULT_DOC };
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const fontStack = (name) => (FONTS.find(f => f[0] === name) || [name, `'${name}', serif`])[1];

  // ───────── selection helpers ─────────
  function saveSelection() {
    const sel = window.getSelection();
    if (sel.rangeCount && page.contains(sel.getRangeAt(0).commonAncestorContainer)) savedRange = sel.getRangeAt(0).cloneRange();
  }
  function restoreSelection() {
    page.focus({ preventScroll: true });
    if (savedRange) { const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(savedRange); }
  }
  function exec(cmd, value = null) { restoreSelection(); document.execCommand('styleWithCSS', false, cmd === 'hiliteColor' || cmd === 'foreColor'); document.execCommand(cmd, false, value); saveSelection(); changed(); }
  function changed() { normalize(); updateToolbarState(); updateStatus(); onChange(); }
  function normalize() {
    // Keep every top-level node a block so the paper maps cleanly to paragraphs.
    [...page.childNodes].forEach(n => {
      if (n.nodeType === 3 && n.textContent.trim()) { const p = document.createElement('p'); n.replaceWith(p); p.appendChild(n); }
      else if (n.nodeType === 1 && ['SPAN', 'FONT', 'B', 'I', 'U', 'EM', 'STRONG', 'A'].includes(n.tagName)) { const p = document.createElement('p'); n.replaceWith(p); p.appendChild(n); }
    });
    if (!page.firstElementChild) page.innerHTML = '<p><br></p>';
  }
  // Wrap the selection in a span with an inline style (used for exact font sizes and fonts).
  function styleSelection(prop, value) {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    if (sel.isCollapsed) { // apply to the paragraph the caret is in
      const block = currentBlock(); if (block) block.style[prop] = value; changed(); return;
    }
    document.execCommand('styleWithCSS', false, false);
    document.execCommand('fontSize', false, '7');
    page.querySelectorAll('font[size="7"]').forEach(f => {
      const span = document.createElement('span'); span.style[prop] = value;
      while (f.firstChild) span.appendChild(f.firstChild);
      f.replaceWith(span);
      span.querySelectorAll('span').forEach(inner => { inner.style[prop] = ''; if (!inner.getAttribute('style')) inner.replaceWith(...inner.childNodes); });
    });
    saveSelection(); changed();
  }
  function currentBlock() {
    const sel = window.getSelection(); if (!sel.rangeCount) return null;
    let n = sel.getRangeAt(0).startContainer;
    while (n && n.parentNode !== page) n = n.parentNode;
    return n && n.nodeType === 1 ? n : null;
  }
  function selectedBlocks() {
    const sel = window.getSelection(); if (!sel.rangeCount) return [];
    const r = sel.getRangeAt(0);
    return [...page.children].filter(b => r.intersectsNode(b));
  }
  function setBlockStyle(kind) {
    restoreSelection();
    const map = { p: 'P', h1: 'H1', h2: 'H2', h3: 'H3', blockquote: 'BLOCKQUOTE', title: 'H1', subtitle: 'P' };
    document.execCommand('formatBlock', false, map[kind]);
    selectedBlocks().forEach(b => { b.classList.remove('doc-title', 'doc-subtitle'); if (kind === 'title') b.classList.add('doc-title'); if (kind === 'subtitle') b.classList.add('doc-subtitle'); });
    saveSelection(); changed();
  }
  function setLineSpacing(v) { restoreSelection(); const blocks = selectedBlocks(); (blocks.length ? blocks : [currentBlock()]).filter(Boolean).forEach(b => b.style.lineHeight = String(v)); saveSelection(); changed(); }
  function setAlign(a) { exec({ left: 'justifyLeft', center: 'justifyCenter', right: 'justifyRight', justify: 'justifyFull' }[a]); }

  // ───────── page ↔ Markdown ─────────
  function inlineMd(node) {
    let s = '';
    node.childNodes.forEach(n => {
      if (n.nodeType === 3) { s += n.textContent.replace(/ /g, ' '); return; }
      if (n.nodeType !== 1) return;
      const tag = n.tagName, inner = inlineMd(n), st = n.style || {};
      if (tag === 'BR') s += '\n';
      else if (tag === 'IMG') s += '![image]';
      else if ((tag === 'B' || tag === 'STRONG' || +st.fontWeight >= 600 || st.fontWeight === 'bold') && inner.trim()) s += `**${inner}**`;
      else if ((tag === 'I' || tag === 'EM' || st.fontStyle === 'italic') && inner.trim()) s += `*${inner}*`;
      else s += inner;
    });
    return s;
  }
  function blockMd(el) {
    if (el.nodeType === 3) return el.textContent.trim();
    if (el.nodeType !== 1) return '';
    const tag = el.tagName;
    if (el.classList.contains('page-break')) return '---';
    if (tag === 'HR') return '---';
    if (tag === 'H1') return '# ' + inlineMd(el).trim();
    if (tag === 'H2') return '## ' + inlineMd(el).trim();
    if (tag === 'H3' || tag === 'H4') return '### ' + inlineMd(el).trim();
    if (tag === 'BLOCKQUOTE') return inlineMd(el).trim().split('\n').map(l => '> ' + l).join('\n');
    if (tag === 'UL' || tag === 'OL') { let i = 1; return [...el.children].map(li => (tag === 'OL' ? `${i++}.` : '-') + ' ' + inlineMd(li).trim()).join('\n'); }
    if (tag === 'TABLE') { const rows = [...el.querySelectorAll('tr')].map(tr => '| ' + [...tr.children].map(c => inlineMd(c).trim().replace(/\|/g, '/') || ' ').join(' | ') + ' |'); if (rows.length > 1) rows.splice(1, 0, '| ' + rows[0].split('|').slice(1, -1).map(() => '---').join(' | ') + ' |'); return rows.join('\n'); }
    if (tag === 'FIGURE' || (tag === 'P' && el.querySelector('img') && !el.textContent.trim())) return '![image]';
    return inlineMd(el).trim();
  }
  // Top-level blocks with their Markdown, keeping empty paragraphs attached to the block after them.
  function blocks() { return [...page.childNodes].filter(n => n.nodeType === 1 || n.textContent.trim()).map(el => ({ el, md: blockMd(el) })); }
  function toMarkdown() { return blocks().map(b => b.md).filter(Boolean).join('\n\n'); }
  function fromMarkdown(md) { return (window.__artificience?.mdToHtml || (t => `<p>${esc(t)}</p>`))(md) || '<p><br></p>'; }

  // Rebuild the page from revised Markdown, reusing the original HTML of every unchanged block so
  // fonts, colors, alignment and images survive revisions.
  function applyMarkdownPreservingFormat(newMd) {
    const old = blocks();
    const groups = []; let pendingEmpty = [];
    old.forEach(b => { if (!b.md) pendingEmpty.push(b.el.outerHTML); else { groups.push({ md: b.md, html: pendingEmpty.join('') + b.el.outerHTML, lead: pendingEmpty.join('') }); pendingEmpty = []; } });
    const next = newMd.split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
    // merge list/table lines that Markdown splitting may keep together already; compare by block text
    const a = groups.map(g => g.md), b = next, n = a.length, m = b.length;
    const L = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    let i = 0, j = 0, html = '';
    while (j < m) {
      if (i < n && a[i] === b[j]) { html += groups[i].html; i++; j++; continue; }
      // a changed paragraph pairs with the one it replaces; otherwise drop an old one or add a new one
      const replacing = i < n && L[i + 1][j + 1] === L[i][j];
      if (!replacing && i < n && L[i + 1][j] >= L[i][j + 1]) { i++; continue; }
      {
        const lead = i < n ? groups[i].lead : '';
        const base = i < n ? groups[i].html.slice(lead.length) : '';
        let fresh = fromMarkdown(b[j]);
        // carry paragraph-level formatting (alignment, spacing, font) from the block it replaces
        const tmp = document.createElement('div'); tmp.innerHTML = base;
        const src = tmp.firstElementChild, dst = document.createElement('div'); dst.innerHTML = fresh;
        if (src && dst.firstElementChild && src.tagName === dst.firstElementChild.tagName && src.getAttribute('style')) dst.firstElementChild.setAttribute('style', src.getAttribute('style'));
        // carry the most common inline font, size and color of the replaced paragraph
        if (src && dst.firstElementChild) {
          const pick = (prop) => { const tally = {}; src.querySelectorAll('span[style], font').forEach(el => { const v = prop === 'fontFamily' && el.getAttribute('face') ? el.getAttribute('face') : el.style[prop]; if (v) tally[v] = (tally[v] || 0) + (el.textContent || '').length; }); return Object.entries(tally).sort((x, y) => y[1] - x[1])[0]?.[0]; };
          for (const prop of ['fontFamily', 'fontSize', 'color']) { const v = pick(prop); if (v && !dst.firstElementChild.style[prop]) dst.firstElementChild.style[prop] = v; }
        }
        html += (replacing ? lead : '') + dst.innerHTML; j++; if (replacing) i++;
      }
    }
    page.innerHTML = html || '<p><br></p>';
    changed();
  }

  // Plain reading text of Markdown (what the page shows), used to match quotes to the page.
  function plainOf(md) {
    return String(md || '').replace(/^\s*#{1,3}\s+/gm, '').replace(/^\s*(?:[-*•]|\d+[.)])\s+/gm, '').replace(/^\s*>\s?/gm, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1').replace(/(^|[^*])\*([^*\n]+)\*/g, '$1$2').replace(/!\[image\]/g, '');
  }
  function normChar(c) { c = c.toLowerCase(); if (/[‘’‚′]/.test(c)) return "'"; if (/[“”„″]/.test(c)) return '"'; if (/[–—]/.test(c)) return '-'; if (/\s| /.test(c)) return ' '; return c; }
  function normalizeText(t) { let out = '', sp = false; for (const ch of t) { const c = normChar(ch); if (c === ' ') { if (sp) continue; sp = true; } else sp = false; out += c; } return out; }
  // Page text with a map back to text nodes. Adjacent inline nodes join without a space; blocks join with one.
  function pageIndex() {
    const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT);
    const map = []; let ns = '', sp = true, lastBlock = null;
    while (walker.nextNode()) {
      const n = walker.currentNode; let blk = n.parentNode; while (blk && blk.parentNode !== page) blk = blk.parentNode;
      if (lastBlock && blk !== lastBlock && !sp) { ns += ' '; map.push(null); sp = true; }
      lastBlock = blk;
      const t = n.textContent;
      for (let k = 0; k < t.length; k++) { const c = normChar(t[k]); if (c === ' ') { if (sp) continue; sp = true; } else sp = false; ns += c; map.push({ n, k }); }
    }
    return { ns, map };
  }
  // Find the page range for a passage quoted from the Markdown text (the nth occurrence).
  function findRange(quote, nth = 0) {
    const t = normalizeText(plainOf(quote)).trim();
    if (t.length < 2) return null;
    const { ns, map } = pageIndex();
    let at = -1, from = 0;
    for (let k = 0; k <= nth; k++) { at = ns.indexOf(t, from); if (at < 0) return null; from = at + 1; }
    let s = map[at], e = map[at + t.length - 1];
    if (!s) s = map[at + 1]; if (!e) e = map[at + t.length - 2];
    if (!s || !e) return null;
    const r = document.createRange(); r.setStart(s.n, s.k); r.setEnd(e.n, e.k + 1);
    return r;
  }
  // Writes kept revisions straight into the page at their exact place, so the new words take on
  // the surrounding font, size and color and nothing else on the page changes. Returns false if
  // any change can't be placed, so the caller can fall back to a block-level rebuild.
  function applyEdits(edits, baseText) {
    const count = (hay, needle) => { let n = 0, i = -1; while ((i = hay.indexOf(needle, i + 1)) >= 0) n++; return n; };
    const plan = [];
    for (const e of edits) {
      const before = normalizeText(plainOf(baseText.slice(0, e.start)));
      let key;
      if (e.type === 'insert') {
        // anchor: the last few words before the insertion point, within the same paragraph
        const para = baseText.slice(0, e.start).split(/\n\n/).pop();
        key = normalizeText(plainOf(para.slice(-90))).trim().replace(/^\S*\s/, '');
      } else key = normalizeText(plainOf(e.original)).trim();
      if (!key || key.length < 2) return false;
      const nth = e.type === 'insert' ? Math.max(0, count(before.trimEnd(), key) - 1) : count(before, key);
      plan.push({ e, key, nth });
    }
    const snapshot = page.innerHTML;
    try {
      for (const { e, key, nth } of plan.sort((a, b) => b.e.start - a.e.start)) {
        const r = findRange(key, nth); if (!r) throw new Error('unplaced');
        if (e.type === 'insert') {
          const text = e.replacement.replace(/^\s+/, '');
          if (e.replacement.startsWith('\n\n')) {
            let blk = r.endContainer; while (blk && blk.parentNode !== page) blk = blk.parentNode;
            const p = document.createElement(blk && /^(P|BLOCKQUOTE)$/.test(blk.tagName) ? blk.tagName : 'P');
            if (blk && blk.getAttribute && blk.getAttribute('style')) p.setAttribute('style', blk.getAttribute('style'));
            const inner = blk && blk.querySelector && blk.querySelector('span[style], font');
            if (inner) { const span = inner.cloneNode(false); span.textContent = text; p.appendChild(span); } else p.textContent = text;
            blk ? blk.after(p) : page.appendChild(p);
          } else { r.collapse(false); r.insertNode(document.createTextNode(' ' + text)); }
        } else {
          const startNode = r.startContainer, startOff = r.startOffset;
          r.deleteContents();
          if (e.replacement) { const tn = document.createTextNode(e.replacement); const rr = document.createRange(); rr.setStart(startNode, Math.min(startOff, startNode.textContent.length)); rr.insertNode(tn); }
        }
      }
      page.normalize();
      [...page.children].forEach(b => { if (!b.textContent.trim() && !b.querySelector('img, table, br, hr') && !b.classList.contains('page-break')) b.remove(); });
      changed();
      return true;
    } catch { page.innerHTML = snapshot; return false; }
  }
  function reveal(quote) {
    const r = findRange(quote); if (!r) return false;
    page.focus(); const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r); saveSelection();
    (r.startContainer.parentElement || page).scrollIntoView({ block: 'center', behavior: 'smooth' });
    return true;
  }
  function selectedText() {
    const sel = window.getSelection();
    if (!sel.rangeCount || sel.isCollapsed || !page.contains(sel.getRangeAt(0).commonAncestorContainer)) return '';
    return sel.toString();
  }

  // ───────── HTML → Word (.docx), keeping fonts, sizes, colors and alignment ─────────
  const pxToHalfPt = (v) => { const m = /([\d.]+)(px|pt|em|rem)?/.exec(v || ''); if (!m) return null; const n = +m[1]; const pt = m[2] === 'pt' ? n : m[2] === 'em' || m[2] === 'rem' ? n * docStyle.size : n * 0.75; return Math.round(pt * 2); };
  const toHex = (c) => { if (!c || c === 'transparent' || /rgba\(.*,\s*0\)/.test(c)) return null; if (c[0] === '#') return c.slice(1).padEnd(6, '0').slice(0, 6); const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c); return m ? [m[1], m[2], m[3]].map(x => (+x).toString(16).padStart(2, '0')).join('') : null; };
  const firstFamily = (f) => (f || '').split(',')[0].replace(/['"]/g, '').trim() || null;
  // Academic templates: front matter, headers and page numbers. opts = { template, meta }
  const TPL_STYLE = { font: 'Times New Roman', size: 12, line: 2, indent: true, spacingAfter: 0 };
  const lastName = (n) => (String(n || '').trim().split(/\s+/).pop() || '');
  const mlaDate = (d) => { const x = d ? new Date(d) : new Date(); return isNaN(x) ? String(d) : `${x.getDate()} ${x.toLocaleString('en-US', { month: 'long' })} ${x.getFullYear()}`; };
  const longDate = (d) => { const x = d ? new Date(d) : new Date(); return isNaN(x) ? String(d) : x.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); };
  function frontMatter(title, opts) {
    const m = opts.meta || {}, t = opts.template;
    if (t === 'apa') return { titlePage: [['', 'gap3'], [title, 'bold'], ['', ''], [m.name], [m.institution], [m.course], [m.instructor], [longDate(m.date)]].filter(x => x[0] !== undefined && (x[0] !== null)), bodyTitle: { text: title, bold: true, center: true }, header: 'page' };
    if (t === 'mla') return { block: [m.name, m.instructor, m.course, mlaDate(m.date)].filter(Boolean), bodyTitle: { text: title, bold: false, center: true }, header: 'surname', surname: lastName(m.name) };
    if (t === 'chicago') return { titlePage: [['', 'gap6'], [title, 'bold'], ['', 'gap6'], [m.name], [m.course], [m.instructor], [longDate(m.date)]], header: 'footer-page' };
    return null;
  }
  async function toDocx(title, appendixMd, opts = {}) {
    const D = window.docx; if (!D) throw new Error('The Word writer did not load.');
    const fm = frontMatter(title, opts);
    const savedStyle = docStyle; if (fm) docStyle = { ...docStyle, ...TPL_STYLE };
    try {
    const base = { font: docStyle.font, size: Math.round(docStyle.size * 2) };
    const runs = (node, inh) => {
      const out = [];
      node.childNodes.forEach(n => {
        if (n.nodeType === 3) { const t = n.textContent.replace(/ /g, ' '); if (t) out.push(new D.TextRun({ text: t, bold: inh.bold, italics: inh.italics, underline: inh.underline ? {} : undefined, strike: inh.strike, font: inh.font, size: inh.size, color: inh.color || undefined, shading: inh.highlight ? { fill: inh.highlight, type: D.ShadingType.CLEAR, color: 'auto' } : undefined, superScript: inh.sup, subScript: inh.sub })); return; }
        if (n.nodeType !== 1) return;
        const tag = n.tagName, st = n.style, s = { ...inh };
        if (tag === 'BR') { out.push(new D.TextRun({ break: 1 })); return; }
        if (tag === 'IMG') { const img = imageRun(n); if (img) out.push(img); return; }
        if (tag === 'B' || tag === 'STRONG' || st.fontWeight === 'bold' || +st.fontWeight >= 600) s.bold = true;
        if (tag === 'I' || tag === 'EM' || st.fontStyle === 'italic') s.italics = true;
        if (tag === 'U' || /underline/.test(st.textDecoration || st.textDecorationLine || '')) s.underline = true;
        if (tag === 'S' || tag === 'STRIKE' || tag === 'DEL' || /line-through/.test(st.textDecoration || st.textDecorationLine || '')) s.strike = true;
        if (tag === 'SUP') s.sup = true; if (tag === 'SUB') s.sub = true;
        if (tag === 'FONT') { if (n.getAttribute('face')) s.font = firstFamily(n.getAttribute('face')); if (n.getAttribute('color')) s.color = toHex(n.getAttribute('color')); }
        if (st.fontFamily) s.font = firstFamily(st.fontFamily);
        if (st.fontSize) s.size = pxToHalfPt(st.fontSize) || s.size;
        if (st.color) s.color = toHex(st.color);
        if (st.backgroundColor) s.highlight = toHex(st.backgroundColor);
        if (tag === 'A') s.color = s.color || '1155CC', s.underline = true;
        out.push(...runs(n, s));
      });
      return out;
    };
    function imageRun(img) {
      const m = /^data:image\/(png|jpe?g|gif|bmp);base64,(.*)$/.exec(img.src || ''); if (!m) return null;
      const bytes = Uint8Array.from(atob(m[2]), c => c.charCodeAt(0));
      const w = img.naturalWidth || img.width || 400, h = img.naturalHeight || img.height || 300, max = 600, scale = Math.min(1, max / w);
      return new D.ImageRun({ type: m[1] === 'jpeg' ? 'jpg' : m[1], data: bytes, transformation: { width: Math.round(w * scale), height: Math.round(h * scale) } });
    }
    const align = (el) => ({ center: D.AlignmentType.CENTER, right: D.AlignmentType.RIGHT, justify: D.AlignmentType.JUSTIFIED })[(el.style.textAlign || el.getAttribute('align') || '').toLowerCase()];
    const lineOf = (el) => { const lh = parseFloat(el.style.lineHeight); return Math.round(((lh && lh < 5 ? lh : docStyle.line) || 1.15) * 240); };
    const inhFor = (el) => { const s = { ...base }; if (el.style.fontFamily) s.font = firstFamily(el.style.fontFamily); if (el.style.fontSize) s.size = pxToHalfPt(el.style.fontSize) || s.size; if (el.style.color) s.color = toHex(el.style.color); return s; };
    const kids = [];
    const para = (el, opts = {}) => new D.Paragraph({ alignment: align(el), spacing: { line: lineOf(el), after: Math.round((docStyle.spacingAfter || 0) * 20) }, indent: opts.indent, heading: opts.heading, bullet: opts.bullet, numbering: opts.numbering, pageBreakBefore: opts.pageBreakBefore, children: runs(el, { ...inhFor(el), ...(opts.run || {}) }) });
    const skipOwnTitle = !!frontMatter(title, opts);
    // APA Level 1 = the highest heading level the paper actually uses (often Heading 2 under the title)
    const topLvl = Math.min(4, ...[...page.children].filter(el => /^H[1-4]$/.test(el.tagName) && !el.classList.contains('doc-title')).map(el => +el.tagName[1]));
    let leading = true;
    for (const el of page.children) {
      const tag = el.tagName;
      if (leading && skipOwnTitle && (el.classList.contains('doc-title') || el.classList.contains('doc-subtitle'))) continue;
      leading = false;
      if (el.classList.contains('page-break')) { kids.push(new D.Paragraph({ children: [new D.PageBreak()] })); continue; }
      if (tag === 'HR') { kids.push(new D.Paragraph({ border: { bottom: { color: '999999', space: 1, style: D.BorderStyle.SINGLE, size: 6 } }, children: [] })); continue; }
      if (tag === 'H1' && el.classList.contains('doc-title')) { kids.push(new D.Paragraph({ heading: D.HeadingLevel.TITLE, alignment: align(el) || D.AlignmentType.CENTER, spacing: { after: 240 }, children: runs(el, { ...inhFor(el), bold: true, size: Math.round(docStyle.size * 2 * 1.6) }) })); continue; }
      if (/^H[1-4]$/.test(tag)) { const lvl = +tag[1]; kids.push(new D.Paragraph({ heading: [D.HeadingLevel.HEADING_1, D.HeadingLevel.HEADING_2, D.HeadingLevel.HEADING_3, D.HeadingLevel.HEADING_3][lvl - 1], alignment: align(el) || (skipOwnTitle && opts.template === 'apa' && lvl === topLvl ? D.AlignmentType.CENTER : undefined), spacing: { before: 240, after: 120, line: skipOwnTitle ? 480 : undefined }, children: runs(el, { ...inhFor(el), bold: true, color: '000000', italics: skipOwnTitle && lvl >= topLvl + 2 ? true : undefined, size: Math.round(docStyle.size * 2 * (skipOwnTitle ? 1 : [1.4, 1.2, 1.05, 1][lvl - 1])) }) })); continue; }
      if (tag === 'BLOCKQUOTE') { kids.push(para(el, { indent: { left: 720, right: 720 } })); continue; }
      if (tag === 'UL' || tag === 'OL') { [...el.children].forEach(li => kids.push(para(li, tag === 'UL' ? { bullet: { level: 0 } } : { numbering: { reference: 'num', level: 0 } }))); continue; }
      if (tag === 'TABLE') {
        kids.push(new D.Table({ width: { size: 100, type: D.WidthType.PERCENTAGE }, rows: [...el.querySelectorAll('tr')].map(tr => new D.TableRow({ children: [...tr.children].map(td => new D.TableCell({ children: [new D.Paragraph({ children: runs(td, { ...base, bold: td.tagName === 'TH' }) })] })) })) }));
        kids.push(new D.Paragraph({ children: [] })); continue;
      }
      const firstLine = docStyle.indent && tag === 'P' && !el.classList.contains('doc-subtitle') && !(el.style.textAlign === 'center') ? 720 : undefined;
      if (el.classList.contains('doc-subtitle')) { kids.push(new D.Paragraph({ alignment: align(el) || D.AlignmentType.CENTER, spacing: { after: 240 }, children: runs(el, { ...inhFor(el), italics: true }) })); continue; }
      kids.push(para(el, { indent: firstLine ? { firstLine } : undefined }));
    }
    if (appendixMd) {
      kids.push(new D.Paragraph({ children: [new D.PageBreak()] }));
      const tmp = document.createElement('div'); tmp.innerHTML = fromMarkdown(appendixMd);
      const holder = page; page = tmp; const saved = docStyle; docStyle = { ...docStyle, indent: false, line: 1.15 };
      try { for (const el of tmp.children) { if (/^H[1-3]$/.test(el.tagName)) kids.push(new D.Paragraph({ heading: D.HeadingLevel.HEADING_1, spacing: { before: 240, after: 120 }, children: runs(el, { ...base, bold: true, size: Math.round(docStyle.size * 2.4) }) })); else if (el.tagName === 'TABLE') kids.push(new D.Table({ width: { size: 100, type: D.WidthType.PERCENTAGE }, rows: [...el.querySelectorAll('tr')].map(tr => new D.TableRow({ children: [...tr.children].map(td => new D.TableCell({ children: [new D.Paragraph({ children: runs(td, { ...base, size: 18, bold: td.tagName === 'TH' }) })] })) })) }), new D.Paragraph({ children: [] })); else if (el.tagName === 'UL' || el.tagName === 'OL') [...el.children].forEach(li => kids.push(para(li, { bullet: { level: 0 } }))); else kids.push(para(el)); } }
      finally { page = holder; docStyle = saved; }
    }
    let headers, footers, titlePage = false;
    if (fm) {
      const tr = (text, o = {}) => new D.TextRun({ text, font: 'Times New Roman', size: 24, bold: o.bold });
      const center = (text, o = {}) => new D.Paragraph({ alignment: D.AlignmentType.CENTER, spacing: { line: 480, before: o.before || 0 }, children: [tr(text || '', o)] });
      const front = [];
      if (fm.titlePage) {
        fm.titlePage.forEach(([text, kind]) => { if (kind === 'gap3') front.push(center('', { before: 1440 })); else if (kind === 'gap6') front.push(center('', { before: 2400 })); else if (text || kind === '') front.push(center(text || '', { bold: kind === 'bold' })); });
        front.push(new D.Paragraph({ children: [new D.PageBreak()] }));
      }
      if (fm.block) fm.block.forEach(l => front.push(new D.Paragraph({ spacing: { line: 480 }, children: [tr(l)] })));
      if (fm.bodyTitle) front.push(new D.Paragraph({ alignment: D.AlignmentType.CENTER, spacing: { line: 480 }, children: [tr(fm.bodyTitle.text, { bold: fm.bodyTitle.bold })] }));
      kids.unshift(...front);
      const pageRun = (prefix) => new D.TextRun({ font: 'Times New Roman', size: 24, children: [prefix, D.PageNumber.CURRENT] });
      if (fm.header === 'page') headers = { default: new D.Header({ children: [new D.Paragraph({ alignment: D.AlignmentType.RIGHT, children: [pageRun('')] })] }) };
      if (fm.header === 'surname') headers = { default: new D.Header({ children: [new D.Paragraph({ alignment: D.AlignmentType.RIGHT, children: [pageRun(fm.surname ? fm.surname + ' ' : '')] })] }) };
      if (fm.header === 'footer-page') { titlePage = true; footers = { default: new D.Footer({ children: [new D.Paragraph({ alignment: D.AlignmentType.CENTER, children: [pageRun('')] })] }), first: new D.Footer({ children: [new D.Paragraph({ children: [] })] }) }; }
    }
    const file = new D.Document({
      creator: 'Artificience', title,
      // Headings and title in black, in the paper's font (Word's defaults are blue and in another typeface)
      styles: { default: { document: { run: { font: docStyle.font, size: Math.round(docStyle.size * 2) } } },
        paragraphStyles: [['Title', 'Title', 1.6], ['Heading1', 'Heading 1', 1.4], ['Heading2', 'Heading 2', 1.2], ['Heading3', 'Heading 3', 1.05]].map(([id, name, k]) => ({ id, name, basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: docStyle.font, size: Math.round(docStyle.size * 2 * (fm ? 1 : k)), bold: true, color: '000000', italics: fm && id === 'Heading3' }, paragraph: { spacing: { before: 240, after: 120 }, alignment: fm && opts.template === 'apa' && id === 'Heading1' ? D.AlignmentType.CENTER : undefined } })) },
      numbering: { config: [{ reference: 'num', levels: [{ level: 0, format: D.LevelFormat.DECIMAL, text: '%1.', alignment: D.AlignmentType.START }] }] },
      sections: [{ properties: { titlePage, page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } }, headers, footers, children: kids }]
    });
    return await D.Packer.toBlob(file);
    } finally { docStyle = savedStyle; }
  }
  function docCss() {
    return `body{font-family:${fontStack(docStyle.font)};font-size:${docStyle.size}pt;line-height:${docStyle.line};color:#000;}
      p{margin:0 0 ${docStyle.spacingAfter || 0}pt;${docStyle.indent ? 'text-indent:0.5in;' : ''}}
      p[style*="text-align: center"],p.doc-subtitle,li p{text-indent:0}
      h1,h2,h3{line-height:1.3;margin:14pt 0 6pt;text-indent:0} h1{font-size:1.4em} h2{font-size:1.2em} h3{font-size:1.05em}
      h1.doc-title{font-size:1.6em;text-align:center;margin:0 0 6pt} p.doc-subtitle{text-align:center;font-style:italic;margin-bottom:18pt}
      blockquote{margin:0 0.5in 12pt;text-indent:0} ul,ol{margin:0 0 8pt 0.4in;padding:0} li{text-indent:0}
      table{border-collapse:collapse;width:100%;margin:6pt 0 12pt;line-height:1.3} td,th{border:1px solid #999;padding:4pt 6pt;vertical-align:top;text-align:left}
      img{max-width:100%} hr{border:0;border-top:1px solid #999} .page-break{break-after:page;height:0;border:0}`;
  }
  function toPrintHtml(title, opts = {}) {
    const fm = frontMatter(title, opts);
    if (!fm) return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>@page{size:letter;margin:1in}${docCss()} body{max-width:6.5in;margin:0 auto}</style></head><body>${page.innerHTML}</body></html>`;
    const saved = docStyle; docStyle = { ...docStyle, ...TPL_STYLE };
    try {
      const pageBox = fm.header === 'page' ? '@top-right{content:counter(page);font:12pt "Times New Roman",serif}' : fm.header === 'surname' ? `@top-right{content:"${esc(fm.surname)} " counter(page);font:12pt "Times New Roman",serif}` : '@bottom-center{content:counter(page);font:12pt "Times New Roman",serif}';
      let front = '';
      if (fm.titlePage) front += `<section class="tp ${opts.template}">${fm.titlePage.map(([t, k]) => k === 'gap3' ? '<div style="height:1.5in"></div>' : k === 'gap6' ? '<div style="height:2.5in"></div>' : `<p class="c">${k === 'bold' ? `<strong>${esc(t)}</strong>` : esc(t || '')}</p>`).join('')}</section>`;
      if (fm.block) front += fm.block.map(l => `<p class="blk">${esc(l)}</p>`).join('');
      if (fm.bodyTitle) front += `<p class="c">${fm.bodyTitle.bold ? `<strong>${esc(fm.bodyTitle.text)}</strong>` : esc(fm.bodyTitle.text)}</p>`;
      // the page's own font choices are replaced by the template's Times New Roman 12 pt
      const holder = document.createElement('div'); holder.innerHTML = page.innerHTML;
      while (holder.firstElementChild && (holder.firstElementChild.classList.contains('doc-title') || holder.firstElementChild.classList.contains('doc-subtitle'))) holder.firstElementChild.remove();
      const body = holder.innerHTML.replace(/font-family:[^;"]*;?/g, '').replace(/font-size:[^;"]*;?/g, '').replace(/<font [^>]*>/g, '<span>').replace(/<\/font>/g, '</span>');
      return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>@page{size:letter;margin:1in;${pageBox}} ${fm.header === 'footer-page' ? '@page:first{@bottom-center{content:none}}' : ''} ${docCss()} body{max-width:6.5in;margin:0 auto} p.c,p.blk{text-indent:0;margin:0} p.c{text-align:center} section.tp{break-after:page;line-height:2}</style></head><body>${front}${body}</body></html>`;
    } finally { docStyle = saved; }
  }

  // ───────── UI: menu bar, toolbar, popovers ─────────
  let openMenuEl = null;
  function closeMenus() { document.querySelectorAll('.rt-pop').forEach(p => p.remove()); document.querySelectorAll('.rt-menu-btn.open').forEach(b => b.classList.remove('open')); openMenuEl = null; }
  function popover(anchor, html, cls = '') {
    closeMenus();
    const pop = document.createElement('div');
    pop.className = 'rt-pop ' + cls; pop.innerHTML = html;
    document.body.appendChild(pop);
    const r = anchor.getBoundingClientRect();
    pop.style.top = Math.max(8, Math.min(r.bottom + 4, window.innerHeight - pop.offsetHeight - 8)) + 'px';
    pop.style.left = Math.max(8, Math.min(r.left, window.innerWidth - pop.offsetWidth - 8)) + 'px';
    pop.addEventListener('mousedown', e => { if (!e.target.closest('input,textarea,select')) e.preventDefault(); });
    return pop;
  }
  function menuHtml(items) {
    return items.map(it => it === '-' ? '<div class="rt-sep"></div>' : `<button class="rt-item${it.sub ? ' has-sub' : ''}" data-key="${esc(it.key)}"${it.disabled ? ' disabled' : ''}><span>${esc(it.label)}</span>${it.hint ? `<kbd>${esc(it.hint)}</kbd>` : ''}${it.sub ? '<span class="rt-caret">▸</span>' : ''}</button>`).join('');
  }
  function openMenu(btn, items) {
    const pop = popover(btn, menuHtml(items), 'rt-dropdown');
    btn.classList.add('open'); openMenuEl = btn;
    const bind = (container, list) => container.querySelectorAll(':scope > .rt-item').forEach(el => {
      const it = list.find(i => i !== '-' && i.key === el.dataset.key);
      const showSubmenu = () => {
        container.querySelectorAll('.rt-sub').forEach(s => s.remove());
        if (!it.sub) return;
        const sub = document.createElement('div');
        sub.className = 'rt-pop rt-dropdown rt-sub';
        sub.innerHTML = menuHtml(it.sub);
        document.body.appendChild(sub);
        const r = el.getBoundingClientRect();
        const mobile = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
        if (mobile) {
          // A tap opens nested menus as a contained overlay rather than relying on hover.
          sub.style.top = Math.max(8, Math.min(r.bottom + 4, window.innerHeight - sub.offsetHeight - 8)) + 'px';
          sub.style.left = Math.max(8, Math.min(r.left, window.innerWidth - sub.offsetWidth - 8)) + 'px';
        } else {
          sub.style.top = Math.max(8, Math.min(r.top, window.innerHeight - sub.offsetHeight - 8)) + 'px';
          sub.style.left = Math.max(8, Math.min(r.right + 2, window.innerWidth - sub.offsetWidth - 8)) + 'px';
        }
        sub.addEventListener('mousedown', e => { if (!e.target.closest('input,textarea,select')) e.preventDefault(); });
        bind(sub, it.sub);
        container._sub = sub;
      };
      el.addEventListener('mouseenter', () => {
        if (!window.matchMedia('(pointer: coarse)').matches) showSubmenu();
      });
      el.addEventListener('click', () => {
        if (it.sub) { showSubmenu(); return; }
        closeMenus(); it.run && it.run();
      });
    });
    bind(pop, items);
  }
  const A = () => window.App || {};
  function menus() {
    const app = A();
    return {
      File: [
        { key: 'new', label: 'New paper', hint: '', run: () => app.newPaper?.() },
        { key: 'open', label: 'Open a paper…', run: () => app.openPapers?.() },
        { key: 'import', label: 'Import a file (PDF, Word, Markdown, text)…', run: () => document.getElementById('omnibox-file-import').click() },
        { key: 'copy', label: 'Make a copy', run: () => app.duplicatePaper?.() },
        '-',
        { key: 'dl', label: 'Download', sub: [
          { key: 'pdf', label: 'PDF document (.pdf)', run: () => app.exportPaper?.('pdf') },
          { key: 'docx', label: 'Microsoft Word (.docx)', run: () => app.exportPaper?.('docx') },
          { key: 'docx-track', label: 'Word with revision decisions', run: () => app.exportPaper?.('docx-track') },
          { key: 'md', label: 'Markdown (.md)', run: () => app.exportPaper?.('md') },
          { key: 'txt', label: 'Plain text (.txt)', run: () => app.exportPaper?.('txt') },
          { key: 'html', label: 'Web page (.html)', run: () => app.exportPaper?.('html') }] },
        { key: 'academic', label: 'Download with APA, MLA or Chicago formatting…', run: () => window.Features?.templateExport() },
        { key: 'more', label: 'More formats', sub: [
          { key: 'rtf', label: 'Rich Text (.rtf)', run: () => window.Features?.exportRtf() },
          { key: 'tex', label: 'LaTeX (.tex)', run: () => window.Features?.exportTex() }] },
        { key: 'backup', label: 'Back up the whole workspace (.json)', run: () => app.exportPaper?.('json') },
        '-',
        { key: 'saveversion', label: 'Save a named version…', run: () => window.Features?.saveNamedVersion() },
        { key: 'history', label: 'Version history…', run: () => window.Features?.versions() },
        { key: 'peer', label: 'Send for peer review…', run: () => window.Features?.sendForReview() },
        '-',
        { key: 'setup', label: 'Page setup (default font, size, spacing)…', run: () => openPageSetup() },
        { key: 'print', label: 'Print', hint: '⌘P', run: () => app.exportPaper?.('pdf') },
        '-',
        { key: 'delete', label: 'Delete this paper…', run: () => app.deleteCurrentPaper?.() }
      ],
      Edit: [
        { key: 'undo', label: 'Undo', hint: '⌘Z', run: () => exec('undo') },
        { key: 'redo', label: 'Redo', hint: '⇧⌘Z', run: () => exec('redo') },
        '-',
        { key: 'cut', label: 'Cut', hint: '⌘X', run: () => exec('cut') },
        { key: 'copy', label: 'Copy', hint: '⌘C', run: () => exec('copy') },
        { key: 'paste', label: 'Paste', hint: '⌘V', run: async () => { try { const t = await navigator.clipboard.readText(); restoreSelection(); document.execCommand('insertText', false, t); changed(); } catch { app.toast?.('Use ⌘V to paste.'); } } },
        { key: 'pasteplain', label: 'Paste without formatting', hint: '⇧⌘V', run: async () => { try { const t = await navigator.clipboard.readText(); restoreSelection(); document.execCommand('insertText', false, t); changed(); } catch { app.toast?.('Use ⇧⌘V to paste without formatting.'); } } },
        { key: 'all', label: 'Select all', hint: '⌘A', run: () => { page.focus(); document.execCommand('selectAll'); saveSelection(); } },
        '-',
        { key: 'find', label: 'Find and replace', hint: '⌘F', run: () => openFind() }
      ],
      View: [
        { key: 'zoom', label: 'Zoom', sub: [50, 75, 90, 100, 125, 150, 200].map(z => ({ key: 'z' + z, label: z + '%', run: () => setZoom(z / 100) })) },
        { key: 'fit', label: 'Fit page to width', run: () => setZoom(Math.max(0.5, Math.min(2, (host.clientWidth - 64) / 816))) },
        '-',
        { key: 'panel', label: 'Show or hide the evaluator panel', hint: '⌘E', run: () => document.getElementById('evaluator-panel').classList.toggle('collapsed') },
        { key: 'focus', label: 'Focus mode (page only)', run: () => document.body.classList.toggle('focus-mode') },
        { key: 'full', label: 'Full screen', run: () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.()) }
      ],
      Insert: [
        { key: 'image', label: 'Image…', run: () => insertImage() },
        { key: 'table', label: 'Table', sub: [[2, 2], [3, 3], [3, 4], [4, 4], [5, 3]].map(([r, c]) => ({ key: `t${r}${c}`, label: `${r} rows × ${c} columns`, run: () => insertTable(r, c) })) },
        { key: 'link', label: 'Link…', hint: '⌘K', run: () => insertLink() },
        '-',
        { key: 'hr', label: 'Horizontal line', run: () => exec('insertHorizontalRule') },
        { key: 'pb', label: 'Page break', run: () => insertHtml('<div class="page-break" contenteditable="false"></div><p><br></p>') },
        { key: 'date', label: 'Today’s date', run: () => exec('insertText', new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })) },
        { key: 'special', label: 'Special characters…', run: () => specialChars(document.querySelector('[data-menu="Insert"]')) },
        { key: 'cite', label: 'Citation placeholder', run: () => exec('insertText', '[citation needed: ]') }
      ],
      Format: [
        { key: 'text', label: 'Text', sub: [
          { key: 'b', label: 'Bold', hint: '⌘B', run: () => exec('bold') },
          { key: 'i', label: 'Italic', hint: '⌘I', run: () => exec('italic') },
          { key: 'u', label: 'Underline', hint: '⌘U', run: () => exec('underline') },
          { key: 's', label: 'Strikethrough', run: () => exec('strikeThrough') },
          { key: 'sup', label: 'Superscript', run: () => exec('superscript') },
          { key: 'sub', label: 'Subscript', run: () => exec('subscript') },
          { key: 'upper', label: 'UPPERCASE', run: () => changeCase('upper') },
          { key: 'lower', label: 'lowercase', run: () => changeCase('lower') },
          { key: 'titlec', label: 'Title Case', run: () => changeCase('title') }] },
        { key: 'styles', label: 'Paragraph styles', sub: STYLES.map(([k, l]) => ({ key: 'st' + k, label: l, run: () => setBlockStyle(k) })) },
        { key: 'align', label: 'Align', sub: [['left', 'Left', '⇧⌘L'], ['center', 'Center', '⇧⌘E'], ['right', 'Right', '⇧⌘R'], ['justify', 'Justified', '⇧⌘J']].map(([k, l, h]) => ({ key: 'a' + k, label: l, hint: h, run: () => setAlign(k) })) },
        { key: 'spacing', label: 'Line spacing', sub: [1, 1.15, 1.5, 2, 2.5, 3].map(v => ({ key: 'ls' + v, label: v === 1 ? 'Single' : v === 2 ? 'Double' : String(v), run: () => setLineSpacing(v) })) },
        { key: 'lists', label: 'Bullets and numbering', sub: [{ key: 'ul', label: 'Bulleted list', run: () => exec('insertUnorderedList') }, { key: 'ol', label: 'Numbered list', run: () => exec('insertOrderedList') }] },
        { key: 'indent', label: 'Increase indent', run: () => exec('indent') },
        { key: 'outdent', label: 'Decrease indent', run: () => exec('outdent') },
        '-',
        { key: 'clear', label: 'Clear formatting', hint: '⌘\\', run: () => { exec('removeFormat'); exec('formatBlock', 'P'); } },
        { key: 'setup2', label: 'Page setup (default font, size, spacing)…', run: () => openPageSetup() }
      ],
      Tools: [
        { key: 'wc', label: 'Word count', hint: '⇧⌘C', run: () => wordCount() },
        { key: 'insights', label: 'Writing insights (readability, sentences, progress)', run: () => app.selectTab?.('insights') },
        { key: 'focus', label: 'Feedback focus…', run: () => window.Features?.focusMenu(document.getElementById('btn-focus')) },
        { key: 'spell', label: (page.spellcheck ? '✓ ' : '') + 'Spelling check', run: () => { page.spellcheck = !page.spellcheck; app.toast?.(page.spellcheck ? 'Spelling check on.' : 'Spelling check off.'); } },
        '-',
        { key: 'appraise', label: 'Run appraisal & grade', hint: '⌘↵', run: () => app.runAppraisal?.() },
        { key: 'revise', label: 'Suggest scholarly revisions', hint: '⇧⌘↵', run: () => app.runRevisions?.() },
        { key: 'revsel', label: 'Revise the selected passage…', run: () => app.reviseSelection?.() },
        { key: 'docs', label: 'Create a document…', run: () => app.selectTab?.('artifacts') },
        '-',
        { key: 'stacks', label: 'Reference library (The Stacks)', run: () => document.getElementById('btn-open-stacks').click() },
        { key: 'settings', label: 'Settings & AI engine', run: () => document.getElementById('btn-open-settings').click() }
      ],
      Help: [
        { key: 'tour', label: 'Take the guided tour', run: () => window.Features?.tour() },
        { key: 'sample', label: 'Open a sample paper to practice on', run: () => window.Features?.samplePaper() },
        { key: 'how', label: 'How Artificience works', run: () => app.showHelp?.('how') },
        { key: 'keys', label: 'Keyboard shortcuts', hint: '⌘/', run: () => app.showHelp?.('keys') },
        { key: 'about', label: 'About Artificience', run: () => app.showHelp?.('about') }
      ]
    };
  }

  function fontMenu(btn) {
    const pop = popover(btn, FONTS.map(([name, stack]) => `<button class="rt-item rt-font" data-font="${esc(name)}" style="font-family:${esc(stack)}">${esc(name)}</button>`).join(''), 'rt-dropdown rt-fonts');
    pop.querySelectorAll('[data-font]').forEach(b => b.addEventListener('click', () => { closeMenus(); styleSelection('fontFamily', fontStack(b.dataset.font)); $('#rt-font-label').textContent = b.dataset.font; }));
  }
  function sizeMenu(btn) {
    const pop = popover(btn, SIZES.map(s => `<button class="rt-item" data-size="${s}">${s}</button>`).join(''), 'rt-dropdown rt-sizes');
    pop.querySelectorAll('[data-size]').forEach(b => b.addEventListener('click', () => { closeMenus(); applySize(+b.dataset.size); }));
  }
  function applySize(pt) { pt = Math.max(6, Math.min(96, pt)); styleSelection('fontSize', pt + 'pt'); $('#rt-size').value = pt; }
  function stylesMenu(btn) {
    const sample = { p: '', title: 'font-size:20px;font-weight:600', subtitle: 'font-style:italic;color:#666', h1: 'font-size:18px;font-weight:700', h2: 'font-size:16px;font-weight:700', h3: 'font-size:14px;font-weight:700;font-style:italic', blockquote: 'padding-left:10px;border-left:2px solid #c99a38' };
    const pop = popover(btn, STYLES.map(([k, l]) => `<button class="rt-item" data-style="${k}"><span style="${sample[k]}">${esc(l)}</span></button>`).join(''), 'rt-dropdown');
    pop.querySelectorAll('[data-style]').forEach(b => b.addEventListener('click', () => { closeMenus(); setBlockStyle(b.dataset.style); }));
  }
  function colorMenu(btn, kind) {
    const list = kind === 'fore' ? COLORS : HIGHLIGHTS;
    const pop = popover(btn, `<div class="rt-swatches">${list.map(c => `<button class="rt-swatch" data-color="${c}" title="${c === 'transparent' ? 'None' : c}" style="background:${c === 'transparent' ? 'repeating-linear-gradient(45deg,#fff 0 4px,#eee 4px 8px)' : c}"></button>`).join('')}</div><label class="rt-custom">Custom <input type="color" value="#000000"></label>`, 'rt-palette');
    const apply = (c) => { closeMenus(); if (kind === 'fore') exec('foreColor', c); else exec('hiliteColor', c === 'transparent' ? 'transparent' : c); $(kind === 'fore' ? '#rt-fore-bar' : '#rt-hi-bar').style.background = c; };
    pop.querySelectorAll('[data-color]').forEach(b => b.addEventListener('click', () => apply(b.dataset.color)));
    pop.querySelector('input').addEventListener('change', (e) => apply(e.target.value));
  }
  function spacingMenu(btn) {
    const pop = popover(btn, [1, 1.15, 1.5, 2, 2.5, 3].map(v => `<button class="rt-item" data-ls="${v}">${v === 1 ? 'Single' : v === 2 ? 'Double' : v}</button>`).join(''), 'rt-dropdown');
    pop.querySelectorAll('[data-ls]').forEach(b => b.addEventListener('click', () => { closeMenus(); setLineSpacing(+b.dataset.ls); }));
  }
  function tableMenu(btn) {
    let html = '<div class="rt-grid">'; for (let r = 1; r <= 8; r++) for (let c = 1; c <= 8; c++) html += `<span data-r="${r}" data-c="${c}"></span>`; html += '</div><div class="rt-grid-label">Insert table</div>';
    const pop = popover(btn, html, 'rt-palette');
    const cells = pop.querySelectorAll('[data-r]'), label = pop.querySelector('.rt-grid-label');
    cells.forEach(cell => {
      cell.addEventListener('mouseenter', () => { const R = +cell.dataset.r, C = +cell.dataset.c; cells.forEach(x => x.classList.toggle('on', +x.dataset.r <= R && +x.dataset.c <= C)); label.textContent = `${R} × ${C}`; });
      cell.addEventListener('click', () => { closeMenus(); insertTable(+cell.dataset.r, +cell.dataset.c); });
    });
  }
  function specialChars(btn) {
    const pop = popover(btn || page, `<div class="rt-chars">${SPECIAL.map(c => `<button data-ch="${esc(c)}">${esc(c)}</button>`).join('')}</div>`, 'rt-palette');
    pop.querySelectorAll('[data-ch]').forEach(b => b.addEventListener('click', () => { exec('insertText', b.dataset.ch); }));
  }
  function insertHtml(html) { exec('insertHTML', html); }
  function insertTable(r, c) {
    const row = (tag) => '<tr>' + Array.from({ length: c }, () => `<${tag}><br></${tag}>`).join('') + '</tr>';
    insertHtml(`<table class="rt-table"><tbody>${row('th')}${Array.from({ length: r - 1 }, () => row('td')).join('')}</tbody></table><p><br></p>`);
  }
  function insertLink() {
    saveSelection();
    const url = prompt('Link address (https://…):', 'https://');
    if (!url || url === 'https://') return;
    if (window.getSelection().isCollapsed) insertHtml(`<a href="${esc(url)}">${esc(url)}</a>`); else exec('createLink', url);
  }
  function insertImage() {
    saveSelection();
    const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/png,image/jpeg,image/gif';
    input.onchange = () => { const f = input.files[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => insertHtml(`<p><img src="${rd.result}" alt="${esc(f.name)}"></p>`); rd.readAsDataURL(f); };
    input.click();
  }
  function changeCase(kind) {
    restoreSelection(); const t = window.getSelection().toString(); if (!t) return;
    const out = kind === 'upper' ? t.toUpperCase() : kind === 'lower' ? t.toLowerCase() : t.toLowerCase().replace(/(^|[\s\-“"(])(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
    exec('insertText', out);
  }
  function wordCount() {
    const text = page.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const paras = blocks().filter(b => b.md && !/^#/.test(b.md)).length;
    const sel = selectedText(); const selWords = sel.trim() ? sel.trim().split(/\s+/).length : 0;
    A().info?.('Word count', `<table class="wc-table"><tr><td>Pages (approx.)</td><td>${Math.max(1, Math.ceil(words / (docStyle.line >= 2 ? 275 : 500)))}</td></tr><tr><td>Words</td><td>${words.toLocaleString()}</td></tr><tr><td>Characters</td><td>${text.length.toLocaleString()}</td></tr><tr><td>Characters excluding spaces</td><td>${text.replace(/\s/g, '').length.toLocaleString()}</td></tr><tr><td>Paragraphs</td><td>${paras}</td></tr>${selWords ? `<tr><td>Words selected</td><td>${selWords}</td></tr>` : ''}</table>`);
  }
  function openPageSetup() {
    const app = A();
    app.info?.('Page setup', `
      <div class="form-group"><label>Default font</label><select id="ps-font">${FONTS.map(([n]) => `<option ${n === docStyle.font ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select></div>
      <div class="form-group"><label>Default size (pt)</label><select id="ps-size">${SIZES.map(s => `<option ${s === docStyle.size ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
      <div class="form-group"><label>Line spacing</label><select id="ps-line">${[[1, 'Single'], [1.15, '1.15'], [1.5, '1.5'], [2, 'Double']].map(([v, l]) => `<option value="${v}" ${v === docStyle.line ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
      <div class="form-group"><label>Space after paragraphs (pt)</label><select id="ps-after">${[0, 6, 8, 10, 12].map(v => `<option ${v === docStyle.spacingAfter ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
      <div class="form-group"><label class="ps-check"><input type="checkbox" id="ps-indent" ${docStyle.indent ? 'checked' : ''}> Indent the first line of each paragraph (0.5 in)</label></div>
      <div class="modal-actions-row"><button class="btn-modal-primary" id="ps-apply">Apply to this paper</button><button class="btn-modal-secondary" id="ps-mla">MLA / APA defaults</button></div>`, () => {
      const read = () => setDocStyle({ font: $('#ps-font').value, size: +$('#ps-size').value, line: +$('#ps-line').value, spacingAfter: +$('#ps-after').value, indent: $('#ps-indent').checked });
      $('#ps-apply').onclick = () => { read(); app.closeInfo?.(); app.toast?.('Page setup applied.'); };
      $('#ps-mla').onclick = () => { setDocStyle({ ...DEFAULT_DOC }); app.closeInfo?.(); app.toast?.('Times New Roman 12 pt, double-spaced, first-line indent.'); };
    });
  }
  function setDocStyle(s) { docStyle = { ...DEFAULT_DOC, ...s }; applyDocStyle(); onChange(); }
  function applyDocStyle() {
    page.style.fontFamily = fontStack(docStyle.font);
    page.style.fontSize = docStyle.size + 'pt';
    page.style.lineHeight = String(docStyle.line);
    page.style.setProperty('--para-after', (docStyle.spacingAfter || 0) + 'pt');
    page.classList.toggle('indent-first', !!docStyle.indent);
    const stage = document.getElementById('diff-review-stage');
    if (stage) { stage.style.fontFamily = page.style.fontFamily; stage.style.fontSize = page.style.fontSize; stage.style.lineHeight = String(docStyle.line); }
    updateToolbarState();
  }
  function setZoom(z) {
    zoom = Math.max(0.5, Math.min(2, z));
    document.querySelectorAll('.page-sheet').forEach(s => { s.style.zoom = zoom; });
    const zl = $('#rt-zoom'); if (zl) zl.value = String(Math.round(zoom * 100));
    try { localStorage.setItem('artificience_zoom', String(zoom)); } catch {}
  }

  // ───────── Find & replace ─────────
  let findHits = [], findIdx = -1;
  function openFind() {
    const bar = $('#rt-find'); bar.classList.remove('hidden');
    const sel = selectedText(); if (sel && sel.length < 80) $('#rt-find-q').value = sel;
    $('#rt-find-q').focus(); $('#rt-find-q').select(); runFind();
  }
  function clearFindMarks() { page.querySelectorAll('mark.rt-hit').forEach(m => m.replaceWith(...m.childNodes)); page.normalize(); }
  function runFind() {
    clearFindMarks(); findHits = []; findIdx = -1;
    const q = $('#rt-find-q').value; const caseSense = $('#rt-find-case').checked;
    if (!q) { $('#rt-find-count').textContent = ''; return; }
    const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT); const texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    const needle = caseSense ? q : q.toLowerCase();
    texts.forEach(node => {
      let hay = caseSense ? node.textContent : node.textContent.toLowerCase(), at = hay.indexOf(needle), cur = node;
      while (at >= 0) {
        const r = document.createRange(); r.setStart(cur, at); r.setEnd(cur, at + q.length);
        const mark = document.createElement('mark'); mark.className = 'rt-hit'; r.surroundContents(mark); findHits.push(mark);
        cur = mark.nextSibling; if (!cur || cur.nodeType !== 3) break;
        hay = caseSense ? cur.textContent : cur.textContent.toLowerCase(); at = hay.indexOf(needle);
      }
    });
    $('#rt-find-count').textContent = findHits.length ? `${findHits.length} found` : 'No matches';
    if (findHits.length) stepFind(1);
  }
  function stepFind(d) {
    if (!findHits.length) return;
    findHits[findIdx]?.classList.remove('current');
    findIdx = (findIdx + d + findHits.length) % findHits.length;
    findHits[findIdx].classList.add('current'); findHits[findIdx].scrollIntoView({ block: 'center', behavior: 'smooth' });
    $('#rt-find-count').textContent = `${findIdx + 1} of ${findHits.length}`;
  }
  function replaceOne() { const m = findHits[findIdx]; if (!m) return; m.replaceWith(document.createTextNode($('#rt-replace-q').value)); findHits.splice(findIdx, 1); findIdx--; changed(); stepFind(1); if (!findHits.length) $('#rt-find-count').textContent = 'Done'; }
  function replaceAll() { const n = findHits.length; findHits.forEach(m => m.replaceWith(document.createTextNode($('#rt-replace-q').value))); findHits = []; page.normalize(); changed(); $('#rt-find-count').textContent = `Replaced ${n}`; }
  function closeFind() { clearFindMarks(); $('#rt-find').classList.add('hidden'); findHits = []; onChange(); }

  // ───────── toolbar state + status bar ─────────
  function updateToolbarState() {
    if (!page) return;
    const q = (c) => { try { return document.queryCommandState(c); } catch { return false; } };
    [['bold', 'b'], ['italic', 'i'], ['underline', 'u'], ['strikeThrough', 's'], ['insertUnorderedList', 'ul'], ['insertOrderedList', 'ol'], ['justifyLeft', 'al'], ['justifyCenter', 'ac'], ['justifyRight', 'ar'], ['justifyFull', 'aj']].forEach(([c, id]) => document.querySelector(`[data-rt="${id}"]`)?.classList.toggle('on', q(c)));
    const sel = window.getSelection();
    if (sel.rangeCount && page.contains(sel.anchorNode)) {
      const el = sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode;
      const cs = getComputedStyle(el);
      const fam = cs.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
      const known = FONTS.find(f => f[1].split(',')[0].replace(/['"]/g, '').trim() === fam || f[0] === fam);
      $('#rt-font-label').textContent = known ? known[0] : fam;
      $('#rt-size').value = String(Math.round(parseFloat(cs.fontSize) * 0.75 * 2) / 2);
      const block = currentBlock();
      const label = block ? (block.classList.contains('doc-title') ? 'Title' : block.classList.contains('doc-subtitle') ? 'Subtitle' : ({ H1: 'Heading 1', H2: 'Heading 2', H3: 'Heading 3', BLOCKQUOTE: 'Block quote' })[block.tagName] || 'Normal text') : 'Normal text';
      $('#rt-style-label').textContent = label;
    } else {
      $('#rt-font-label').textContent = docStyle.font; $('#rt-size').value = String(docStyle.size);
    }
  }
  function updateStatus() {
    const text = page.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const pages = Math.max(1, Math.ceil(words / (docStyle.line >= 2 ? 275 : 500)));
    page.classList.toggle('is-empty', !text.trim() && !page.querySelector('img, table, hr'));
    const el = $('#rt-status-words'); if (el) el.textContent = `${words.toLocaleString()} words · ${text.length.toLocaleString()} characters · about ${pages} page${pages === 1 ? '' : 's'}`;
  }

  // ───────── build ─────────
  function toolbarHtml() {
    const icon = (d, w = 15) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
    return `
    <div class="rt-menubar">${['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Help'].map(m => `<button class="rt-menu-btn" data-menu="${m}">${m}</button>`).join('')}<span class="rt-menubar-spacer"></span><span class="rt-saved" id="rt-saved"></span></div>
    <div class="rt-toolbar" role="toolbar" aria-label="Formatting">
      <button class="rt-btn" data-act="undo" title="Undo (⌘Z)">${icon('<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-1"/>')}</button>
      <button class="rt-btn" data-act="redo" title="Redo (⇧⌘Z)">${icon('<path d="m15 14 5-5-5-5"/><path d="M20 9H9a5 5 0 0 0 0 10h1"/>')}</button>
      <button class="rt-btn" data-act="print" title="Print or save as PDF (⌘P)">${icon('<path d="M6 9V2h12v7"/><rect x="6" y="14" width="12" height="8"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>')}</button>
      <button class="rt-btn" data-act="find" title="Find and replace (⌘F)">${icon('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>')}</button>
      <span class="rt-div"></span>
      <label class="rt-zoom" title="Zoom"><select id="rt-zoom">${[50, 75, 90, 100, 125, 150, 200].map(z => `<option value="${z}">${z}%</option>`).join('')}</select></label>
      <span class="rt-div"></span>
      <button class="rt-drop rt-style" data-act="styles" title="Paragraph style"><span id="rt-style-label">Normal text</span><span class="rt-caret">▾</span></button>
      <span class="rt-div"></span>
      <button class="rt-drop rt-font-btn" data-act="font" title="Font"><span id="rt-font-label">Times New Roman</span><span class="rt-caret">▾</span></button>
      <span class="rt-div"></span>
      <span class="rt-size-wrap">
        <button class="rt-btn rt-small" data-act="size-down" title="Decrease font size">−</button>
        <input id="rt-size" class="rt-size" value="12" title="Font size" aria-label="Font size" />
        <button class="rt-btn rt-small rt-size-menu" data-act="size-menu" title="Font sizes">▾</button>
        <button class="rt-btn rt-small" data-act="size-up" title="Increase font size">+</button>
      </span>
      <span class="rt-div"></span>
      <button class="rt-btn" data-rt="b" data-act="bold" title="Bold (⌘B)"><b>B</b></button>
      <button class="rt-btn" data-rt="i" data-act="italic" title="Italic (⌘I)"><i style="font-family:Georgia,serif">I</i></button>
      <button class="rt-btn" data-rt="u" data-act="underline" title="Underline (⌘U)"><u>U</u></button>
      <button class="rt-btn" data-rt="s" data-act="strike" title="Strikethrough"><s>S</s></button>
      <button class="rt-btn rt-color" data-act="fore" title="Text color"><span>A</span><i id="rt-fore-bar" style="background:#000"></i></button>
      <button class="rt-btn rt-color" data-act="hilite" title="Highlight color">${icon('<path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>', 14)}<i id="rt-hi-bar" style="background:#fff59d"></i></button>
      <span class="rt-div"></span>
      <button class="rt-btn" data-act="link" title="Insert link (⌘K)">${icon('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>')}</button>
      <button class="rt-btn" data-act="image" title="Insert image">${icon('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>')}</button>
      <button class="rt-btn" data-act="table" title="Insert table">${icon('<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>')}</button>
      <span class="rt-div"></span>
      <button class="rt-btn" data-rt="al" data-act="al" title="Align left (⇧⌘L)">${icon('<path d="M3 6h18M3 12h12M3 18h16"/>')}</button>
      <button class="rt-btn" data-rt="ac" data-act="ac" title="Center (⇧⌘E)">${icon('<path d="M3 6h18M6 12h12M4 18h16"/>')}</button>
      <button class="rt-btn" data-rt="ar" data-act="ar" title="Align right (⇧⌘R)">${icon('<path d="M3 6h18M9 12h12M5 18h16"/>')}</button>
      <button class="rt-btn" data-rt="aj" data-act="aj" title="Justify (⇧⌘J)">${icon('<path d="M3 6h18M3 12h18M3 18h18"/>')}</button>
      <button class="rt-btn" data-act="spacing" title="Line spacing">${icon('<path d="M11 6h10M11 12h10M11 18h10"/><path d="m3 8 3-3 3 3M3 16l3 3 3-3M6 5v14"/>')}</button>
      <span class="rt-div"></span>
      <button class="rt-btn" data-rt="ul" data-act="ul" title="Bulleted list">${icon('<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>')}</button>
      <button class="rt-btn" data-rt="ol" data-act="ol" title="Numbered list">${icon('<path d="M10 6h11M10 12h11M10 18h11"/><path d="M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>')}</button>
      <button class="rt-btn" data-act="outdent" title="Decrease indent">${icon('<path d="M21 6H11M21 12H11M21 18H11"/><path d="m7 8-4 4 4 4"/>')}</button>
      <button class="rt-btn" data-act="indent" title="Increase indent">${icon('<path d="M21 6H11M21 12H11M21 18H11"/><path d="m3 8 4 4-4 4"/>')}</button>
      <button class="rt-btn" data-act="clear" title="Clear formatting (⌘\\)">${icon('<path d="M4 7V4h16v3M9 20h6M12 4v16"/><path d="m3 21 18-18" stroke="#b91c1c"/>')}</button>
      <span class="rt-div"></span>
      <button class="rt-btn rt-gold" id="btn-revise-selection" data-act="revsel" title="Select a passage, then ask for revisions to just that passage" disabled>${icon('<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>', 13)}<span>Revise selection</span></button>
    </div>
    <div id="rt-find" class="rt-find hidden">
      <input id="rt-find-q" placeholder="Find in paper" />
      <input id="rt-replace-q" placeholder="Replace with" />
      <label class="rt-find-case"><input type="checkbox" id="rt-find-case"> Match case</label>
      <button class="btn-mini ghost" id="rt-find-prev">↑</button><button class="btn-mini ghost" id="rt-find-next">↓</button>
      <button class="btn-mini ghost" id="rt-replace-one">Replace</button><button class="btn-mini ghost" id="rt-replace-all">Replace all</button>
      <span id="rt-find-count" class="rt-find-count"></span>
      <button class="btn-mini ghost" id="rt-find-close">✕</button>
    </div>`;
  }
  function init(opts) {
    page = opts.page; host = opts.host; onChange = opts.onChange || onChange;
    opts.toolbarHost.innerHTML = toolbarHtml();
    try { document.execCommand('defaultParagraphSeparator', false, 'p'); } catch {}
    const acts = {
      undo: () => exec('undo'), redo: () => exec('redo'), print: () => A().exportPaper?.('pdf'), find: () => openFind(),
      styles: (b) => stylesMenu(b), font: (b) => fontMenu(b), 'size-menu': (b) => sizeMenu(b),
      'size-down': () => applySize((SIZES.slice().reverse().find(s => s < (+$('#rt-size').value || 12))) || 6),
      'size-up': () => applySize(SIZES.find(s => s > (+$('#rt-size').value || 12)) || 96),
      bold: () => exec('bold'), italic: () => exec('italic'), underline: () => exec('underline'), strike: () => exec('strikeThrough'),
      fore: (b) => colorMenu(b, 'fore'), hilite: (b) => colorMenu(b, 'hi'),
      link: () => insertLink(), image: () => insertImage(), table: (b) => tableMenu(b),
      al: () => setAlign('left'), ac: () => setAlign('center'), ar: () => setAlign('right'), aj: () => setAlign('justify'), spacing: (b) => spacingMenu(b),
      ul: () => exec('insertUnorderedList'), ol: () => exec('insertOrderedList'), indent: () => exec('indent'), outdent: () => exec('outdent'),
      clear: () => { exec('removeFormat'); exec('formatBlock', 'P'); selectedBlocks().forEach(b => { b.removeAttribute('style'); b.className = ''; }); changed(); },
      revsel: () => A().reviseSelection?.()
    };
    opts.toolbarHost.querySelectorAll('[data-act]').forEach(b => {
      b.addEventListener('mousedown', e => { e.preventDefault(); saveSelection(); });
      b.addEventListener('click', (e) => { e.stopPropagation(); const f = acts[b.dataset.act]; if (f) f(b); });
    });
    opts.toolbarHost.querySelectorAll('[data-menu]').forEach(b => {
      b.addEventListener('mousedown', e => { e.preventDefault(); saveSelection(); });
      b.addEventListener('click', (e) => { e.stopPropagation(); if (openMenuEl === b) { closeMenus(); return; } openMenu(b, menus()[b.dataset.menu]); });
      b.addEventListener('mouseenter', () => { if (openMenuEl && openMenuEl !== b) openMenu(b, menus()[b.dataset.menu]); });
    });
    const sizeInput = $('#rt-size');
    sizeInput.addEventListener('mousedown', () => saveSelection());
    sizeInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); applySize(+sizeInput.value || 12); } });
    $('#rt-zoom').addEventListener('change', (e) => setZoom(+e.target.value / 100));
    $('#rt-find-q').addEventListener('input', runFind);
    $('#rt-find-case').addEventListener('change', runFind);
    $('#rt-find-q').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); stepFind(e.shiftKey ? -1 : 1); } if (e.key === 'Escape') closeFind(); });
    $('#rt-find-next').addEventListener('click', () => stepFind(1)); $('#rt-find-prev').addEventListener('click', () => stepFind(-1));
    $('#rt-replace-one').addEventListener('click', replaceOne); $('#rt-replace-all').addEventListener('click', replaceAll); $('#rt-find-close').addEventListener('click', closeFind);
    document.addEventListener('mousedown', (e) => { if (!e.target.closest('.rt-pop, [data-menu], [data-act]')) closeMenus(); });
    document.addEventListener('selectionchange', () => { if (page.contains(window.getSelection().anchorNode)) { saveSelection(); updateToolbarState(); opts.onSelection && opts.onSelection(); } });
    page.addEventListener('input', () => { normalize(); updateStatus(); onChange(); });
    page.addEventListener('paste', (e) => {
      // Keep pasted structure (headings, bold, lists) but drop foreign page styling.
      const html = e.clipboardData.getData('text/html');
      if (!html) return;
      e.preventDefault();
      const md = window.__artificience?.htmlToText ? window.__artificience.htmlToText(html) : e.clipboardData.getData('text/plain');
      insertHtml(fromMarkdown(md));
    });
    page.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase(), mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (k === 'k') { e.preventDefault(); insertLink(); }
      else if (k === 'f') { e.preventDefault(); openFind(); }
      else if (k === 'p') { e.preventDefault(); A().exportPaper?.('pdf'); }
      else if (k === '\\') { e.preventDefault(); acts.clear(); }
      else if (e.shiftKey && k === 'l') { e.preventDefault(); setAlign('left'); }
      else if (e.shiftKey && k === 'e') { e.preventDefault(); setAlign('center'); }
      else if (e.shiftKey && k === 'r') { e.preventDefault(); setAlign('right'); }
      else if (e.shiftKey && k === 'j') { e.preventDefault(); setAlign('justify'); }
      else if (e.shiftKey && k === 'c') { e.preventDefault(); wordCount(); }
      else if (e.shiftKey && k === 'v') { e.preventDefault(); navigator.clipboard.readText().then(t => { document.execCommand('insertText', false, t); changed(); }).catch(() => {}); }
      else if (e.shiftKey && (k === '.' || k === '>')) { e.preventDefault(); applySize(SIZES.find(s => s > (+$('#rt-size').value || 12)) || 96); }
      else if (e.shiftKey && (k === ',' || k === '<')) { e.preventDefault(); applySize((SIZES.slice().reverse().find(s => s < (+$('#rt-size').value || 12))) || 6); }
      setTimeout(updateToolbarState, 0);
    });
    let z = 1; try { z = +localStorage.getItem('artificience_zoom') || 1; } catch {}
    setZoom(z);
    applyDocStyle();
  }
  function setHtml(html, style) { page.innerHTML = html || '<p><br></p>'; if (style) docStyle = { ...DEFAULT_DOC, ...style }; applyDocStyle(); normalize(); updateStatus(); }
  function setSaved(text) { const el = $('#rt-saved'); if (el) el.textContent = text; }

  window.RichEditor = {
    init, setHtml, getHtml: () => page.innerHTML, toMarkdown, fromMarkdown, applyMarkdownPreservingFormat, applyEdits,
    getDocStyle: () => ({ ...docStyle }), setDocStyle, reveal, selectedText, toDocx, toPrintHtml, docCss, focus: () => page.focus(),
    setSaved, wordCount, openFind, FONTS, closeMenus, popover, openMenu,
    ownTitle: () => (page.querySelector(':scope > h1.doc-title')?.textContent || '').trim()
  };
})();
