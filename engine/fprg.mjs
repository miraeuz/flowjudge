// Flowgorithm (.fprg) interpreter + judge. Zero dependencies; runs in Node and Electron.
export class FlowError extends Error {
  constructor(kind, msg) {
    super(msg);
    this.kind = kind;
  }
}
const unesc = (s) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/&amp;/g, "&");

function parseXml(s) {
  if (typeof s !== "string" || Buffer.byteLength(s, "utf8") > 1e6)
    throw new FlowError("CE", "File exceeds 1 MB");
  if (/<!DOCTYPE|<!ENTITY/i.test(s))
    throw new FlowError("CE", "XML entities are not supported");
  const root = { tag: "#", attrs: {}, kids: [] },
    stack = [root];
  const re =
    /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<(\/?)([\w:-]+)((?:\s+[\w:-]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>/g;
  let match,
    end = 0,
    count = 0;
  while ((match = re.exec(s))) {
    if (s.slice(end, match.index).trim())
      throw new FlowError("CE", "Malformed XML");
    end = re.lastIndex;
    if (match[0].startsWith("<!--") || match[0].startsWith("<?")) continue;
    if (++count > 20000 || stack.length > 128)
      throw new FlowError("CE", "Flowchart is too complex");
    if (match[1]) {
      if (
        match[3].trim() ||
        match[4] ||
        stack.length === 1 ||
        stack.at(-1).tag !== match[2]
      )
        throw new FlowError("CE", "Mismatched XML closing tag");
      stack.pop();
      continue;
    }
    const attrs = Object.create(null);
    match[3].replace(
      /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g,
      (_, key, a, b) => {
        if (Object.hasOwn(attrs, key))
          throw new FlowError("CE", "Duplicate XML attribute");
        attrs[key] = unesc(a ?? b);
      },
    );
    const node = { tag: match[2], attrs, kids: [] };
    stack.at(-1).kids.push(node);
    if (!match[4]) stack.push(node);
  }
  if (stack.length !== 1 || s.slice(end).trim() || root.kids.length !== 1)
    throw new FlowError("CE", "Incomplete XML document");
  return root.kids[0];
}

function lex(s) {
  const t = [],
    re =
      /\s*(?:(\d+\.?\d*|\.\d+)|"([^"]*)"|([A-Za-z_]\w*)|(<>|<=|>=|==|!=|[-+*\/^%&<>=(),\[\]]))/y;
  let p = 0;
  while (s.slice(p).trim() !== "") {
    re.lastIndex = p;
    const m = re.exec(s);
    if (!m) throw new FlowError("CE", "Bad expression: " + s);
    p = re.lastIndex;
    t.push(
      m[1]
        ? { k: "n", v: parseFloat(m[1]) }
        : m[2] !== undefined
          ? { k: "s", v: m[2] }
          : m[3]
            ? { k: "w", v: m[3] }
            : { k: "o", v: m[4] },
    );
  }
  return t;
}

const BIN = Object.assign(Object.create(null), {
  or: 1,
  and: 2,
  "==": 4,
  "=": 4,
  "!=": 4,
  "<>": 4,
  "<": 4,
  ">": 4,
  "<=": 4,
  ">=": 4,
  "&": 5,
  "+": 6,
  "-": 6,
  "*": 7,
  "/": 7,
  mod: 7,
  "%": 7,
  div: 7,
  "^": 9,
});
const cache = new Map();
function parseExpr(src) {
  if (cache.has(src)) return cache.get(src);
  const T = lex(src);
  let p = 0;
  const opOf = (t) =>
    t && (t.k === "o" ? t.v : t.k === "w" ? t.v.toLowerCase() : null);
  const expr = (min) => {
    let l = unary();
    for (;;) {
      const op = opOf(T[p]),
        b = op && BIN[op];
      if (!b || b < min) break;
      p++;
      l = { n: "bin", op, l, r: expr(op === "^" ? b : b + 1) };
    }
    return l;
  };
  const unary = () => {
    const t = T[p++];
    if (!t) throw new FlowError("CE", "Unexpected end: " + src);
    if (t.k === "n" || t.k === "s") return { n: "lit", v: t.v };
    if (t.k === "o" && t.v === "-") return { n: "neg", e: expr(8) };
    if (t.k === "o" && t.v === "(") {
      const e = expr(1);
      if (T[p]?.v !== ")") throw new FlowError("CE", "Missing )");
      p++;
      return e;
    }
    if (t.k === "w") {
      const w = t.v.toLowerCase();
      if (w === "not") return { n: "not", e: expr(4) };
      if (T[p]?.v === "(" && T[p].k === "o") {
        p++;
        const args = [];
        if (T[p]?.v !== ")") {
          do args.push(expr(1));
          while (T[p]?.v === "," && p++);
        }
        if (T[p]?.v !== ")") throw new FlowError("CE", "Missing )");
        p++;
        return { n: "call", name: w, args };
      }
      if (T[p]?.v === "[" && T[p].k === "o") {
        p++;
        const i = expr(1);
        if (T[p]?.v !== "]") throw new FlowError("CE", "Missing ]");
        p++;
        return { n: "idx", name: w, i };
      }
      return { n: "var", name: w };
    }
    throw new FlowError("CE", "Syntax error: " + src);
  };
  const ast = expr(1);
  if (p < T.length) throw new FlowError("CE", "Syntax error: " + src);
  if (cache.size > 5000) cache.clear();
  cache.set(src, ast);
  return ast;
}

export const fmt = (v) =>
  typeof v === "number"
    ? String(+v.toPrecision(15))
    : typeof v === "boolean"
      ? v
        ? "True"
        : "False"
      : String(v);
const BUILTIN = {
  abs: Math.abs,
  sqrt: Math.sqrt,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  arcsin: Math.asin,
  arccos: Math.acos,
  arctan: Math.atan,
  log: Math.log,
  log10: Math.log10,
  exp: Math.exp,
  int: Math.trunc,
  floor: Math.floor,
  ceiling: Math.ceil,
  round: (x) => Math.sign(x) * Math.round(Math.abs(x)),
  sign: Math.sign,
  min: Math.min,
  max: Math.max,
  length: (s) => String(s).length,
  toreal: Number,
  tointeger: (x) => Math.trunc(Number(x)),
  tostring: fmt,
  isnumeric: (s) => String(s).trim() !== "" && !isNaN(Number(s)),
  tochar: (c) => String.fromCharCode(c),
  toascii: (s) => String(s).charCodeAt(0),
  char: (s, i) => String(s)[i],
  random: (n) => Math.floor(Math.random() * n),
};
const cap = (s) => {
  if (s.length > 1e6) throw new FlowError("RE", "String too long");
  return s;
};
const coerceRaw = (t, v) =>
  t === "Integer"
    ? Math.trunc(Number(v))
    : t === "Real"
      ? Number(v)
      : t === "String"
        ? cap(String(v))
        : t === "Boolean"
          ? !!v
          : v;
const coerce = (t, v) => {
  const result = coerceRaw(t, v);
  if (typeof result === "number" && !Number.isFinite(result))
    throw new FlowError("RE", "Numeric value is not finite");
  return result;
};
const dflt = (t) =>
  t === "Integer" || t === "Real" ? 0 : t === "Boolean" ? false : "";
const blk = (n) =>
  (n.kids.find((k) => k.tag === "body") || n).kids.filter(
    (k) => k.tag !== "parameters" && k.tag !== "comment" && k.tag !== "body",
  );

export function compile(xml) {
  const root = parseXml(xml);
  if (!root || root.tag !== "flowgorithm")
    throw new FlowError("CE", "Not a Flowgorithm file");
  const fns = Object.create(null);
  for (const f of root.kids.filter((k) => k.tag === "function")) {
    if (!f.attrs.name || Object.hasOwn(fns, f.attrs.name.toLowerCase()))
      throw new FlowError("CE", "Missing or duplicate function name");
    fns[f.attrs.name.toLowerCase()] = {
      ...f.attrs,
      params: (f.kids.find((k) => k.tag === "parameters")?.kids || []).map(
        (p) => p.attrs,
      ),
      body: blk(f),
    };
  }
  if (!fns.main) throw new FlowError("CE", "No Main function");
  return fns;
}

class Run {
  constructor(fns, input, max) {
    this.fns = fns;
    this.in = input.split(/\r?\n/);
    if (this.in.at(-1) === "") this.in.pop();
    this.ip = 0;
    this.out = "";
    this.steps = 0;
    this.max = max;
    this.depth = 0;
    this.t0 = Date.now();
  }
  tick() {
    if (
      ++this.steps > this.max ||
      ((this.steps & 8191) === 0 && Date.now() - this.t0 > 3000)
    )
      throw new FlowError("TLE", "Step limit exceeded");
  }
  v(fr, name) {
    const x = fr.get(name);
    if (!x) throw new FlowError("RE", `Variable '${name}' is not declared`);
    return x;
  }
  ev(a, fr) {
    switch (a.n) {
      case "lit":
        return a.v;
      case "neg":
        return -this.ev(a.e, fr);
      case "not":
        return !this.ev(a.e, fr);
      case "var": {
        if (a.name === "true") return true;
        if (a.name === "false") return false;
        if (a.name === "pi") return Math.PI;
        return this.v(fr, a.name).v;
      }
      case "idx": {
        const x = this.v(fr, a.name),
          i = this.ev(a.i, fr);
        if (
          !Array.isArray(x.v) ||
          !Number.isInteger(i) ||
          i < 0 ||
          i >= x.v.length
        )
          throw new FlowError("RE", `Index ${i} out of range`);
        return x.v[i];
      }
      case "call": {
        const args = a.args.map((e) => this.ev(e, fr));
        if (Object.hasOwn(BUILTIN, a.name)) return BUILTIN[a.name](...args);
        return this.call(a.name, args);
      }
      case "bin": {
        const { op } = a;
        if (op === "and") return !!this.ev(a.l, fr) && !!this.ev(a.r, fr);
        if (op === "or") return !!this.ev(a.l, fr) || !!this.ev(a.r, fr);
        const l = this.ev(a.l, fr),
          r = this.ev(a.r, fr);
        switch (op) {
          case "+":
            return typeof l === "string" || typeof r === "string"
              ? fmt(l) + fmt(r)
              : l + r;
          case "-":
            return l - r;
          case "*":
            return l * r;
          case "^":
            return l ** r;
          case "&":
            return fmt(l) + fmt(r);
          case "/":
          case "div":
          case "mod":
          case "%":
            if (r === 0) throw new FlowError("RE", "Division by zero");
            return op === "/"
              ? l / r
              : op === "div"
                ? Math.trunc(l / r)
                : l % r;
          case "=":
          case "==":
            return l === r;
          case "!=":
          case "<>":
            return l !== r;
          case "<":
            return l < r;
          case ">":
            return l > r;
          case "<=":
            return l <= r;
          case ">=":
            return l >= r;
        }
      }
    }
  }
  call(name, args) {
    const f = this.fns[name];
    if (!f) throw new FlowError("RE", `Unknown function '${name}'`);
    const nf = new Map();
    f.params.forEach((p, i) =>
      nf.set(p.name.toLowerCase(), {
        t: p.type,
        v: Array.isArray(args[i]) ? args[i] : coerce(p.type, args[i]),
      }),
    );
    if (f.variable)
      nf.set(f.variable.toLowerCase(), { t: f.type, v: dflt(f.type) });
    if (++this.depth > 200) throw new FlowError("RE", "Recursion too deep");
    try {
      this.exec(f.body, nf);
    } finally {
      this.depth--;
    }
    return f.variable ? nf.get(f.variable.toLowerCase()).v : undefined;
  }
  set(fr, target, val) {
    const a = parseExpr(target);
    if (a.n === "var") {
      const x = this.v(fr, a.name);
      if (Array.isArray(x.v))
        throw new FlowError("RE", "Cannot assign to a whole array");
      x.v = coerce(x.t, val);
    } else if (a.n === "idx") {
      const x = this.v(fr, a.name),
        i = this.ev(a.i, fr);
      if (
        !Array.isArray(x.v) ||
        !Number.isInteger(i) ||
        i < 0 ||
        i >= x.v.length
      )
        throw new FlowError("RE", `Index ${i} out of range`);
      x.v[i] = coerce(x.t, val);
    } else throw new FlowError("CE", "Bad assignment target");
  }
  arr(A, fr) {
    const n = this.ex(A.size, fr);
    if (!Number.isInteger(n) || n < 0 || n > 1e6)
      throw new FlowError("RE", "Bad array size");
    return Array.from({ length: n }, () => dflt(A.type));
  }
  ex(s, fr) {
    return this.ev(parseExpr(s), fr);
  }
  exec(stmts, fr) {
    for (const s of stmts) {
      this.tick();
      const A = s.attrs;
      switch (s.tag) {
        case "comment":
          break;
        case "declare":
          for (const nm of A.name
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean))
            fr.set(nm.toLowerCase(), {
              t: A.type,
              v: A.array === "True" ? this.arr(A, fr) : dflt(A.type),
            });
          break;
        case "assign":
          this.set(fr, A.variable, this.ex(A.expression, fr));
          break;
        case "input": {
          if (this.ip >= this.in.length)
            throw new FlowError(
              "RE",
              "Program asked for more input than provided",
            );
          const line = this.in[this.ip++],
            raw = line.trim(),
            tgt = parseExpr(A.variable),
            x = this.v(fr, tgt.name);
          const t = tgt.n === "idx" ? x.t : x.t;
          if (
            (t === "Integer" && !/^[-+]?\d+$/.test(raw)) ||
            (t === "Real" && (raw === "" || isNaN(Number(raw))))
          )
            throw new FlowError("RE", `Cannot read '${raw}' as ${t}`);
          this.set(
            fr,
            A.variable,
            t === "Boolean" ? /^true$/i.test(raw) : t === "String" ? line : raw,
          );
          break;
        }
        case "output": {
          const value = this.ex(A.expression, fr);
          if (typeof value === "number" && !Number.isFinite(value))
            throw new FlowError("RE", "Numeric value is not finite");
          this.out += fmt(value) + (A.newline === "True" ? "\n" : "");
          if (this.out.length > 1e6) throw new FlowError("RE", "Output limit");
          break;
        }
        case "call":
          this.ex(A.expression, fr);
          break;
        case "if":
          this.exec(
            blk(
              s.kids.find(
                (k) => k.tag === (this.ex(A.expression, fr) ? "then" : "else"),
              ) || { kids: [] },
            ),
            fr,
          );
          break;
        case "while":
          while (this.ex(A.expression, fr)) {
            this.tick();
            this.exec(blk(s), fr);
          }
          break;
        case "do":
          do {
            this.tick();
            this.exec(blk(s), fr);
          } while (this.ex(A.expression, fr));
          break;
        case "for": {
          const step = this.ex(A.step || "1", fr),
            dec = A.direction === "dec";
          if (!Number.isFinite(step) || step <= 0)
            throw new FlowError("RE", "For step must be positive");
          this.set(fr, A.variable, this.ex(A.start, fr));
          for (;;) {
            const i = this.ex(A.variable, fr),
              e = this.ex(A.end, fr);
            if (dec ? i < e : i > e) break;
            this.tick();
            this.exec(blk(s), fr);
            this.set(
              fr,
              A.variable,
              this.ex(A.variable, fr) + (dec ? -step : step),
            );
          }
          break;
        }
        default:
          throw new FlowError("CE", "Unsupported block: " + s.tag);
      }
    }
  }
}

