 "use client";

import { useMemo, useState } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

type CalendarCell = {
  key: string;
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
};

function buildCalendar(year: number, month: number): CalendarCell[] {
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay(); // 0 (Sun) – 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const totalCells = 42; // 6 weeks * 7 days
  const cells: CalendarCell[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let index = 0; index < totalCells; index += 1) {
    let dayNumber: number;
    let cellMonth = month;
    let cellYear = year;
    let isCurrentMonth = true;

    if (index < startWeekday) {
      // days from previous month
      isCurrentMonth = false;
      dayNumber = daysInPrevMonth - startWeekday + 1 + index;
      cellMonth = month - 1;
      if (cellMonth < 0) {
        cellMonth = 11;
        cellYear = year - 1;
      }
    } else if (index >= startWeekday + daysInMonth) {
      // days from next month
      isCurrentMonth = false;
      dayNumber = index - (startWeekday + daysInMonth) + 1;
      cellMonth = month + 1;
      if (cellMonth > 11) {
        cellMonth = 0;
        cellYear = year + 1;
      }
    } else {
      // current month
      dayNumber = index - startWeekday + 1;
    }

    const date = new Date(cellYear, cellMonth, dayNumber);
    date.setHours(0, 0, 0, 0);

    const isToday =
      date.getTime() === today.getTime() && isCurrentMonth;

    cells.push({
      key: `${cellYear}-${cellMonth}-${dayNumber}`,
      date,
      isCurrentMonth,
      isToday,
    });
  }

  return cells;
}

export default function Home() {
  const now = useMemo(() => new Date(), []);
  const [visibleYear, setVisibleYear] = useState(now.getFullYear());
  const [visibleMonth, setVisibleMonth] = useState(now.getMonth()); // 0-11

  const calendarCells = useMemo(
    () => buildCalendar(visibleYear, visibleMonth),
    [visibleYear, visibleMonth],
  );

  const monthFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        month: "long",
        year: "numeric",
      }),
    [],
  );

  const monthLabel = monthFormatter.format(
    new Date(visibleYear, visibleMonth, 1),
  );

  const timezoneLabel = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "Local time";
    }
  }, []);

  const goToPreviousMonth = () => {
    setVisibleMonth((currentMonth) => {
      if (currentMonth === 0) {
        setVisibleYear((year) => year - 1);
        return 11;
      }
      return currentMonth - 1;
    });
  };

  const goToNextMonth = () => {
    setVisibleMonth((currentMonth) => {
      if (currentMonth === 11) {
        setVisibleYear((year) => year + 1);
        return 0;
      }
      return currentMonth + 1;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setVisibleYear(today.getFullYear());
    setVisibleMonth(today.getMonth());
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-4 py-6">
      <main className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.16)] p-6 sm:p-8 space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              Calendar
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Browse months, see today at a glance, and get a clean overview of your week.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous month"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 text-lg shadow-sm transition hover:bg-slate-100 hover:-translate-y-px hover:shadow-md"
              onClick={goToPreviousMonth}
            >
              ‹
            </button>
            <div className="min-w-[8rem] text-center text-sm font-medium text-slate-900">
              {monthLabel}
            </div>
            <button
              type="button"
              aria-label="Next month"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 text-lg shadow-sm transition hover:bg-slate-100 hover:-translate-y-px hover:shadow-md"
              onClick={goToNextMonth}
            >
              ›
            </button>
            <button
              type="button"
              className="inline-flex h-9 px-3 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-medium text-slate-800 shadow-sm transition hover:bg-slate-100 hover:-translate-y-px hover:shadow-md"
              onClick={goToToday}
            >
              Today
            </button>
          </div>
        </header>

        <section
          className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden"
          aria-label="Monthly calendar"
        >
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-slate-500">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="px-2 py-2 text-center"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 bg-white">
            {calendarCells.map((cell) => {
              const dayNumber = cell.date.getDate();
              return (
                <div
                  key={cell.key}
                  className="relative min-h-[4.5rem] border-r border-b border-slate-100 px-2 py-1.5 last:border-r-0"
                  aria-label={cell.date.toDateString()}
                >
                  {cell.isToday && (
                    <span
                      className="pointer-events-none absolute inset-1 rounded-xl bg-yellow-200/70"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={[
                      "relative z-10 text-xs font-medium",
                      !cell.isCurrentMonth ? "text-slate-400" : "text-slate-900",
                      cell.isToday ? "text-slate-900" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {dayNumber}
                  </span>
                  {/* Simple example “events” marker for weekends */}
                  {cell.date.getDay() === 0 || cell.date.getDay() === 6 ? (
                    <span
                      className="absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-sky-500"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        <footer className="flex flex-col gap-3 pt-1 text-[0.75rem] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span>Today</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              <span>Weekend</span>
            </div>
          </div>
          <div className="text-[0.75rem] text-slate-500">
            Times shown in{" "}
            <strong className="font-medium text-slate-300">
              {timezoneLabel}
            </strong>
          </div>
        </footer>
      </main>
    </div>
  );
}
