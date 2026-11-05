// Flowgorithm (.fprg) interpreter + judge. Zero dependencies; runs in Node and Electron.
export class FlowError extends Error { constructor(kind, msg) { super(msg); this.kind = kind; } }
const MAX_XML_SIZE = 1_000_000;
const MAX_XML_NODES = 100_000;
const MAX_XML_DEPTH = 256;
const XML_NAME = /^[A-Za-z_][A-Za-z0-9_.:-]*/;

function unesc(value) {
  return value.replace(/&([^;]+);/g, (entity, name) => {
    if (name === 'lt') return '<';
    if (name === 'gt') return '>';
    if (name === 'quot') return '"';
    if (name === 'apos') return "'";
    if (name === 'amp') return '&';
    let cp;
    if (/^#\d+$/.test(name)) cp = Number(name.slice(1));
    else if (/^#x[0-9a-f]+$/i.test(name)) cp = Number.parseInt(name.slice(2), 16);
    else throw new FlowError('CE', `Unknown XML entity &${name};`);
    if (!Number.isInteger(cp) || cp < 0 || cp > 0x10ffff || (cp >= 0xd800 && cp <= 0xdfff)) {
      throw new FlowError('CE', 'Invalid XML character reference');
    }
    return String.fromCodePoint(cp);
  });
}

function decodeAttribute(value) {
  // Reject undeclared or unterminated entities before decoding. A decoded &amp;
  // is permitted and must not be mistaken for an unescaped source ampersand.
  const withoutEntities = value.replace(/&(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);/gi, '');
  if (withoutEntities.includes('&')) throw new FlowError('CE', 'Malformed XML entity');
  return unesc(value);
}

function parseXml(source) {
  if (typeof source !== 'string' || source.length === 0 || source.length > MAX_XML_SIZE) {
    throw new FlowError('CE', 'Invalid or oversized Flowgorithm XML');
  }
  const root = { tag: '#', attrs: {}, kids: [] };
  const stack = [root];
  let index = 0;
  let nodeCount = 0;
  while (index < source.length) {
    if (source[index] !== '<') {
      const next = source.indexOf('<', index);
      const end = next < 0 ? source.length : next;
      if (source.slice(index, end).trim() !== '') throw new FlowError('CE', 'Unexpected text outside Flowgorithm elements');
      index = end;
      continue;
    }
    if (source.startsWith('<!--', index)) {
      const end = source.indexOf('-->', index + 4);
      if (end < 0) throw new FlowError('CE', 'Unclosed XML comment');
      if (source.slice(index + 4, end).includes('--')) throw new FlowError('CE', 'Invalid XML comment');
      index = end + 3;
      continue;
    }
    if (source.startsWith('<?', index)) {
      const end = source.indexOf('?>', index + 2);
      if (end < 0) throw new FlowError('CE', 'Unclosed XML processing instruction');
      index = end + 2;
      continue;
    }
    if (source.startsWith('<!', index)) {
      // DTD/entity declarations and CDATA are not used by Flowgorithm and are
      // deliberately rejected rather than partially parsed.
      throw new FlowError('CE', 'DOCTYPE, entity declarations and CDATA are not supported');
    }

    let end = index + 1;
    let quote = '';
    for (; end < source.length; end++) {
      const ch = source[end];
      if (quote) { if (ch === quote) quote = ''; }
      else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '>') break;
    }
    if (end >= source.length || quote) throw new FlowError('CE', 'Unclosed XML tag');
    let content = source.slice(index + 1, end).trim();
    index = end + 1;

    if (content.startsWith('/')) {
      const closing = content.slice(1).trim();
      if (!XML_NAME.test(closing) || XML_NAME.exec(closing)[0] !== closing) throw new FlowError('CE', 'Malformed closing XML tag');
      if (stack.length <= 1 || stack[stack.length - 1].tag !== closing) throw new FlowError('CE', `Mismatched closing XML tag: ${closing}`);
      stack.pop();
      continue;
    }

    const selfClosing = /\/\s*$/.test(content);
    if (selfClosing) content = content.replace(/\/\s*$/, '').trimEnd();
    const nameMatch = XML_NAME.exec(content);
    if (!nameMatch) throw new FlowError('CE', 'Malformed XML element name');
    const tag = nameMatch[0];
    let pos = nameMatch[0].length;
    const attrs = Object.create(null);
    while (pos < content.length) {
      while (/\s/.test(content[pos] || '')) pos++;
      if (pos >= content.length) break;
      const attrMatch = XML_NAME.exec(content.slice(pos));
      if (!attrMatch) throw new FlowError('CE', `Malformed attribute in <${tag}>`);
      const attrName = attrMatch[0];
      pos += attrName.length;
      while (/\s/.test(content[pos] || '')) pos++;
      if (content[pos] !== '=') throw new FlowError('CE', `Missing = after ${attrName}`);
      pos++;
      while (/\s/.test(content[pos] || '')) pos++;
      const delimiter = content[pos];
      if (delimiter !== '"' && delimiter !== "'") throw new FlowError('CE', `Attribute ${attrName} must be quoted`);
      const valueStart = ++pos;
      while (pos < content.length && content[pos] !== delimiter) pos++;
      if (pos >= content.length) throw new FlowError('CE', `Unclosed attribute ${attrName}`);
      if (Object.hasOwn(attrs, attrName)) throw new FlowError('CE', `Duplicate attribute ${attrName}`);
      const rawValue = content.slice(valueStart, pos);
      if (rawValue.includes('<')) throw new FlowError('CE', `Unescaped < in attribute ${attrName}`);
      attrs[attrName] = decodeAttribute(rawValue);
      pos++;
    }

    if (++nodeCount > MAX_XML_NODES) throw new FlowError('CE', 'Too many XML elements');
    const node = { tag, attrs, kids: [] };
    stack[stack.length - 1].kids.push(node);
    if (!selfClosing) {
      if (stack.length >= MAX_XML_DEPTH) throw new FlowError('CE', 'XML nesting is too deep');
      stack.push(node);
    }
  }
  if (stack.length !== 1) throw new FlowError('CE', `Unclosed XML element: ${stack[stack.length - 1].tag}`);
  if (root.kids.length !== 1) throw new FlowError('CE', 'Flowgorithm file must contain exactly one root element');
  return root.kids[0];
}

function lex(s) {
  if (typeof s !== 'string' || s.length > 100_000) throw new FlowError('CE', 'Expression is too long');
  const t = [], re = /\s*(?:(\d+\.?\d*(?:[eE][-+]?\d+)?|\.\d+(?:[eE][-+]?\d+)?)|"([^\"]*)"|([A-Za-z_]\w*)|(<>|<=|>=|==|!=|[-+*\/%^&<>=(),\[\]]))/y;
  let p = 0;
  while (s.slice(p).trim() !== '') {
    re.lastIndex = p;
    const m = re.exec(s);
    if (!m) throw new FlowError('CE', 'Bad expression: ' + s.slice(0, 120));
    p = re.lastIndex;
    t.push(m[1] ? { k: 'n', v: Number(m[1]) } : m[2] !== undefined ? { k: 's', v: m[2] } : m[3] ? { k: 'w', v: m[3] } : { k: 'o', v: m[4] });
    if (t.length > 10_000) throw new FlowError('CE', 'Expression has too many tokens');
  }
  return t;
}

const BIN = Object.assign(Object.create(null), { or:1, and:2, '==':4,'=':4,'!=':4,'<>':4,'<':4,'>':4,'<=':4,'>=':4, '&':5,'+':6,'-':6,'*':7,'/':7,mod:7,'%':7,div:7,'^':9 });
const cache = new Map();
function parseExpr(src) {
  if (cache.has(src)) return cache.get(src);
  const T = lex(src); let p = 0, depth = 0;
  const opOf = t => t && (t.k === 'o' ? t.v : t.k === 'w' ? t.v.toLowerCase() : null);
  const expr = min => {
    if (++depth > 256) throw new FlowError('CE', 'Expression nesting is too deep');
    try {
      let l = unary();
      for (;;) {
        const op = opOf(T[p]), b = op && BIN[op]; if (!b || b < min) break; p++;
        l = { n: 'bin', op, l, r: expr(op === '^' ? b : b + 1) };
      } return l;
    } finally { depth--; }
  };
  const unary = () => {
    const t = T[p++]; if (!t) throw new FlowError('CE', 'Unexpected end: ' + src);
    if (t.k === 'n' || t.k === 's') return { n: 'lit', v: t.v };
    if (t.k === 'o' && t.v === '-') return { n: 'neg', e: expr(8) };
    if (t.k === 'o' && t.v === '(') { const e = expr(1); if (T[p]?.v !== ')') throw new FlowError('CE', 'Missing )'); p++; return e; }
    if (t.k === 'w') {
      const w = t.v.toLowerCase();
      if (w === 'not') return { n: 'not', e: expr(4) };
      if (T[p]?.v === '(' && T[p].k === 'o') { p++; const args = []; if (T[p]?.v !== ')') { do args.push(expr(1)); while (T[p]?.v === ',' && p++); } if (T[p]?.v !== ')') throw new FlowError('CE', 'Missing )'); p++; return { n: 'call', name: w, args }; }
      if (T[p]?.v === '[' && T[p].k === 'o') { p++; const i = expr(1); if (T[p]?.v !== ']') throw new FlowError('CE', 'Missing ]'); p++; return { n: 'idx', name: w, i }; }
      return { n: 'var', name: w };
    }
    throw new FlowError('CE', 'Syntax error: ' + src);
  };
  const ast = expr(1); if (p < T.length) throw new FlowError('CE', 'Syntax error: ' + src);
  if (cache.size > 1024) cache.clear(); cache.set(src, ast); return ast;
}

export const fmt = v => typeof v === 'number' ? String(+v.toPrecision(15)) : typeof v === 'boolean' ? (v ? 'True' : 'False') : String(v);
const BUILTIN = { abs:Math.abs, sqrt:Math.sqrt, sin:Math.sin, cos:Math.cos, tan:Math.tan, arcsin:Math.asin, arccos:Math.acos, arctan:Math.atan,
  log:Math.log, log10:Math.log10, exp:Math.exp, int:Math.trunc, floor:Math.floor, ceiling:Math.ceil, round:x=>Math.sign(x)*Math.round(Math.abs(x)), sign:Math.sign,
  min:Math.min, max:Math.max, length:s=>String(s).length, toreal:Number, tointeger:x=>Math.trunc(Number(x)), tostring:fmt,
  isnumeric:s=>String(s).trim()!==''&&!isNaN(Number(s)), tochar:c=>String.fromCharCode(c), toascii:s=>String(s).charCodeAt(0),
  char:(s,i)=>String(s)[i], random:n=>Math.floor(Math.random()*n) };
const cap = s => { if (s.length > 1e6) throw new FlowError('RE', 'String too long'); return s; };
const TYPES = new Set(['Integer', 'Real', 'String', 'Boolean']);
const coerce = (t, v) => {
  if (t === 'Integer') { const n = Number(v), value = Math.trunc(n); if (!Number.isSafeInteger(value)) throw new FlowError('RE', 'Invalid Integer value'); return value; }
  if (t === 'Real') { const n = Number(v); if (!Number.isFinite(n)) throw new FlowError('RE', 'Invalid Real value'); return n; }
  if (t === 'String') return cap(String(v));
  if (t === 'Boolean') {
    if (typeof v === 'boolean') return v;
    if (v === 1 || String(v).toLowerCase() === 'true') return true;
    if (v === 0 || String(v).toLowerCase() === 'false') return false;
    throw new FlowError('RE', 'Invalid Boolean value');
  }
  throw new FlowError('CE', `Unsupported variable type: ${t}`);
};
const dflt = t => t === 'Integer' || t === 'Real' ? 0 : t === 'Boolean' ? false : t === 'String' ? '' : (() => { throw new FlowError('CE', `Unsupported variable type: ${t}`); })();
const blk = n => (n.kids.find(k => k.tag === 'body') || n).kids.filter(k => k.tag !== 'parameters' && k.tag !== 'comment' && k.tag !== 'body');
const STATEMENTS = new Set(['declare', 'assign', 'input', 'output', 'call', 'if', 'while', 'do', 'for', 'comment']);

function validateStatementList(nodes) {
  for (const node of nodes) {
    if (node.tag === 'comment') continue;
    if (!STATEMENTS.has(node.tag)) throw new FlowError('CE', `Unsupported Flowgorithm shape: ${node.tag}`);
    if (node.tag === 'if') {
      const branches = node.kids.filter(k => k.tag === 'then' || k.tag === 'else');
      if (!branches.some(k => k.tag === 'then') || branches.length !== node.kids.length || branches.filter(k => k.tag === 'then').length !== 1 || branches.filter(k => k.tag === 'else').length > 1) {
        throw new FlowError('CE', 'Invalid If branches');
      }
      for (const branch of branches) validateStatementList(blk(branch));
    } else if (['while', 'do', 'for'].includes(node.tag)) {
      if (node.kids.filter(k => k.tag === 'body').length > 1) throw new FlowError('CE', `Invalid ${node.tag} body`);
      validateStatementList(blk(node));
    } else if (node.kids.length) {
      throw new FlowError('CE', `Unexpected child element in ${node.tag}`);
    }
  }
}

export function compile(xml) {
  const root = parseXml(xml);
  if (!root || root.tag !== 'flowgorithm') throw new FlowError('CE', 'Not a Flowgorithm file');
  const fns = Object.create(null);
  for (const f of root.kids) {
    if (f.tag === 'attributes') {
      if (f.kids.some(k => k.tag !== 'attribute' || k.kids.length)) throw new FlowError('CE', 'Invalid Flowgorithm metadata');
      continue;
    }
    if (f.tag !== 'function') throw new FlowError('CE', `Unsupported top-level element: ${f.tag}`);
    const name = String(f.attrs.name || '').trim().toLowerCase();
    if (!/^[a-z_]\w*$/.test(name)) throw new FlowError('CE', 'Invalid function name');
    if (Object.hasOwn(fns, name)) throw new FlowError('CE', `Duplicate function: ${name}`);
    const paramsNode = f.kids.find(k => k.tag === 'parameters');
    const bodyNode = f.kids.find(k => k.tag === 'body');
    if (!bodyNode || f.kids.filter(k => k.tag === 'body').length !== 1 || f.kids.filter(k => k.tag === 'parameters').length > 1 || f.kids.some(k => !['parameters', 'body', 'comment'].includes(k.tag))) throw new FlowError('CE', `Invalid function structure: ${name}`);
    const params = (paramsNode?.kids || []).map(p => {
      if (p.tag !== 'parameter' || !p.attrs.name || !TYPES.has(p.attrs.type)) throw new FlowError('CE', `Invalid parameter in ${name}`);
      return p.attrs;
    });
    if (new Set(params.map(p => p.name.toLowerCase())).size !== params.length) throw new FlowError('CE', `Duplicate parameter in ${name}`);
    if (f.attrs.type && f.attrs.type !== 'None' && !TYPES.has(f.attrs.type)) throw new FlowError('CE', `Unsupported return type in ${name}`);
    if (f.attrs.type && f.attrs.type !== 'None' && !f.attrs.variable) throw new FlowError('CE', `Missing return variable in ${name}`);
    const body = blk(f);
    validateStatementList(body);
    fns[name] = { ...f.attrs, params, body };
  }
  if (!Object.hasOwn(fns, 'main')) throw new FlowError('CE', 'No Main function');
  return fns;
}

class Run {
  constructor(fns, input, max) { if (typeof input !== 'string' || input.length > 250_000) throw new FlowError('RE', 'Input is too large'); this.fns = fns; this.in = input.split(/\r?\n/); if (this.in.at(-1) === '') this.in.pop(); this.ip = 0; this.out = ''; this.steps = 0; this.max = max; this.depth = 0; this.t0 = Date.now(); }
  tick() { if (++this.steps > this.max || ((this.steps & 1023) === 0 && Date.now() - this.t0 > 2000)) throw new FlowError('TLE', 'Step limit exceeded'); }
  v(fr, name) { const x = fr.get(name); if (!x) throw new FlowError('RE', `Variable '${name}' is not declared`); return x; }
  ev(a, fr) {
    const finite = value => { if (typeof value === 'number' && !Number.isFinite(value)) throw new FlowError('RE', 'Numeric result is not finite'); return value; };
    switch (a.n) {
      case 'lit': return finite(a.v);
      case 'neg': return -this.ev(a.e, fr);
      case 'not': return !this.ev(a.e, fr);
      case 'var': { if (a.name === 'true') return true; if (a.name === 'false') return false; if (a.name === 'pi') return Math.PI; return this.v(fr, a.name).v; }
      case 'idx': { const x = this.v(fr, a.name), i = this.ev(a.i, fr); if (!Array.isArray(x.v) || !Number.isInteger(i) || i < 0 || i >= x.v.length) throw new FlowError('RE', `Index ${i} out of range`); return x.v[i]; }
      case 'call': { const args = a.args.map(e => this.ev(e, fr)); const value = Object.hasOwn(BUILTIN, a.name) ? BUILTIN[a.name](...args) : this.call(a.name, args); if (typeof value === 'number' && !Number.isFinite(value)) throw new FlowError('RE', 'Numeric result is not finite'); return value; }
      case 'bin': {
        const { op } = a; if (op === 'and') return !!this.ev(a.l, fr) && !!this.ev(a.r, fr); if (op === 'or') return !!this.ev(a.l, fr) || !!this.ev(a.r, fr);
        const l = this.ev(a.l, fr), r = this.ev(a.r, fr);
        switch (op) {
          case '+': return typeof l === 'string' || typeof r === 'string' ? fmt(l) + fmt(r) : l + r;
          case '-': return finite(l - r); case '*': return finite(l * r); case '^': return finite(l ** r); case '&': return fmt(l) + fmt(r);
          case '/': case 'div': case 'mod': case '%': if (r === 0) throw new FlowError('RE', 'Division by zero'); return finite(op === '/' ? l / r : op === 'div' ? Math.trunc(l / r) : l % r);
          case '=': case '==': return l === r; case '!=': case '<>': return l !== r;
          case '<': return l < r; case '>': return l > r; case '<=': return l <= r; case '>=': return l >= r;
        }
      }
    }
  }
  call(name, args) {
    const f = this.fns[name]; if (!f) throw new FlowError('RE', `Unknown function '${name}'`);
    if (args.length !== f.params.length) throw new FlowError('RE', `Function '${name}' expects ${f.params.length} argument(s)`);
    const nf = new Map(); f.params.forEach((p, i) => nf.set(p.name.toLowerCase(), { t: p.type, v: Array.isArray(args[i]) ? args[i] : coerce(p.type, args[i]) }));
    if (f.variable) nf.set(f.variable.toLowerCase(), { t: f.type, v: dflt(f.type) });
    if (++this.depth > 100) throw new FlowError('RE', 'Recursion too deep'); try { this.exec(f.body, nf); } finally { this.depth--; } return f.variable ? nf.get(f.variable.toLowerCase()).v : undefined;
  }
  set(fr, target, val) {
    const a = parseExpr(target);
    if (a.n === 'var') { const x = this.v(fr, a.name); if (Array.isArray(x.v)) throw new FlowError('RE', 'Cannot assign to a whole array'); x.v = coerce(x.t, val); }
    else if (a.n === 'idx') { const x = this.v(fr, a.name), i = this.ev(a.i, fr); if (!Array.isArray(x.v) || !Number.isInteger(i) || i < 0 || i >= x.v.length) throw new FlowError('RE', `Index ${i} out of range`); x.v[i] = coerce(x.t, val); }
    else throw new FlowError('CE', 'Bad assignment target');
  }
  arr(A, fr) { const n = this.ex(A.size, fr); if (!Number.isInteger(n) || n < 0 || n > 100_000) throw new FlowError('RE', 'Bad array size'); return Array.from({ length: n }, () => dflt(A.type)); }
  ex(s, fr) { return this.ev(parseExpr(s), fr); }
  exec(stmts, fr) {
    for (const s of stmts) {
      this.tick(); const A = s.attrs;
      switch (s.tag) {
        case 'declare': {
          for (const nm of String(A.name || '').split(',').map(x => x.trim()).filter(Boolean)) {
            const key = nm.toLowerCase();
            if (fr.has(key)) throw new FlowError('RE', `Variable '${nm}' is already declared`);
            if (!TYPES.has(A.type)) throw new FlowError('CE', `Unsupported variable type: ${A.type}`);
            fr.set(key, { t: A.type, v: A.array === 'True' ? this.arr(A, fr) : dflt(A.type) });
          }
          break;
        }
        case 'assign': this.set(fr, A.variable, this.ex(A.expression, fr)); break;
        case 'input': {
          if (this.ip >= this.in.length) throw new FlowError('RE', 'Program asked for more input than provided');
          const line = this.in[this.ip++], raw = line.trim(), tgt = parseExpr(A.variable), x = this.v(fr, tgt.name);
          const t = tgt.n === 'idx' ? x.t : x.t;
          const validReal = /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][-+]?\d+)?$/.test(raw) && Number.isFinite(Number(raw));
          if ((t === 'Integer' && (!/^[-+]?\d+$/.test(raw) || !Number.isSafeInteger(Number(raw)))) || (t === 'Real' && !validReal) || (t === 'Boolean' && !/^(true|false)$/i.test(raw))) throw new FlowError('RE', `Cannot read '${raw}' as ${t}`);
          this.set(fr, A.variable, t === 'Boolean' ? /^true$/i.test(raw) : t === 'String' ? line : raw); break;
        }
        case 'output': this.out += fmt(this.ex(A.expression, fr)) + (A.newline === 'True' ? '\n' : ''); if (this.out.length > 1e6) throw new FlowError('RE', 'Output limit'); break;
        case 'call': this.ex(A.expression, fr); break;
        case 'if': this.exec(blk(s.kids.find(k => k.tag === (this.ex(A.expression, fr) ? 'then' : 'else')) || { kids: [] }), fr); break;
        case 'while': while (this.ex(A.expression, fr)) { this.tick(); this.exec(blk(s), fr); } break;
        case 'do': do { this.tick(); this.exec(blk(s), fr); } while (this.ex(A.expression, fr)); break;
        case 'for': {
          const step = this.ex(A.step || '1', fr), dec = A.direction === 'dec'; if (typeof step !== 'number' || !Number.isFinite(step) || step <= 0) throw new FlowError('RE', 'For step must be a positive finite number'); this.set(fr, A.variable, this.ex(A.start, fr));
          for (;;) { const i = this.ex(A.variable, fr), e = this.ex(A.end, fr); if (dec ? i < e : i > e) break; this.tick(); this.exec(blk(s), fr); this.set(fr, A.variable, this.ex(A.variable, fr) + (dec ? -step : step)); }
          break;
        }
      }
    }
  }
}