export function run(xml, input = "", { maxSteps = 2e6 } = {}) {
  const fns = compile(xml),
    r = new Run(fns, input, maxSteps);
  r.exec(fns.main.body, new Map());
  return r.out;
}

// ---------- Judge ----------
const NUM = /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/;
const numsEq = (a, b, eps) => Math.abs(a - b) <= eps * Math.max(1, Math.abs(b));
/** modes: 'tokens' (default: whitespace tokens, numbers with tolerance), 'numbers' (only numbers, ignores prompt text), 'exact' */
export function compare(got, exp, { mode = "tokens", eps = 1e-6 } = {}) {
  if (mode === "exact") {
    const n = (s) =>
      s
        .replace(/\r/g, "")
        .split("\n")
        .map((l) => l.trimEnd())
        .join("\n")
        .trimEnd();
    return n(got) === n(exp);
  }
  const toks = (s) =>
    mode === "numbers"
      ? s.match(/[-+]?\d+\.?\d*|[-+]?\.\d+/g) || []
      : s.split(/\s+/).filter(Boolean);
  const a = toks(got),
    b = toks(exp);
  if (a.length !== b.length) return false;
  return a.every((x, i) =>
    NUM.test(x) && NUM.test(b[i]) ? numsEq(+x, +b[i], eps) : x === b[i],
  );
}

