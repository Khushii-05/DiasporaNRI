import { useState, useEffect } from 'react';
import Icon from './Icon';

export default function BookingCalendar({ selectedDate, selectedTime, onDateSelect, onTimeSelect, existingBookings = [] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState([]);

  // Generate calendar days
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Create array of days
    const calendarDays = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(new Date(year, month, day));
    }

    setDays(calendarDays);
  }, [currentMonth]);

  const isDateDisabled = (date) => {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (date) => {
    if (!date || !selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getBookingsForDate = (date) => {
    if (!date) return [];
    return existingBookings.filter(booking => {
      const bookingDate = new Date(booking.meetingDate);
      return (
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const formatMonthYear = () => {
    return currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (date) => {
    if (!isDateDisabled(date)) {
      onDateSelect(date);
    }
  };

  // Time slots (business hours)
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Calendar Section */}
      <div className="bg-slate-800/50 border border-blue-400/30 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-blue-300 mb-4">Select a Date</h4>
        
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
            title="Previous month"
          >
            <Icon name="chevronLeft" className="w-5 h-5 text-blue-400" />
          </button>
          <h3 className="text-lg font-bold text-white">{formatMonthYear()}</h3>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
            title="Next month"
          >
            <Icon name="chevronRight" className="w-5 h-5 text-blue-400" />
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((day, idx) => (
            <div key={idx} className="text-center text-sm font-semibold text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, idx) => {
            const bookings = date ? getBookingsForDate(date) : [];
            const isDisabled = isDateDisabled(date);
            const isSelected = isDateSelected(date);

            return (
              <button
                key={idx}
                onClick={() => handleDateClick(date)}
                disabled={isDisabled}
                className={`aspect-square p-2 rounded-lg font-semibold text-sm transition flex flex-col items-center justify-center relative group ${
                  !date
                    ? 'bg-transparent'
                    : isSelected
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                    : isDisabled
                    ? 'bg-slate-700/30 text-gray-500 cursor-not-allowed opacity-50'
                    : 'bg-slate-700 text-gray-200 hover:bg-slate-600 hover:border-blue-400/60 border border-slate-600'
                }`}
              >
                {date && (
                  <>
                    <span>{date.getDate()}</span>
                    {bookings.length > 0 && (
                      <span className="text-xs mt-0.5 flex gap-1">
                        {bookings.map((_, i) => (
                          <span key={i} className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                        ))}
                      </span>
                    )}
                  </>
                )}
                
                {/* Tooltip with bookings */}
                {date && bookings.length > 0 && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 border border-blue-400/30 rounded-lg p-2 whitespace-nowrap text-xs z-50">
                    <p className="font-semibold text-blue-300 mb-1">{bookings.length} meeting(s)</p>
                    {bookings.map((booking, i) => (
                      <p key={i} className="text-gray-300">{booking.meetingTime}</p>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Date Display */}
        {selectedDate && (
          <div className="mt-6 p-4 bg-slate-900/50 border border-blue-400/30 rounded-lg">
            <p className="text-sm text-gray-300">
              <span className="text-blue-300 font-semibold">Selected Date:</span> {' '}
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        )}
      </div>

      {/* Time Selection Section */}
      {selectedDate && (
        <div className="bg-slate-800/50 border border-blue-400/30 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-blue-300 mb-4">Select a Time</h4>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => onTimeSelect(time)}
                className={`p-3 rounded-lg font-semibold text-sm transition border ${
                  selectedTime === time
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400 shadow-lg shadow-blue-500/50'
                    : 'bg-slate-700 text-gray-200 border-slate-600 hover:bg-slate-600 hover:border-blue-400/60'
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          {selectedTime && (
            <div className="mt-4 p-3 bg-slate-900/50 border border-blue-400/30 rounded-lg">
              <p className="text-sm text-gray-300">
                <span className="text-blue-300 font-semibold">Selected Time:</span> {selectedTime}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