export function run(xml, input = '', { maxSteps = 2e6 } = {}) {
  const safeSteps = Number.isSafeInteger(maxSteps) && maxSteps > 0 ? Math.min(maxSteps, 2e6) : 2e6;
  const fns = compile(xml), r = new Run(fns, input, safeSteps); r.exec(fns.main.body, new Map()); return r.out;
}

// ---------- Judge ----------
const NUM = /^[-+]?(\d+\.?\d*|\.\d+)$/;
const numsEq = (a, b, eps) => Math.abs(a - b) <= eps * Math.max(1, Math.abs(b));
/** modes: 'tokens' (default: whitespace tokens, numbers with tolerance), 'numbers' (only numbers, ignores prompt text), 'exact' */
export function compare(got, exp, { mode = 'tokens', eps = 1e-6 } = {}) {
  const fixq = s => s.replace(/[‘’ʻʼ`´]/g, "'").replace(/[–—]/g, '-'); got = fixq(got); exp = fixq(exp);   // students type ’ or ' — treat alike
  if (mode === 'yesno') {   // "is it divisible?" — accept Ha / Bo'linadi / Juft / 1 ... and Yo'q / Bo'linmaydi / Toq / 0 ...
    const YES = ['ha', "bo'linadi", 'juft', 'true', '1', 'yes', "to'g'ri"], NO = ["yo'q", 'yoq', "bo'linmaydi", 'toq', 'false', '0', 'no', "noto'g'ri"];
    const t = got.toLowerCase().split(/[^a-z0-9']+/).filter(Boolean), y = t.some(x => YES.includes(x)), n = t.some(x => NO.includes(x));
    return (y && !n ? 'yes' : n && !y ? 'no' : '?') === exp.trim();
  }
  if (mode === 'exact') { const n = s => s.replace(/\r/g, '').split('\n').map(l => l.trimEnd()).join('\n').trimEnd(); return n(got) === n(exp); }
  if (mode === 'shape') { const n = s => s.replace(/\r/g, '').split('\n').map(l => l.replace(/\s+/g, '')).join('\n').replace(/^\n+|\n+$/g, ''); return n(got) === n(exp); }
  if (mode === 'lines') { const n = s => s.replace(/\r/g, '').split('\n').map(l => l.trim().split(/\s+/).filter(Boolean).join(' ')).join('\n').replace(/^\n+|\n+$/g, ''); return n(got) === n(exp); }
  const toks = s => mode === 'numbers' ? (s.match(/[-+]?\d+\.?\d*|[-+]?\.\d+/g) || []) : s.split(/\s+/).filter(Boolean);
  const a = toks(got), b = toks(exp); if (a.length !== b.length) return false;
  return a.every((x, i) => NUM.test(x) && NUM.test(b[i]) ? numsEq(+x, +b[i], eps) : x === b[i]);
}

/** tests: [{in, out, hidden?}] -> {verdict: AC|WA|RE|TLE|CE, passed, total, results[]} */
export function judge(xml, tests, opts = {}) {
  if (typeof xml !== 'string' || xml.length > MAX_XML_SIZE) return { verdict: 'CE', message: 'Invalid or too large file', passed: 0, total: Array.isArray(tests) ? tests.length : 0, results: [] };
  if (!Array.isArray(tests) || tests.length < 1 || tests.length > 10_000 || tests.some(t => !t || typeof t !== 'object' || typeof t.in !== 'string' && t.in !== undefined || !('out' in t) || !(typeof t.out === 'string' || Array.isArray(t.out) && t.out.length > 0 && t.out.every(x => typeof x === 'string')))) return { verdict: 'CE', message: 'Invalid test configuration', passed: 0, total: 0, results: [] };
  if (opts.mode !== undefined && !['tokens', 'numbers', 'exact', 'shape', 'lines', 'yesno'].includes(opts.mode)) return { verdict: 'CE', message: 'Invalid checker mode', passed: 0, total: 0, results: [] };
  const maxSteps = Number.isSafeInteger(opts.maxSteps) && opts.maxSteps > 0 ? Math.min(opts.maxSteps, 2e6) : 2e6;
  let fns; try { fns = compile(xml); } catch (e) { return { verdict: 'CE', message: e.message, passed: 0, total: tests.length, results: [] }; }
  const results = []; let first = null;
  for (const [i, t] of tests.entries()) {
    let v = 'AC', got = '', msg = '';
    try { const r = new Run(fns, t.in ?? '', maxSteps); r.exec(fns.main.body, new Map()); got = r.out; if (!(Array.isArray(t.out) ? t.out : [t.out]).some(o => compare(got, o, opts))) v = 'WA'; }
    catch (e) { v = e instanceof FlowError ? e.kind : 'RE'; msg = e instanceof FlowError ? e.message : 'Runtime error'; }
    results.push({ n: i + 1, verdict: v, message: msg, ...(t.hidden ? {} : { input: t.in, expected: Array.isArray(t.out) ? t.out[0] : t.out, got }) });
    if (v !== 'AC' && !first) first = v;
  }
  return { verdict: first || 'AC', passed: results.filter(r => r.verdict === 'AC').length, total: tests.length, results };
}
