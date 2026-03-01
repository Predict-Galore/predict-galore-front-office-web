/**
 * Header Calendar Component
 * Displays current date and opens a lightweight month calendar.
 */

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarToday,
  ChevronLeft,
  ChevronRight,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { Box, IconButton, Popover, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { cn } from '@/shared/lib/utils';

interface DatePickerComponentProps {
  onDateChange?: (date: Date) => void;
  value?: Date;
  date?: Date;
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({ onDateChange, value, date }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs(value ?? date ?? new Date()));
  const [visibleMonth, setVisibleMonth] = useState<Dayjs>(dayjs(value ?? date ?? new Date()).startOf('month'));

  useEffect(() => {
    const nextDate = dayjs(value ?? date ?? new Date());
    setSelectedDate(nextDate);
    setVisibleMonth(nextDate.startOf('month'));
  }, [value, date]);

  const isOpen = Boolean(anchorEl);

  const calendarDays = useMemo(() => {
    const monthStart = visibleMonth.startOf('month');
    const mondayOffset = (monthStart.day() + 6) % 7;
    const firstVisibleDay = monthStart.subtract(mondayOffset, 'day');

    return Array.from({ length: 42 }, (_, index) => firstVisibleDay.add(index, 'day'));
  }, [visibleMonth]);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateSelect = (day: Dayjs) => {
    setSelectedDate(day);
    setVisibleMonth(day.startOf('month'));
    onDateChange?.(day.toDate());
    handleClose();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 rounded-full',
          'bg-white border border-green-500',
          'hover:bg-green-50 transition-colors',
          'font-medium text-sm text-gray-900',
          'whitespace-nowrap'
        )}
        aria-label="Open calendar"
      >
        <CalendarToday sx={{ fontSize: 16, color: 'success.main' }} />
        <span>{selectedDate.format('MM/DD/YYYY')}</span>
        {isOpen ? (
          <KeyboardArrowUp sx={{ fontSize: 18, color: 'text.secondary' }} />
        ) : (
          <KeyboardArrowDown sx={{ fontSize: 18, color: 'text.secondary' }} />
        )}
      </button>

      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: 620,
              maxWidth: '90vw',
              maxHeight: '80vh',
              borderRadius: 2,
            },
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ width: 320, maxWidth: '100%', mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {visibleMonth.format('MMMM YYYY')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  size="small"
                  aria-label="Previous month"
                  onClick={() => setVisibleMonth((prev) => prev.subtract(1, 'month'))}
                >
                  <ChevronLeft sx={{ fontSize: 20 }} />
                </IconButton>
                <IconButton
                  size="small"
                  aria-label="Next month"
                  onClick={() => setVisibleMonth((prev) => prev.add(1, 'month'))}
                >
                  <ChevronRight sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                rowGap: 0.5,
                columnGap: 0.5,
              }}
            >
              {DAYS_OF_WEEK.map((day) => (
                <Typography
                  key={day}
                  variant="caption"
                  sx={{ textAlign: 'center', fontWeight: 700, color: 'text.secondary', py: 0.5 }}
                >
                  {day}
                </Typography>
              ))}

              {calendarDays.map((day) => {
                const isInCurrentMonth = day.month() === visibleMonth.month();
                const isSelected = day.isSame(selectedDate, 'day');
                const isToday = day.isSame(dayjs(), 'day');
                const todayHighlightClass = isToday
                  ? isSelected
                    ? 'ring-2 ring-offset-1 ring-green-200'
                    : 'ring-2 ring-offset-1 ring-green-500'
                  : '';

                return (
                  <button
                    key={day.format('YYYY-MM-DD')}
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    aria-current={isToday ? 'date' : undefined}
                    className={cn(
                      'aspect-square rounded-full text-sm font-medium transition-colors relative',
                      'hover:bg-gray-100',
                      isSelected
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : isInCurrentMonth
                          ? 'text-gray-900'
                          : 'text-gray-300',
                      todayHighlightClass
                    )}
                  >
                    {day.date()}
                    {isToday && (
                      <span
                        className={cn(
                          'absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full',
                          isSelected ? 'bg-white' : 'bg-green-600'
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Popover>
    </div>
  );
};

export default DatePickerComponent;
