const SHANGHAI_OFFSET_MINUTES = 8 * 60;

function pad(input: number) {
  return String(input).padStart(2, "0");
}

function toShanghaiDateParts(date = new Date()) {
  const utcMillis = date.getTime() + date.getTimezoneOffset() * 60_000;
  const shanghai = new Date(utcMillis + SHANGHAI_OFFSET_MINUTES * 60_000);
  return {
    year: shanghai.getUTCFullYear(),
    month: shanghai.getUTCMonth() + 1,
    day: shanghai.getUTCDate(),
    dayOfWeek: shanghai.getUTCDay(),
    hour: shanghai.getUTCHours(),
    minute: shanghai.getUTCMinutes(),
    second: shanghai.getUTCSeconds(),
  };
}

export function todayInShanghai() {
  const { day, month, year } = toShanghaiDateParts();
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function startOfWeek(dateString: string) {
  const base = new Date(`${dateString}T00:00:00+08:00`);
  const day = base.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  base.setDate(base.getDate() + offset);
  return `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())}`;
}

export function datesForRecentDays(totalDays: number, endDate = todayInShanghai()) {
  const days: string[] = [];
  const base = new Date(`${endDate}T00:00:00+08:00`);
  for (let index = totalDays - 1; index >= 0; index -= 1) {
    const current = new Date(base);
    current.setDate(base.getDate() - index);
    days.push(`${current.getFullYear()}-${pad(current.getMonth() + 1)}-${pad(current.getDate())}`);
  }
  return days;
}

export function monthKeysForRecentMonths(totalMonths: number) {
  const parts = toShanghaiDateParts();
  const months: string[] = [];
  for (let index = totalMonths - 1; index >= 0; index -= 1) {
    const date = new Date(Date.UTC(parts.year, parts.month - 1 - index, 1));
    months.push(pad(date.getUTCMonth() + 1));
  }
  return months;
}
