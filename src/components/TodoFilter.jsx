import React from 'react';

function TodoFilter({
  currentFilter,
  onFilterChange,
  currentCategoryFilter,
  onCategoryFilterChange
}) {
  return (
    <div className="filter-container">
      <div className="filter-tabs">
        <button 
          className={`tab-btn ${currentFilter === 'all' ? 'active' : ''}`} 
          data-filter="all"
          onClick={() => onFilterChange('all')}
        >전체</button>
        <button 
          className={`tab-btn ${currentFilter === 'active' ? 'active' : ''}`} 
          data-filter="active"
          onClick={() => onFilterChange('active')}
        >진행</button>
        <button 
          className={`tab-btn ${currentFilter === 'completed' ? 'active' : ''}`} 
          data-filter="completed"
          onClick={() => onFilterChange('completed')}
        >완료</button>
      </div>
      <select 
        id="filter-category" 
        className="filter-category-select" 
        aria-label="카테고리 필터"
        value={currentCategoryFilter}
        onChange={onCategoryFilterChange}
      >
        <option value="all">모든 카테고리</option>
        <option value="일상">일상</option>
        <option value="학업">학업</option>
        <option value="업무">업무</option>
        <option value="운동">운동</option>
      </select>
    </div>
  );
}

export default TodoFilter;
