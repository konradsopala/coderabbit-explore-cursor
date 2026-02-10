import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './page';
import styles from './page.module.css';

// Mock Date to have consistent test results
const MOCK_DATE = new Date('2024-02-15T12:00:00Z');

describe('Home Component - CSS Module Integration', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MOCK_DATE);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('CSS Class Applications', () => {
    it('should apply page class to root container', () => {
      const { container } = render(<Home />);
      const pageDiv = container.firstChild as HTMLElement;
      expect(pageDiv).toHaveClass(styles.page);
    });

    it('should apply main class to main element', () => {
      render(<Home />);
      const main = screen.getByRole('main');
      expect(main).toHaveClass(styles.main);
    });

    it('should apply header class to header element', () => {
      render(<Home />);
      const header = screen.getByRole('banner');
      expect(header).toHaveClass(styles.header);
    });

    it('should apply title class to heading', () => {
      render(<Home />);
      const heading = screen.getByRole('heading', { name: /calendar/i });
      expect(heading).toHaveClass(styles.title);
    });

    it('should apply subtitle class to subtitle paragraph', () => {
      render(<Home />);
      const subtitle = screen.getByText(/browse months, see today/i);
      expect(subtitle).toHaveClass(styles.subtitle);
    });

    it('should apply nav class to navigation container', () => {
      render(<Home />);
      const header = screen.getByRole('banner');
      const navDiv = header.querySelector(`.${styles.nav}`);
      expect(navDiv).toBeInTheDocument();
      expect(navDiv).toHaveClass(styles.nav);
    });

    it('should apply navButton class to navigation buttons', () => {
      render(<Home />);
      const prevButton = screen.getByRole('button', { name: /previous month/i });
      const nextButton = screen.getByRole('button', { name: /next month/i });

      expect(prevButton).toHaveClass(styles.navButton);
      expect(nextButton).toHaveClass(styles.navButton);
    });

    it('should apply todayButton class in addition to navButton for Today button', () => {
      render(<Home />);
      const todayButton = screen.getByRole('button', { name: /today/i });

      expect(todayButton).toHaveClass(styles.navButton);
      expect(todayButton).toHaveClass(styles.todayButton);
    });

    it('should apply monthLabel class to month display', () => {
      render(<Home />);
      const header = screen.getByRole('banner');
      const monthLabel = header.querySelector(`.${styles.monthLabel}`);

      expect(monthLabel).toBeInTheDocument();
      expect(monthLabel).toHaveClass(styles.monthLabel);
    });
  });

  describe('Calendar Structure CSS Classes', () => {
    it('should apply calendar class to calendar section', () => {
      render(<Home />);
      const calendar = screen.getByRole('region', { name: /monthly calendar/i });
      expect(calendar).toHaveClass(styles.calendar);
    });

    it('should apply weekdays class to weekdays container', () => {
      render(<Home />);
      const calendar = screen.getByRole('region', { name: /monthly calendar/i });
      const weekdaysContainer = calendar.querySelector(`.${styles.weekdays}`);

      expect(weekdaysContainer).toBeInTheDocument();
      expect(weekdaysContainer).toHaveClass(styles.weekdays);
    });

    it('should apply weekday class to each weekday header', () => {
      render(<Home />);
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      weekdays.forEach(day => {
        const dayElement = screen.getByText(day);
        expect(dayElement).toHaveClass(styles.weekday);
      });
    });

    it('should apply days class to days container', () => {
      render(<Home />);
      const calendar = screen.getByRole('region', { name: /monthly calendar/i });
      const daysContainer = calendar.querySelector(`.${styles.days}`);

      expect(daysContainer).toBeInTheDocument();
      expect(daysContainer).toHaveClass(styles.days);
    });

    it('should apply dayCell class to all day cells', () => {
      render(<Home />);
      const calendar = screen.getByRole('region', { name: /monthly calendar/i });
      const dayCells = calendar.querySelectorAll(`.${styles.dayCell}`);

      // Should have 42 cells (6 weeks * 7 days)
      expect(dayCells).toHaveLength(42);
      dayCells.forEach(cell => {
        expect(cell).toHaveClass(styles.dayCell);
      });
    });
  });

  describe('Conditional CSS Classes', () => {
    it('should apply dayNumber class to day numbers', () => {
      render(<Home />);
      const calendar = screen.getByRole('region', { name: /monthly calendar/i });
      const dayNumbers = calendar.querySelectorAll(`.${styles.dayNumber}`);

      expect(dayNumbers.length).toBeGreaterThan(0);
      dayNumbers.forEach(num => {
        expect(num).toHaveClass(styles.dayNumber);
      });
    });

    it('should apply outside class to days from previous/next month', () => {
      render(<Home />);
      const calendar = screen.getByRole('region', { name: /monthly calendar/i });
      const outsideDays = calendar.querySelectorAll(`.${styles.outside}`);

      // February 2024 starts on Thursday, so we should have some outside days
      expect(outsideDays.length).toBeGreaterThan(0);
      outsideDays.forEach(day => {
        expect(day).toHaveClass(styles.outside);
      });
    });

    it('should apply todayNumber and todayBadge classes to current day', () => {
      render(<Home />);
      const calendar = screen.getByRole('region', { name: /monthly calendar/i });

      // Find today's badge
      const todayBadge = calendar.querySelector(`.${styles.todayBadge}`);
      expect(todayBadge).toBeInTheDocument();

      // Find today's number
      const todayNumber = calendar.querySelector(`.${styles.todayNumber}`);
      expect(todayNumber).toBeInTheDocument();
      expect(todayNumber).toHaveClass(styles.todayNumber);
    });

    it('should apply eventDot class to weekend days', () => {
      render(<Home />);
      const calendar = screen.getByRole('region', { name: /monthly calendar/i });
      const eventDots = calendar.querySelectorAll(`.${styles.eventDot}`);

      // Should have event dots on weekends (8-9 dots for ~4 weeks)
      expect(eventDots.length).toBeGreaterThan(0);
      eventDots.forEach(dot => {
        expect(dot).toHaveClass(styles.eventDot);
      });
    });
  });

  describe('Footer CSS Classes', () => {
    it('should apply footer class to footer element', () => {
      render(<Home />);
      const main = screen.getByRole('main');
      const footer = main.querySelector(`.${styles.footer}`);

      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(styles.footer);
    });

    it('should apply legend class to legend container', () => {
      render(<Home />);
      const main = screen.getByRole('main');
      const legend = main.querySelector(`.${styles.legend}`);

      expect(legend).toBeInTheDocument();
      expect(legend).toHaveClass(styles.legend);
    });

    it('should apply legendItem class to legend items', () => {
      render(<Home />);
      const main = screen.getByRole('main');
      const legendItems = main.querySelectorAll(`.${styles.legendItem}`);

      expect(legendItems.length).toBe(2); // Today and Weekend
      legendItems.forEach(item => {
        expect(item).toHaveClass(styles.legendItem);
      });
    });

    it('should apply legendToday class to today indicator', () => {
      render(<Home />);
      const main = screen.getByRole('main');
      const legendToday = main.querySelector(`.${styles.legendToday}`);

      expect(legendToday).toBeInTheDocument();
      expect(legendToday).toHaveClass(styles.legendToday);
    });

    it('should apply legendDot class to event indicator', () => {
      render(<Home />);
      const main = screen.getByRole('main');
      const legendDot = main.querySelector(`.${styles.legendDot}`);

      expect(legendDot).toBeInTheDocument();
      expect(legendDot).toHaveClass(styles.legendDot);
    });

    it('should apply legendLabel class to legend labels', () => {
      render(<Home />);
      const main = screen.getByRole('main');
      const legend = main.querySelector(`.${styles.legend}`);

      // Use within to scope to legend container
      const todayLabel = within(legend as HTMLElement).getByText('Today');
      const weekendLabel = within(legend as HTMLElement).getByText('Weekend');

      expect(todayLabel).toHaveClass(styles.legendLabel);
      expect(weekendLabel).toHaveClass(styles.legendLabel);
    });

    it('should apply timezone class to timezone text', () => {
      render(<Home />);
      const main = screen.getByRole('main');
      const timezone = main.querySelector(`.${styles.timezone}`);

      expect(timezone).toBeInTheDocument();
      expect(timezone).toHaveClass(styles.timezone);
    });
  });

  describe('Dynamic CSS Class Changes', () => {
    it('should maintain proper classes when navigating to previous month', () => {
      render(<Home />);
      const prevButton = screen.getByRole('button', { name: /previous month/i });

      fireEvent.click(prevButton);

      // Calendar structure should still have proper classes
      const calendar = screen.getByRole('region', { name: /monthly calendar/i });
      expect(calendar).toHaveClass(styles.calendar);

      const dayCells = calendar.querySelectorAll(`.${styles.dayCell}`);
      expect(dayCells).toHaveLength(42);
    });

    it('should maintain proper classes when navigating to next month', () => {
      render(<Home />);
      const nextButton = screen.getByRole('button', { name: /next month/i });

      fireEvent.click(nextButton);

      // Calendar structure should still have proper classes
      const calendar = screen.getByRole('region', { name: /monthly calendar/i });
      expect(calendar).toHaveClass(styles.calendar);

      const weekdays = calendar.querySelectorAll(`.${styles.weekday}`);
      expect(weekdays).toHaveLength(7);
    });

    it('should update today highlighting when returning to current month', () => {
      render(<Home />);

      // Navigate away
      const nextButton = screen.getByRole('button', { name: /next month/i });
      fireEvent.click(nextButton);

      // Navigate back
      const todayButton = screen.getByRole('button', { name: /today/i });
      fireEvent.click(todayButton);

      // Today should be highlighted
      const calendar = screen.getByRole('region', { name: /monthly calendar/i });
      const todayBadge = calendar.querySelector(`.${styles.todayBadge}`);
      expect(todayBadge).toBeInTheDocument();
    });
  });

  describe('CSS Module Exports', () => {
    it('should export all expected CSS class names', () => {
      const expectedClasses = [
        'page',
        'main',
        'header',
        'titleGroup',
        'title',
        'subtitle',
        'nav',
        'navButton',
        'todayButton',
        'monthLabel',
        'calendar',
        'weekdays',
        'days',
        'weekday',
        'dayCell',
        'dayNumber',
        'outside',
        'today',
        'todayBadge',
        'todayNumber',
        'eventDot',
        'footer',
        'legend',
        'legendItem',
        'legendDot',
        'legendLabel',
        'legendToday',
        'timezone',
      ];

      expectedClasses.forEach(className => {
        expect(styles).toHaveProperty(className);
        expect(typeof styles[className]).toBe('string');
        expect(styles[className].length).toBeGreaterThan(0);
      });
    });

    it('should have unique CSS class name hashes', () => {
      const classValues = Object.values(styles);
      const uniqueValues = new Set(classValues);

      // All class names should be unique (no duplicates)
      expect(uniqueValues.size).toBe(classValues.length);
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should properly handle year boundary (December to January)', () => {
      jest.setSystemTime(new Date('2024-12-31T12:00:00Z'));

      render(<Home />);
      const nextButton = screen.getByRole('button', { name: /next month/i });
      fireEvent.click(nextButton);

      // Should now be January 2025
      const monthLabel = screen.getByText(/january 2025/i);
      expect(monthLabel).toBeInTheDocument();
      expect(monthLabel).toHaveClass(styles.monthLabel);
    });

    it('should properly handle year boundary (January to December)', () => {
      jest.setSystemTime(new Date('2024-01-01T12:00:00Z'));

      render(<Home />);
      const prevButton = screen.getByRole('button', { name: /previous month/i });
      fireEvent.click(prevButton);

      // Should now be December 2023
      const monthLabel = screen.getByText(/december 2023/i);
      expect(monthLabel).toBeInTheDocument();
      expect(monthLabel).toHaveClass(styles.monthLabel);
    });

    it('should always render exactly 42 day cells', () => {
      render(<Home />);

      // Test multiple months
      const nextButton = screen.getByRole('button', { name: /next month/i });

      for (let i = 0; i < 12; i++) {
        const calendar = screen.getByRole('region', { name: /monthly calendar/i });
        const dayCells = calendar.querySelectorAll(`.${styles.dayCell}`);
        expect(dayCells).toHaveLength(42);

        fireEvent.click(nextButton);
      }
    });

    it('should correctly apply outside class for months starting on Sunday', () => {
      // September 2024 starts on Sunday
      jest.setSystemTime(new Date('2024-09-01T12:00:00Z'));

      render(<Home />);
      const calendar = screen.getByRole('region', { name: /monthly calendar/i });
      const dayCells = calendar.querySelectorAll(`.${styles.dayCell}`);

      // First cell should be day 1 (not outside)
      const firstDayNumber = dayCells[0].querySelector(`.${styles.dayNumber}`);
      expect(firstDayNumber).not.toHaveClass(styles.outside);
    });

    it('should correctly apply outside class for months starting on Saturday', () => {
      // June 2024 starts on Saturday
      jest.setSystemTime(new Date('2024-06-01T12:00:00Z'));

      render(<Home />);
      const calendar = screen.getByRole('region', { name: /monthly calendar/i });
      const dayCells = calendar.querySelectorAll(`.${styles.dayCell}`);

      // First 6 cells should be from previous month (outside)
      for (let i = 0; i < 6; i++) {
        const dayNumber = dayCells[i].querySelector(`.${styles.dayNumber}`);
        expect(dayNumber).toHaveClass(styles.outside);
      }
    });
  });

  describe('Accessibility and Semantic Structure', () => {
    it('should apply classes to elements with proper ARIA labels', () => {
      render(<Home />);

      const calendar = screen.getByRole('region', { name: /monthly calendar/i });
      expect(calendar).toHaveClass(styles.calendar);

      const prevButton = screen.getByRole('button', { name: /previous month/i });
      expect(prevButton).toHaveClass(styles.navButton);

      const nextButton = screen.getByRole('button', { name: /next month/i });
      expect(nextButton).toHaveClass(styles.navButton);
    });

    it('should maintain proper class structure after multiple interactions', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Home />);

      // Perform multiple navigation actions
      const prevButton = screen.getByRole('button', { name: /previous month/i });
      const nextButton = screen.getByRole('button', { name: /next month/i });
      const todayButton = screen.getByRole('button', { name: /today/i });

      await user.click(nextButton);
      await user.click(nextButton);
      await user.click(prevButton);
      await user.click(todayButton);

      // Verify all classes are still properly applied
      expect(screen.getByRole('main')).toHaveClass(styles.main);
      expect(screen.getByRole('banner')).toHaveClass(styles.header);

      const calendar = screen.getByRole('region', { name: /monthly calendar/i });
      expect(calendar).toHaveClass(styles.calendar);
    });
  });

  describe('CSS Variables and Theming', () => {
    it('should render component structure that supports CSS variable theming', () => {
      const { container } = render(<Home />);
      const pageDiv = container.firstChild as HTMLElement;

      // Page container should have the class that defines CSS variables
      expect(pageDiv).toHaveClass(styles.page);

      // Verify computed styles would use variables (if CSS is loaded)
      expect(pageDiv).toBeInTheDocument();
    });
  });

  describe('Regression Tests', () => {
    it('should not apply today classes when viewing a different month', () => {
      jest.setSystemTime(new Date('2024-02-15T12:00:00Z'));
      render(<Home />);

      // Navigate to next month
      const nextButton = screen.getByRole('button', { name: /next month/i });
      fireEvent.click(nextButton);

      // Should not have today badge in March 2024
      const calendar = screen.getByRole('region', { name: /monthly calendar/i });
      const todayBadge = calendar.querySelector(`.${styles.todayBadge}`);
      expect(todayBadge).not.toBeInTheDocument();
    });

    it('should preserve weekend event dots across month navigation', () => {
      render(<Home />);

      const calendar = screen.getByRole('region', { name: /monthly calendar/i });
      let eventDots = calendar.querySelectorAll(`.${styles.eventDot}`);
      const initialCount = eventDots.length;

      expect(initialCount).toBeGreaterThan(0);

      // Navigate to next month
      const nextButton = screen.getByRole('button', { name: /next month/i });
      fireEvent.click(nextButton);

      // Should still have event dots on weekends
      eventDots = calendar.querySelectorAll(`.${styles.eventDot}`);
      expect(eventDots.length).toBeGreaterThan(0);
    });
  });
});