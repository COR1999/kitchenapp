export interface WeekRange {
  start: Date;
  end: Date;
  label: string;
  value: string;
}

export class DateUtils {
  /**
   * Gets the start of the week (Monday) for a given date
   */
  static getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  }

  /**
   * Gets the end of the week (Sunday) for a given date
   */
  static getWeekEnd(date: Date): Date {
    const weekStart = this.getWeekStart(date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return weekEnd;
  }

  /**
   * Checks if a date falls within a specific week
   */
  static isDateInWeek(date: Date, weekStart: Date): boolean {
    const weekEnd = this.getWeekEnd(weekStart);
    return date >= weekStart && date <= weekEnd;
  }

  /**
   * Gets the current week range
   */
  static getCurrentWeek(): WeekRange {
    const now = new Date();
    const start = this.getWeekStart(now);
    const end = this.getWeekEnd(now);
    
    return {
      start,
      end,
      label: 'This Week',
      value: 'current'
    };
  }

  /**
   * Gets week ranges for filtering (current week + previous weeks)
   */
  static getWeekRanges(weeksCount: number = 8): WeekRange[] {
    const ranges: WeekRange[] = [];
    const now = new Date();
    
    // Add current week
    ranges.push(this.getCurrentWeek());
    
    // Add previous weeks
    for (let i = 1; i < weeksCount; i++) {
      const weekDate = new Date(now);
      weekDate.setDate(now.getDate() - (i * 7));
      
      const start = this.getWeekStart(weekDate);
      const end = this.getWeekEnd(weekDate);
      
      const isLastWeek = i === 1;
      const label = isLastWeek 
        ? 'Last Week' 
        : `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`;
      
      ranges.push({
        start,
        end,
        label,
        value: `week-${i}`
      });
    }
    
    return ranges;
  }

  /**
   * Formats a date range for display
   */
  static formatWeekRange(start: Date, end: Date): string {
    const startStr = start.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    const endStr = end.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    return `${startStr} - ${endStr}`;
  }

  /**
   * Gets a week range by its value identifier
   */
  static getWeekRangeByValue(value: string): WeekRange | null {
    if (value === 'current') {
      return this.getCurrentWeek();
    }
    
    if (value === 'all') {
      return null; // No filtering
    }
    
    const weekMatch = value.match(/^week-(\d+)$/);
    if (weekMatch) {
      const weeksAgo = parseInt(weekMatch[1]);
      const now = new Date();
      const weekDate = new Date(now);
      weekDate.setDate(now.getDate() - (weeksAgo * 7));
      
      const start = this.getWeekStart(weekDate);
      const end = this.getWeekEnd(weekDate);
      
      return {
        start,
        end,
        label: weeksAgo === 1 ? 'Last Week' : this.formatWeekRange(start, end),
        value
      };
    }
    
    return null;
  }

  /**
   * Checks if two dates are in the same week
   */
  static areDatesInSameWeek(date1: Date, date2: Date): boolean {
    const week1Start = this.getWeekStart(date1);
    return this.isDateInWeek(date2, week1Start);
  }
}