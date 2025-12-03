// src/utils/date-utils.ts

export function getLastMonthRange(now: Date = new Date()): {
    from: Date;
    to: Date;
    year: number;
    month: number;
  } {
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-11, current month
  
    const lastMonthIndex = month - 1;
    const lastMonthDate =
      lastMonthIndex >= 0
        ? new Date(year, lastMonthIndex, 1)
        : new Date(year - 1, 11, 1);
  
    const from = lastMonthDate;
    const to = new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth() + 1, 1);
  
    return {
      from,
      to,
      year: lastMonthDate.getFullYear(),
      month: lastMonthDate.getMonth() + 1, // 1-12
    };
  }