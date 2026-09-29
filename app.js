const STORAGE_KEY = "my-tracker-v1";
let state = loadState();
let deferredInstallPrompt = null;

const $ = (id) => document.getElementById(id);

const ui = {
  trackerList: $("trackerList"),
  emptyState: $("emptyState"),
  modalBackdrop: $("modalBackdrop"),
  trackerForm: $("trackerForm"),
  nameInput: $("nameInput"),
  typeInput: $("typeInput"),
  targetInput: $("targetInput"),
  targetWrap: $("targetWrap"),
  deadlineWrap: $("deadlineWrap"),
  deadlineInput: $("deadlineInput"),
  categoryInput: $("categoryInput"),
  colorInput: $("colorInput"),
  todayLabel: $("todayLabel"),
  todayDone: $("todayDone"),
  activeCount: $("activeCount"),
  bestStreak: $("bestStreak"),
  toast: $("toast"),
  installBtn: $("installBtn"),
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { trackers: [] };
    const parsed = JSON.parse(raw);
    return parsed && Array.isArray(parsed.trackers) ? parsed : { trackers: [] };
  } catch {
    return { trackers: [] };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function dateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric", month: "2-digit", day: "2-digit"
  }).format(date);
}

function friendlyDate(date = new Date()) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  }).format(date);
}

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

function todayProgress(t) {
  const key = dateKey();
  const entry = t.history?.[key] ?? defaultEntry(t);
  if (t.type === "habit") return entry.done ? 1 : 0;
  if (t.type === "count") return clamp(Number(entry.value || 0) / Math.max(1, t.target || 1), 0, 1);
  if (t.type === "checklist") {
    const items = entry.items || [];
    return items.length ? items.filter(Boolean).length / items.length : 0;
  }
  if (t.type === "deadline") {
    return entry.done ? 1 : 0;
  }
  return 0;
}

function defaultEntry(t) {
  if (t.type === "habit" || t.type === "deadline") return { done: false };
  if (t.type === "count") return { value: 0 };
  if (t.type === "checklist") return { items: (t.items || []).map(() => false) };
  return {};
}

function ensureTodayEntry(t) {
  const key = dateKey();
  if (!t.history) t.history = {};
  if (!t.history[key]) t.history[key] = defaultEntry(t);
  return t.history[key];
}

