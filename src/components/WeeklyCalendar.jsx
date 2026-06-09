import React from 'react';
import { getFormattedDateString } from '../utils/dateUtils';

function WeeklyCalendar({
  year,
  month,
  handleWeekNavigation,
  weekDays,
  dayNames,
  todos,
  realTodayStr,
  selectedDateStr,
  setSelectedDate
}) {
  return (
    <>
      <div className="week-header">
        <button id="prev-week-btn" className="nav-btn" aria-label="이전 주" onClick={() => handleWeekNavigation(-7)}>&lt;</button>
        <span id="month-display">{year}년 {month}월</span>
        <button id="next-week-btn" className="nav-btn" aria-label="다음 주" onClick={() => handleWeekNavigation(7)}>&gt;</button>
      </div>
      <div id="weekly-calendar" className="weekly-calendar">
        {weekDays.map((loopDay, index) => {
          const loopDayStr = getFormattedDateString(loopDay);
          const dayTodoCount = todos.filter(todo => todo.date === loopDayStr).length;
          
          let dayCardClass = "day-card";
          if (loopDayStr === realTodayStr) dayCardClass += " today";
          if (loopDayStr === selectedDateStr) dayCardClass += " active";

          return (
            <div 
              key={loopDayStr}
              className={dayCardClass}
              onClick={() => setSelectedDate(new Date(loopDay))}
            >
              <span className="day-name">{dayNames[index]}</span>
              <span className="day-number">{loopDay.getDate()}</span>
              <span className="todo-count">{dayTodoCount > 0 ? dayTodoCount : ''}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default WeeklyCalendar;
