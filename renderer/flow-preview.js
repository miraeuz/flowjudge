/* A bounded, read-only view of the student's uploaded XML. No evaluation, URLs or raw markup. */
(() => {
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
  function render(xml, lang = "uz") {
    const t = (uz, en) => (lang === "uz" ? uz : en);
    const error = () =>
      `<p class="preview-empty">${t("Chizma ko‘rinishini yaratib bo‘lmadi. To‘g‘ri .fprg fayl tanlang.", "Could not preview this flowchart. Choose a valid .fprg file.")}</p>`;
    if (
      typeof xml !== "string" ||
      xml.length > 1e6 ||
      /<!DOCTYPE|<!ENTITY/i.test(xml)
    )
      return error();
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    if (
      doc.querySelector("parsererror") ||
      doc.documentElement.tagName !== "flowgorithm"
    )
      return error();
    const functions = Array.from(doc.documentElement.children).filter(
      (n) => n.tagName === "function",
    );
    if (!functions.length) return error();
    let count = 0,
      cut = false;
    const sequence = (parent, depth = 0) => {
      if (!parent) return "";
      if (depth > 20) {
        cut = true;
        return "";
      }
      let html = "";
      for (const node of parent.children) {
        if (count >= 160) {
          cut = true;
          break;
        }
        const tag = node.tagName;
        if (tag === "comment") continue;
        count++;
        const attr = (n) => node.getAttribute(n) || "";
        const labels = {
          declare: t("E’lon qilish", "Declare"),
          assign: t("Qiymat berish", "Assign"),
          input: t("Kiritish", "Input"),
          output: t("Chiqarish", "Output"),
          call: t("Chaqirish", "Call"),
          if: t("Shart", "Decision"),
          for: "For",
          while: "While",
          do: "Do-While",
        };
        const label = labels[tag];
        if (!label) {
          html += `<div class="flow-node"><small>${t("Blok", "Block")}</small><code>${esc(tag)}</code></div>`;
          continue;
        }
        let value =
          tag === "declare"
            ? `${attr("name")} : ${attr("type")}${attr("array") === "True" ? `[${attr("size")}]` : ""}`
            : tag === "assign"
              ? `${attr("variable")} ← ${attr("expression")}`
              : tag === "input"
                ? attr("variable")
                : tag === "for"
                  ? `${attr("variable")}: ${attr("start")} → ${attr("end")} (${attr("direction") === "dec" ? "-" : "+"}${attr("step") || "1"})`
                  : attr("expression");
        html += `<div class="flow-node flow-${tag}"><small>${label}</small><code>${esc(value.slice(0, 1500))}${value.length > 1500 ? "…" : ""}</code></div>`;
        if (tag === "if") {
          const child = (name) =>
            Array.from(node.children).find((n) => n.tagName === name);
          html += `<div class="flow-branches"><div class="flow-branch"><b>${t("Ha", "True")}</b>${sequence(child("then"), depth + 1) || `<span class="flow-empty">—</span>`}</div><div class="flow-branch"><b>${t("Yo‘q", "False")}</b>${sequence(child("else"), depth + 1) || `<span class="flow-empty">—</span>`}</div></div>`;
        } else if (["for", "while", "do"].includes(tag)) {
          const body =
            Array.from(node.children).find((n) => n.tagName === "body") || node;
          html += `<div class="flow-loop">${sequence(body, depth + 1)}<span class="flow-return">↺ ${t("Shartni tekshirish", "Check condition")}</span></div>`;
        }
      }
      return html;
    };
    const charts = functions
      .slice(0, 16)
      .map(
        (fn) =>
          `<section class="flow-function"><h4>${esc(fn.getAttribute("name"))}</h4><div class="flow-terminal">${t("Boshlash", "Start")}</div>${sequence(Array.from(fn.children).find((n) => n.tagName === "body"))}<div class="flow-terminal">${t("Tugatish", "End")}</div></section>`,
      )
      .join("");
    return `<p class="muted small">${t("Yuklagan faylingizning blok tuzilishi.", "Block structure of your uploaded file.")}</p><div class="flow-canvas" tabindex="0" role="region" aria-label="${t("Yuklangan chizma", "Uploaded flowchart")}">${charts}</div>${cut || functions.length > 16 ? `<p class="muted small">${t("Katta chizmaning bir qismi ko‘rsatilgan. Tekshiruvchi butun faylni oladi.", "This large preview is abbreviated. The judge receives the whole file.")}</p>` : ""}`;
  }
  window.FlowPreview = Object.freeze({ render });
})();
