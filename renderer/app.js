(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  let lang = ["uz", "en"].includes(localStorage.lang)
    ? localStorage.lang
    : "uz";
  let theme = ["light", "dark", "system"].includes(localStorage.theme)
    ? localStorage.theme
    : "system";
  let topics = [],
    progress = {},
    attempts = [],
    act = {},
    busy = false,
    query = "",
    filter = "all",
    section = "classwork";
  let notice = "",
    lastFile = "",
    result = null,
    resultKey = "",
    currentName = "";
  let uploadedXml = "",
    submissionTab = "feedback",
    focusMode = false;
  let bookmarks;
  try {
    const stored = JSON.parse(localStorage.bookmarks || "[]");
    bookmarks = new Set(
      Array.isArray(stored)
        ? stored.filter((x) => typeof x === "string").slice(0, 1000)
        : [],
    );
  } catch {
    bookmarks = new Set();
  }
  const latestAttempt = (k) => attempts.findLast((a) => a.key === k);
  const needsReview = (k) =>
    !progress[k] && latestAttempt(k) && latestAttempt(k).verdict !== "AC";
  const T = (uz, en) => (lang === "uz" ? uz : en);
  const L = (value) => value?.[lang] || value?.uz || value?.en || "";
  const all = () =>
    topics.flatMap((t) =>
      [...t.classwork, ...t.homework].map((p) => ({ ...p, topic: t })),
    );
  const key = (t, p) => `${t.id}/${p.id}`;
  const done = (t) =>
    [...t.classwork, ...t.homework].filter((p) => progress[key(t, p)]).length;
  const icons = [
    "◉",
    "⌘",
    "↳",
    "÷",
    "◇",
    "↳",
    "∧",
    "↻",
    "▦",
    "⟳",
    "↺",
    "▤",
    "⇅",
    "ƒ",
    "✧",
  ];
  const path = () => location.hash.slice(2).split("/");
  const nav = (hash) => {
    location.hash = hash;
  };
  const title = (text) =>
    `<div class="eyebrow">MIRAE / FLOWGORITHM ACADEMY</div><h1>${text}</h1>`;
  const button = (text, action, cls = "btn") =>
    `<button class="${cls}" data-action="${action}">${text}</button>`;
  const percent = (t) =>
    Math.round(
      (done(t) / Math.max(1, t.classwork.length + t.homework.length)) * 100,
    );
  const pill = (text) => `<span class="pill">${text}</span>`;
  const difficulty = (p) =>
    ({
      easy: T("Boshlang‘ich", "Foundation"),
      medium: T("O‘rta", "Practice"),
      hard: T("Murakkab", "Challenge"),
    })[p.difficulty || "easy"];
  function shell(body) {
    const route = path()[0] || "home";
    const links = [
      ["home", "◫", T("Bosh sahifa", "Overview")],
      ["map", "⌘", T("O‘quv xaritasi", "Learning path")],
      ["practice", "▷", T("Mashqlar", "Practice studio")],
      ["progress", "▥", T("Natijalarim", "My progress")],
      ["settings", "⚙", T("Sozlamalar", "Settings")],
    ];
    return `<button class="skip" data-action="skip">${T("Asosiy qismga o‘tish", "Skip to content")}</button><aside class="sidebar"><a class="brand" href="#/"><span class="logo">◈</span><span>Flowgorithm<small>ACADEMY BY MIRAE</small></span></a>
 <div class="nav-caption">${T("ISH MAYDONI", "WORKSPACE")}</div><nav>${links.map(([id, icon, label]) => `<a href="#/${id === "home" ? "" : id}" class="nav-item ${route === id ? "active" : ""}" ${route === id ? 'aria-current="page"' : ""}><span>${icon}</span>${label}</a>`).join("")}</nav>
 <div class="sidebar-bottom"><div class="offline"><i></i>${T("Oflayn o‘rganish", "Learn offline")}</div><p>${T("Kichik qadamlar. Katta imkoniyatlar.", "Small steps. Extraordinary possibilities.")}</p><div class="profile"><span class="avatar">${esc((act.name || "M").slice(0, 1).toUpperCase())}</span><div><strong>${esc(act.name || T("Xush kelibsiz", "Welcome"))}</strong><small>${T("Algoritm yaratuvchisi", "Algorithm explorer")}</small></div></div></div></aside>
 <div class="workspace"><header class="topbar"><span class="breadcrumb">${T("O‘rganing", "Learn")} <span>/</span> ${T("Yarating", "Build")} <span>/</span> ${T("Sinab ko‘ring", "Test")}</span><div class="top-actions"><button data-action="language" class="icon-btn" aria-label="${T("Tilni almashtirish", "Change language")}">${lang.toUpperCase()}</button><button data-action="theme" class="icon-btn" aria-label="${T("Mavzuni almashtirish", "Change theme")}">${theme === "dark" ? "☾" : theme === "light" ? "☀" : "◐"}</button><span class="pill desktop">${T("Shaxsiy o‘quv maydoni", "Your learning space")}</span></div></header><main id="main" tabindex="-1">${body}</main><div class="toast" id="toast" role="status" ${notice ? "" : "hidden"}>${esc(notice)}</div></div>`;
  }
  function gate() {
    return `<section class="activation"><div><div class="eyebrow">MIRAE ACADEMY</div><h1>${T("G‘oyadan<br>algoritmgacha.", "From an idea.<br>To an algorithm.")}</h1><p class="lead">${T("O‘qing, Flowgorithm’da yarating va yechimingizni tekshiring. O‘z sur’atingizda.", "Learn a concept, build it in Flowgorithm, and test your solution. At your own pace.")}</p><div class="flow-illustration" aria-hidden="true"><span>Start</span><i>↓</i><span class="flow-input">Input</span><i>↓</i><span class="flow-process">Create something.</span><i>↓</i><span>Output</span></div></div><section class="glass activation-card"><span class="label">${T("BIR MARTALIK FAOLLASHTIRISH", "ONE-TIME ACTIVATION")}</span><h2>${T("O‘rganishni boshlang", "Make room for learning")}</h2><p class="muted">${T("Ismingizni kiriting. Kod o‘qituvchining Telegram chatiga boradi.", "Enter your name. Your teacher receives the code in Telegram.")}</p>${act.state === "clock" ? `<p class="error">${T("Kompyuter sana-vaqtini tekshiring.", "Check your computer date and time.")}</p>` : `${act.state === "expired" ? `<p class="error">${T("Faollashtirish muddati tugadi. Yangi kod oling.", "Activation expired. Request a new code.")}</p>` : ""}<label for="name">${T("Ism va familiya", "Full name")}</label><input id="name" maxlength="60" autocomplete="name" value="${esc(currentName)}" placeholder="${T("Masalan: Aziz Karimov", "e.g. Aziz Karimov")}">${button(T("Telegram orqali kod so‘rash", "Request code via Telegram"), "send")}<div class="divider"></div><label for="code">${T("6 xonali kod", "6-digit code")}</label><input id="code" maxlength="6" inputmode="numeric" autocomplete="one-time-code" placeholder="000000">${button(T("Tasdiqlash va boshlash →", "Verify & start learning →"), "verify")}<p class="muted small">${T("Kod 10 daqiqa amal qiladi. Faollashtirgach, internet shart emas.", "The code lasts 10 minutes. After activation, learning works offline.")}</p>`}</section></section>`;
  }
  function topicCard(t) {
    return `<a class="topic-card glass" href="#/t/${t.id}"><div class="card-top"><span class="topic-icon">${icons[(t.order - 1) % icons.length]}</span><span class="small muted">${String(t.order).padStart(2, "0")} / ${String(topics.length).padStart(2, "0")}</span></div><h3>${esc(L(t.title))}</h3><p class="muted small">${t.classwork.length} ${T("sinf ishi", "classwork")} · ${t.homework.length} ${T("uyga vazifa", "homework")}</p><div class="progress-label"><span>${done(t)} / ${t.classwork.length + t.homework.length}</span><span>${percent(t)}%</span></div><progress max="100" value="${percent(t)}" aria-label="${esc(L(t.title))}"></progress></a>`;
  }
  function home() {
    const list = all(),
      solved = list.filter((p) => progress[key(p.topic, p)]).length;
    const resume = list.find(
      (p) =>
        key(p.topic, p) === localStorage.lastProblem &&
        !progress[key(p.topic, p)],
    );
    const next = resume || list.find((p) => !progress[key(p.topic, p)]);
    const latest = attempts.at(-1),
      last = latest && list.find((p) => key(p.topic, p) === latest.key);
    return `<section class="hero"><div><div class="eyebrow">${T("BUGUN YANGI NARSA YARATING", "BUILD SOMETHING NEW TODAY")}</div><h1>${T("Fikrlashni o‘rganing.<br><em>Algoritm yarating.</em>", "Learn to think.<br><em>Build your next idea.</em>")}</h1><p class="lead">${T("Har bir blok — yangi ko‘nikma. Har bir yechim — oldinga qadam.", "Every block is a new skill. Every solution is a step forward.")}</p>${next ? `<a class="btn" href="#/t/${next.topic.id}/${next.id}">${T("O‘rganishni davom ettirish", "Continue learning")} <span>↗</span></a>` : pill(T("Barcha mashqlar bajarildi!", "All exercises completed!"))}</div><div class="hero-art" aria-hidden="true"><div class="orbit o1"></div><div class="orbit o2"></div><span class="art-node node-start">Start</span><span class="art-line l1"></span><span class="art-node node-if">?</span><span class="art-line l2"></span><span class="art-node node-out">Hello, future.</span><span class="art-spark">✧</span><span class="art-caption">IDEA → FLOW → SOLUTION</span></div></section>
 ${reviewBanner()}<section class="stats"><div class="stat glass"><span>${T("Yechilgan mashqlar", "Problems solved")}</span><strong>${solved}<small> / ${list.length}</small></strong><progress max="${Math.max(1, list.length)}" value="${solved}"></progress></div><div class="stat glass"><span>${T("Yakunlangan mavzular", "Topics completed")}</span><strong>${topics.filter((t) => percent(t) === 100).length}<small> / ${topics.length}</small></strong><small class="muted">${T("Asoslardan loyihalargacha", "From foundations to projects")}</small></div><div class="stat glass"><span>${T("O‘rganish ballari", "Learning XP")}</span><strong>${solved * 10}<small> XP</small></strong><small class="muted">${T("Har yangi yechim uchun 10 XP", "10 XP for every first accepted solution")}</small></div></section>
 <div class="section-heading"><div><span class="eyebrow">${T("BOSQICHMA-BOSQICH", "ONE STEP AT A TIME")}</span><h2>${T("O‘quv yo‘lingiz", "Your learning journey")}</h2></div><a class="text-link" href="#/map">${T("Barcha mavzular", "View learning path")} ↗</a></div><div class="topic-grid">${topics.slice(0, 6).map(topicCard).join("")}</div>
 ${last ? `<section class="glass recent"><span class="topic-icon">↻</span><div><small class="muted">${T("Oxirgi urinish", "Last attempt")}</small><h3>${esc(L(last.title))}</h3></div>${pill(latest.verdict)}<a class="text-link" href="#/t/${last.topic.id}/${last.id}">${T("Ochish", "Open")} →</a></section>` : ""}`;
  }
  function reviewBanner() {
    const pending = all().filter((p) => needsReview(key(p.topic, p)));
    const saved = all().filter((p) => bookmarks.has(key(p.topic, p))).length;
    return `<div class="review-banner"><div><span class="topic-icon">↻</span><div><strong>${T("Bir qadam oldinga", "One step forward")}</strong><p>${pending.length ? T(`${pending.length} ta mashqni yana sinab ko‘ring.`, `${pending.length} exercises are ready for another attempt.`) : T("Yangi mavzuni boshlang yoki qiziqarli mashqni saqlab qo‘ying.", "Start a new topic or save an interesting exercise for later.")}</p></div></div><div class="button-row">${pending.length ? button(T("Qayta ishlash", "Review attempts"), "review", "btn ghost") : ""}${button(T(`Saqlanganlar · ${saved}`, `Saved · ${saved}`), "saved", "btn ghost")}</div></div>`;
  }
  function map() {
    const stages = [
      [
        T("Poydevor", "Foundations"),
        T(
          "Birinchi blokdan ma’lumotlargacha",
          "From your first block to working with data",
        ),
        1,
        4,
        "01",
      ],
      [
        T("Qarorlar", "Decisions"),
        T("Shartlar va mantiqiy fikrlash", "Conditions and logical thinking"),
        5,
        7,
        "02",
      ],
      [
        T("Takrorlash", "Repetition"),
        T(
          "Sikllar bilan ko‘proq ish bajaring",
          "Make loops do the repeated work",
        ),
        8,
        11,
        "03",
      ],
      [
        T("Yaratish", "Build"),
        T(
          "Massivlar, funksiyalar va loyihalar",
          "Arrays, functions and projects",
        ),
        12,
        15,
        "04",
      ],
    ];
    const next = topics.find((t) => percent(t) < 100);
    return `${title(T("Sizning o‘quv xaritangiz", "Your learning path"))}<p class="lead">${T("To‘rt bosqich. O‘n besh mavzu. Har qadamda yangi ko‘nikma.", "Four stages. Fifteen topics. A new skill at every step.")}</p><div class="stage-index">${stages
      .map(([name, sub, start, end, n]) => {
        const ts = topics.filter((t) => t.order >= start && t.order <= end),
          total = ts.reduce(
            (v, t) => v + t.classwork.length + t.homework.length,
            0,
          ),
          solved = ts.reduce((v, t) => v + done(t), 0);
        return `<button class="glass stage-summary" data-stage="${n}"><span class="label">${T("BOSQICH", "STAGE")} ${n}</span><strong>${name}</strong><small>${solved}/${total} ${T("yechilgan", "solved")}</small><progress value="${solved}" max="${total || 1}" aria-label="${name}"></progress></button>`;
      })
      .join("")}</div>${stages
      .map(
        ([name, sub, start, end, n]) =>
          `<section class="learning-stage" id="stage-${n}"><div class="stage-heading"><span>${n}</span><div><h2>${name}</h2><p class="muted">${sub}</p></div></div><div class="stage-topics">${topics
            .filter((t) => t.order >= start && t.order <= end)
            .map(
              (t) =>
                `<a class="glass stage-topic ${next?.id === t.id ? "recommended" : ""}" href="#/t/${t.id}"><div class="card-top"><span class="topic-icon">${percent(t) === 100 ? "✓" : icons[t.order - 1]}</span><span class="label">${next?.id === t.id ? T("KEYINGI QADAM", "UP NEXT") : String(t.order).padStart(2, "0")}</span></div><h3>${esc(L(t.title))}</h3><p class="small muted">${t.classwork.length} ${T("sinf ishi", "classwork")} · ${t.homework.length} ${T("uyga vazifa", "homework")}</p><div class="progress-label"><span>${done(t)}/${t.classwork.length + t.homework.length}</span><span>${percent(t)}%</span></div><progress value="${percent(t)}" max="100" aria-label="${esc(L(t.title))}"></progress></a>`,
            )
            .join("")}</div></section>`,
      )
      .join("")}`;
  }
  function row(p, t, i) {
    const solved = !!progress[key(t, p)];
    return `<a class="problem-row" href="#/t/${t.id}/${p.id}"><span class="status-dot ${solved ? "solved" : ""}">${solved ? "✓" : String(i + 1).padStart(2, "0")}</span><div><strong>${esc(L(p.title))}${bookmarks.has(key(t, p)) ? ' <span class="bookmark-mark" aria-label="Saved">◆</span>' : ""}</strong><small>${esc(L(t.title))}</small></div><span class="difficulty ${p.difficulty || "easy"}">${difficulty(p)}</span><span class="row-arrow">↗</span></a>`;
  }
  function searchControls() {
    return `<div class="search-controls"><label class="search-box"><span>⌕</span><input type="search" id="search" placeholder="${T("Mashq yoki mavzu qidirish…", "Search problems or topics…")}" value="${esc(query)}" aria-label="${T("Mashq qidirish", "Search problems")}"><kbd>Ctrl K</kbd></label><select id="filter" aria-label="${T("Holat bo‘yicha saralash", "Filter by status")}">${[
      ["all", T("Barchasi", "All problems")],
      ["todo", T("Yechilmagan", "To do")],
      ["review", T("Qayta ishlash", "Needs another attempt")],
      ["saved", T("Saqlanganlar", "Saved")],
      ["solved", T("Yechilgan", "Solved")],
    ]
      .map(
        ([v, l]) =>
          `<option value="${v}" ${filter === v ? "selected" : ""}>${l}</option>`,
      )
      .join("")}</select></div>`;
  }
  const searchText = (s) => s.toLocaleLowerCase().replace(/[‘’ʻʼ`]/g, "'");
  function filtered(list, t) {
    return list.filter((p) => {
      const tp = t || p.topic,
        s = !!progress[key(tp, p)];
      return (
        (filter === "all" ||
          (filter === "saved"
            ? bookmarks.has(key(tp, p))
            : filter === "review"
              ? needsReview(key(tp, p))
              : filter === "solved"
                ? s
                : !s)) &&
        searchText(L(p.title) + " " + L(tp.title)).includes(searchText(query))
      );
    });
  }
  function practice() {
    const list = filtered(all());
    return `${title(T("Mashq maydoni", "Practice studio"))}<p class="lead">${T("Flowgorithm’da yeching. Faylni yuboring. Natijani o‘rganing.", "Solve in Flowgorithm. Submit your file. Learn from the result.")}</p>${searchControls()}<div class="glass problem-list" id="problem-list">${list.length ? list.map((p, i) => row(p, p.topic, i)).join("") : empty()}</div>`;
  }
  const empty = () =>
    `<div class="empty"><span>⌕</span><h3>${T("Mos mashq topilmadi", "No matching problems")}</h3><p class="muted">${T("Qidiruv yoki saralashni o‘zgartiring.", "Try another search or filter.")}</p></div>`;
  function topic(t) {
    const list = filtered(t[section], t);
    return `<a class="text-link" href="#/map">← ${T("O‘quv xaritasi", "Learning path")}</a>${title(esc(L(t.title)))}<div class="topic-meta">${pill(`${done(t)}/${t.classwork.length + t.homework.length} ${T("yechildi", "solved")}`)}${pill(T("O‘z sur’atingizda", "Self paced"))}</div><section class="glass lesson"><div class="section-heading"><h2>${T("Avval tushunib olamiz", "Understand the idea")}</h2><span class="topic-icon">${icons[t.order - 1]}</span></div>${L(
      t.lesson,
    )
      .split("\n")
      .filter(Boolean)
      .map((p) => `<p>${esc(p)}</p>`)
      .join(
        "",
      )}${t.concepts?.length ? `<div class="concept-grid">${t.concepts.map((c) => `<div class="concept"><strong>${esc(L(c.title))}</strong><p>${esc(L(c.text))}</p></div>`).join("")}</div>` : ""}</section><div class="tabs" role="group" aria-label="${T("Mashq turi", "Exercise type")}">${["classwork", "homework"].map((s) => `<button class="${section === s ? "selected" : ""}" data-section="${s}" aria-pressed="${section === s}">${s === "classwork" ? T("Sinf ishi", "Classwork") : T("Uyga vazifa", "Homework")} <span>${t[s].length}</span></button>`).join("")}</div>${searchControls()}<div class="glass problem-list" id="problem-list">${list.length ? list.map((p, i) => row(p, t, i)).join("") : empty()}</div>`;
  }
  function problem(t, p) {
    const k = key(t, p),
      r = resultKey === k ? result : null;
    localStorage.lastProblem = k;
    section = t.homework.some((x) => x.id === p.id) ? "homework" : "classwork";
    return `<a class="text-link" href="#/t/${t.id}">← ${esc(L(t.title))}</a>${problemToolbar(t, p)}<div class="problem-heading"><div>${title(esc(L(p.title)))}<div class="topic-meta">${pill(difficulty(p))}${pill(progress[k] ? T("✓ Yechilgan", "✓ Solved") : T("Yechishga tayyor", "Ready to solve"))}${pill(t.classwork.some((x) => x.id === p.id) ? T("Sinf ishi", "Classwork") : T("Uyga vazifa", "Homework"))}</div></div></div><div class="problem-layout"><section class="glass statement"><h2>${T("Vazifa", "Your task")}</h2><p>${esc(L(p.statement))}</p><h3>${T("Kirish ma’lumotlari", "Input")}</h3><p>${esc(L(p.inputFormat))}</p><h3>${T("Chiqish ma’lumotlari", "Output")}</h3><p>${esc(L(p.outputFormat)) || T("Natijani chiqaring.", "Print the result.")}</p>${p.requiredBlocks?.length ? `<div class="callout">${T("Ishlatilishi kerak bo‘lgan bloklar", "Required blocks")}: <strong>${p.requiredBlocks.map(esc).join(", ")}</strong></div>` : ""}<h3>${T("Namunalar", "Examples")}</h3>${p.examples.map((e, i) => `<div class="example"><div class="example-title">${T("Namuna", "Example")} ${i + 1}</div><div class="example-grid"><div><span class="label">INPUT</span><pre>${esc(e.in) || T("(kiritish yo‘q)", "(no input)")}</pre></div><div><span class="label">OUTPUT</span><pre>${esc(e.out)}</pre></div></div></div>`).join("")}${p.hints?.length ? `<h3>${T("Yordam kerakmi?", "Need a nudge?")}</h3>${p.hints.map((h, i) => `<details><summary>${T("Ishora", "Hint")} ${i + 1}</summary><p>${esc(L(h))}</p></details>`).join("")}` : ""}</section><div class="submission-column"><section class="glass submission"><div class="section-heading"><h2>${T("Yechimni tekshirish", "Test your solution")}</h2>${pill(".fprg")}</div><p class="muted small">${T("Flowgorithm’da File → Save orqali saqlang, so‘ng faylni tanlang.", "Save with File → Save in Flowgorithm, then choose the file here.")}</p><div id="drop" class="drop ${resultKey === k && uploadedXml ? "has-file" : ""}" aria-busy="${busy}"><span class="upload-icon">↥</span><strong>${T("Faylingizni shu yerga tashlang", "Drop your flowchart here")}</strong><span class="muted small">.fprg · ${T("1 MB gacha", "up to 1 MB")}</span><button class="btn" data-action="pick" ${busy ? "disabled" : ""}>${busy ? T("Tekshirilmoqda…", "Checking…") : resultKey === k && uploadedXml ? T("Faylni almashtirish", "Choose another file") : T("Fayl tanlash", "Choose file")}</button><input id="file" type="file" accept=".fprg" hidden></div><div class="tabs submission-tabs" role="group" aria-label="${T("Yechim ko‘rinishi", "Submission view")}"><button data-subtab="feedback" aria-pressed="${submissionTab === "feedback"}" class="${submissionTab === "feedback" ? "selected" : ""}">${T("Natija", "Feedback")}</button><button data-subtab="flow" aria-pressed="${submissionTab === "flow"}" class="${submissionTab === "flow" ? "selected" : ""}">${T("Chizma", "Flowchart")}</button></div>${resultKey === k && lastFile ? `<p class="submitted-file">↳ ${esc(lastFile)}</p>` : ""}<div id="result" aria-live="polite">${submissionTab === "flow" ? (resultKey === k && uploadedXml ? FlowPreview.render(uploadedXml, lang) : `<p class="preview-empty">${T("Chizmani ko‘rish uchun .fprg fayl yuklang.", "Upload a .fprg file to see its flowchart.")}</p>`) : r ? resultHtml(r) : `<div class="judge-idle"><span>◎</span><p>${T("Tayyor bo‘lganda yuboring.<br>Har bir urinish — o‘rganish imkoniyati.", "Submit when you’re ready.<br>Every attempt is a chance to learn.")}</p></div>`}</div></section><section class="glass tips"><span class="label">${T("QANDAY ISHLAYDI?", "THE LEARNING LOOP")}</span><ol><li>${T("Shart va namunalarni o‘qing.", "Read the task and examples.")}</li><li>${T("Flowgorithm’da bloklarni tuzing.", "Build the blocks in Flowgorithm.")}</li><li>${T("Saqlang va testlarga yuboring.", "Save and run against the tests.")}</li><li>${T("Natijaga qarab yaxshilang.", "Use the feedback to improve.")}</li></ol><p class="small muted">${T("Yashirin testlarning qiymatlari ko‘rsatilmaydi.", "Hidden-test values are never shown.")}</p></section></div></div>${problemNavigation(t, p)}`;
  }
  function problemToolbar(t, p) {
    const saved = bookmarks.has(key(t, p));
    return `<div class="problem-toolbar"><span class="label">${T("MASHQ MAYDONI", "PRACTICE WORKSPACE")}</span><div class="button-row"><button class="btn ghost" data-action="bookmark" aria-pressed="${saved}">${saved ? "◆" : "◇"} ${saved ? T("Saqlangan", "Saved") : T("Saqlash", "Save for later")}</button><button class="btn ghost" data-action="focus" aria-pressed="${focusMode}">${focusMode ? T("To‘liq ko‘rinish", "Exit focus") : T("Diqqat rejimi", "Focus view")}</button></div></div>`;
  }
  function neighbors(t, p) {
    const list = all(),
      i = list.findIndex((x) => key(x.topic, x) === key(t, p));
    return { previous: list[i - 1], next: list[i + 1] };
  }
  function problemNavigation(t, p) {
    const { previous, next } = neighbors(t, p),
      list = [...t.classwork, ...t.homework],
      index = list.findIndex((x) => x.id === p.id);
    const link = (q, label, cls) =>
      q
        ? `<a class="btn ${cls}" href="#/t/${q.topic.id}/${q.id}">${label}</a>`
        : "<span></span>";
    return `<nav class="exercise-navigation" aria-label="${T("Mashqlar orasida o‘tish", "Exercise navigation")}">${link(previous, T("← Oldingi", "← Previous"), "ghost")}<span>${index + 1} / ${list.length}</span>${link(next, T("Keyingi →", "Next →"), "")}</nav>`;
  }
  function feedbackGuide(r) {
    const advice = {
      WA: T(
        "Natijalar tartibini, qo‘shimcha Output matnini va chegara qiymatlarini tekshiring.",
        "Check output order, extra output text and boundary values.",
      ),
      RE: T(
        "Input soni, o‘zgaruvchi turi, massiv indeksi va nolga bo‘lish holatini tekshiring.",
        "Check the number of inputs, variable types, array indexes and division by zero.",
      ),
      TLE: T(
        "Har aylanishda sikl shartiga ta’sir qiluvchi qiymat o‘zgarsin. To‘xtash shartini tekshiring.",
        "Make sure each loop updates the value used in its condition. Check when the loop stops.",
      ),
      CE: T(
        "Faylni Flowgorithm’da oching, talab qilingan bloklarni tekshiring va qayta saqlang.",
        "Open the file in Flowgorithm, check the required blocks and save it again.",
      ),
    };
    if (r.verdict === "AC") {
      const [, tid, pid] = path(),
        t = topics.find((t) => t.id === tid),
        p = t && [...t.classwork, ...t.homework].find((p) => p.id === pid),
        next = p && neighbors(t, p).next;
      return next
        ? `<a class="btn next-success" href="#/t/${next.topic.id}/${next.id}">${T("Keyingi mashqni boshlash", "Start the next exercise")} →</a>`
        : "";
    }
    return advice[r.verdict]
      ? `<div class="feedback-guide"><strong>${T("Keyingi qadam", "Your next step")}</strong><p>${advice[r.verdict]}</p></div>`
      : "";
  }
  const verdictName = (v) =>
    ({
      AC: T("Qabul qilindi", "Accepted"),
      WA: T("Javob mos kelmadi", "Wrong answer"),
      RE: T("Bajarilish xatosi", "Runtime error"),
      CE: T("Fayl yoki blok xatosi", "File or block error"),
      TLE: T("Bajarish limiti tugadi", "Execution limit"),
    })[v] || v;
  function resultHtml(r) {
    if (r.error) return `<div class="verdict failure">${esc(r.error)}</div>`;
    const failure = r.results?.find(
      (x) => x.verdict !== "AC" && !x.hidden && x.input !== undefined,
    );
    return `<div class="verdict ${r.verdict === "AC" ? "success" : "failure"}"><span class="verdict-icon">${r.verdict === "AC" ? "✓" : "!"}</span><div><h3>${verdictName(r.verdict)}</h3><small>${r.passed}/${r.total} ${T("test muvaffaqiyatli", "tests passed")}</small></div></div>${r.message ? `<p class="small">${esc(r.message)}</p>` : ""}<div class="test-chips">${(r.results || []).map((x) => `<span class="test-chip ${x.verdict === "AC" ? "pass" : "fail"}" title="${x.hidden ? T("Yashirin", "Hidden") : T("Ochiq", "Visible")} · ${verdictName(x.verdict)}">${x.verdict === "AC" ? "✓" : "×"} ${x.n}${x.hidden ? " ▪" : ""}</span>`).join("")}</div>${failure ? `<details open class="diff"><summary>${T("Birinchi ochiq test xatosi", "First failing visible test")}</summary><p class="small">${esc(failure.message)}</p><label>Input</label><pre>${esc(failure.input)}</pre><label>${T("Kutilgan natija", "Expected")}</label><pre>${esc(failure.expected)}</pre><label>${T("Sizning natijangiz", "Your output")}</label><pre>${esc(failure.got)}</pre></details>` : ""}${feedbackGuide(r)}${r.verdict === "AC" ? `<p class="small muted">${T("Ajoyib. Endi keyingi mashqni sinab ko‘ring.", "Well done. Try the next exercise when you’re ready.")}</p>` : ""}`;
  }
  function progressPage() {
    const list = all(),
      solved = list.filter((p) => progress[key(p.topic, p)]).length;
    return `${title(T("Har bir qadam hisobda", "Every step counts"))}<p class="lead">${T("Natijalar shu kompyuterda saqlanadi. Ularni zaxiralashingiz mumkin.", "Progress is saved on this computer. Keep a backup of your work.")}</p><section class="stats"><div class="stat glass"><span>${T("Yechilgan", "Solved")}</span><strong>${solved}</strong></div><div class="stat glass"><span>XP</span><strong>${solved * 10}</strong></div><div class="stat glass"><span>${T("Saqlangan urinishlar", "Recorded attempts")}</span><strong>${attempts.length}</strong></div></section><div class="section-heading"><h2>${T("Mavzular bo‘yicha", "By topic")}</h2>${button(T("CSV natijalar", "Export CSV"), "csv", "btn ghost")}</div><div class="glass progress-table">${topics.map((t) => `<div class="progress-row"><a href="#/t/${t.id}">${esc(L(t.title))}</a><progress max="100" value="${percent(t)}"></progress><strong>${percent(t)}%</strong></div>`).join("")}</div><h2>${T("Oxirgi urinishlar", "Recent attempts")}</h2><div class="glass problem-list">${
      attempts
        .slice(-20)
        .reverse()
        .map((a) => {
          const p = list.find((p) => key(p.topic, p) === a.key);
          return p
            ? `<a class="attempt" href="#/t/${p.topic.id}/${p.id}"><span>${esc(L(p.title))}<small>${new Date(a.at).toLocaleString(lang === "uz" ? "uz-UZ" : "en-GB")}</small></span><span class="${a.verdict === "AC" ? "green" : "muted"}">${verdictName(a.verdict)}</span></a>`
            : "";
        })
        .join("") ||
      `<div class="empty">${T("Birinchi yechimingiz shu yerda ko‘rinadi.", "Your first attempt will appear here.")}</div>`
    }</div>`;
  }
  function settings() {
    return `${title(T("O‘zingizga moslang", "Make it yours"))}<p class="lead">${T("Qulay ko‘rinish. Diqqatni jamlash. Ishonchli zaxira.", "A comfortable view. Space to focus. A backup you can keep.")}</p><section class="glass settings"><h2>${T("Ko‘rinish", "Appearance")}</h2><label for="theme-select">${T("Rang rejimi", "Theme")}</label><select id="theme-select">${[
      ["system", T("Tizimga mos", "Follow system")],
      ["light", T("Kunduz", "Day")],
      ["dark", T("Tun", "Night")],
    ]
      .map(
        ([v, l]) =>
          `<option value="${v}" ${theme === v ? "selected" : ""}>${l}</option>`,
      )
      .join(
        "",
      )}</select><label for="language-select">${T("Til", "Language")}</label><select id="language-select"><option value="uz" ${lang === "uz" ? "selected" : ""}>O‘zbekcha</option><option value="en" ${lang === "en" ? "selected" : ""}>English</option></select><label class="check"><input type="checkbox" id="motion" ${localStorage.reducedMotion === "true" ? "checked" : ""}>${T("Animatsiyalarni kamaytirish", "Reduce motion")}</label><label for="font-size">${T("Matn o‘lchami", "Text size")}</label><select id="font-size">${["100", "110", "120"].map((v) => `<option value="${v}" ${(localStorage.fontSize || "100") === v ? "selected" : ""}>${v}%</option>`).join("")}</select><div class="divider"></div><h2>${T("Natijalarni saqlash", "Keep your progress")}</h2><p class="muted">${T("Import mavjud yechimlarni saqlagan holda natijalarni birlashtiradi. Faollashtirish boshqa kompyuterga ko‘chirilmaydi.", "Import merges solved problems without removing existing progress. Activation does not transfer to another computer.")}</p><div class="button-row">${button(T("Zaxira yaratish", "Export backup"), "backup")}${button(T("Zaxirani tiklash", "Restore backup"), "restore", "btn ghost")}</div><p class="small muted">${T("Qisqa tugmalar: Ctrl+K — qidiruv, Ctrl+O — yechim fayli, Ctrl+, — sozlamalar.", "Shortcuts: Ctrl+K — search, Ctrl+O — solution file, Ctrl+, — settings.")}</p></section>`;
  }
  function render() {
    document.documentElement.dataset.theme = theme === "system" ? "" : theme;
    document.documentElement.dataset.motion =
      localStorage.reducedMotion === "true" ? "reduced" : "";
    document.documentElement.lang = lang;
    document.documentElement.dataset.font = localStorage.fontSize || "100";
    const [route, tid, pid] = path(),
      tp = topics.find((t) => t.id === tid),
      p = tp && [...tp.classwork, ...tp.homework].find((p) => p.id === pid);
    document.documentElement.dataset.focus =
      focusMode && route === "t" && p ? "true" : "false";
    const body =
      act.state !== "ok"
        ? gate()
        : route === "t" && tp
          ? p
            ? problem(tp, p)
            : topic(tp)
          : route === "map"
            ? map()
            : route === "practice"
              ? practice()
              : route === "progress"
                ? progressPage()
                : route === "settings"
                  ? settings()
                  : home();
    $("app").innerHTML = shell(body);
  }
  function notify(message) {
    notice = message;
    const el = $("toast");
    if (el) {
      el.textContent = message;
      el.hidden = false;
    }
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => {
      notice = "";
      if ($("toast")) $("toast").hidden = true;
    }, 6000);
  }
  async function sync() {
    const s = await api.state();
    progress = s.progress || {};
    attempts = s.attempts || [];
  }
  async function submit(file) {
    if (!file || busy) return;
    if (!/\.fprg$/i.test(file.name) || file.size > 1e6) {
      notify(
        T(
          "1 MB dan kichik .fprg fayl tanlang.",
          "Choose a .fprg file no larger than 1 MB.",
        ),
      );
      return;
    }
    const [route, tid, pid] = path();
    if (route !== "t" || !pid) return;
    busy = true;
    uploadedXml = "";
    submissionTab = "feedback";
    result = null;
    resultKey = `${tid}/${pid}`;
    lastFile = file.name;
    render();
    try {
      const text = await file.text();
      uploadedXml = text;
      result = await api.judge({ topic: tid, problem: pid, file: text });
      await sync();
    } catch {
      result = {
        error: T(
          "Tekshirish amalga oshmadi. Qayta urinib ko‘ring.",
          "Could not check this file. Please try again.",
        ),
      };
    } finally {
      busy = false;
      render();
    }
  }
  const errors = {
    name: () =>
      T(
        "Ism kamida 2 belgidan iborat bo‘lsin.",
        "Enter at least two characters.",
      ),
    not_configured: () =>
      T(
        "Faollashtirish sozlanmagan. Administratorga murojaat qiling.",
        "Activation is not configured. Contact your administrator.",
      ),
    send_failed: () =>
      T(
        "Kod yuborilmadi. Internetni tekshiring.",
        "Code could not be sent. Check your connection.",
      ),
    bad: () => T("Kod noto‘g‘ri.", "Incorrect code."),
    expired: () =>
      T(
        "Kod muddati tugadi. Yangi kod so‘rang.",
        "Code expired. Request a new code.",
      ),
    locked: () =>
      T(
        "Urinishlar tugadi. Yangi kod so‘rang.",
        "No attempts left. Request a new code.",
      ),
    rate: () =>
      T(
        "Ko‘p so‘rov yuborildi. 10 daqiqa kuting.",
        "Too many requests. Wait 10 minutes.",
      ),
  };
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.stage) {
      document.getElementById("stage-" + b.dataset.stage)?.scrollIntoView({
        behavior:
          localStorage.reducedMotion === "true" ||
          matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        block: "start",
      });
      return;
    }
    if (b.dataset.subtab) {
      submissionTab = b.dataset.subtab;
      render();
      return;
    }
    if (b.dataset.section) {
      section = b.dataset.section;
      query = "";
      render();
      return;
    }
    const a = b.dataset.action;
    if (!a) return;
    if (a === "skip") {
      $("main")?.focus();
      return;
    }
    if (a === "bookmark") {
      const [, tid, pid] = path(),
        k = `${tid}/${pid}`;
      if (bookmarks.has(k)) bookmarks.delete(k);
      else bookmarks.add(k);
      localStorage.bookmarks = JSON.stringify([...bookmarks]);
      render();
      document.querySelector('[data-action="bookmark"]')?.focus();
      return;
    }
    if (a === "focus") {
      focusMode = !focusMode;
      render();
      document.querySelector('[data-action="focus"]')?.focus();
      return;
    }
    if (a === "saved" || a === "review") {
      filter = a;
      query = "";
      if (location.hash === "#/practice") render();
      else nav("#/practice");
      return;
    }
    if (a === "language") {
      lang = localStorage.lang = lang === "uz" ? "en" : "uz";
      render();
      return;
    }
    if (a === "theme") {
      theme = localStorage.theme = theme === "dark" ? "light" : "dark";
      render();
      return;
    }
    if (a === "pick") {
      $("file")?.click();
      return;
    }
    b.disabled = true;
    try {
      if (a === "send") {
        currentName = $("name").value;
        const r = await api.request(currentName);
        notify(
          r.ok
            ? T(
                "Kod o‘qituvchining Telegram chatiga yuborildi.",
                "Code sent to your teacher’s Telegram chat.",
              )
            : errors[r.error]?.() || r.error,
        );
        if (r.ok) $("code")?.focus();
      }
      if (a === "verify") {
        const r = await api.verify($("code").value);
        if (r.ok) {
          act = await api.status();
          render();
        } else notify(errors[r.error]?.() || r.error);
      }
      if (["backup", "restore", "csv"].includes(a)) {
        const r =
          await api[
            a === "backup"
              ? "exportBackup"
              : a === "restore"
                ? "importBackup"
                : "exportCsv"
          ]();
        if (r.ok) {
          await sync();
          render();
          notify(T("Tayyor.", "Done."));
        } else if (r.error) notify(r.error);
      }
    } catch {
      notify(
        T(
          "Amal bajarilmadi. Qayta urinib ko‘ring.",
          "The action could not complete. Please try again.",
        ),
      );
    } finally {
      b.disabled = false;
    }
  });
  document.addEventListener("input", (e) => {
    if (e.target.id === "search") {
      query = e.target.value;
      const [route, tid] = path(),
        tp = topics.find((t) => t.id === tid),
        list =
          route === "t" && tp ? filtered(tp[section], tp) : filtered(all());
      $("problem-list").innerHTML = list.length
        ? list.map((p, i) => row(p, tp || p.topic, i)).join("")
        : empty();
    }
  });
  document.addEventListener("change", (e) => {
    const id = e.target.id,
      v = e.target.value;
    if (id === "file") {
      submit(e.target.files[0]);
      return;
    }
    if (id === "filter") filter = v;
    else if (id === "theme-select") theme = localStorage.theme = v;
    else if (id === "language-select") lang = localStorage.lang = v;
    else if (id === "motion")
      localStorage.reducedMotion = String(e.target.checked);
    else if (id === "font-size") localStorage.fontSize = v;
    else return;
    render();
  });
  document.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.target.closest?.("#drop")?.classList.add("over");
  });
  document.addEventListener("dragleave", (e) =>
    e.target.closest?.("#drop")?.classList.remove("over"),
  );
  document.addEventListener("drop", (e) => {
    e.preventDefault();
    if (e.target.closest?.("#drop")) submit(e.dataTransfer.files[0]);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && focusMode) {
      focusMode = false;
      render();
      document.querySelector('[data-action="focus"]')?.focus();
      return;
    }
    if (!(e.ctrlKey || e.metaKey)) return;
    if (e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (!$("search")) {
        location.hash = "#/practice";
        setTimeout(() => $("search")?.focus(), 50);
      } else $("search").focus();
    }
    if (e.key.toLowerCase() === "o" && $("file")) {
      e.preventDefault();
      $("file").click();
    }
    if (e.key === ",") {
      e.preventDefault();
      nav("#/settings");
    }
  });
  window.addEventListener("hashchange", () => {
    query = "";
    render();
    window.scrollTo(0, 0);
  });
  (async () => {
    try {
      act = await api.status();
      topics = await api.topics();
      await sync();
      render();
    } catch {
      $("app").innerHTML =
        `<main><h1>${T("Ilova ochilmadi", "Could not open the app")}</h1><p>${T("Ilovani yoping va qayta oching.", "Close the app and try again.")}</p></main>`;
    }
  })();
})();
