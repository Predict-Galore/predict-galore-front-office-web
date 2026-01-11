/**
 * Date Picker Component
 * Matches Figma UI design - Green pill button with calendar popup
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CalendarToday, KeyboardArrowDown, ChevronLeft, ChevronRight } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { cn } from '@/shared/lib/utils';

interface DatePickerComponentProps {
  onDateChange?: (date: Date) => void;
  value?: Date;
  date?: Date; // Alias for value for backward compatibility
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs(value || date || new Date()));
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(selectedDate);
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Format date as DD/MM/YYYY
  const formatDate = (date: Dayjs): string => {
    return date.format('DD/MM/YYYY');
  };

  // Get calendar days for current month view
  const getCalendarDays = (): (Dayjs | null)[] => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const startDay = startOfMonth.day(); // 0 = Sunday, 1 = Monday, etc.
    // Adjust to Monday = 0
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

    const days: (Dayjs | null)[] = [];

    // Add previous month days
    for (let i = adjustedStartDay - 1; i >= 0; i--) {
      days.push(startOfMonth.subtract(i + 1, 'day'));
    }

    // Add current month days
    for (let i = 0; i < endOfMonth.date(); i++) {
      days.push(startOfMonth.add(i, 'day'));
    }

    // Add next month days to fill 6 weeks (42 days)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(endOfMonth.add(i, 'day'));
    }

    return days;
  };

  const handleDateSelect = useCallback(
    (date: Dayjs) => {
      setSelectedDate(date);
      setCurrentMonth(date);
      setIsOpen(false);

      if (onDateChange) {
        onDateChange(date.toDate());
      }
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
  const isCurrentMonth = (day: Dayjs | null): boolean => {
    return day ? day.month() === currentMonth.month() : false;
  };
  const isSelected = (day: Dayjs | null): boolean => {
    return day ? day.isSame(selectedDate, 'day') : false;
  };
  const isToday = (day: Dayjs | null): boolean => {
    return day ? day.isSame(dayjs(), 'day') : false;
  };

  return (
    <div className="relative">
      {/* Green Pill Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-full',
          'bg-gray-100 text-gray-900',
          'border border-gray-200',
          'hover:bg-gray-200 transition-colors',
          'font-medium text-sm',
          'shadow-sm'
        )}
        aria-label="Select date"
      >
        <CalendarToday className="w-4 h-4 text-gray-600" />
        <span>{formatDate(selectedDate)}</span>
        <KeyboardArrowDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {/* Calendar Popup */}
      {isOpen && (
        <div
          ref={calendarRef}
          className="absolute top-full right-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Light grey frame with subtle green border */}
          <div
            className={cn(
              'bg-gray-100 rounded-lg border border-green-500/30',
              'p-2',
              'min-w-[320px]',
              'shadow-lg'
            )}
          >
            {/* White inner card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {MONTHS[currentMonth.month()]} {currentMonth.year()}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                    aria-label="Next month"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
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
                        'aspect-square rounded text-sm font-medium transition-all',
                        'flex items-center justify-center',
                        'hover:bg-gray-100',
                        !isCurrent && 'text-gray-400',
                        isCurrent && !isSelectedDate && 'text-gray-900',
                        isSelectedDate &&
                          'bg-green-500 text-white hover:bg-green-600 font-semibold',
                        !isSelectedDate &&
                          isTodayDate &&
                          isCurrent &&
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
        </div>
      )}
    </div>
  );
};

export default DatePickerComponent;
