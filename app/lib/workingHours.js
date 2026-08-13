export const DAYS = [
  {
    key: "mon",
    labelPl: "Poniedziałek",
    labelEn: "Monday",
    shortPl: "Pon",
    shortEn: "Mon",
  },
  {
    key: "tue",
    labelPl: "Wtorek",
    labelEn: "Tuesday",
    shortPl: "Wt",
    shortEn: "Tue",
  },
  {
    key: "wed",
    labelPl: "Środa",
    labelEn: "Wednesday",
    shortPl: "Śr",
    shortEn: "Wed",
  },
  {
    key: "thu",
    labelPl: "Czwartek",
    labelEn: "Thursday",
    shortPl: "Czw",
    shortEn: "Thu",
  },
  {
    key: "fri",
    labelPl: "Piątek",
    labelEn: "Friday",
    shortPl: "Pt",
    shortEn: "Fri",
  },
  {
    key: "sat",
    labelPl: "Sobota",
    labelEn: "Saturday",
    shortPl: "Sob",
    shortEn: "Sat",
  },
  {
    key: "sun",
    labelPl: "Niedziela",
    labelEn: "Sunday",
    shortPl: "Ndz",
    shortEn: "Sun",
  },
];

export const defaultHours = () =>
  DAYS.reduce((acc, day) => {
    acc[day.key] = { open: "08:00", close: "22:00", closed: false };
    return acc;
  }, {});

export function parseHoursFromContacts(cmsContacts) {
  const entry = cmsContacts?.find((c) => c.type === "HOURS");
  if (!entry) return null;
  try {
    return { ...defaultHours(), ...JSON.parse(entry.value) };
  } catch (e) {
    console.error("Failed to parse working hours JSON:", e);
    return null;
  }
}

export function formatCompactHours(hours, lang) {
  if (!hours) return null;

  const segments = [];
  let i = 0;

  while (i < DAYS.length) {
    const start = i;
    const day = hours[DAYS[i].key];

    while (
      i + 1 < DAYS.length &&
      hours[DAYS[i + 1].key] &&
      hours[DAYS[i + 1].key].closed === day.closed &&
      hours[DAYS[i + 1].key].open === day.open &&
      hours[DAYS[i + 1].key].close === day.close
    ) {
      i++;
    }

    if (!day.closed) {
      const end = i;
      const startLabel =
        lang === "pl" ? DAYS[start].shortPl : DAYS[start].shortEn;
      const endLabel = lang === "pl" ? DAYS[end].shortPl : DAYS[end].shortEn;
      const rangeLabel =
        start === end ? startLabel : `${startLabel}-${endLabel}`;
      segments.push(`${rangeLabel}: ${day.open}-${day.close}`);
    }

    i++;
  }

  if (segments.length === 0) {
    return lang === "pl" ? "Zamknięte" : "Closed";
  }

  return segments.join(", ");
}
export function formatPrimaryHours(hours, lang) {
  if (!hours) return null;

  const openDays = DAYS.filter((d) => hours[d.key] && !hours[d.key].closed);
  if (openDays.length === 0) {
    return lang === "pl" ? "Zamknięte" : "Closed";
  }

  // Count how many days share each open/close combination
  const counts = {};
  openDays.forEach((d) => {
    const key = `${hours[d.key].open}-${hours[d.key].close}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  const topKey = Object.keys(counts).reduce((a, b) =>
    counts[b] > counts[a] ? b : a,
  );
  const [open, close] =
    topKey.split("-").length === 2 ? topKey.split("-") : [topKey, ""];

  const matchingDays = openDays.filter(
    (d) => `${hours[d.key].open}-${hours[d.key].close}` === topKey,
  );

  const first = matchingDays[0];
  const last = matchingDays[matchingDays.length - 1];
  const startLabel = lang === "pl" ? first.shortPl : first.shortEn;
  const endLabel = lang === "pl" ? last.shortPl : last.shortEn;
  const rangeLabel = first === last ? startLabel : `${startLabel}-${endLabel}`;

  return `${rangeLabel}: ${open}-${close}`;
}
// Converts a saved per-day hours object into a list of range "rules"
// for the rule-based editor UI, e.g. Mon-Thu identical -> one rule
// { startIdx: 0, endIdx: 3, open, close, closed }.
export function hoursToSingleRange(hours) {
  const info = DAYS.map(
    (d) => hours[d.key] || { open: "08:00", close: "22:00", closed: true },
  );

  // Find a boundary where the signature changes, so we can walk the
  // week linearly instead of worrying about wraparound during grouping.
  let startBoundary = 0;
  for (let i = 0; i < 7; i++) {
    const prev = info[(i + 6) % 7];
    if (
      prev.closed !== info[i].closed ||
      prev.open !== info[i].open ||
      prev.close !== info[i].close
    ) {
      startBoundary = i;
      break;
    }
  }

  const blocks = [];
  let i = 0;
  while (i < 7) {
    const idx = (startBoundary + i) % 7;
    const sig = info[idx];
    let count = 1;
    while (i + count < 7) {
      const nextIdx = (startBoundary + i + count) % 7;
      const next = info[nextIdx];
      if (
        next.closed === sig.closed &&
        next.open === sig.open &&
        next.close === sig.close
      ) {
        count++;
      } else break;
    }
    const endIdxAbs = (startBoundary + i + count - 1) % 7;
    blocks.push({
      startIdx: idx,
      endIdx: endIdxAbs,
      open: sig.open,
      close: sig.close,
      closed: sig.closed,
      length: count,
    });
    i += count;
  }

  const openBlocks = blocks.filter((b) => !b.closed);
  if (openBlocks.length === 0) {
    return {
      startIdx: 0,
      endIdx: 6,
      open: "08:00",
      close: "22:00",
      closed: true,
    };
  }

  const best = openBlocks.reduce((a, b) => (b.length > a.length ? b : a));
  return {
    startIdx: best.startIdx,
    endIdx: best.endIdx,
    open: best.open,
    close: best.close,
    closed: false,
  };
}

// Expands a single rule (with wraparound support) back into the full
// per-day hours object. Days outside the rule's range default to closed.
export function singleRangeToHours(range) {
  const hours = DAYS.reduce((acc, d) => {
    acc[d.key] = { open: "08:00", close: "22:00", closed: true };
    return acc;
  }, {});

  if (range.closed) return hours;

  let idx = range.startIdx;
  while (true) {
    hours[DAYS[idx].key] = {
      open: range.open,
      close: range.close,
      closed: false,
    };
    if (idx === range.endIdx) break;
    idx = (idx + 1) % 7;
  }

  return hours;
}
