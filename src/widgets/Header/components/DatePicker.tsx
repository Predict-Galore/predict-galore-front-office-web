/**
 * Date Picker Component
 * Green-outlined pill button with clean white calendar dropdown
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CalendarToday, KeyboardArrowUp, KeyboardArrowDown, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useTheme, useMediaQuery } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { cn } from '@/shared/lib/utils';

interface DatePickerComponentProps {
  onDateChange?: (date: Date) => void;
  value?: Date;
  date?: Date;
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({ onDateChange, value, date }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs(value || date || new Date()));
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(selectedDate);
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const formatDate = (d: Dayjs): string => d.format('MM/DD/YYYY');

  const getCalendarDays = (): (Dayjs | null)[] => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const startDay = startOfMonth.day();
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

    const days: (Dayjs | null)[] = [];

    for (let i = adjustedStartDay - 1; i >= 0; i--) {
      days.push(startOfMonth.subtract(i + 1, 'day'));
    }

    for (let i = 0; i < endOfMonth.date(); i++) {
      days.push(startOfMonth.add(i, 'day'));
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(endOfMonth.add(i, 'day'));
    }

    return days;
  };

  const handleDateSelect = useCallback(
    (d: Dayjs) => {
      setSelectedDate(d);
      setCurrentMonth(d);
      setIsOpen(false);
      onDateChange?.(d.toDate());
    },
    [onDateChange]
  );

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth((prev) => prev.subtract(1, 'month'));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prev) => prev.add(1, 'month'));
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        calendarRef.current &&
        buttonRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const calendarDays = getCalendarDays();

  const isCurrentMonth = (day: Dayjs | null): boolean =>
    day ? day.month() === currentMonth.month() : false;

  const isSelected = (day: Dayjs | null): boolean =>
    day ? day.isSame(selectedDate, 'day') : false;

  const isToday = (day: Dayjs | null): boolean =>
    day ? day.isSame(dayjs(), 'day') : false;

  return (
    <div className="relative">
      {/* Green-outlined pill button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 rounded-full',
          'bg-white border border-green-500',
          'hover:bg-green-50 transition-colors',
          'font-medium text-sm text-gray-900',
          'whitespace-nowrap'
        )}
        aria-label="Select date"
      >
        <CalendarToday sx={{ fontSize: 16, color: 'success.main' }} />
        <span>{formatDate(selectedDate)}</span>
        {isOpen ? (
          <KeyboardArrowUp sx={{ fontSize: 18, color: 'text.secondary' }} />
        ) : (
          <KeyboardArrowDown sx={{ fontSize: 18, color: 'text.secondary' }} />
        )}
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div
          ref={calendarRef}
          className={cn(
            'top-full mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200',
            isMobile
              ? 'fixed left-4 right-4 top-[72px] w-auto'
              : 'absolute right-0'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Clean white card */}
          <div
            className={cn(
              'bg-white rounded-xl shadow-lg border border-gray-200 p-5',
              isMobile ? 'w-full' : 'min-w-[320px]'
            )}
          >
            {/* Month / Year header with arrows */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">
                {MONTHS[currentMonth.month()]} {currentMonth.year()}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft sx={{ fontSize: 20, color: 'text.secondary' }} />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight sx={{ fontSize: 20, color: 'text.secondary' }} />
                </button>
              </div>
            </div>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-gray-500 py-1.5"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                if (!day) return <div key={index} />;

                const isCurrent = isCurrentMonth(day);
                const isSelectedDate = isSelected(day);
                const isTodayDate = isToday(day);

                return (
                  <button
                    key={day.format('YYYY-MM-DD')}
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    className={cn(
                      'relative flex items-center justify-center',
                      'w-full aspect-square text-sm font-medium transition-all',
                      'rounded-full',
                      'hover:bg-gray-100',
                      // Not current month
                      !isCurrent && 'text-gray-300',
                      // Current month, not selected
                      isCurrent && !isSelectedDate && 'text-gray-900',
                      // Selected
                      isSelectedDate &&
                        'bg-green-500 text-white hover:bg-green-600 font-bold',
                      // Today (not selected)
                      !isSelectedDate && isTodayDate && isCurrent &&
                        'ring-2 ring-green-500 ring-offset-1'
                    )}
                  >
                    {day.date()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePickerComponent;