function trackerStreak(t) {
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = dateKey(d);
    const entry = t.history?.[key];
    if (!entry) break;
    const progress = progressFromEntry(t, entry);
    if (progress < 1) break;
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function progressFromEntry(t, entry) {
  if (t.type === "habit" || t.type === "deadline") return entry.done ? 1 : 0;
  if (t.type === "count") return clamp(Number(entry.value || 0) / Math.max(1, t.target || 1), 0, 1);
  if (t.type === "checklist") {
    const items = entry.items || [];
    return items.length ? items.filter(Boolean).length / items.length : 0;
  }
  return 0;
}

function bestStreak(t) {
  let best = 0, current = 0;
  const days = Object.keys(t.history || {}).sort();
  if (!days.length) return 0;
  let prev = null;
  for (const key of days) {
    const [y,m,d] = key.split("-").map(Number);
    const currentDate = new Date(y, m - 1, d);
    if (prev) {
      const diff = Math.round((currentDate - prev) / 86400000);
      if (diff === 1 && progressFromEntry(t, t.history[key]) >= 1) {
        current += 1;
      } else {
        current = progressFromEntry(t, t.history[key]) >= 1 ? 1 : 0;
      }
    } else {
      current = progressFromEntry(t, t.history[key]) >= 1 ? 1 : 0;
    }
    best = Math.max(best, current);
    prev = currentDate;
  }
  return best;
}

function render() {
  ui.todayLabel.textContent = friendlyDate();
  const active = state.trackers.filter(t => !t.archived);
  ui.activeCount.textContent = active.length;

  const overall = active.length
    ? Math.round(active.reduce((sum,t) => sum + todayProgress(t), 0) / active.length * 100)
    : 0;
  ui.todayDone.textContent = `${overall}%`;
  ui.bestStreak.textContent = active.reduce((best,t) => Math.max(best, bestStreak(t)), 0);

  ui.trackerList.innerHTML = "";
  ui.emptyState.classList.toggle("hidden", active.length > 0);

  active.forEach(t => {
    ensureTodayEntry(t);
    ui.trackerList.appendChild(renderTrackerCard(t));
  });

  saveState();
}

function renderTrackerCard(t) {
  const card = document.createElement("article");
  card.className = "tracker-card";

  const p = todayProgress(t);
  const pct = Math.round(p * 100);
  const entry = ensureTodayEntry(t);
  const streak = trackerStreak(t);

  const metaParts = [];
  if (t.category) metaParts.push(t.category);
  if (t.type === "habit") metaParts.push("Daily");
  if (t.type === "count") metaParts.push(`Target ${t.target}`);
  if (t.type === "deadline" && t.deadline) metaParts.push(`Due ${formatShortDate(t.deadline)}`);
  if (streak) metaParts.push(`${streak} day streak`);

  const top = document.createElement("div");
  top.className = "tracker-top";

  const titleRow = document.createElement("div");
  titleRow.className = "tracker-title-row";

  const dot = document.createElement("span");
  dot.className = `dot color-${t.color || "violet"}`;

  const titleWrap = document.createElement("div");
  const h3 = document.createElement("h3");
  h3.textContent = t.name;
  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = metaParts.join(" • ") || t.type;
  titleWrap.append(h3, meta);
  titleRow.append(dot, titleWrap);

  const menu = document.createElement("button");
  menu.className = "menu-btn";
  menu.textContent = "⋯";
  menu.title = "Tracker options";
  menu.addEventListener("click", () => trackerMenu(t.id));

  top.append(titleRow, menu);
  card.appendChild(top);

  if (t.type === "checklist") {
    card.appendChild(renderChecklist(t, entry));
  } else {
    const prog = document.createElement("div");
    prog.className = "progress";
    const bar = document.createElement("div");
    bar.className = "progress-bar";
    bar.style.width = `${pct}%`;
    prog.appendChild(bar);
    card.appendChild(prog);
  }

  const actions = document.createElement("div");
  actions.className = "tracker-actions";

  const label = document.createElement("span");
  label.className = "meta";
  label.textContent = displayValue(t, entry, pct);

  const group = document.createElement("div");
  group.className = "action-group";

  if (t.type === "habit" || t.type === "deadline") {
    const btn = document.createElement("button");
    btn.className = `complete-btn ${entry.done ? "done" : ""}`;
    btn.textContent = entry.done ? "Done ✓" : "Mark done";
    btn.addEventListener("click", () => {
      entry.done = !entry.done;
      render();
      toast(entry.done ? "Nice — marked done." : "Marked as incomplete.");
    });
    group.appendChild(btn);
  }

  if (t.type === "count") {
    const minus = document.createElement("button");
    minus.className = "small-btn";
    minus.textContent = "−";
    minus.addEventListener("click", () => {
      entry.value = Math.max(0, Number(entry.value || 0) - 1);
      render();
    });

    const plus = document.createElement("button");
    plus.className = "small-btn";
    plus.textContent = "+";
    plus.addEventListener("click", () => {
      entry.value = Number(entry.value || 0) + 1;
      render();
    });

    group.append(minus, plus);
  }

  actions.append(label, group);
  card.appendChild(actions);
  return card;
}

function renderChecklist(t, entry) {
  const wrapper = document.createElement("div");
  wrapper.className = "checklist";

  (t.items || []).forEach((item, index) => {
    const checked = !!entry.items?.[index];
    const row = document.createElement("label");
    row.className = `check-row ${checked ? "done" : ""}`;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = checked;
    input.addEventListener("change", () => {
      if (!entry.items) entry.items = t.items.map(() => false);
      entry.items[index] = input.checked;
      render();
    });

    const span = document.createElement("span");
    span.textContent = item;

    row.append(input, span);
    wrapper.appendChild(row);
  });

  return wrapper;
}

function displayValue(t, entry, pct) {
  if (t.type === "habit") return `${pct}% complete today`;
  if (t.type === "count") return `${entry.value || 0} / ${t.target}`;
  if (t.type === "checklist") {
    const done = (entry.items || []).filter(Boolean).length;
    return `${done} / ${(t.items || []).length} checked`;
  }
  if (t.type === "deadline") {
    if (entry.done) return "Completed";
    return `${daysUntil(t.deadline)} days left`;
  }
  return `${pct}%`;
}

function daysUntil(dateStr) {
  const target = new Date(`${dateStr}T00:00:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.ceil((target - today) / 86400000);
}

function formatShortDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" }).format(d);
}

function trackerMenu(id) {
  const t = state.trackers.find(x => x.id === id);
  if (!t) return;
  const action = prompt(
    `"${t.name}"\n\nType DELETE to delete, ARCHIVE to hide, or CANCEL.`,
    "CANCEL"
  );
  if (!action) return;
  const normalized = action.trim().toUpperCase();
  if (normalized === "DELETE") {
    state.trackers = state.trackers.filter(x => x.id !== id);
    render();
    toast("Tracker deleted.");
  } else if (normalized === "ARCHIVE") {
    t.archived = true;
    render();
    toast("Tracker archived.");
  }
}

function openModal() {
  ui.modalBackdrop.classList.remove("hidden");
  ui.nameInput.focus();
}
function closeModal() {
  ui.modalBackdrop.classList.add("hidden");
  ui.trackerForm.reset();
  ui.targetInput.value = "1";
  ui.deadlineWrap.classList.add("hidden");
  ui.targetWrap.classList.remove("hidden");
}

function syncTypeFields() {
  const type = ui.typeInput.value;
  ui.targetWrap.classList.toggle("hidden", type !== "count");
  ui.deadlineWrap.classList.toggle("hidden", type !== "deadline");
}

function createTracker(event) {
  event.preventDefault();
  const type = ui.typeInput.value;
  const tracker = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name: ui.nameInput.value.trim(),
    type,
    target: Number(ui.targetInput.value || 1),
    deadline: ui.deadlineInput.value || null,
    category: ui.categoryInput.value.trim(),
    color: ui.colorInput.value,
    createdAt: new Date().toISOString(),
    archived: false,
    history: {}
  };

  if (!tracker.name) return;
  if (type === "checklist") {
    const text = prompt("Enter checklist items separated by commas:", "Morning, Workout, Reading");
    tracker.items = (text || "").split(",").map(s => s.trim()).filter(Boolean).slice(0, 20);
    if (!tracker.items.length) {
      tracker.items = ["First item", "Second item"];
    }
  }

  state.trackers.unshift(tracker);
  saveState();
  closeModal();
  render();
  toast("Tracker created.");
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `my-tracker-backup-${dateKey()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast("Backup exported.");
}

async function importData(file) {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!parsed || !Array.isArray(parsed.trackers)) throw new Error("Invalid backup");
    state = parsed;
    saveState();
    render();
    toast("Backup imported.");
  } catch {
    toast("That file is not a valid tracker backup.");
  }
}

function toast(message) {
  ui.toast.textContent = message;
  ui.toast.classList.remove("hidden");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => ui.toast.classList.add("hidden"), 1800);
}

$("addBtn").addEventListener("click", openModal);
$("addTopBtn").addEventListener("click", openModal);
$("emptyAddBtn").addEventListener("click", openModal);
$("closeModalBtn").addEventListener("click", closeModal);
$("cancelBtn").addEventListener("click", closeModal);
ui.typeInput.addEventListener("change", syncTypeFields);
ui.trackerForm.addEventListener("submit", createTracker);
$("exportBtn").addEventListener("click", exportData);
$("importInput").addEventListener("change", e => {
  const file = e.target.files?.[0];
  if (file) importData(file);
  e.target.value = "";
});
ui.modalBackdrop.addEventListener("click", e => {
  if (e.target === ui.modalBackdrop) closeModal();
});

window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredInstallPrompt = e;
  ui.installBtn.classList.remove("hidden");
});
ui.installBtn.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  ui.installBtn.classList.add("hidden");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}

render();
