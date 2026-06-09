import React from 'react';

function WeeklyProgress({ progressPercentage }) {
  return (
    <div className="progress-container">
      <div className="progress-label">
        <span>주간 달성률</span>
        <span id="progress-percent">{progressPercentage}%</span>
      </div>
      <div className="progress-bar-bg">
        <div id="progress-bar-fill" className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
      </div>
    </div>
  );
}

export default WeeklyProgress;