/** tests: [{in, out, hidden?}] -> {verdict: AC|WA|RE|TLE|CE, passed, total, results[]} */
export function judge(xml, tests, opts = {}) {
  if (typeof xml !== "string" || xml.length > 1e6)
    return {
      verdict: "CE",
      message: "Invalid or too large file",
      passed: 0,
      total: tests.length,
      results: [],
    };
  let fns;
  try {
    fns = compile(xml);
  } catch (e) {
    return {
      verdict: "CE",
      message: e.message,
      passed: 0,
      total: tests.length,
      results: [],
    };
  }
  const tags = new Set();
  let arrays = false,
    nestedFor = false;
  const inspect = (nodes, depth = 0) => {
    for (const node of nodes) {
      if (node.tag === "declare" && node.attrs.array === "True") arrays = true;
      if (node.tag === "for" && depth > 0) nestedFor = true;
      inspect(node.kids, depth + (node.tag === "for" ? 1 : 0));
    }
  };
  for (const fn of Object.values(fns)) inspect(fn.body);
  const structuralError = (message) => ({
    verdict: "CE",
    message,
    passed: 0,
    total: tests.length,
    results: [],
  });
  if (opts.requireArray && !arrays)
    return structuralError("An array is required");
  if (opts.requireNestedFor && !nestedFor)
    return structuralError("Nested For blocks are required");
  if (
    opts.requiredFunction &&
    !Object.hasOwn(fns, opts.requiredFunction.toLowerCase())
  )
    return structuralError("Required function: " + opts.requiredFunction);
  const visit = (nodes) => {
    for (const node of nodes) {
      tags.add(node.tag);
      visit(node.kids);
    }
  };
  for (const fn of Object.values(fns)) visit(fn.body);
  for (const block of opts.requiredBlocks || [])
    if (!tags.has(block))
      return {
        verdict: "CE",
        message: "Required block: " + block,
        passed: 0,
        total: tests.length,
        results: [],
      };
  for (const block of opts.forbiddenBlocks || [])
    if (tags.has(block))
      return structuralError("This exercise does not use: " + block);
  const results = [];
  let first = null;
  for (const [i, t] of tests.entries()) {
    let v = "AC",
      got = "",
      msg = "";
    try {
      const r = new Run(fns, t.in ?? "", opts.maxSteps ?? 2e6);
      r.exec(fns.main.body, new Map());
      got = r.out;
      if (!compare(got, t.out, opts)) v = "WA";
    } catch (e) {
      v = e instanceof FlowError ? e.kind : "RE";
      msg = e instanceof FlowError ? e.message : "Runtime error";
    }
    results.push({
      n: i + 1,
      verdict: v,
      hidden: !!t.hidden,
      message: t.hidden ? "" : msg,
      ...(t.hidden ? {} : { input: t.in, expected: t.out, got }),
    });
    if (v !== "AC" && !first) first = v;
  }
  return {
    verdict: first || "AC",
    passed: results.filter((r) => r.verdict === "AC").length,
    total: tests.length,
    results,
  };
}
