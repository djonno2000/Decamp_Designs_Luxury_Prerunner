// splitText.js — tiny, dependency-free text splitter for staggered reveals.
// Free/included GSAP has no SplitText; this covers our needs (chars, words, lines).

// Wrap each character of an element in <span class="char">. Spaces preserved.
export function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  const spans = [];
  for (const ch of text) {
    if (ch === ' ') { el.appendChild(document.createTextNode(' ')); continue; }
    const s = document.createElement('span');
    s.className = 'char';
    s.style.display = 'inline-block';
    s.textContent = ch;
    el.appendChild(s);
    spans.push(s);
  }
  return spans;
}

// Wrap each word in <span class="word">. Returns the word spans.
export function splitWords(el) {
  const words = el.textContent.split(/(\s+)/);
  el.textContent = '';
  const spans = [];
  for (const w of words) {
    if (/^\s+$/.test(w)) { el.appendChild(document.createTextNode(w)); continue; }
    if (w === '') continue;
    const s = document.createElement('span');
    s.className = 'word';
    s.style.display = 'inline-block';
    s.textContent = w;
    el.appendChild(s);
    spans.push(s);
  }
  return spans;
}

// Split on the author's explicit <br> breaks, wrapping each segment in
// <span class="split-line"><span>…</span></span> while PRESERVING inner markup (e.g. a
// gold .lit gradient span). Returns the inner spans to animate. Use this for hero headings.
export function splitByBR(el) {
  const segments = [[]];
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeName === 'BR') segments.push([]);
    else segments[segments.length - 1].push(node);
  }
  el.textContent = '';
  const inners = [];
  for (const seg of segments) {
    if (!seg.length) continue;
    const outer = document.createElement('span');
    outer.className = 'split-line';
    const inner = document.createElement('span');
    seg.forEach((n) => inner.appendChild(n));
    outer.appendChild(inner);
    el.appendChild(outer);
    inners.push(inner);
  }
  return inners;
}

// Measure-based line splitting: wrap words, group by vertical offset into lines,
// then wrap each line in <span class="split-line"><span>…</span></span> (clip + slide).
// Returns the inner line spans (the ones you animate).
export function splitLines(el) {
  const words = splitWords(el);
  if (!words.length) return [];
  const lines = [];
  let current = [];
  let lastTop = null;
  for (const w of words) {
    const top = w.offsetTop;
    if (lastTop === null || Math.abs(top - lastTop) < 4) {
      current.push(w);
    } else {
      lines.push(current);
      current = [w];
    }
    lastTop = top;
  }
  if (current.length) lines.push(current);

  el.textContent = '';
  const inners = [];
  lines.forEach((lineWords) => {
    const outer = document.createElement('span');
    outer.className = 'split-line';
    const inner = document.createElement('span');
    inner.textContent = lineWords.map((w) => w.textContent).join(' ');
    outer.appendChild(inner);
    el.appendChild(outer);
    inners.push(inner);
  });
  return inners;
}
