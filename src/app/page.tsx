 "use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

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
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>Calendar</h1>
            <p className={styles.subtitle}>
              Browse months, see today at a glance, and get a clean overview of your week.
            </p>
          </div>
          <div className={styles.nav}>
            <button
              type="button"
              aria-label="Previous month"
              className={styles.navButton}
              onClick={goToPreviousMonth}
            >
              ‹
            </button>
            <div className={styles.monthLabel}>{monthLabel}</div>
            <button
              type="button"
              aria-label="Next month"
              className={styles.navButton}
              onClick={goToNextMonth}
            >
              ›
            </button>
            <button
              type="button"
              className={`${styles.navButton} ${styles.todayButton}`}
              onClick={goToToday}
            >
              Today
            </button>
          </div>
        </header>

        <section className={styles.calendar} aria-label="Monthly calendar">
          <div className={styles.weekdays}>
            {WEEKDAYS.map((day) => (
              <div key={day} className={styles.weekday}>
                {day}
              </div>
            ))}
          </div>
          <div className={styles.days}>
            {calendarCells.map((cell) => {
              const dayNumber = cell.date.getDate();
              const dayClassNames = [
                styles.dayNumber,
                !cell.isCurrentMonth ? styles.outside : "",
                cell.isToday ? styles.todayNumber : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  key={cell.key}
                  className={styles.dayCell}
                  aria-label={cell.date.toDateString()}
                >
                  {cell.isToday && (
                    <span className={styles.todayBadge} aria-hidden="true" />
                  )}
                  <span className={dayClassNames}>{dayNumber}</span>
                  {/* Simple example “events” marker for weekends */}
                  {cell.date.getDay() === 0 || cell.date.getDay() === 6 ? (
                    <span className={styles.eventDot} aria-hidden="true" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={styles.legendToday} />
              <span className={styles.legendLabel}>Today</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDot} />
              <span className={styles.legendLabel}>Weekend</span>
            </div>
          </div>
          <div className={styles.timezone}>
            Times shown in <strong>{timezoneLabel}</strong>
          </div>
        </footer>
      </main>
    </div>
  );
}
